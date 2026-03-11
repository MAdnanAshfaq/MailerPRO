package database

import (
	"database/sql"
	"fmt"
	"strings"
)

func RunMigration(db *sql.DB) error {
	// Simple check to see if we're on Postgres
	isPostgres := false
	var version string
	if err := db.QueryRow("SELECT version()").Scan(&version); err == nil {
		isPostgres = strings.Contains(strings.ToLower(version), "postgresql")
	}

	migrations := []string{
		`
			CREATE TABLE IF NOT EXISTS contacts (
				id %ID_AUTO%,
				fname TEXT NOT NULL,
				lname TEXT NOT NULL,
				email TEXT UNIQUE NOT NULL,
				phone TEXT,
				created_at %TIMESTAMP% DEFAULT CURRENT_TIMESTAMP,
				updated_at %TIMESTAMP% DEFAULT CURRENT_TIMESTAMP
			)
		`,
		`
			CREATE TABLE IF NOT EXISTS tags (
				id %ID_AUTO%,
				text TEXT UNIQUE NOT NULL,
				created_at %TIMESTAMP% DEFAULT CURRENT_TIMESTAMP,
				updated_at %TIMESTAMP% DEFAULT CURRENT_TIMESTAMP
			)
		`,
		`
			CREATE TABLE IF NOT EXISTS contact_tag (
				id %ID_AUTO%,
				contact_id INTEGER NOT NULL,
				tag_id INTEGER NOT NULL,
				created_at %TIMESTAMP% DEFAULT CURRENT_TIMESTAMP,
				updated_at %TIMESTAMP% DEFAULT CURRENT_TIMESTAMP,

				FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
				FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,

				UNIQUE(contact_id, tag_id)
			)
		`,
		`
			CREATE TABLE IF NOT EXISTS campaigns (
				id %ID_AUTO%,
				name TEXT NOT NULL,
				subject TEXT NOT NULL,
				content TEXT NOT NULL,
				status TEXT CHECK(status IN ('draft', 'sent', 'paused')) DEFAULT 'draft',
				open_rate REAL DEFAULT 0,
				ctr REAL DEFAULT 0,
				conversions REAL DEFAULT 0,
				sent_at %TIMESTAMP%,
				created_at %TIMESTAMP% DEFAULT CURRENT_TIMESTAMP,
				updated_at %TIMESTAMP% DEFAULT CURRENT_TIMESTAMP
			)
		`,
		`
			CREATE TABLE IF NOT EXISTS accounts (
				id %ID_AUTO%,
				name TEXT NOT NULL,
				email TEXT UNIQUE NOT NULL,
				password_hash TEXT NOT NULL,
				company_name TEXT,
				domain TEXT,
				created_at %TIMESTAMP% DEFAULT CURRENT_TIMESTAMP,
				updated_at %TIMESTAMP% DEFAULT CURRENT_TIMESTAMP
			)
		`,
		`
			CREATE TABLE IF NOT EXISTS smtp_settings (
				id %ID_AUTO%,
				account_id INTEGER NOT NULL UNIQUE,
				host TEXT NOT NULL,
				port INTEGER NOT NULL,
				username TEXT NOT NULL,
				password TEXT NOT NULL,
				security_type TEXT CHECK(security_type IN ('none', 'ssl', 'tls')) DEFAULT 'tls',
				created_at %TIMESTAMP% DEFAULT CURRENT_TIMESTAMP,
				updated_at %TIMESTAMP% DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
			)
		`,
		`
			CREATE TABLE IF NOT EXISTS warming_status (
				id %ID_AUTO%,
				account_id INTEGER NOT NULL UNIQUE,
				status TEXT CHECK(status IN ('active', 'paused', 'completed')) DEFAULT 'active',
				daily_limit INTEGER DEFAULT 10,
				target_limit INTEGER DEFAULT 50,
				current_count INTEGER DEFAULT 0,
				start_date %TIMESTAMP% DEFAULT CURRENT_TIMESTAMP,
				updated_at %TIMESTAMP% DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
			)
		`,
		// Add account_id to contacts for per-user scoping
		`ALTER TABLE contacts ADD COLUMN account_id INTEGER REFERENCES accounts(id)`,
	}

	for i, migration := range migrations {
		m := migration
		if isPostgres {
			m = strings.ReplaceAll(m, "%ID_AUTO%", "SERIAL PRIMARY KEY")
			m = strings.ReplaceAll(m, "%TIMESTAMP%", "TIMESTAMP")
		} else {
			m = strings.ReplaceAll(m, "%ID_AUTO%", "INTEGER PRIMARY KEY AUTOINCREMENT")
			m = strings.ReplaceAll(m, "%TIMESTAMP%", "DATETIME")
		}

		_, err := db.Exec(m)
		if err != nil {
			// SQLite doesn't support ALTER TABLE ADD COLUMN IF NOT EXISTS,
			// Postgres might already have it too.
			if strings.Contains(m, "ALTER TABLE") && (strings.Contains(err.Error(), "duplicate column") || strings.Contains(err.Error(), "already exists")) {
				continue
			}
			return fmt.Errorf("migration %d failed: %w", i+1, err)
		}
	}

	return nil
}
