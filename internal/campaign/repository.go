package campaign

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

func (r *Repository) Create(c *Campaign) (int64, error) {
	if database.IsPostgres() {
		query := `
			INSERT INTO campaigns (account_id, name, subject, content, status, scheduled_at, is_personalized)
			VALUES ($1, $2, $3, $4, $5, $6, $7)
			RETURNING id
		`
		var id int64
		// If AccountID is 0, we'll try to use account 1 as default for now if it exists, 
		// but ideally frontend should send it.
		accountID := c.AccountID
		if accountID == 0 { accountID = 1 } 

		err := r.db.QueryRow(query, accountID, c.Name, c.Subject, c.Content, c.Status, c.ScheduledAt, c.IsPersonalized).Scan(&id)
		if err != nil {
			return 0, fmt.Errorf("failed to create campaign: %w", err)
		}
		return id, nil
	}

	query := `
		INSERT INTO campaigns (account_id, name, subject, content, status, scheduled_at, is_personalized)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`
	accountID := c.AccountID
	if accountID == 0 { accountID = 1 }
	result, err := r.db.Exec(database.Translate(query), accountID, c.Name, c.Subject, c.Content, c.Status, c.ScheduledAt, c.IsPersonalized)
	if err != nil {
		return 0, fmt.Errorf("failed to create campaign: %w", err)
	}
	return result.LastInsertId()
}

func (r *Repository) GetByID(id int64) (*Campaign, error) {
	query := database.Translate(`
		SELECT id, account_id, name, subject, content, status, open_rate, ctr, conversions, sent_at, scheduled_at, is_personalized, created_at, updated_at
		FROM campaigns
		WHERE id = ?
	`)
	var c Campaign
	err := r.db.QueryRow(query, id).Scan(
		&c.ID, &c.AccountID, &c.Name, &c.Subject, &c.Content, &c.Status, &c.OpenRate, &c.CTR, &c.Conversions, &c.SentAt, &c.ScheduledAt, &c.IsPersonalized, &c.CreatedAt, &c.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get campaign: %w", err)
	}
	return &c, nil
}

func (r *Repository) List() ([]Campaign, error) {
	query := database.Translate(`
		SELECT id, account_id, name, subject, content, status, open_rate, ctr, conversions, sent_at, scheduled_at, is_personalized, created_at, updated_at
		FROM campaigns
		ORDER BY created_at DESC
	`)
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to list campaigns: %w", err)
	}
	defer rows.Close()

	campaigns := make([]Campaign, 0)
	for rows.Next() {
		var c Campaign
		err := rows.Scan(
			&c.ID, &c.AccountID, &c.Name, &c.Subject, &c.Content, &c.Status, &c.OpenRate, &c.CTR, &c.Conversions, &c.SentAt, &c.ScheduledAt, &c.IsPersonalized, &c.CreatedAt, &c.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan campaign: %w", err)
		}
		campaigns = append(campaigns, c)
	}
	return campaigns, nil
}
func (r *Repository) Update(c *Campaign) error {
	query := database.Translate(`
		UPDATE campaigns
		SET name = ?, subject = ?, content = ?, status = ?, open_rate = ?, ctr = ?, conversions = ?, sent_at = ?, scheduled_at = ?, is_personalized = ?, updated_at = CURRENT_TIMESTAMP
		WHERE id = ?
	`)
	_, err := r.db.Exec(query, c.Name, c.Subject, c.Content, c.Status, c.OpenRate, c.CTR, c.Conversions, c.SentAt, c.ScheduledAt, c.IsPersonalized, c.ID)
	if err != nil {
		return fmt.Errorf("failed to update campaign: %w", err)
	}
	return nil
}
func (r *Repository) GetAllScheduled() ([]Campaign, error) {
	query := database.Translate(`
		SELECT id, account_id, name, subject, content, status, open_rate, ctr, conversions, sent_at, scheduled_at, is_personalized, created_at, updated_at
		FROM campaigns
		WHERE status = 'scheduled' AND (scheduled_at <= CURRENT_TIMESTAMP OR scheduled_at IS NULL)
	`)
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var campaigns []Campaign
	for rows.Next() {
		var c Campaign
		err := rows.Scan(
			&c.ID, &c.AccountID, &c.Name, &c.Subject, &c.Content, &c.Status, &c.OpenRate, &c.CTR, &c.Conversions, &c.SentAt, &c.ScheduledAt, &c.IsPersonalized, &c.CreatedAt, &c.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		campaigns = append(campaigns, c)
	}
	return campaigns, nil
}
