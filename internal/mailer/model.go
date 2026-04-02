package mailer

import "time"

type SentEmail struct {
	ID        int64      `json:"id"`
	AccountID int64      `json:"account_id"`
	Recipient string     `json:"recipient"`
	Subject   string     `json:"subject"`
	Type      string     `json:"type"` // "campaign" or "warming"
	SentAt    *time.Time `json:"sent_at"`
}
