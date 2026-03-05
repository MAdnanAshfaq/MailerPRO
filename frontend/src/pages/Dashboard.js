import { contactsApi, campaignsApi, statsApi, accountApi, domainApi } from '../api';

export async function Dashboard() {
    let stats = {
        total_contacts: 0,
        total_sent: 0,
        open_rate: 0,
        ctr: 0,
        revenue: 0,
        audience_growth: []
    };
    let recentCampaigns = [];
    let warmingStatus = null;
    let domainHealth = null;

    try {
        const user = JSON.parse(localStorage.getItem('camp_user') || '{}');
        const promises = [
            statsApi.getOverview(),
            campaignsApi.list()
        ];
        
        if (user.id) {
            promises.push(accountApi.getWarming(user.id));
        }
        if (user.domain) {
            promises.push(domainApi.getHealth(user.domain));
        }

        const res = await Promise.all(promises);
        stats = res[0];
        recentCampaigns = res[1];
        if (user.id) warmingStatus = res[2];
        if (user.domain) domainHealth = res[3];

        // Limit to top 4 for the table
        recentCampaigns = (recentCampaigns || []).slice(0, 4);
    } catch (e) {
        console.error('Failed to fetch dashboard data', e);
    }

    const user = JSON.parse(localStorage.getItem('camp_user') || '{ "name": "Test User" }');
    const userName = user.name;

    return `
        <div class="main-content">
            <!-- Header -->
            <header class="flex justify-between items-center mb-8">
                <h1 style="font-size: 2rem;">Overview</h1>
                <div class="flex items-center gap-4">
                    <button class="btn btn-outline" style="padding: 0.5rem; width: 40px; border-radius: 50%;">🔍</button>
                    <button class="btn btn-outline" style="padding: 0.5rem; width: 40px; border-radius: 50%; position: relative;">
                        🔔
                        <span style="position: absolute; top: 0; right: 0; width: 8px; height: 8px; background: var(--danger); border-radius: 50%; border: 2px solid white;"></span>
                    </button>
                    <div class="flex items-center gap-2 ml-4">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=8a9a5b&color=fff" style="width: 40px; height: 40px; border-radius: 50%;" />
                        <div style="line-height: 1.2;">
                            <p style="font-size: 0.75rem; color: var(--text-muted); font-weight: 500;">Welcome,</p>
                            <p style="font-size: 0.875rem; font-weight: 800;">${userName}</p>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Filters & Actions -->
            <div class="flex justify-between items-center mb-8">
                <div class="flex items-center gap-4">
                    <div class="flex items-center gap-2 card" style="padding: 0.5rem 1rem; cursor: pointer; border-radius: var(--radius-sm);">
                        <span style="font-size: 0.875rem; font-weight: 600;">Last 7 Days</span>
                        <span style="font-size: 0.75rem;">⌵</span>
                    </div>
                    <div class="flex items-center gap-2 card" style="padding: 0.5rem 1rem; border-radius: var(--radius-sm);">
                        <span>📅</span>
                        <span style="font-size: 0.875rem; font-weight: 600;">${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}-Today</span>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <button class="btn btn-outline" style="font-weight: 700;">
                        <span>📥</span> Export
                    </button>
                    <button class="btn btn-primary" id="dash-create-camp" style="font-weight: 700; border-radius: var(--radius);">
                        <span>+</span> Create campaign
                    </button>
                </div>
            </div>

            <!-- Stats Bar -->
            <div class="grid-cols-4 mb-8">
                <div class="card stat-card">
                    <div class="stat-icon" style="background: rgba(138, 154, 91, 0.1); color: var(--primary);">🗂</div>
                    <div class="stat-info">
                        <span class="stat-label">Total Sent</span>
                        <span class="stat-value">${stats.total_sent.toLocaleString()}</span>
                        <div class="stat-trend trend-up"><span>↑</span> Live</div>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-icon" style="background: rgba(16, 185, 129, 0.1); color: #059669;">✉</div>
                    <div class="stat-info">
                        <span class="stat-label">Open Rate</span>
                        <span class="stat-value">${stats.open_rate.toFixed(1)}%</span>
                        <div class="stat-trend trend-up"><span>↑</span> Average</div>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-icon" style="background: rgba(239, 68, 68, 0.1); color: var(--danger);">📈</div>
                    <div class="stat-info">
                        <span class="stat-label">CTR</span>
                        <span class="stat-value">${stats.ctr.toFixed(1)}%</span>
                        <div class="stat-trend trend-up"><span>↑</span> Average</div>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-icon" style="background: rgba(138, 154, 91, 0.1); color: var(--primary);">💰</div>
                    <div class="stat-info">
                        <span class="stat-label">Revenue</span>
                        <span class="stat-value">$${stats.revenue.toLocaleString()}</span>
                        <div class="stat-trend trend-up"><span>↑</span> Est.</div>
                    </div>
                </div>
            </div>

            <!-- Main Grid -->
            <div class="grid-2">
                <!-- Left Column -->
                <div class="flex flex-col gap-4">
                    <div class="flex gap-4" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                        <!-- Audience Growth -->
                        <div class="card">
                            <h3 class="mb-6">Audience Growth</h3>
                            <div class="flex items-center">
                                <div class="donut-container">
                                    <svg viewBox="0 0 36 36" style="width: 100%; height: 100%; transform: rotate(-90deg);">
                                        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#e4e4e7" stroke-width="3"></circle>
                                        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="#8a9a5b" stroke-width="3" stroke-dasharray="100 0" stroke-dashoffset="0"></circle>
                                    </svg>
                                    <div class="donut-label">
                                        <span class="donut-value" style="font-size: 0.9rem;">${stats.total_contacts}</span>
                                    </div>
                                </div>
                                <div class="flex flex-col gap-2 ml-8" style="font-size: 0.75rem; font-weight: 600;">
                                    <div class="flex items-center gap-2">
                                        <div style="width: 12px; height: 12px; background: #8a9a5b; border-radius: 2px;"></div>
                                        <span>Total Contacts</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <div style="width: 12px; height: 12px; background: #d9e3c1; border-radius: 2px;"></div>
                                        <span>Active Growth</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Scheduled Campaigns -->
                        <div class="card">
                            <div class="flex justify-between items-center mb-6">
                                <h3>Upcoming Campaigns</h3>
                                <span style="cursor: pointer;">⚙</span>
                            </div>
                            <div class="flex flex-col gap-4">
                                ${recentCampaigns.filter(c => c.status === 'scheduled').length > 0 ? 
                                    recentCampaigns.filter(c => c.status === 'scheduled').map(c => `
                                        <div class="card" style="padding: 1rem; border: 1px solid var(--border); box-shadow: none;">
                                            <div class="flex justify-between items-center">
                                                <div class="flex items-center gap-3">
                                                    <div style="font-size: 1.25rem;">✉</div>
                                                    <div>
                                                        <p style="font-size: 0.875rem; font-weight: 700;">${c.name}</p>
                                                        <p style="font-size: 0.75rem; color: var(--text-muted);">Scheduled</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    `).join('') :
                                    `<div class="text-muted" style="font-size: 0.875rem; text-align: center; padding: 2rem;">No campaigns scheduled.</div>`
                                }
                            </div>
                        </div>
                    </div>

                    <!-- Recent Campaigns -->
                    <div class="card">
                        <div class="flex justify-between items-center mb-6">
                            <h3>Recent Campaigns</h3>
                            <div class="flex gap-2">
                                <button class="btn btn-outline" style="padding: 0.4rem; font-size: 0.75rem;">📥</button>
                            </div>
                        </div>
                        <table class="campaign-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Status</th>
                                    <th>Open Rate</th>
                                    <th>CTR</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${recentCampaigns.map(c => `
                                    <tr>
                                        <td style="font-weight: 700;">${c.name}</td>
                                        <td>
                                            <span class="status-badge status-${c.status}">${c.status}</span>
                                        </td>
                                        <td style="font-weight: 700;">${c.open_rate}%</td>
                                        <td style="font-weight: 700;">${c.ctr}%</td>
                                        <td><a href="/campaign" style="font-size: 0.75rem; font-weight: 700; color: var(--primary);">View</a></td>
                                    </tr>
                                `).join('')}
                                ${recentCampaigns.length === 0 ? '<tr><td colspan="5" style="text-align: center; padding: 2rem;" class="text-muted">No recent campaigns.</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Right Column -->
                <div class="flex flex-col gap-4">
                    <!-- Top Automations -->
                    <div class="card" style="flex: 1;">
                        <h3 class="mb-6">Performance Insights</h3>
                        <div class="flex flex-col gap-6">
                            <div class="insight-row">
                                <p style="font-weight: 700; font-size: 1rem; margin-bottom: 0.5rem;">Engagement Goal</p>
                                <div class="progress-container" style="height: 12px;">
                                    <div class="progress-bar" style="width: ${Math.min(100, stats.open_rate * 2)}%;"></div>
                                </div>
                                <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem;">Target: 50% Open Rate</p>
                            </div>
                            <div class="insight-row">
                                <p style="font-weight: 700; font-size: 1rem; margin-bottom: 0.5rem;">Conversion Score</p>
                                <div class="progress-container" style="height: 12px;">
                                    <div class="progress-bar" style="width: ${Math.min(100, stats.ctr * 5)}%; background: #c2c9af;"></div>
                                </div>
                                <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem;">Target: 20% CTR</p>
                            </div>
                        </div>
                    </div>

                    <!-- Deliverability Health -->
                    <div class="card" id="deliverability-card" style="border: 1px solid var(--border);">
                        <div class="flex justify-between items-center mb-4">
                            <h3 style="font-size: 1rem;">🛡 Deliverability Health</h3>
                            <span class="status-badge" id="health-badge" style="font-size: 0.65rem; ${domainHealth ? (domainHealth.spf && domainHealth.dkim && domainHealth.dmarc ? 'background:#ecfdf5;color:#059669;' : 'background:#fff7ed;color:#ea580c;') : 'background:#f4f4f5;color:#71717a;'}">${domainHealth ? (domainHealth.spf && domainHealth.dkim && domainHealth.dmarc ? 'Excellent' : 'Action Needed') : 'Not Checked'}</span>
                        </div>

                        <!-- Domain Input Row -->
                        <div class="flex gap-2 mb-4" style="align-items: stretch;">
                            <input type="text" id="domain-check-input" class="input" placeholder="yourdomain.com" value="${user.domain || ''}" style="flex: 1; padding: 0.6rem 0.875rem; font-size: 0.875rem;">
                            <button class="btn btn-primary" id="check-health-btn" style="padding: 0.6rem 1rem; font-size: 0.8125rem; white-space: nowrap;">
                                🔍 Check
                            </button>
                        </div>

                        <!-- Result Panel -->
                        <div id="health-result-panel">
                            ${domainHealth ? `
                            <div style="display: flex; flex-direction: column; gap: 0.625rem;">
                                ${renderHealthRow('SPF', domainHealth.spf, domainHealth.spf_record)}
                                ${renderHealthRow('DKIM', domainHealth.dkim, domainHealth.dkim_selector ? `Selector: ${domainHealth.dkim_selector}` : null)}
                                ${renderHealthRow('DMARC', domainHealth.dmarc, domainHealth.dmarc_record)}
                            </div>
                            <div style="font-size: 0.75rem; color: var(--text-muted); background: var(--bg-main); padding: 0.75rem; border-radius: 8px; margin-top: 0.875rem; line-height: 1.5;">
                                ${domainHealth.spf && domainHealth.dkim && domainHealth.dmarc
                                    ? '✅ All records verified. Your domain is properly authenticated for inbox delivery.'
                                    : '⚠️ Some records are missing or not yet propagated. DNS changes can take up to 24–48 hours to propagate globally.'}
                            </div>` : `
                            <div style="font-size: 0.8125rem; color: var(--text-muted); text-align: center; padding: 1rem 0;">
                                Enter your sending domain above and click Check to see your DNS health.
                            </div>`}
                        </div>
                    </div>

                    <!-- Email Warming Progress -->
                    <div class="card">
                        <div class="flex justify-between items-center mb-6">
                            <h3>Email Warming</h3>
                            <span style="font-size: 0.75rem; font-weight: 700; color: var(--primary);">${warmingStatus ? warmingStatus.status.toUpperCase() : 'PENDING'}</span>
                        </div>
                        <div class="insight-row">
                            <div class="insight-label">
                                <span>Daily Progress</span>
                                <span>${warmingStatus ? warmingStatus.current_count : 0} / ${warmingStatus ? warmingStatus.daily_limit : 10}</span>
                            </div>
                            <div class="progress-container">
                                <div class="progress-bar" style="width: ${warmingStatus ? (warmingStatus.current_count / warmingStatus.daily_limit) * 100 : 0}%;"></div>
                            </div>
                        </div>
                        <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 1rem;">
                            Gradually increasing volume to build trust with Gmail and Outlook.
                        </p>
                    </div>

                    <!-- Audience Metrics -->
                    <div class="card">
                </div>
            </div>
        </div>
    `;
}

