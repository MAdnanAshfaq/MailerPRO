package auth

import (
	"encoding/json"
	"fmt"
	"net/http"
	"github.com/codersgyan/camp/internal/account"
	"github.com/codersgyan/camp/internal/google"
)

type Handler struct {
	repo          *account.Repository
	googleService *google.Service
}

func NewHandler(repo *account.Repository, googleSvc *google.Service) *Handler {
	return &Handler{
		repo:          repo,
		googleService: googleSvc,
	}
}

func (h *Handler) GetGoogleAuthURL(w http.ResponseWriter, r *http.Request) {
	// State can be "account_id" for linking or "login" for authentication
	state := r.URL.Query().Get("account_id")
	if state == "" {
		state = r.URL.Query().Get("state")
	}

	if state == "" {
		http.Error(w, "state or account_id is required", http.StatusBadRequest)
		return
	}
	url := h.googleService.GetAuthURL(state)
	json.NewEncoder(w).Encode(map[string]string{"url": url})
}

func (h *Handler) GoogleCallback(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	state := r.URL.Query().Get("state")

	if code == "" || state == "" {
		http.Redirect(w, r, "/login?error=oauth_failed", http.StatusTemporaryRedirect)
		return
	}

	token, err := h.googleService.ExchangeCode(r.Context(), code)
	if err != nil {
		http.Redirect(w, r, "/login?error=token_exchange_failed", http.StatusTemporaryRedirect)
		return
	}

	// Case 1: Standard Login/Signup via Google
	if state == "login" || state == "signup" {
		email, name, err := h.googleService.GetUserInfo(r.Context(), token)
		if err != nil {
			http.Redirect(w, r, "/login?error=user_info_failed", http.StatusTemporaryRedirect)
			return
		}

		acc, err := h.repo.GetByEmail(email)
		if err != nil {
			http.Redirect(w, r, "/login?error=db_error", http.StatusTemporaryRedirect)
			return
		}

		var accountID int64
		if acc == nil {
			// Auto-register if not exists
			newAcc := &account.Account{
				Name:  name,
				Email: email,
				// Google users don't need a local password, but we set a random one
				PasswordHash: "google_authenticated", 
				CompanyName:  name + "'s Company",
			}
			accountID, err = h.repo.CreateAccount(newAcc)
			if err != nil {
				http.Redirect(w, r, "/login?error=registration_failed", http.StatusTemporaryRedirect)
				return
			}
			// Also initialize warming
			_ = h.repo.CreateInitialWarming(accountID)
		} else {
			accountID = acc.ID
		}

		// Save/Update Google tokens for mail sending
		_ = h.repo.UpdateGoogleTokens(accountID, token.AccessToken, token.RefreshToken, &token.Expiry)

		// Redirect to dashboard with user details in query for initial login sync
		http.Redirect(w, r, fmt.Sprintf("/?login_success=true&user_id=%d", accountID), http.StatusTemporaryRedirect)
		return
	}

	// Case 2: Linking Gmail from Settings (state is accountID)
	var accountID int64
	fmt.Sscanf(state, "%d", &accountID)

	err = h.repo.UpdateGoogleTokens(accountID, token.AccessToken, token.RefreshToken, &token.Expiry)
	if err != nil {
		http.Redirect(w, r, "/settings?error=save_failed", http.StatusTemporaryRedirect)
		return
	}

	http.Redirect(w, r, "/settings?success=google_connected", http.StatusTemporaryRedirect)
}
