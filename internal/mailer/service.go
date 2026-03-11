package mailer

import (
	"fmt"
	"log"
	"net/smtp"

	"github.com/codersgyan/camp/internal/account"
	"github.com/codersgyan/camp/internal/contact"
)

type Service struct {
	accountRepo *account.Repository
	contactRepo *contact.Repository
}

func NewService(accRepo *account.Repository, contactRepo *contact.Repository) *Service {
	return &Service{
		accountRepo: accRepo,
		contactRepo: contactRepo,
	}
}

func (s *Service) SendCampaign(accID int64, subject, content string) error {
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
		msg := []byte(fmt.Sprintf("To: %s\r\n"+
			"Subject: %s\r\n"+
			"\r\n"+
			"%s\r\n", c.Email, subject, content))

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