// Helper to render a single DNS check row
function renderHealthRow(label, passed, detail) {
    const color    = passed ? '#059669' : '#ea580c';
    const bg       = passed ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.06)';
    const icon     = passed ? '✅' : '❌';
    const detailEl = detail
        ? `<span style="font-size:0.7rem;color:var(--text-muted);margin-top:2px;font-family:monospace;word-break:break-all;">${detail}</span>`
        : '';
    return `
        <div style="display:flex;align-items:flex-start;gap:0.6rem;padding:0.6rem 0.75rem;background:${bg};border-radius:8px;">
            <span style="font-size:0.9rem;flex-shrink:0;margin-top:1px;">${icon}</span>
            <div style="display:flex;flex-direction:column;">
                <span style="font-size:0.8125rem;font-weight:700;color:${color};">${label}</span>
                ${detailEl}
            </div>
        </div>`;
}

export function initDashboard() {
    const createBtn = document.getElementById('dash-create-camp');
    if (createBtn) {
        createBtn.onclick = () => { window.history.pushState({}, '', '/campaigns'); window.dispatchEvent(new PopStateEvent('popstate')); };
    }

    const checkBtn   = document.getElementById('check-health-btn');
    const domainInput = document.getElementById('domain-check-input');
    const badge      = document.getElementById('health-badge');
    const resultPanel = document.getElementById('health-result-panel');

    if (!checkBtn || !domainInput) return;

    checkBtn.onclick = async () => {
        const domain = domainInput.value.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
        if (!domain) {
            domainInput.focus();
            return;
        }

        // Loading state
        checkBtn.disabled = true;
        checkBtn.innerHTML = '<span style="display:inline-block;animation:spin 0.8s linear infinite;">⟳</span> Checking…';
        resultPanel.innerHTML = `<div style="font-size:0.8125rem;color:var(--text-muted);text-align:center;padding:1rem 0;">Looking up DNS records for <strong>${domain}</strong>…</div>`;

        try {
            const res = await fetch(`/api/domain/health?domain=${encodeURIComponent(domain)}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const h = await res.json();

            // Update badge
            const allPassed = h.spf && h.dkim && h.dmarc;
            badge.textContent = allPassed ? 'Excellent' : 'Action Needed';
            badge.style.cssText = allPassed
                ? 'font-size:0.65rem;background:#ecfdf5;color:#059669;'
                : 'font-size:0.65rem;background:#fff7ed;color:#ea580c;';

            // Update result panel
            const dkimDetail = h.dkim_selector ? `Selector found: ${h.dkim_selector}` : null;
            resultPanel.innerHTML = `
                <div style="display:flex;flex-direction:column;gap:0.625rem;">
                    ${renderHealthRow('SPF',   h.spf,   h.spf_record   || null)}
                    ${renderHealthRow('DKIM',  h.dkim,  dkimDetail)}
                    ${renderHealthRow('DMARC', h.dmarc, h.dmarc_record || null)}
                </div>
                <div style="font-size:0.75rem;color:var(--text-muted);background:var(--bg-main);padding:0.75rem;border-radius:8px;margin-top:0.875rem;line-height:1.5;">
                    ${allPassed
                        ? '✅ All records verified. Your domain is properly authenticated for inbox delivery.'
                        : '⚠️ Some records are missing or not yet propagated. DNS changes can take 24–48 hours to be visible globally. If you just added a record, wait and try again.'}
                </div>`;

            // Save the checked domain for next load
            const user = JSON.parse(localStorage.getItem('camp_user') || '{}');
            localStorage.setItem('camp_user', JSON.stringify({ ...user, domain }));

        } catch (err) {
            resultPanel.innerHTML = `<div style="font-size:0.8125rem;color:var(--danger);padding:0.75rem;background:rgba(239,68,68,0.06);border-radius:8px;">⚠️ Error: ${err.message}. Make sure the backend is running and the domain is valid.</div>`;
        } finally {
            checkBtn.disabled = false;
            checkBtn.innerHTML = '🔍 Check';
        }
    };
}

