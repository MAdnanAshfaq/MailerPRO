package contact

import (
	"database/sql"
	"fmt"
	"strings"

	"github.com/codersgyan/camp/internal/database"
)

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{
		db: db,
	}
}

// CreateContactOrUpsertTags creates a new contact or adds tags if the email already exists.
// It NEVER returns an error for duplicate emails — it just returns the existing contact's ID.
// This makes bulk imports idempotent and safe.
func (r *Repository) CreateContactOrUpsertTags(c *Contact) (int64, error) {
	existingContact, err := r.GetByEmail(c.Email)
	if err != nil {
		return 0, err
	}

	if existingContact != nil {
		// Contact already exists — if there are tags to add, upsert them
		if len(c.Tags) > 0 {
			txn, err := r.db.Begin()
			if err != nil {
				return 0, fmt.Errorf("failed to start transaction: %w", err)
			}
			defer txn.Rollback()

			if err := insertTagIfNotExist(txn, c.Tags); err != nil {
				return 0, err
			}
			tags, err := getTagsByTexts(txn, c.Tags)
			if err != nil {
				return 0, err
			}
			if err := linkTagsToContact(txn, existingContact.ID, tags); err != nil {
				return 0, err
			}
			if err := txn.Commit(); err != nil {
				return 0, err
			}
			return existingContact.ID, nil
		}
		// Simply return the existing contact ID without error.
		// This makes bulk imports idempotent and prevents 500 errors.
		return existingContact.ID, nil
	}

	// New contact — create it
	txn, err := r.db.Begin()
	if err != nil {
		return 0, err
	}
	defer txn.Rollback()

	lastId, err := createContact(txn, c)
	if err != nil {
		return 0, err
	}

	if len(c.Tags) > 0 {
		if err := insertTagIfNotExist(txn, c.Tags); err != nil {
			return 0, err
		}
		tags, err := getTagsByTexts(txn, c.Tags)
		if err != nil {
			return 0, err
		}
		if err := linkTagsToContact(txn, lastId, tags); err != nil {
			return 0, err
		}
	}

	if err := txn.Commit(); err != nil {
		return 0, err
	}

	return lastId, nil
}

func (r *Repository) GetByEmail(email string) (*Contact, error) {
	query := database.Translate(`
		SELECT id, account_id, fname, lname, email, phone, created_at, updated_at
		FROM contacts
		WHERE email = ?
		LIMIT 1
	`)
	var result Contact
	var accountID sql.NullInt64

	err := r.db.QueryRow(query, email).Scan(
		&result.ID,
		&accountID,
		&result.FirstName,
		&result.LastName,
		&result.Email,
		&result.Phone,
		&result.CreatedAt,
		&result.UpdatedAt,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	if accountID.Valid {
		result.AccountID = accountID.Int64
	}

	return &result, nil
}

// ListAll returns contacts — filtered by account_id if provided (> 0).
func (r *Repository) ListAll(accountID int64) ([]Contact, error) {
	var rows *sql.Rows
	var err error

	if accountID > 0 {
		rows, err = r.db.Query(database.Translate(`
			SELECT id, COALESCE(account_id, 0), fname, lname, email, phone, created_at, updated_at
			FROM contacts
			WHERE account_id = ?
			ORDER BY created_at DESC
		`), accountID)
	} else {
		rows, err = r.db.Query(database.Translate(`
			SELECT id, COALESCE(account_id, 0), fname, lname, email, phone, created_at, updated_at
			FROM contacts
			ORDER BY created_at DESC
		`))
	}

	if err != nil {
		return nil, fmt.Errorf("failed to list contacts: %w", err)
	}
	defer rows.Close()

	contacts := make([]Contact, 0)
	for rows.Next() {
		var c Contact
		if err := rows.Scan(
			&c.ID,
			&c.AccountID,
			&c.FirstName,
			&c.LastName,
			&c.Email,
			&c.Phone,
			&c.CreatedAt,
			&c.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("failed to scan contact: %w", err)
		}

		tags, err := r.GetTagsForContact(c.ID)
		if err != nil {
			return nil, err
		}
		c.Tags = tags
		contacts = append(contacts, c)
	}

	return contacts, nil
}

func (r *Repository) Update(c *Contact) error {
	query := database.Translate(`
		UPDATE contacts
		SET fname = ?, lname = ?, email = ?, phone = ?, updated_at = CURRENT_TIMESTAMP
		WHERE id = ?
	`)
	_, err := r.db.Exec(query, c.FirstName, c.LastName, c.Email, c.Phone, c.ID)
	if err != nil {
		return fmt.Errorf("failed to update contact: %w", err)
	}
	return nil
}

func (r *Repository) GetTagsForContact(contactID int64) ([]Tag, error) {
	query := database.Translate(`
		SELECT t.id, t.text, t.created_at, t.updated_at
		FROM tags t
		JOIN contact_tag ct ON t.id = ct.tag_id
		WHERE ct.contact_id = ?
	`)
	rows, err := r.db.Query(query, contactID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch tags: %w", err)
	}
	defer rows.Close()

	tags := make([]Tag, 0)
	for rows.Next() {
		var t Tag
		if err := rows.Scan(&t.ID, &t.Text, &t.CreatedAt, &t.UpdatedAt); err != nil {
			return nil, fmt.Errorf("failed to scan tag: %w", err)
		}
		tags = append(tags, t)
	}
	return tags, nil
}

func (r *Repository) RemoveTagFromContact(contactID int64, tagText string) error {
	var tagID int64
	err := r.db.QueryRow(database.Translate("SELECT id FROM tags WHERE text = ?"), tagText).Scan(&tagID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil
		}
		return fmt.Errorf("failed to find tag: %w", err)
	}

	_, err = r.db.Exec(database.Translate("DELETE FROM contact_tag WHERE contact_id = ? AND tag_id = ?"), contactID, tagID)
	if err != nil {
		return fmt.Errorf("failed to remove tag from contact: %w", err)
	}

	return nil
}

