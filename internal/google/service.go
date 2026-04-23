package google

import (
	"context"
	"encoding/base64"
	"fmt"
	"os"

	"github.com/codersgyan/camp/internal/account"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/gmail/v1"
	"google.golang.org/api/option"
)

type Service struct {
	config *oauth2.Config
	repo   *account.Repository
}

func NewService(repo *account.Repository) *Service {
	config := &oauth2.Config{
		ClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		RedirectURL:  os.Getenv("GOOGLE_REDIRECT_URL"),
		Endpoint:     google.Endpoint,
		Scopes: []string{
			gmail.GmailSendScope,
			"https://www.googleapis.com/auth/userinfo.email",
		},
	}

	return &Service{
		config: config,
		repo:   repo,
	}
}

func (s *Service) GetAuthURL(state string) string {
	return s.config.AuthCodeURL(state, oauth2.AccessTypeOffline, oauth2.ApprovalForce)
}

func (s *Service) ExchangeCode(ctx context.Context, code string) (*oauth2.Token, error) {
	return s.config.Exchange(ctx, code)
}

func (s *Service) SendGmail(ctx context.Context, acc *account.Account, to, subject, body string) error {
	if acc.GoogleRefreshToken == nil {
		return fmt.Errorf("no google refresh token for account %d", acc.ID)
	}

	if acc.GoogleAccessToken == nil || acc.GoogleRefreshToken == nil || acc.GoogleTokenExpiry == nil {
		return fmt.Errorf("missing google tokens for account %d", acc.ID)
	}

	token := &oauth2.Token{
		AccessToken:  *acc.GoogleAccessToken,
		RefreshToken: *acc.GoogleRefreshToken,
		Expiry:       *acc.GoogleTokenExpiry,
	}

	tokenSource := s.config.TokenSource(ctx, token)
	newToken, err := tokenSource.Token()
	if err != nil {
		return fmt.Errorf("failed to get token: %w", err)
	}

	// Update tokens if they changed
	if newToken.AccessToken != *acc.GoogleAccessToken {
		err := s.repo.UpdateGoogleTokens(acc.ID, newToken.AccessToken, newToken.RefreshToken, &newToken.Expiry)
		if err != nil {
			fmt.Printf("Warning: failed to update refreshed google tokens: %v\n", err)
		}
	}

	client := oauth2.NewClient(ctx, tokenSource)
	svc, err := gmail.NewService(ctx, option.WithHTTPClient(client))
	if err != nil {
		return fmt.Errorf("failed to create gmail service: %w", err)
	}

	var message gmail.Message
	raw := fmt.Sprintf("To: %s\r\nSubject: %s\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n%s", to, subject, body)
	message.Raw = base64.URLEncoding.EncodeToString([]byte(raw))

	_, err = svc.Users.Messages.Send("me", &message).Do()
	if err != nil {
		return fmt.Errorf("gmail send error: %w", err)
	}

	return nil
}
