package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"regexp"
	"strings"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
	_ "modernc.org/sqlite"
)

var currentDriver string
var qMarkRegex = regexp.MustCompile(`\?`)

func Connect(connStr string) (*sql.DB, error) {
	driver := "sqlite"
	if strings.HasPrefix(connStr, "postgresql://") || strings.HasPrefix(connStr, "postgres://") {
		driver = "pgx"
	}
	currentDriver = driver

	if driver == "pgx" {
		// pgBouncer transaction mode doesn't support named prepared statements by default
		// This forces pgx to use simple query protocol (exec instead of prepare/bind/exec)
		if !strings.Contains(connStr, "default_query_exec_mode=") {
			if strings.Contains(connStr, "?") {
				connStr += "&default_query_exec_mode=exec"
			} else {
				connStr += "?default_query_exec_mode=exec"
			}
		}
	}

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

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)
	db.SetConnMaxLifetime(5 * time.Minute)

	// In pgx, using standard library driver with pgBouncer transaction mode sometimes still requires
	// completely disabling prepared statements for the *connection* itself if simple query protocol isn't fully honored.
	// But let's see what the translations look like first.

	log.Printf("%s database connected successfully!\n", driver)
	return db, nil
}

func IsPostgres() bool {
	return currentDriver == "pgx"
}

func Translate(query string) string {
	if currentDriver != "pgx" {
		return query
	}

	result := query
	// Translate ? to $1, $2, etc. safely using regex to avoid issues with already translated queries if any
	// though repositories should not call it twice.
	if strings.Contains(result, "?") {
		n := 1
		result = qMarkRegex.ReplaceAllStringFunc(result, func(string) string {
			s := fmt.Sprintf("$%d", n)
			n++
			return s
		})
	}

	// fmt.Printf("[DEBUG db.Translate] Original: %s\n", query)
	// fmt.Printf("[DEBUG db.Translate] Translated: %s\n", result)

	return result
}
