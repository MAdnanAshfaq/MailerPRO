package mailer

import (
	"fmt"
	"log"
	"net/smtp"

	"strings"

	"github.com/codersgyan/camp/internal/account"
	"github.com/codersgyan/camp/internal/ai"
	"github.com/codersgyan/camp/internal/contact"
)

type Service struct {
	accountRepo *account.Repository
	contactRepo *contact.Repository
	aiService   *ai.Service
}

func NewService(accRepo *account.Repository, contactRepo *contact.Repository, ai *ai.Service) *Service {
	return &Service{
		accountRepo: accRepo,
		contactRepo: contactRepo,
		aiService:   ai,
	}
}

func (s *Service) SendCampaign(accID int64, subject, content string, isPersonalized bool) error {
	// 1. Get SMTP settings for the account
	settings, err := s.accountRepo.GetSMTPSettings(accID)
	if err != nil || settings == nil {
		log.Printf("No SMTP settings found for account %d. Simulating send.", accID)
		return nil // Graceful degradation for prototype
	}

	// 2. Get contacts
	contacts, err := s.contactRepo.ListAll(accID)
	if err != nil {
		return fmt.Errorf("failed to fetch contacts: %w", err)
	}

	// 3. Configure SMTP client
	auth := smtp.PlainAuth("", settings.Username, settings.Password, settings.Host)
	addr := fmt.Sprintf("%s:%d", settings.Host, settings.Port)

	// 4. Send to all contacts
	successes := 0
	for _, c := range contacts {
		emailContent := content
		
		if isPersonalized && s.aiService != nil {
			domain := extractDomain(c.Email)
			if !isGenericDomain(domain) {
				log.Printf("Hyper-personalizing for %s...", domain)
				draft, err := s.aiService.GeneratePersonalizedDraft(domain, content)
				if err == nil {
					emailContent = draft
				} else {
					log.Printf("Personalization failed for %s: %v. Using base template.", domain, err)
				}
			}
		}

		msg := []byte(fmt.Sprintf("To: %s\r\n"+
			"Subject: %s\r\n"+
			"\r\n"+
			"%s\r\n", c.Email, subject, emailContent))

		err := smtp.SendMail(addr, auth, settings.Username, []string{c.Email}, msg)
		if err != nil {
			log.Printf("Failed to send to %s via %s: %v", c.Email, settings.Host, err)
		} else {
			successes++
			log.Printf("Successfully sent out email to %s via %s", c.Email, settings.Host)
		}
	}
	log.Printf("Campaign sent to %d contacts", successes)
	return nil
}
func extractDomain(email string) string {
	parts := strings.Split(email, "@")
	if len(parts) > 1 {
		return parts[1]
	}
	return ""
}

func isGenericDomain(domain string) bool {
	generics := map[string]bool{
		"gmail.com":   true,
		"outlook.com": true,
		"hotmail.com": true,
		"yahoo.com":   true,
		"icloud.com":  true,
		"aol.com":     true,
	}
	return generics[strings.ToLower(domain)]
}
