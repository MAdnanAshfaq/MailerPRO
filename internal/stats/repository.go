package stats

import (
	"database/sql"
	"fmt"
)

type Repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) *Repository {
	return &Repository{db: db}
}

func (r *Repository) GetOverviewStats() (*OverviewStats, error) {
	stats := &OverviewStats{}

	// Total Contacts
	err := r.db.QueryRow("SELECT COUNT(*) FROM contacts").Scan(&stats.TotalContacts)
	if err != nil {
		return nil, fmt.Errorf("failed to get total contacts: %w", err)
	}
	stats.ActiveSubscribers = stats.TotalContacts // Placeholder logic for now

	// Campaign Aggregates
	query := `
		SELECT 
			COUNT(*) as total_sent,
			AVG(open_rate) as avg_open_rate,
			AVG(ctr) as avg_ctr,
			SUM(conversions * 10) as estimated_revenue -- Placeholder multipliers for "realtime" feel
		FROM campaigns
		WHERE status = 'sent'
	`
	var totalSent sql.NullInt64
	var avgOpenRate, avgCTR, revenue sql.NullFloat64

	err = r.db.QueryRow(query).Scan(&totalSent, &avgOpenRate, &avgCTR, &revenue)
	if err != nil {
		return nil, fmt.Errorf("failed to aggregate campaign stats: %w", err)
	}

	stats.TotalSent = totalSent.Int64
	stats.OpenRate = avgOpenRate.Float64
	stats.CTR = avgCTR.Float64
	stats.Revenue = revenue.Float64

	// Audience Growth (Mocking 3 points for the donut)
	stats.AudienceGrowth = []GrowthPoint{
		{Label: "New Subscribers", Value: stats.TotalContacts},
		{Label: "Unsubscribes", Value: stats.TotalContacts / 10},
		{Label: "Bounce Rate", Value: 2},
	}

	return stats, nil
}
