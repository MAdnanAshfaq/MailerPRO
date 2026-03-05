package domain

import (
	"fmt"
	"net"
	"strings"
)

type HealthStatus struct {
	Domain       string `json:"domain"`
	SPF          bool   `json:"spf"`
	DKIM         bool   `json:"dkim"`
	DMARC        bool   `json:"dmarc"`
	SPFRecord    string `json:"spf_record,omitempty"`
	DKIMRecord   string `json:"dkim_record,omitempty"`
	DKIMSelector string `json:"dkim_selector,omitempty"`
	DMARCRecord  string `json:"dmarc_record,omitempty"`
}

// Common DKIM selectors used by popular email providers
var commonDKIMSelectors = []string{
	// Generic
	"default", "mail", "email", "dkim", "k1", "k2",
	// Hostinger / Titan
	"s1", "s2", "titan", "hostinger",
	// Google Workspace
	"google", "google1", "google2",
	// Microsoft / Outlook
	"selector1", "selector2",
	// SendGrid
	"s1", "s2", "sm",
	// Mailchimp
	"k1", "k2",
	// Amazon SES
	"amazon", "amazonses",
	// Postmark
	"pm", "20131113",
	// Zoho
	"zoho", "zmail",
	// ProtonMail
	"protonmail",
}

func CheckHealth(domain string) HealthStatus {
	status := HealthStatus{Domain: domain}

	// ─── SPF ───────────────────────────────────────────────────────────
	txtRecords, err := net.LookupTXT(domain)
	if err == nil {
		for _, txt := range txtRecords {
			if strings.HasPrefix(txt, "v=spf1") {
				status.SPF = true
				status.SPFRecord = truncate(txt, 100)
				break
			}
		}
	}

	// ─── DMARC ─────────────────────────────────────────────────────────
	dmarcDomain := "_dmarc." + domain
	dmarcRecords, err := net.LookupTXT(dmarcDomain)
	if err == nil {
		for _, txt := range dmarcRecords {
			if strings.HasPrefix(txt, "v=DMARC1") {
				status.DMARC = true
				status.DMARCRecord = truncate(txt, 100)
				break
			}
		}
	}

	// ─── DKIM ──────────────────────────────────────────────────────────
	// Try all common selectors - NO MOCK FALLBACK any more.
	for _, selector := range commonDKIMSelectors {
		dkimDomain := fmt.Sprintf("%s._domainkey.%s", selector, domain)
		dkimRecords, err := net.LookupTXT(dkimDomain)
		if err != nil {
			continue
		}
		for _, txt := range dkimRecords {
			if strings.HasPrefix(txt, "v=DKIM1") || strings.HasPrefix(txt, "k=rsa") {
				status.DKIM = true
				status.DKIMSelector = selector
				status.DKIMRecord = truncate(txt, 80)
				break
			}
		}
		if status.DKIM {
			break
		}
	}

	return status
}

func truncate(s string, max int) string {
	if len(s) <= max {
		return s
	}
	return s[:max] + "..."
}
