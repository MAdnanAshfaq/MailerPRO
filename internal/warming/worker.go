package warming

import (
	"database/sql"
	"log"
	"time"

	"github.com/codersgyan/camp/internal/account"
	"github.com/codersgyan/camp/internal/database"
	"github.com/codersgyan/camp/internal/mailer"
)

type Worker struct {
	db          *sql.DB
	accountRepo *account.Repository
	mailer      *mailer.Service
}

func NewWorker(db *sql.DB, repo *account.Repository, ms *mailer.Service) *Worker {
	return &Worker{
		db:          db,
		accountRepo: repo,
		mailer:      ms,
	}
}

func (w *Worker) Start() {
	log.Println("Starting background email warming service...")
	ticker := time.NewTicker(10 * time.Minute) // In a real app, this would be more complex
	go func() {
		for range ticker.C {
			w.runCycle()
		}
	}()
}

func (w *Worker) runCycle() {
	// 1. Get all active warming accounts
	query := `SELECT account_id, daily_limit, current_count FROM warming_status WHERE status = 'active'`
	rows, err := w.db.Query(query)
	if err != nil {
		log.Printf("Warming Service Error: %v", err)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var accountID int64
		var dailyLimit, currentCount int
		if err := rows.Scan(&accountID, &dailyLimit, &currentCount); err != nil {
			continue
		}

		if currentCount < dailyLimit {
			w.sendWarmingEmail(accountID)
		}
	}
}

func (w *Worker) sendWarmingEmail(accountID int64) {
	// 1. Fetch SMTP settings indirectly via mailer service
	// 2. Pick a realistic "natural" subject and body
	templates := []struct {
		Subject string
		Body    string
	}{
		{"Quick question about your services", "Hi there, I was browsing your site and had a quick question about the pricing tiers for small teams. Could you let me know? Thanks!"},
		{"Follow up on our discussion", "Hello, just following up on our chat from last week. Let me know if you've had a chance to look at the proposal. Best regards."},
		{"Meeting next Tuesday?", "Hey, hope you're doing well. Are we still on for our meeting next Tuesday at 10 AM? Looking forward to it."},
		{"Checking in", "Hi, just checking in to see if everything is on track for the Q2 release. Let me know if you need any help from my side."},
		{"Great article!", "I just read your recent post on LinkedIn and found it very insightful. Thanks for sharing your expertise!"},
	}

	// Simple rotation based on time
	idx := time.Now().Unix() % int64(len(templates))
	tmpl := templates[idx]

	// 3. Pick a simulated "seed" from a more realistic pool
	seedAddresses := []string{
		"inbox-validator@gmail.com",
		"warmup-target-a@outlook.com",
		"team-sync-test@yahoo.com",
		"validator@warmup.mailerpro.com",
	}
	seedAddress := seedAddresses[time.Now().Unix()%int64(len(seedAddresses))]

	log.Printf("[Warming] Sending real warming email for account %d to %s...", accountID, seedAddress)

	// 4. Actually send the email
	if w.mailer != nil {
		err := w.mailer.SendWarming(accountID, seedAddress, tmpl.Subject, tmpl.Body)
		if err != nil {
			log.Printf("[Warming] FAILED to send warming email for account %d: %v", accountID, err)
			return
		}
		
		// Log the warming email as a sent email
		w.mailer.LogSentEmail(accountID, seedAddress, tmpl.Subject, "warming")
	}

	// 5. Update the current_count and optionally ramp up the daily_limit
	// In a good warming strategy, we increase the limit by ~20% every 24h
	var query string
	if database.IsPostgres() {
		query = `
			UPDATE warming_status 
			SET current_count = current_count + 1, 
			    daily_limit = CASE 
					WHEN updated_at < CURRENT_TIMESTAMP - INTERVAL '1 day' AND daily_limit < target_limit 
					THEN CAST(daily_limit * 1.2 AS INTEGER) 
					ELSE daily_limit 
				END,
			    updated_at = CURRENT_TIMESTAMP 
			WHERE account_id = $1
		`
	} else {
		query = `
			UPDATE warming_status 
			SET current_count = current_count + 1, 
			    daily_limit = CASE 
					WHEN updated_at < datetime('now', '-1 day') AND daily_limit < target_limit 
					THEN CAST(daily_limit * 1.2 AS INTEGER) 
					ELSE daily_limit 
				END,
			    updated_at = CURRENT_TIMESTAMP 
			WHERE account_id = ?
		`
	}
	_, err := w.db.Exec(query, accountID)
	if err != nil {
		log.Printf("[Warming] Failed to update warming status for account %d: %v", accountID, err)
	}
}
