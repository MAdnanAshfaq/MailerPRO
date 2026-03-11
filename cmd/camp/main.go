package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/codersgyan/camp/internal/account"
	"github.com/codersgyan/camp/internal/ai"
	"github.com/codersgyan/camp/internal/campaign"
	"github.com/codersgyan/camp/internal/contact"
	"github.com/codersgyan/camp/internal/database"
	"github.com/codersgyan/camp/internal/domain"
	"github.com/codersgyan/camp/internal/mailer"
	"github.com/codersgyan/camp/internal/stats"
	"github.com/codersgyan/camp/internal/warming"
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

	mailerService := mailer.NewService(accountRepo, contactRepository)
	aiService := ai.NewService()

	campaignRepository := campaign.NewRepository(db)
	campaignHandler := campaign.NewHandler(campaignRepository, mailerService, aiService)

	warmingWorker := warming.NewWorker(db, accountRepo)
	warmingWorker.Start()

	// Serve static files from the frontend/dist directory
	fs := http.FileServer(http.Dir("./frontend/dist"))
	http.Handle("/assets/", fs)
	http.Handle("/vite.svg", fs) // Assuming vite.svg is in dist

	http.HandleFunc("POST /api/contacts", contactHandler.Create)
	statsRepo := stats.NewRepository(db)
	statsHandler := stats.NewHandler(statsRepo)

	http.HandleFunc("GET /api/contacts", contactHandler.List)
	http.HandleFunc("PUT /api/contacts/{id}", contactHandler.Update)
	http.HandleFunc("POST /api/contacts/tag", contactHandler.AddTag)
	http.HandleFunc("PATCH /api/contacts/{id}/tag", contactHandler.RemoveTag)

	http.HandleFunc("POST /api/campaigns", campaignHandler.Create)
	http.HandleFunc("POST /api/campaigns/generate-ai", campaignHandler.GenerateAI)
	http.HandleFunc("GET /api/campaigns/{id}", campaignHandler.Get)
	http.HandleFunc("PUT /api/campaigns/{id}", campaignHandler.Update)
	http.HandleFunc("GET /api/campaigns", campaignHandler.List)

	// Stats
	http.HandleFunc("/api/stats/overview", statsHandler.GetOverview)

	// Accounts & Settings
	http.HandleFunc("POST /api/signup", accountHandler.Signup)
	http.HandleFunc("POST /api/login", accountHandler.Login)
	http.HandleFunc("POST /api/settings/smtp", accountHandler.SaveSMTP)
	http.HandleFunc("GET /api/stats/warming", accountHandler.GetWarming)

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
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
