package account

import (
	"encoding/json"
	"fmt"
	"net"
	"net/http"
	"strconv"
	"strings"
)

type Handler struct {
	repo *Repository
}

func NewHandler(repo *Repository) *Handler {
	return &Handler{repo: repo}
}

func (h *Handler) Signup(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name        string `json:"name"`
		Email       string `json:"email"`
		Password    string `json:"password"`
		CompanyName string `json:"company_name"`
		Domain      string `json:"domain"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Validate Email Domain via MX records
	parts := strings.Split(req.Email, "@")
	if len(parts) != 2 || parts[1] == "" {
		http.Error(w, "invalid email format", http.StatusBadRequest)
		return
	}
	domain := parts[1]
	mxRecords, err := net.LookupMX(domain)
	if err != nil || len(mxRecords) == 0 {
		http.Error(w, "invalid or unreachable email domain", http.StatusBadRequest)
		return
	}

	// In a real app, hash the password properly
	a := &Account{
		Name:         req.Name,
		Email:        req.Email,
		PasswordHash: req.Password, // PLAIN FOR NOW AS REQUESTED TO FOCUS ON CORE ENGINE
		CompanyName:  req.CompanyName,
		Domain:       req.Domain,
	}

	id, err := h.repo.CreateAccount(a)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Create initial warming status
	_ = h.repo.CreateInitialWarming(id)

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{"id": id, "message": "Account created successfully"})
}

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	acc, err := h.repo.GetByEmail(req.Email)
	if err != nil {
		http.Error(w, "error logging in", http.StatusInternalServerError)
		return
	}

	if acc == nil || acc.PasswordHash != req.Password {
		http.Error(w, "invalid email or password", http.StatusUnauthorized)
		return
	}

	json.NewEncoder(w).Encode(acc)
}

func (h *Handler) SaveSMTP(w http.ResponseWriter, r *http.Request) {
	var s SMTPSettings
	if err := json.NewDecoder(r.Body).Decode(&s); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := h.repo.SaveSMTPSettings(&s); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "SMTP settings saved"})
}

func (h *Handler) GetSMTP(w http.ResponseWriter, r *http.Request) {
	accountIDStr := r.URL.Query().Get("account_id")
	accountID, _ := strconv.ParseInt(accountIDStr, 10, 64)

	settings, err := h.repo.GetSMTPSettings(accountID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if settings == nil {
		json.NewEncoder(w).Encode(map[string]interface{}{})
		return
	}
	json.NewEncoder(w).Encode(settings)
}

func (h *Handler) GetWarming(w http.ResponseWriter, r *http.Request) {
	accountIDStr := r.URL.Query().Get("account_id")
	accountID, _ := strconv.ParseInt(accountIDStr, 10, 64)

	status, err := h.repo.GetWarmingStatus(accountID)
	if err != nil {
		fmt.Printf("[account] GetWarming error: %v\n", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if status == nil {
		// No warming record yet for this account — return safe defaults
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":        "active",
			"daily_limit":   10,
			"target_limit":  50,
			"current_count": 0,
		})
		return
	}
	json.NewEncoder(w).Encode(status)
}

func (h *Handler) GetMe(w http.ResponseWriter, r *http.Request) {
	// In a real app, this would use JWT from a cookie/header.
	// For this prototype, we'll try to find an account by email if it's in a header or param,
	// or just return the first account for demo purposes if not specified.
	
	email := r.URL.Query().Get("email")
	if email == "" {
		// Mock: just return a default if skipping auth logic for the prototype
		acc, _ := h.repo.GetByEmail("test@example.com")
		if acc != nil {
			json.NewEncoder(w).Encode(acc)
			return
		}
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	acc, err := h.repo.GetByEmail(email)
	if err != nil || acc == nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(acc)
}
