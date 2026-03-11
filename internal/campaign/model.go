package campaign

import "time"

type Campaign struct {
	ID          int64      `json:"id"`
	AccountID   int64      `json:"account_id"`
	Name        string     `json:"name"`
	Subject     string     `json:"subject"`
	Content     string     `json:"content"`
	Status      string     `json:"status"` // draft, sent, paused, scheduled
	OpenRate    float64    `json:"open_rate"`
	CTR         float64    `json:"ctr"`
	Conversions float64    `json:"conversions"`
	SentAt      *time.Time `json:"sent_at"`
	ScheduledAt *time.Time `json:"scheduled_at"`
	IsPersonalized bool       `json:"is_personalized"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt   time.Time  `json:"updated_at"`
}
