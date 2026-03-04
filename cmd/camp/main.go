package main

import (
	"log"
	"net/http"

	"github.com/codersgyan/camp/internal/account"
	"github.com/codersgyan/camp/internal/campaign"
	"github.com/codersgyan/camp/internal/contact"
	"github.com/codersgyan/camp/internal/database"
	"github.com/codersgyan/camp/internal/domain"
	"github.com/codersgyan/camp/internal/mailer"
	"github.com/codersgyan/camp/internal/stats"
	"github.com/codersgyan/camp/internal/warming"
)

func main() {
	db, err := database.Connect("./camp_data/camp.db")
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

	campaignRepository := campaign.NewRepository(db)
	campaignHandler := campaign.NewHandler(campaignRepository, mailerService)

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
	http.HandleFunc("GET /api/campaigns/{id}", campaignHandler.Get)
	http.HandleFunc("PUT /api/campaigns/{id}", campaignHandler.Update)
	http.HandleFunc("GET /api/campaigns", campaignHandler.List)

	// Stats
	http.HandleFunc("/api/stats/overview", statsHandler.GetOverview)

	// Accounts & Settings
	http.HandleFunc("POST /api/signup", accountHandler.Signup)
	http.HandleFunc("POST /api/settings/smtp", accountHandler.SaveSMTP)
	http.HandleFunc("GET /api/stats/warming", accountHandler.GetWarming)

	domainHandler := domain.NewHandler()
	http.HandleFunc("GET /api/domain/health", domainHandler.GetHealth)

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

	log.Println("Server started at :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
