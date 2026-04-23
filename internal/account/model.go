package account

import "time"

type Account struct {
	ID           int64     `json:"id"`
	Name         string    `json:"name"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"-"`
	CompanyName  string    `json:"company_name"`
	Domain              string     `json:"domain"`
	GoogleAccessToken   *string    `json:"google_access_token"`
	GoogleRefreshToken  *string    `json:"google_refresh_token"`
	GoogleTokenExpiry   *time.Time `json:"google_token_expiry"`
	CreatedAt           time.Time  `json:"created_at"`
	UpdatedAt           time.Time  `json:"updated_at"`
}

type SMTPSettings struct {
	ID           int64     `json:"id"`
	AccountID    int64     `json:"account_id"`
	Host         string    `json:"host"`
	Port         int       `json:"port"`
	Username     string    `json:"username"`
	Password     string    `json:"password"`
	SecurityType string    `json:"security_type"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type WarmingStatus struct {
	ID           int64     `json:"id"`
	AccountID    int64     `json:"account_id"`
	Status       string    `json:"status"`
	DailyLimit   int       `json:"daily_limit"`
	TargetLimit  int       `json:"target_limit"`
	CurrentCount int        `json:"current_count"`
	StartDate    *time.Time `json:"start_date"`
	UpdatedAt    *time.Time `json:"updated_at"`
}
