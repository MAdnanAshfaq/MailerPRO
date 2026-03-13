package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/codersgyan/camp/internal/account"
	"github.com/codersgyan/camp/internal/ai"
	"github.com/codersgyan/camp/internal/campaign"
	"github.com/codersgyan/camp/internal/contact"
	"github.com/codersgyan/camp/internal/database"
	"github.com/codersgyan/camp/internal/domain"
	"github.com/codersgyan/camp/internal/mailer"
	"github.com/codersgyan/camp/internal/stats"
	"github.com/codersgyan/camp/internal/warming"
	"github.com/codersgyan/camp/internal/scheduler"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, relying on environment variables")
	}

	dbConn := os.Getenv("DB_URL")
	if dbConn == "" {
		dbConn = os.Getenv("DB_PATH")
	}
	if dbConn == "" {
		dbConn = "./camp_data/camp.db"
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	db, err := database.Connect(dbConn)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// run the migration
	if err := database.RunMigration(db); err != nil {
		log.Fatal(err)
	}

	contactRepository := contact.NewRepository(db)
	contactHandler := contact.NewHandler(contactRepository)

	accountRepo := account.NewRepository(db)
	accountHandler := account.NewHandler(accountRepo)

	aiService := ai.NewService()
	mailerService := mailer.NewService(accountRepo, contactRepository, aiService)

	campaignRepository := campaign.NewRepository(db)
	campaignHandler := campaign.NewHandler(campaignRepository, mailerService, aiService)

	statsRepo := stats.NewRepository(db)
	statsHandler := stats.NewHandler(statsRepo)

	warmingWorker := warming.NewWorker(db, accountRepo)
	warmingWorker.Start()

	schedulerWorker := scheduler.NewWorker(campaignRepository, mailerService)
	schedulerWorker.Start()

	// Serve static files from the frontend/dist directory
	fs := http.FileServer(http.Dir("./frontend/dist"))
	http.Handle("/assets/", fs)
	http.Handle("/vite.svg", fs) // Assuming vite.svg is in dist

	http.HandleFunc("/api/contacts", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			contactHandler.Create(w, r)
		} else if r.Method == http.MethodGet {
			contactHandler.List(w, r)
		}
	})
	// IMPORTANT: /api/contacts/tag MUST be registered before /api/contacts/
	// because Go's mux treats trailing-slash patterns as prefix matchers.
	http.HandleFunc("/api/contacts/tag", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			contactHandler.AddTag(w, r)
		}
	})
	http.HandleFunc("/api/contacts/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPut {
			contactHandler.Update(w, r)
		} else if r.Method == http.MethodPatch && strings.HasSuffix(r.URL.Path, "/tag") {
			contactHandler.RemoveTag(w, r)
		}
	})

	http.HandleFunc("/api/campaigns", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			campaignHandler.Create(w, r)
		} else {
			campaignHandler.List(w, r)
		}
	})
	http.HandleFunc("/api/campaigns/generate-ai", campaignHandler.GenerateAI)
	http.HandleFunc("/api/campaigns/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			campaignHandler.Get(w, r)
		} else if r.Method == http.MethodPut {
			campaignHandler.Update(w, r)
		}
	})

	// Stats
	http.HandleFunc("/api/stats/overview", statsHandler.GetOverview)

	// Accounts & Settings
	http.HandleFunc("/api/signup", accountHandler.Signup)
	http.HandleFunc("/api/login", accountHandler.Login)
	http.HandleFunc("/api/settings/smtp", accountHandler.SaveSMTP)
	http.HandleFunc("/api/stats/warming", accountHandler.GetWarming)
	http.HandleFunc("/api/account/me", accountHandler.GetMe)

	domainHandler := domain.NewHandler()
	http.HandleFunc("GET /api/domain/health", domainHandler.GetHealth)

	// Health Check Route
	http.HandleFunc("GET /api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "ok",
			"version": "1.0.0",
		})
	})

	// Catch-all route to serve index.html for SPA routing
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// If it's an API request that didn't match, return 404
		if len(r.URL.Path) >= 4 && r.URL.Path[:4] == "/api" {
			http.NotFound(w, r)
			return
		}
		// Otherwise serve index.html
		http.ServeFile(w, r, "./frontend/dist/index.html")
	})

	log.Printf("Server started at :%s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, withSecurityHeaders(http.DefaultServeMux)))
}

func withSecurityHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Content Security Policy
		// default-src 'self': only allow resources from own domain
		// script-src 'self' ... 'unsafe-eval': XLSX library needs eval, cdnjs for XLSX
		// style-src 'self' 'unsafe-inline' ...: Google Fonts and inline styles
		// img-src 'self' data: https://*: allow all images for AI personalization research
		csp := "default-src 'self'; " +
			"script-src 'self' https://cdnjs.cloudflare.com 'unsafe-eval'; " +
			"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
			"font-src 'self' https://fonts.gstatic.com; " +
			"img-src 'self' data: https://*; " +
			"connect-src 'self' https://api.openai.com;"

		w.Header().Set("Content-Security-Policy", csp)
		w.Header().Set("X-Content-Type-Options", "nosniff")
		w.Header().Set("X-Frame-Options", "DENY")
		w.Header().Set("X-XSS-Protection", "1; mode=block")
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")

		next.ServeHTTP(w, r)
	})
}
