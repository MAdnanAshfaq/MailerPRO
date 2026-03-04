export async function Integration() {
    const isSheetsConnected = localStorage.getItem('camp_sheets_connected') === 'true';

    setTimeout(() => {
        const connectBtn = document.getElementById('connect-sheets-btn');
        if (connectBtn) {
            connectBtn.onclick = () => {
                if (isSheetsConnected) {
                    // Disconnect logic
                    localStorage.setItem('camp_sheets_connected', 'false');
                    window.location.reload();
                } else {
                    // Connect logic (simulate OAuth delay)
                    connectBtn.innerHTML = '<span style="display:inline-block; animation: spin 1s linear infinite;">⏳</span> Connecting...';
                    connectBtn.style.opacity = '0.7';
                    setTimeout(() => {
                        localStorage.setItem('camp_sheets_connected', 'true');
                        window.location.reload();
                    }, 1500);
                }
            };
        }
    }, 100);

    return `
        <div class="main-content">
            <header class="flex justify-between items-center mb-8">
                <div>
                    <h1 style="font-size: 2rem;">Integrations</h1>
                    <p class="text-muted">Connect Sendable with your favorite tools to automate your workflow.</p>
                </div>
                <div style="position: relative;">
                    <input type="text" placeholder="Search integrations..." class="input" style="padding-left: 2.5rem; width: 320px; border-radius: 20px;">
                    <span style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);">🔍</span>
                </div>
            </header>

            <div class="flex gap-4 mb-8 overflow-x-auto pb-2">
                <button class="btn btn-primary" style="padding: 0.5rem 1.25rem;">Featured</button>
                <button class="btn btn-outline" style="padding: 0.5rem 1.25rem;">E-commerce</button>
                <button class="btn btn-outline" style="padding: 0.5rem 1.25rem;">CRM & Sales</button>
                <button class="btn btn-outline" style="padding: 0.5rem 1.25rem;">Analytics</button>
                <button class="btn btn-outline" style="padding: 0.5rem 1.25rem;">Developer Tools</button>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem;">
                ${[
                    { name: 'Shopify', desc: 'Import products and sync customer purchase history automatically.', icon: '🛍️', status: 'Connected' },
                    { name: 'WordPress', desc: 'Integrate signup forms and publish newsletters as blog posts.', icon: '📝', status: 'Available' },
                    { name: 'Zapier', desc: 'Connect with 5000+ apps to trigger emails from any event.', icon: '⚡', status: 'Available' },
                    { name: 'Stripe', desc: 'Track customer lifetime value and payment-triggered automations.', icon: '💳', status: 'Available' },
                    { name: 'Salesforce', desc: 'Sync leads and contacts directly with your Salesforce CRM.', icon: '☁️', status: 'Available' },
                    { name: 'Google Sheets', desc: 'Live sync your audience segments with shared spreadsheets.', icon: '📄', status: isSheetsConnected ? 'Connected' : 'Available', id: 'connect-sheets-btn' }
                ].map(item => `
                    <div class="card" style="display: flex; flex-direction: column; align-items: flex-start; padding: 2rem; position: relative;">
                        ${item.status === 'Connected' ? '<span class="status-badge status-sent" style="position: absolute; top: 1.5rem; right: 1.5rem;">Connected</span>' : ''}
                        <div style="width: 56px; height: 56px; background: #f8fafc; border: 1px solid var(--border); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin-bottom: 1.5rem;">
                            ${item.icon}
                        </div>
                        <h4 style="margin-bottom: 0.75rem; font-weight: 700;">${item.name}</h4>
                        <p style="font-size: 0.8125rem; color: var(--text-muted); margin-bottom: 2rem; flex-grow: 1; line-height: 1.5;">${item.desc}</p>
                        <button ${item.id ? `id="${item.id}"` : ''} class="btn ${item.status === 'Connected' ? 'btn-outline' : 'btn-primary'}" style="width: 100%; border-radius: var(--radius-sm);">${item.status === 'Connected' ? 'Disconnect' : 'Connect'}</button>
                    </div>
                `).join('')}
            </div>
            
            <style>
                @keyframes spin { 100% { transform: rotate(360deg); } }
            </style>
        </div>
    `;
}
