package stats

type OverviewStats struct {
	TotalContacts     int64         `json:"total_contacts"`
	ActiveSubscribers int64         `json:"active_subscribers"`
	TotalSent         int64         `json:"total_sent"`
	OpenRate          float64       `json:"open_rate"`
	CTR               float64       `json:"ctr"`
	Revenue           float64       `json:"revenue"`
	AudienceGrowth    []GrowthPoint `json:"audience_growth"`
}

type GrowthPoint struct {
	Label string `json:"label"`
	Value int64  `json:"value"`
}
