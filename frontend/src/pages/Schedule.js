import { campaignsApi } from '../api';

export async function Schedule() {
    let upcoming = [];
    try {
        const campaigns = await campaignsApi.list();
        upcoming = (campaigns || [])
            .filter(c => c.status === 'scheduled')
            .sort((a, b) => new Date(a.scheduled_at || a.created_at) - new Date(b.scheduled_at || b.created_at))
            .slice(0, 10);
    } catch (e) {
        console.error('Failed to fetch schedule', e);
    }
    
    // Generate simple calendar days for current month
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
    
    let calendarDaysHtml = '';
    // Empty slots for start of month
    for (let i = 0; i < firstDay; i++) {
        calendarDaysHtml += `<div style="padding: 1rem; border: 1px solid var(--border); background: var(--bg-main); opacity: 0.5;"></div>`;
    }
    // Days
    for (let i = 1; i <= daysInMonth; i++) {
        const hasCampaign = upcoming.some(c => {
            const date = new Date(c.scheduled_at || c.created_at);
            return date.getDate() === i && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        });
        calendarDaysHtml += `
            <div style="padding: 1rem; border: 1px solid var(--border); min-height: 80px; position: relative; background: var(--bg-card);">
                <span style="font-weight: ${i === now.getDate() ? '800' : '500'}; color: ${i === now.getDate() ? 'var(--primary)' : 'inherit'};">${i}</span>
                ${hasCampaign ? `<div style="position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); width: 6px; height: 6px; border-radius: 50%; background: var(--primary);"></div>` : ''}
            </div>
        `;
    }

    return `
        <div class="main-content">
            <header class="flex justify-between items-center mb-8">
                <div>
                    <h1 style="font-size: 2rem;">Schedule</h1>
                    <p class="text-muted">Plan and manage your upcoming email sends.</p>
                </div>
                <button class="btn btn-primary" id="schedule-create-btn">
                    <span>+</span> Schedule Campaign
                </button>
            </header>

            <div class="card mb-8">
                <div class="flex justify-between items-center mb-6">
                    <div class="flex gap-4">
                        <button class="btn btn-primary" id="view-list-btn" style="padding: 0.5rem 1rem; border-radius: var(--radius-sm);">List View</button>
                        <button class="btn btn-outline" id="view-calendar-btn" style="padding: 0.5rem 1rem; border-radius: var(--radius-sm);">Calendar View</button>
                    </div>
                </div>

                <!-- List View -->
                <div id="schedule-list-view" class="flex flex-col gap-2">
                    ${upcoming.map(item => `
                        <div class="flex items-center gap-6 p-4 border-bottom" style="border-bottom: 1px solid var(--border);">
                            <div style="text-align: center; min-width: 100px;">
                                <p style="font-weight: 800; color: var(--primary);">${new Date(item.scheduled_at || item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                <p style="font-size: 0.75rem; color: var(--text-muted);">${new Date(item.scheduled_at || item.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                            <div style="flex: 1;">
                                <h4 style="font-size: 1rem; font-weight: 700;">${item.name}</h4>
                                <span class="status-badge status-${item.status}" style="font-size: 0.65rem; margin-top: 0.25rem;">${item.status}</span>
                            </div>
                            <button class="btn btn-outline edit-schedule-btn" data-id="${item.id}" style="padding: 0.4rem 0.8rem; font-size: 0.8125rem;">Edit</button>
                        </div>
                    `).join('')}
                    ${upcoming.length === 0 ? '<div class="text-muted" style="text-align: center; padding: 3rem;">No upcoming campaigns found.</div>' : ''}
                </div>

                <!-- Calendar View -->
                <div id="schedule-calendar-view" style="display: none;">
                    <h3 style="text-align: center; margin-bottom: 1rem;">${now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                    <div style="display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-weight: bold; margin-bottom: 0.5rem;">
                        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; background: var(--border);">
                        ${calendarDaysHtml}
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function initSchedule() {
    const createBtn = document.getElementById('schedule-create-btn');
    if (createBtn) {
        createBtn.onclick = () => window.location.hash = '#campaign';
    }

    const listViewBtn = document.getElementById('view-list-btn');
    const calendarViewBtn = document.getElementById('view-calendar-btn');
    const listView = document.getElementById('schedule-list-view');
    const calendarView = document.getElementById('schedule-calendar-view');

    if (listViewBtn && calendarViewBtn) {
        listViewBtn.onclick = () => {
            listView.style.display = 'flex';
            calendarView.style.display = 'none';
            listViewBtn.className = 'btn btn-primary';
            calendarViewBtn.className = 'btn btn-outline';
            listViewBtn.style.padding = '0.5rem 1rem';
            listViewBtn.style.borderRadius = 'var(--radius-sm)';
            calendarViewBtn.style.padding = '0.5rem 1rem';
            calendarViewBtn.style.borderRadius = 'var(--radius-sm)';
        };

        calendarViewBtn.onclick = () => {
            listView.style.display = 'none';
            calendarView.style.display = 'block';
            calendarViewBtn.className = 'btn btn-primary';
            listViewBtn.className = 'btn btn-outline';
            listViewBtn.style.padding = '0.5rem 1rem';
            listViewBtn.style.borderRadius = 'var(--radius-sm)';
            calendarViewBtn.style.padding = '0.5rem 1rem';
            calendarViewBtn.style.borderRadius = 'var(--radius-sm)';
        };
    }
}
