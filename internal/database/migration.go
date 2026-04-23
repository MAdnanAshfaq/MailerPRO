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
		// 1. Accounts (no dependencies)
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
		// 2. Contacts (references accounts)
		`
			CREATE TABLE IF NOT EXISTS contacts (
				id %ID_AUTO%,
				account_id INTEGER REFERENCES accounts(id),
				fname TEXT NOT NULL DEFAULT '',
				lname TEXT NOT NULL DEFAULT '',
				email TEXT UNIQUE NOT NULL,
				phone TEXT,
				created_at %TIMESTAMP% DEFAULT CURRENT_TIMESTAMP,
				updated_at %TIMESTAMP% DEFAULT CURRENT_TIMESTAMP
			)
		`,
		// 3. Tags
		`
			CREATE TABLE IF NOT EXISTS tags (
				id %ID_AUTO%,
				text TEXT UNIQUE NOT NULL,
				created_at %TIMESTAMP% DEFAULT CURRENT_TIMESTAMP,
				updated_at %TIMESTAMP% DEFAULT CURRENT_TIMESTAMP
			)
		`,
		// 4. Contact-tag pivot
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
		// 5. SMTP settings (references accounts)
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
		// 6. Campaigns (references accounts)
		`
			CREATE TABLE IF NOT EXISTS campaigns (
				id %ID_AUTO%,
				account_id INTEGER REFERENCES accounts(id),
				name TEXT NOT NULL,
				subject TEXT NOT NULL,
				content TEXT NOT NULL,
				status TEXT CHECK(status IN ('draft', 'sent', 'paused', 'scheduled')) DEFAULT 'draft',
				open_rate REAL DEFAULT 0,
				ctr REAL DEFAULT 0,
				conversions REAL DEFAULT 0,
				sent_at %TIMESTAMP%,
				scheduled_at %TIMESTAMP%,
				is_personalized BOOLEAN DEFAULT FALSE,
				target_folder TEXT DEFAULT '',
				created_at %TIMESTAMP% DEFAULT CURRENT_TIMESTAMP,
				updated_at %TIMESTAMP% DEFAULT CURRENT_TIMESTAMP
			)
		`,
		// 7. Warming status (references accounts)
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
		// 8. Sent Emails log (references accounts)
		`
			CREATE TABLE IF NOT EXISTS sent_emails (
				id %ID_AUTO%,
				account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
				recipient TEXT NOT NULL,
				subject TEXT NOT NULL,
				type TEXT CHECK(type IN ('campaign', 'warming', 'test')) NOT NULL,
				sent_at %TIMESTAMP% DEFAULT CURRENT_TIMESTAMP
			)
		`,
		// ALTER TABLE migrations for existing DBs (errors are ignored if columns already exist)
		`ALTER TABLE contacts ADD COLUMN account_id INTEGER REFERENCES accounts(id)`,
		`ALTER TABLE campaigns ADD COLUMN account_id INTEGER REFERENCES accounts(id)`,
		`ALTER TABLE campaigns ADD COLUMN scheduled_at %TIMESTAMP%`,
		`ALTER TABLE campaigns ADD COLUMN is_personalized BOOLEAN DEFAULT FALSE`,
		`ALTER TABLE campaigns ADD COLUMN target_folder TEXT DEFAULT ''`,
		`ALTER TABLE campaigns ADD COLUMN open_rate REAL DEFAULT 0`,
		`ALTER TABLE campaigns ADD COLUMN ctr REAL DEFAULT 0`,
		`ALTER TABLE campaigns ADD COLUMN conversions REAL DEFAULT 0`,
		`ALTER TABLE campaigns ADD COLUMN sent_at %TIMESTAMP%`,
		`UPDATE campaigns SET account_id = 1 WHERE account_id IS NULL AND EXISTS (SELECT 1 FROM accounts WHERE id = 1)`,
		`UPDATE contacts SET account_id = 1 WHERE account_id IS NULL AND EXISTS (SELECT 1 FROM accounts WHERE id = 1)`,
	}

	// Postgres-only: DROP/ADD CONSTRAINT (SQLite doesn't support this syntax)
	postgresMigrations := []string{
		`ALTER TABLE campaigns DROP CONSTRAINT IF EXISTS campaigns_status_check`,
		`ALTER TABLE campaigns ADD CONSTRAINT campaigns_status_check CHECK(status IN ('draft', 'sent', 'paused', 'scheduled'))`,
	}

	runMigrationList := func(list []string, label string) error {
		for i, migration := range list {
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
				if strings.Contains(m, "ALTER TABLE") && (strings.Contains(err.Error(), "duplicate column") || strings.Contains(err.Error(), "already exists") || strings.Contains(err.Error(), "multiple primary keys") || strings.Contains(err.Error(), "duplicate column name")) {
					continue
				}
				return fmt.Errorf("%s migration %d failed: %w", label, i+1, err)
			}
		}
		return nil
	}

	if err := runMigrationList(migrations, "core"); err != nil {
		return err
	}

	// Postgres-only constraint migrations
	if isPostgres {
		if err := runMigrationList(postgresMigrations, "postgres"); err != nil {
			return err
		}
	}

	return nil
}
