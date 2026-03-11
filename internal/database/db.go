package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"strings"

	_ "github.com/lib/pq"
	_ "modernc.org/sqlite"
)

var currentDriver string

func Connect(connStr string) (*sql.DB, error) {
	driver := "sqlite"
	if strings.HasPrefix(connStr, "postgresql://") || strings.HasPrefix(connStr, "postgres://") {
		driver = "postgres"
	}
	currentDriver = driver

	if driver == "sqlite" {
		if err := os.MkdirAll("./camp_data", 0755); err != nil {
			return nil, fmt.Errorf("failed to create data directory: %w", err)
		}
	}

	db, err := sql.Open(driver, connStr)
	if err != nil {
		return nil, fmt.Errorf("failed to open the database: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	if driver == "sqlite" {
		pragmas := []string{
			"PRAGMA foreign_keys = ON",
			"PRAGMA journal_mode = WAL",
			"PRAGMA synchronous = NORMAL",
			"PRAGMA busy_timeout = 5000",
		}

		for _, pragma := range pragmas {
			if _, err := db.Exec(pragma); err != nil {
				return nil, fmt.Errorf("failed to set pragma: %w", err)
			}
		}
	}

	log.Printf("%s database connected successfully!\n", driver)
	return db, nil
}

func IsPostgres() bool {
	return currentDriver == "postgres"
}

func Translate(query string) string {
	if currentDriver != "postgres" {
		return query
	}

	// Translate ? to $1, $2, etc.
	// We use a regex-free approach for simplicity, but we need to be careful with strings/comments.
	// For this project, simple string replacement in order is fine as long as we don't have literal '?'
	n := 1
	result := query
	for strings.Contains(result, "?") {
		result = strings.Replace(result, "?", fmt.Sprintf("$%d", n), 1)
		n++
	}

	// Translate INSERT OR IGNORE to INSERT ... ON CONFLICT DO NOTHING
	if strings.Contains(strings.ToUpper(result), "INSERT OR IGNORE") {
		result = strings.Replace(result, "INSERT OR IGNORE", "INSERT", 1)
		if !strings.Contains(strings.ToUpper(result), "ON CONFLICT") {
			result += " ON CONFLICT DO NOTHING"
		}
	}

	return result
}
