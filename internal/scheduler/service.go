package scheduler

import (
	"log"
	"time"

	"github.com/codersgyan/camp/internal/campaign"
	"github.com/codersgyan/camp/internal/mailer"
)

type Worker struct {
	repo   *campaign.Repository
	mailer *mailer.Service
}

func NewWorker(repo *campaign.Repository, mailer *mailer.Service) *Worker {
	return &Worker{
		repo:   repo,
		mailer: mailer,
	}
}

func (w *Worker) Start() {
	go func() {
		ticker := time.NewTicker(1 * time.Minute)
		defer ticker.Stop()

		for range ticker.C {
			w.ProcessScheduled()
		}
	}()
}

func (w *Worker) ProcessScheduled() {
	campaigns, err := w.repo.GetAllScheduled()
	if err != nil {
		log.Printf("Scheduler error: failed to fetch scheduled campaigns: %v", err)
		return
	}

	for _, c := range campaigns {
		log.Printf("Scheduler: sending campaign %d: %s", c.ID, c.Name)
		
		// Send the campaign
		// Note: in a real application the accountID would be extracted from the session (JWT token)
		// For now we assume a sender account exists.
		err := w.mailer.SendCampaign(c.AccountID, c.Subject, c.Content, c.IsPersonalized, c.TargetFolder)
		if err != nil {
			log.Printf("Scheduler: failed to send campaign %d: %v", c.ID, err)
			continue
		}

		// Update campaign status to 'sent'
		now := time.Now()
		c.Status = "sent"
		c.SentAt = &now
		if err := w.repo.Update(&c); err != nil {
			log.Printf("Scheduler: failed to update campaign status %d: %v", c.ID, err)
		}
	}
}
