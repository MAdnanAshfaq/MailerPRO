package stats

import (
	"encoding/json"
	"net/http"
)

type Handler struct {
	repo *Repository
}

func NewHandler(repo *Repository) *Handler {
	return &Handler{repo: repo}
}

func (h *Handler) GetOverview(w http.ResponseWriter, r *http.Request) {
	stats, err := h.repo.GetOverviewStats()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "json")
	json.NewEncoder(w).Encode(stats)
}
