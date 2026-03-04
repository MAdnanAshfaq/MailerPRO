import { statsApi, campaignsApi } from '../api';

export async function Automation() {
    let stats = { total_contacts: 0 };
    let campaigns = [];
    try {
        [stats, campaigns] = await Promise.all([
            statsApi.getOverview(),
            campaignsApi.list()
        ]);
    } catch (e) {
        console.error(e);
    }

    const activeCount = campaigns.filter(c => c.status === 'sent').length;

    return `
        <div class="main-content">
            <header class="flex justify-between items-center mb-8">
                <div>
                    <h1 style="font-size: 2rem;">Automations</h1>
                    <p class="text-muted">Streamline your marketing with automated workflows.</p>
                </div>
                <button class="btn btn-primary">
                    <span>+</span> Create Automation
                </button>
            </header>

            <div class="grid-cols-4 mb-8">
                <div class="card stat-card">
                    <div class="stat-icon">🔄</div>
                    <div class="stat-info">
                        <span class="stat-label">Active Automations</span>
                        <span class="stat-value">${activeCount}</span>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-icon">👥</div>
                    <div class="stat-info">
                        <span class="stat-label">Total Contacts</span>
                        <span class="stat-value">${stats.total_contacts}</span>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-icon">✉️</div>
                    <div class="stat-info">
                        <span class="stat-label">Total Sent</span>
                        <span class="stat-value">${stats.total_sent || 0}</span>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-icon">💰</div>
                    <div class="stat-info">
                        <span class="stat-label">Est. Revenue</span>
                        <span class="stat-value">$${(stats.revenue || 0).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <h3 class="mb-4">Live Workflows</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
                ${campaigns.slice(0, 4).map(c => `
                    <div class="card">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <h4 style="font-size: 1.1rem; margin-bottom: 0.25rem;">${c.name}</h4>
                                <span class="status-badge status-${c.status}" style="font-size: 0.65rem;">${c.status}</span>
                            </div>
                            <span style="font-size: 1.25rem;">⚙️</span>
                        </div>
                        <div class="flex gap-4 mb-6">
                            <div style="flex: 1;">
                                <p style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">Open Rate</p>
                                <p style="font-size: 1rem; font-weight: 700;">${c.open_rate}%</p>
                            </div>
                            <div style="flex: 1;">
                                <p style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">CTR</p>
                                <p style="font-size: 1rem; font-weight: 700;">${c.ctr}%</p>
                            </div>
                        </div>
                        <button class="btn btn-outline" style="width: 100%; font-size: 0.8125rem;">Manage Workflow</button>
                    </div>
                `).join('')}
                ${campaigns.length === 0 ? '<div class="text-muted">No workflows found.</div>' : ''}
            </div>
        </div>
    `;
}
