package campaign

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/codersgyan/camp/internal/ai"
	"github.com/codersgyan/camp/internal/mailer"
)

type Handler struct {
	repo   *Repository
	mailer *mailer.Service
	ai     *ai.Service
}

func NewHandler(repo *Repository, mailerSvc *mailer.Service, aiSvc *ai.Service) *Handler {
	return &Handler{
		repo:   repo,
		mailer: mailerSvc,
		ai:     aiSvc,
	}
}

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	var c Campaign
	if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	id, err := h.repo.Create(&c)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// Trigger mailer if status is 'sent' immediately
	if c.Status == "sent" && h.mailer != nil {
		go h.mailer.SendCampaign(c.AccountID, c.Subject, c.Content, c.IsPersonalized, c.TargetFolder)
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]int64{"id": id})
}

func (h *Handler) Get(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Path[len("/api/campaigns/"):]
	var id int64
	fmt.Sscanf(idStr, "%d", &id)

	c, err := h.repo.GetByID(id)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	if c == nil {
		http.Error(w, "campaign not found", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(c)
}

func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
	campaigns, err := h.repo.List()
	if err != nil {
		fmt.Printf("[campaigns] List error: %v\n", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(campaigns)
}
func (h *Handler) Update(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Path[len("/api/campaigns/"):]
	var id int64
	fmt.Sscanf(idStr, "%d", &id)

	var c Campaign
	if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}
	c.ID = id

	if err := h.repo.Update(&c); err != nil {
		fmt.Printf("[campaigns] Update error for id=%d: %v\n", id, err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// Trigger mailer if status is now 'sent'
	if c.Status == "sent" && h.mailer != nil {
		go h.mailer.SendCampaign(c.AccountID, c.Subject, c.Content, c.IsPersonalized, c.TargetFolder)
	}

	w.WriteHeader(http.StatusNoContent)
}
func (h *Handler) GenerateAI(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Goal      string `json:"goal"`
		PainPoint string `json:"pain_point"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	if h.ai == nil {
		http.Error(w, "AI service not available", http.StatusServiceUnavailable)
		return
	}

	subject, content, err := h.ai.GenerateEmailContent(body.Goal, body.PainPoint)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"subject": subject,
		"content": content,
	})
}
