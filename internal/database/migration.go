package database

import (
	"database/sql"
	"fmt"
)

func RunMigration(db *sql.DB) error {
	migrations := []string{
		`
			CREATE TABLE IF NOT EXISTS contacts (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				fname TEXT NOT NULL,
				lname TEXT NOT NULL,
				email TEXT UNIQUE NOT NULL,
				phone TEXT,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
			)
		`,
		`
			CREATE TABLE IF NOT EXISTS tags (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				text TEXT UNIQUE NOT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
			)
		`,
		`
			CREATE TABLE IF NOT EXISTS contact_tag (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				contact_id INTEGER NOT NULL,
				tag_id INTEGER NOT NULL,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

				FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
				FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,

				UNIQUE(contact_id, tag_id)
			)
		`,
		`
			CREATE TABLE IF NOT EXISTS campaigns (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT NOT NULL,
				subject TEXT NOT NULL,
				content TEXT NOT NULL,
				status TEXT CHECK(status IN ('draft', 'sent', 'paused')) DEFAULT 'draft',
				open_rate REAL DEFAULT 0,
				ctr REAL DEFAULT 0,
				conversions REAL DEFAULT 0,
				sent_at DATETIME,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
			)
		`,
		`
			CREATE TABLE IF NOT EXISTS accounts (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT NOT NULL,
				email TEXT UNIQUE NOT NULL,
				password_hash TEXT NOT NULL,
				company_name TEXT,
				domain TEXT,
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
			)
		`,
		`
			CREATE TABLE IF NOT EXISTS smtp_settings (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				account_id INTEGER NOT NULL UNIQUE,
				host TEXT NOT NULL,
				port INTEGER NOT NULL,
				username TEXT NOT NULL,
				password TEXT NOT NULL,
				security_type TEXT CHECK(security_type IN ('none', 'ssl', 'tls')) DEFAULT 'tls',
				created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
			)
		`,
		`
			CREATE TABLE IF NOT EXISTS warming_status (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				account_id INTEGER NOT NULL UNIQUE,
				status TEXT CHECK(status IN ('active', 'paused', 'completed')) DEFAULT 'active',
				daily_limit INTEGER DEFAULT 10,
				target_limit INTEGER DEFAULT 50,
				current_count INTEGER DEFAULT 0,
				start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
				updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
			)
		`,
	}

	for i, migration := range migrations {
		if _, err := db.Exec(migration); err != nil {
			return fmt.Errorf("migration %d failed: %w", i+1, err)
		}
	}

	return nil
}
