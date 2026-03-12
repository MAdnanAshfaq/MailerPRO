package warming

import (
	"database/sql"
	"log"
	"time"

	"github.com/codersgyan/camp/internal/account"
	"github.com/codersgyan/camp/internal/database"
)

type Worker struct {
	db          *sql.DB
	accountRepo *account.Repository
}

func NewWorker(db *sql.DB, repo *account.Repository) *Worker {
	return &Worker{
		db:          db,
		accountRepo: repo,
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
	// In a real implementation, this would:
	// 1. Pick a "seed" address from a pool.
	// 2. Fetch SMTP settings for the account.
	// 3. Send a natural-looking email.
	// 4. Update the current_count in DB.

	log.Printf("Sending warming email for account %d...", accountID)

	_, err := w.db.Exec(database.Translate(`UPDATE warming_status SET current_count = current_count + 1, updated_at = CURRENT_TIMESTAMP WHERE account_id = ?`), accountID)
	if err != nil {
		log.Printf("Failed to update warming count for account %d: %v", accountID, err)
	}
}
