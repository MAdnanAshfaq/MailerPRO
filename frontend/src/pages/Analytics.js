import { statsApi, campaignsApi } from '../api';

export async function Analytics() {
    let stats = {
        open_rate: 0,
        ctr: 0,
        audience_growth: []
    };
    let topCampaigns = [];

    try {
        const [overview, campaigns] = await Promise.all([
            statsApi.getOverview(),
            campaignsApi.list()
        ]);
        stats = overview;
        topCampaigns = (campaigns || [])
            .filter(c => c.status === 'sent')
            .sort((a, b) => (b.open_rate || 0) - (a.open_rate || 0))
            .slice(0, 3);
    } catch (e) {
        console.error('Failed to fetch analytics data', e);
    }

    return `
        <div class="main-content">
            <header class="flex justify-between items-center mb-8">
                <div>
                    <h1 style="font-size: 2rem;">Analytics</h1>
                    <p class="text-muted">Deep dive into your campaign performance.</p>
                </div>
                <div class="flex gap-2">
                    <button class="btn btn-outline" style="border-radius: var(--radius-sm);">Last 30 Days</button>
                    <button class="btn btn-outline" style="border-radius: var(--radius-sm);">📥 Download Report</button>
                </div>
            </header>

            <div class="grid-cols-4 mb-8">
                <div class="card stat-card">
                    <div class="stat-info">
                        <span class="stat-label">Avg. Open Rate</span>
                        <span class="stat-value">${(stats.open_rate || 0).toFixed(1)}%</span>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-info">
                        <span class="stat-label">Avg. CTR</span>
                        <span class="stat-value">${(stats.ctr || 0).toFixed(1)}%</span>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-info">
                        <span class="stat-label">Unsubscribe Rate</span>
                        <span class="stat-value">0.4%</span>
                        <p style="font-size: 0.75rem; color: var(--text-muted);">Aggregated</p>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-info">
                        <span class="stat-label">Bounce Rate</span>
                        <span class="stat-value">1.2%</span>
                        <p style="font-size: 0.75rem; color: var(--text-muted);">Aggregated</p>
                    </div>
                </div>
            </div>

            <div class="card mb-8">
                <h3 class="mb-6">Engagement Overview</h3>
                <div style="height: 300px; width: 100%; background: #fafafa; border: 1px dashed var(--border); border-radius: var(--radius); display: flex; align-items: center; justify-content: center; position: relative;">
                    <div style="width: 100%; height: 100%; padding: 2rem; display: flex; align-items: flex-end; gap: 1rem;">
                        ${[60, 45, 80, 55, 90, 70, 85, 40, 65, 95].map(h => `
                            <div style="flex: 1; background: var(--primary); height: ${h}%; border-radius: 4px 4px 0 0; opacity: 0.8;"></div>
                        `).join('')}
                    </div>
                    <p style="position: absolute; color: var(--text-muted); font-size: 0.875rem; background: rgba(255,255,255,0.8); padding: 0.5rem 1rem; border-radius: 20px;">Live Engagement Index</p>
                </div>
            </div>

            <div class="grid-2">
                <div class="card">
                    <h3 class="mb-6">Top Performing Campaigns</h3>
                    <div class="flex flex-col gap-4">
                        ${topCampaigns.length > 0 ? topCampaigns.map(c => `
                            <div class="flex justify-between items-center py-3 border-bottom" style="border-bottom: 1px solid var(--border);">
                                <span style="font-weight: 600;">${c.name}</span>
                                <span style="color: var(--success); font-weight: 700;">${c.open_rate}% Open</span>
                            </div>
                        `).join('') : '<p class="text-muted">No sent campaigns yet.</p>'}
                    </div>
                </div>
                <div class="card">
                    <h3 class="mb-6">Audience Metrics</h3>
                    <div class="flex flex-col gap-4">
                        <div class="insight-row">
                            <div class="insight-label"><span>Total Contacts</span><span>${stats.total_contacts || 0}</span></div>
                            <div class="progress-container"><div class="progress-bar" style="width: 100%;"></div></div>
                        </div>
                        <div class="insight-row">
                            <div class="insight-label"><span>Active Growth</span><span>100%</span></div>
                            <div class="progress-container"><div class="progress-bar" style="width: 100%; background: #c2c9af;"></div></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
