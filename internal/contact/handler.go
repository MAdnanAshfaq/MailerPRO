package contact

import (
	"encoding/json"
	"fmt"
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

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	var contactBody Contact
	if err := json.NewDecoder(r.Body).Decode(&contactBody); err != nil {
		fmt.Println(err)
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	createdId, err := h.repo.CreateContactOrUpsertTags(&contactBody)
	if err != nil {
		fmt.Printf("Error creating/upserting contact (email: %s): %v\n", contactBody.Email, err)
		resp := map[string]string{"message": err.Error()}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(resp)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]int64{"id": createdId})
}

func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
	accountIDStr := r.URL.Query().Get("account_id")
	var accountID int64
	if accountIDStr != "" {
		accountID, _ = strconv.ParseInt(accountIDStr, 10, 64)
	}

	contacts, err := h.repo.ListAll(accountID)
	if err != nil {
		fmt.Printf("[contacts] List error: %v\n", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(contacts)
}

func (h *Handler) AddTag(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Email string `json:"email"`
		Tags  []Tag  `json:"tags"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	contact := &Contact{
		Email: body.Email,
		Tags:  body.Tags,
	}

	_, err := h.repo.CreateContactOrUpsertTags(contact)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *Handler) RemoveTag(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Path[len("/api/contacts/"):]
	if strings.Contains(idStr, "/") {
		idStr = strings.Split(idStr, "/")[0]
	}
	var id int64
	fmt.Sscanf(idStr, "%d", &id)

	var body struct {
		Text string `json:"text"`
	}

	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	if err := h.repo.RemoveTagFromContact(id, body.Text); err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *Handler) Update(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Path[len("/api/contacts/"):]
	var id int64
	fmt.Sscanf(idStr, "%d", &id)

	var contactBody Contact
	if err := json.NewDecoder(r.Body).Decode(&contactBody); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}
	contactBody.ID = id

	if err := h.repo.Update(&contactBody); err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func (h *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Path[len("/api/contacts/"):]
	var id int64
	fmt.Sscanf(idStr, "%d", &id)

	if err := h.repo.Delete(id); err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
