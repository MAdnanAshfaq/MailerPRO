package mailer

import (
	"crypto/tls"
	"database/sql"
	"fmt"
	"log"
	"net/smtp"
	"strings"

	"github.com/codersgyan/camp/internal/account"
	"github.com/codersgyan/camp/internal/ai"
	"github.com/codersgyan/camp/internal/contact"
	"github.com/codersgyan/camp/internal/database"
)

type Service struct {
	db          *sql.DB
	accountRepo *account.Repository
	contactRepo *contact.Repository
	aiService   *ai.Service
}

func NewService(db *sql.DB, accRepo *account.Repository, contactRepo *contact.Repository, ai *ai.Service) *Service {
	return &Service{
		db:          db,
		accountRepo: accRepo,
		contactRepo: contactRepo,
		aiService:   ai,
	}
}

func (s *Service) SendCampaign(accID int64, subject, content string, isPersonalized bool, targetFolder string) error {
	// 1. Get SMTP settings for the account
	settings, err := s.accountRepo.GetSMTPSettings(accID)
	if err != nil || settings == nil {
		log.Printf("No SMTP settings found for account %d. Simulating send.", accID)
		return nil // Graceful degradation for prototype
	}

	// 2. Get contacts
	allContacts, err := s.contactRepo.ListAll(accID)
	if err != nil {
		return fmt.Errorf("failed to fetch contacts: %w", err)
	}
	
	// 2.5 Filter by TargetFolder
	var contacts []contact.Contact
	for _, c := range allContacts {
		if targetFolder == "" {
			contacts = append(contacts, c)
			continue
		}
		for _, tag := range c.Tags {
			if strings.EqualFold(strings.TrimSpace(tag.Text), strings.TrimSpace(targetFolder)) {
				contacts = append(contacts, c)
				break
			}
		}
	}

	// 3. Send to all contacts
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
			"Content-Type: text/html; charset=UTF-8\r\n"+
			"\r\n"+
			"%s\r\n", c.Email, subject, emailContent))

		err := s.sendMail(settings, []string{c.Email}, msg)
		if err != nil {
			log.Printf("Failed to send to %s via %s:%d: %v", c.Email, settings.Host, settings.Port, err)
		} else {
			successes++
			log.Printf("Successfully sent out email to %s via %s", c.Email, settings.Host)
			s.LogSentEmail(accID, c.Email, subject, "campaign")
		}
	}
	log.Printf("Campaign sent to %d contacts", successes)
	return nil
}

func (s *Service) sendMail(settings *account.SMTPSettings, to []string, msg []byte) error {
	addr := fmt.Sprintf("%s:%d", settings.Host, settings.Port)
	auth := smtp.PlainAuth("", settings.Username, settings.Password, settings.Host)

	// Port 465 is typically Implicit SSL/TLS
	if settings.Port == 465 || strings.EqualFold(settings.SecurityType, "ssl") {
		tlsconfig := &tls.Config{
			InsecureSkipVerify: false,
			ServerName:         settings.Host,
		}

		conn, err := tls.Dial("tcp", addr, tlsconfig)
		if err != nil {
			return fmt.Errorf("tls.Dial error: %w", err)
		}
		defer conn.Close()

		c, err := smtp.NewClient(conn, settings.Host)
		if err != nil {
			return fmt.Errorf("smtp.NewClient error: %w", err)
		}
		defer c.Quit()

		if err = c.Auth(auth); err != nil {
			return fmt.Errorf("smtp.Auth error: %w", err)
		}

		if err = c.Mail(settings.Username); err != nil {
			return fmt.Errorf("smtp.Mail error: %w", err)
		}

		for _, addr := range to {
			if err = c.Rcpt(addr); err != nil {
				return fmt.Errorf("smtp.Rcpt error: %w", err)
			}
		}

		w, err := c.Data()
		if err != nil {
			return fmt.Errorf("smtp.Data error: %w", err)
		}

		_, err = w.Write(msg)
		if err != nil {
			return fmt.Errorf("data.Write error: %w", err)
		}

		err = w.Close()
		if err != nil {
			return fmt.Errorf("data.Close error: %w", err)
		}

		return nil
	}

	// Standard SMTP (STARTTLS or Plain)
	return smtp.SendMail(addr, auth, settings.Username, to, msg)
}

func (s *Service) LogSentEmail(accID int64, recipient, subject, emailType string) {
	if s.db == nil {
		return
	}
	query := database.Translate("INSERT INTO sent_emails (account_id, recipient, subject, type) VALUES (?, ?, ?, ?)")
	_, err := s.db.Exec(query, accID, recipient, subject, emailType)
	if err != nil {
		log.Printf("Failed to log sent email to %s (type %s): %v", recipient, emailType, err)
	}
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
