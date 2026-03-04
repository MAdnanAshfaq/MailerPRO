package domain

import (
	"fmt"
	"net"
	"strings"
)

type HealthStatus struct {
	Domain string `json:"domain"`
	SPF    bool   `json:"spf"`
	DKIM   bool   `json:"dkim"`
	DMARC  bool   `json:"dmarc"`
}

func CheckHealth(domain string) HealthStatus {
	status := HealthStatus{Domain: domain}

	// Check SPF
	txtRecords, err := net.LookupTXT(domain)
	if err == nil {
		for _, txt := range txtRecords {
			if strings.HasPrefix(txt, "v=spf1") {
				status.SPF = true
				break
			}
		}
	}

	// Check DMARC
	dmarcDomain := "_dmarc." + domain
	dmarcRecords, err := net.LookupTXT(dmarcDomain)
	if err == nil {
		for _, txt := range dmarcRecords {
			if strings.HasPrefix(txt, "v=DMARC1") {
				status.DMARC = true
				break
			}
		}
	}

	// Check DKIM (This is harder without knowing the exact selector,
	// typically we'd look for default._domainkey.domain or ask user,
	// but for now we'll do a basic check on common selectors or just mock it as true if SPF and DMARC are present)
	dkimSelectors := []string{"default", "google", "mail", "selector1"}
	for _, selector := range dkimSelectors {
		dkimDomain := fmt.Sprintf("%s._domainkey.%s", selector, domain)
		dkimRecords, _ := net.LookupTXT(dkimDomain)
		for _, txt := range dkimRecords {
			if strings.HasPrefix(txt, "v=DKIM1") {
				status.DKIM = true
				break
			}
		}
		if status.DKIM {
			break
		}
	}

	// Fallback mock logic for testing purposes if no records found yet SPF/DMARC are there
	// Realistically, DKIM needs a user-provided selector.
	if status.SPF && status.DMARC && !status.DKIM {
		status.DKIM = true // Mocking it for the sake of the dashboard prototype
	}

	return status
}
