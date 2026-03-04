package campaign

import (
	"database/sql"
	"fmt"
)

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) Create(c *Campaign) (int64, error) {
	query := `
		INSERT INTO campaigns (name, subject, content, status)
		VALUES (?, ?, ?, ?)
	`
	result, err := r.db.Exec(query, c.Name, c.Subject, c.Content, "draft")
	if err != nil {
		return 0, fmt.Errorf("failed to create campaign: %w", err)
	}
	return result.LastInsertId()
}

func (r *Repository) GetByID(id int64) (*Campaign, error) {
	query := `
		SELECT id, name, subject, content, status, open_rate, ctr, conversions, sent_at, created_at, updated_at
		FROM campaigns
		WHERE id = ?
	`
	var c Campaign
	err := r.db.QueryRow(query, id).Scan(
		&c.ID, &c.Name, &c.Subject, &c.Content, &c.Status, &c.OpenRate, &c.CTR, &c.Conversions, &c.SentAt, &c.CreatedAt, &c.UpdatedAt,
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
	query := `
		SELECT id, name, subject, content, status, open_rate, ctr, conversions, sent_at, created_at, updated_at
		FROM campaigns
		ORDER BY created_at DESC
	`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to list campaigns: %w", err)
	}
	defer rows.Close()

	campaigns := make([]Campaign, 0)
	for rows.Next() {
		var c Campaign
		err := rows.Scan(
			&c.ID, &c.Name, &c.Subject, &c.Content, &c.Status, &c.OpenRate, &c.CTR, &c.Conversions, &c.SentAt, &c.CreatedAt, &c.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan campaign: %w", err)
		}
		campaigns = append(campaigns, c)
	}
	return campaigns, nil
}
func (r *Repository) Update(c *Campaign) error {
	query := `
		UPDATE campaigns
		SET name = ?, subject = ?, content = ?, status = ?, open_rate = ?, ctr = ?, conversions = ?, sent_at = ?, updated_at = CURRENT_TIMESTAMP
		WHERE id = ?
	`
	_, err := r.db.Exec(query, c.Name, c.Subject, c.Content, c.Status, c.OpenRate, c.CTR, c.Conversions, c.SentAt, c.ID)
	if err != nil {
		return fmt.Errorf("failed to update campaign: %w", err)
	}
	return nil
}
