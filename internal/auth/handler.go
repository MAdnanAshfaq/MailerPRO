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
	// In a real app, 'state' should be a secure random string tied to the session
	state := r.URL.Query().Get("account_id") 
	if state == "" {
		http.Error(w, "account_id is required as state", http.StatusBadRequest)
		return
	}
	url := h.googleService.GetAuthURL(state)
	json.NewEncoder(w).Encode(map[string]string{"url": url})
}

func (h *Handler) GoogleCallback(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	accountIDStr := r.URL.Query().Get("state") // We passed account_id as state

	if code == "" || accountIDStr == "" {
		http.Redirect(w, r, "/settings?error=oauth_failed", http.StatusTemporaryRedirect)
		return
	}

	var accountID int64
	fmt.Sscanf(accountIDStr, "%d", &accountID)

	token, err := h.googleService.ExchangeCode(r.Context(), code)
	if err != nil {
		http.Redirect(w, r, "/settings?error=token_exchange_failed", http.StatusTemporaryRedirect)
		return
	}

	err = h.repo.UpdateGoogleTokens(accountID, token.AccessToken, token.RefreshToken, &token.Expiry)
	if err != nil {
		http.Redirect(w, r, "/settings?error=save_failed", http.StatusTemporaryRedirect)
		return
	}

	// Redirect back to settings with success
	http.Redirect(w, r, "/settings?success=google_connected", http.StatusTemporaryRedirect)
}