// ─── Private helpers ──────────────────────────────────────────────────────────

func insertTagIfNotExist(txn *sql.Tx, tags []Tag) error {
	for _, tag := range tags {
		var query string
		if database.IsPostgres() {
			query = `INSERT INTO tags (text) VALUES ($1) ON CONFLICT (text) DO NOTHING`
		} else {
			query = `INSERT OR IGNORE INTO tags (text) VALUES (?)`
		}
		_, err := txn.Exec(query, tag.Text)
		if err != nil {
			return fmt.Errorf("failed to insert tag: %w", err)
		}
	}
	return nil
}

func getTagsByTexts(txn *sql.Tx, tags []Tag) ([]Tag, error) {
	placeholders := make([]string, len(tags))
	args := make([]interface{}, len(tags))
	for i, tag := range tags {
		placeholders[i] = "?"
		args[i] = tag.Text
	}

	query := fmt.Sprintf(`SELECT id, text FROM tags WHERE text IN (%s)`, strings.Join(placeholders, ","))
	rows, err := txn.Query(query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to select tags: %w", err)
	}
	defer rows.Close()

	var resultTags []Tag
	for rows.Next() {
		var tag Tag
		if err := rows.Scan(&tag.ID, &tag.Text); err != nil {
			return nil, fmt.Errorf("failed to scan tag: %w", err)
		}
		resultTags = append(resultTags, tag)
	}
	return resultTags, nil
}

func linkTagsToContact(txn *sql.Tx, contactID int64, tags []Tag) error {
	valueStrings := make([]string, 0, len(tags))
	valueArgs := make([]interface{}, 0, len(tags)*2)

	for _, tag := range tags {
		valueStrings = append(valueStrings, "(?, ?)")
		valueArgs = append(valueArgs, contactID, tag.ID)
	}

	var query string
	if database.IsPostgres() {
		// PostgreSQL placeholders are $1, $2...
		n := 1
		p := make([]string, len(tags))
		for i := range tags {
			p[i] = fmt.Sprintf("($%d, $%d)", n, n+1)
			n += 2
		}
		query = fmt.Sprintf(`INSERT INTO contact_tag (contact_id, tag_id) VALUES %s ON CONFLICT (contact_id, tag_id) DO NOTHING`, strings.Join(p, ","))
	} else {
		query = fmt.Sprintf(`INSERT OR IGNORE INTO contact_tag (contact_id, tag_id) VALUES %s`, strings.Join(valueStrings, ","))
	}

	_, err := txn.Exec(query, valueArgs...)
	if err != nil {
		return fmt.Errorf("failed to add record in pivot table: %w", err)
	}
	return nil
}

func createContact(txn *sql.Tx, c *Contact) (int64, error) {
	var accountID interface{}
	if c.AccountID > 0 {
		accountID = c.AccountID
	} else {
		accountID = nil
	}

	if database.IsPostgres() {
		query := `
			INSERT INTO contacts (account_id, fname, lname, email, phone)
			VALUES($1, $2, $3, $4, $5)
			RETURNING id
		`
		var id int64
		err := txn.QueryRow(query, accountID, c.FirstName, c.LastName, c.Email, c.Phone).Scan(&id)
		if err != nil {
			return 0, fmt.Errorf("failed to create a contact: %w", err)
		}
		return id, nil
	}

	query := `
		INSERT INTO contacts (account_id, fname, lname, email, phone)
		VALUES(?, ?, ?, ?, ?)
	`
	result, err := txn.Exec(query, accountID, c.FirstName, c.LastName, c.Email, c.Phone)
	if err != nil {
		return 0, fmt.Errorf("failed to create a contact: %w", err)
	}
	lastId, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return lastId, nil
}
