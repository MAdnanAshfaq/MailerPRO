package mailer

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/codersgyan/camp/internal/database"
)

type Handler struct {
	db      *sql.DB
	service *Service
}

func NewHandler(db *sql.DB, service *Service) *Handler {
	return &Handler{db: db, service: service}
}

func (h *Handler) SendTest(w http.ResponseWriter, r *http.Request) {
	var req struct {
		AccountID int64  `json:"account_id"`
		ToEmail   string `json:"to_email"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	if req.ToEmail == "" {
		http.Error(w, "to_email is required", http.StatusBadRequest)
		return
	}

	err := h.service.SendTestEmail(req.AccountID, req.ToEmail)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{
			"message": err.Error(),
			"error": "SMTP_FAILURE",
		})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Test email sent successfully"})
}

func (h *Handler) ListSent(w http.ResponseWriter, r *http.Request) {
	accountIDStr := r.URL.Query().Get("account_id")
	accountID, _ := strconv.ParseInt(accountIDStr, 10, 64)

	var query string
	var rows *sql.Rows
	var err error

	if accountID > 0 {
		query = database.Translate(`
			SELECT id, account_id, recipient, subject, type, sent_at
			FROM sent_emails
			WHERE account_id = ?
			ORDER BY sent_at DESC
		`)
		rows, err = h.db.Query(query, accountID)
	} else {
		query = database.Translate(`
			SELECT id, account_id, recipient, subject, type, sent_at
			FROM sent_emails
			ORDER BY sent_at DESC
		`)
		rows, err = h.db.Query(query)
	}

	if err != nil {
		http.Error(w, "Failed to query sent emails", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var emails []SentEmail
	for rows.Next() {
		var e SentEmail
		if err := rows.Scan(&e.ID, &e.AccountID, &e.Recipient, &e.Subject, &e.Type, &e.SentAt); err != nil {
			http.Error(w, "Failed to scan sent email", http.StatusInternalServerError)
			return
		}
		emails = append(emails, e)
	}

	if emails == nil {
		emails = []SentEmail{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(emails)
}
