package account

import (
	"database/sql"
	"fmt"
	"github.com/codersgyan/camp/internal/database"
)

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) CreateAccount(a *Account) (int64, error) {
	if database.IsPostgres() {
		query := `
			INSERT INTO accounts (name, email, password_hash, company_name, domain)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING id
		`
		var id int64
		err := r.db.QueryRow(query, a.Name, a.Email, a.PasswordHash, a.CompanyName, a.Domain).Scan(&id)
		if err != nil {
			return 0, fmt.Errorf("failed to create account: %w", err)
		}
		return id, nil
	}

	query := `
		INSERT INTO accounts (name, email, password_hash, company_name, domain)
		VALUES (?, ?, ?, ?, ?)
	`
	result, err := r.db.Exec(query, a.Name, a.Email, a.PasswordHash, a.CompanyName, a.Domain)
	if err != nil {
		return 0, fmt.Errorf("failed to create account: %w", err)
	}
	return result.LastInsertId()
}

func (r *Repository) GetByEmail(email string) (*Account, error) {
	query := database.Translate(`SELECT id, name, email, password_hash, company_name, domain, created_at, updated_at FROM accounts WHERE email = ?`)
	var a Account
	err := r.db.QueryRow(query, email).Scan(&a.ID, &a.Name, &a.Email, &a.PasswordHash, &a.CompanyName, &a.Domain, &a.CreatedAt, &a.UpdatedAt)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get account: %w", err)
	}
	return &a, nil
}

func (r *Repository) SaveSMTPSettings(s *SMTPSettings) error {
	query := database.Translate(`
		INSERT INTO smtp_settings (account_id, host, port, username, password, security_type)
		VALUES (?, ?, ?, ?, ?, ?)
		ON CONFLICT(account_id) DO UPDATE SET
			host = EXCLUDED.host,
			port = EXCLUDED.port,
			username = EXCLUDED.username,
			password = EXCLUDED.password,
			security_type = EXCLUDED.security_type,
			updated_at = CURRENT_TIMESTAMP
	`)
	_, err := r.db.Exec(query, s.AccountID, s.Host, s.Port, s.Username, s.Password, s.SecurityType)
	return err
}

func (r *Repository) GetSMTPSettings(accountID int64) (*SMTPSettings, error) {
	query := database.Translate(`SELECT id, account_id, host, port, username, password, security_type, created_at, updated_at FROM smtp_settings WHERE account_id = ?`)
	var s SMTPSettings
	err := r.db.QueryRow(query, accountID).Scan(&s.ID, &s.AccountID, &s.Host, &s.Port, &s.Username, &s.Password, &s.SecurityType, &s.CreatedAt, &s.UpdatedAt)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return &s, err
}

func (r *Repository) CreateInitialWarming(accountID int64) error {
	query := database.Translate(`INSERT INTO warming_status (account_id) VALUES (?)`)
	_, err := r.db.Exec(query, accountID)
	return err
}

func (r *Repository) GetWarmingStatus(accountID int64) (*WarmingStatus, error) {
	query := database.Translate(`SELECT id, account_id, status, daily_limit, target_limit, current_count, start_date, updated_at FROM warming_status WHERE account_id = ?`)
	var w WarmingStatus
	err := r.db.QueryRow(query, accountID).Scan(&w.ID, &w.AccountID, &w.Status, &w.DailyLimit, &w.TargetLimit, &w.CurrentCount, &w.StartDate, &w.UpdatedAt)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return &w, err
}
