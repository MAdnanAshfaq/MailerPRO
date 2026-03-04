package domain

import (
	"encoding/json"
	"net/http"
)

type Handler struct{}

func NewHandler() *Handler {
	return &Handler{}
}

func (h *Handler) GetHealth(w http.ResponseWriter, r *http.Request) {
	domainParam := r.URL.Query().Get("domain")
	if domainParam == "" {
		http.Error(w, "missing domain parameter", http.StatusBadRequest)
		return
	}

	status := CheckHealth(domainParam)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(status)
}
