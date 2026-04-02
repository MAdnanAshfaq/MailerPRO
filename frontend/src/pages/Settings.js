import { accountApi } from '../api';
import { showToast } from '../utils/toast';

export async function Settings() {
    const user = JSON.parse(localStorage.getItem('camp_user') || '{}');
    let settings = {};
    
    try {
        if (user.id) {
            settings = await accountApi.getSMTP(user.id);
        }
    } catch (e) {
        console.error('Failed to fetch SMTP settings', e);
    }

    return `
        <div class="main-content">
            <header class="mb-8">
                <h1 style="font-size: 2.25rem; font-weight: 800; letter-spacing: -0.025em; margin-bottom: 0.5rem;">Settings</h1>
                <p class="text-muted">Configure your sender identity and delivery engine.</p>
            </header>

            <div class="grid-2" style="grid-template-columns: 1fr 1.5fr; gap: 2rem; align-items: start;">
                <!-- Profile Section -->
                <div class="card" style="padding: 2rem;">
                    <h3 class="mb-6" style="font-weight: 700;">Profile Info</h3>
                    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                        <div>
                            <label style="display: block; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 0.5rem; font-weight: 700;">Account Name</label>
                            <p style="font-weight: 600; font-size: 1.1rem;">${user.name || 'Not set'}</p>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 0.5rem; font-weight: 700;">Email Address</label>
                            <p style="color: var(--text-muted);">${user.email || 'Not set'}</p>
                        </div>
                        <div>
                            <label style="display: block; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 0.5rem; font-weight: 700;">Company</label>
                            <p style="font-weight: 600;">${user.company_name || 'Individual'}</p>
                        </div>
                    </div>
                </div>

                <!-- SMTP Section -->
                <div class="card" style="padding: 2rem;">
                    <div class="flex justify-between items-center mb-6">
                        <h3 style="font-weight: 700;">Delivery Engine (SMTP)</h3>
                        <div class="flex gap-2">
                             <button class="btn btn-outline preset-btn" data-preset="hostinger" style="padding: 4px 10px; font-size: 0.75rem;">Hostinger</button>
                             <button class="btn btn-outline preset-btn" data-preset="gmail" style="padding: 4px 10px; font-size: 0.75rem;">Gmail</button>
                        </div>
                    </div>
                    
                    <form id="smtp-form">
                        <div class="grid-2 mb-4" style="gap: 1.5rem; grid-template-columns: 2fr 1fr;">
                            <div>
                                <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">SMTP Host</label>
                                <input type="text" name="host" class="input" style="width: 100%; padding: 0.75rem;" placeholder="smtp.hostinger.com" value="${settings.host || ''}" required>
                            </div>
                            <div>
                                <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">Port</label>
                                <input type="number" name="port" class="input" style="width: 100%; padding: 0.75rem;" placeholder="465" value="${settings.port || 465}" required>
                            </div>
                        </div>
                        
                        <div class="mb-4">
                            <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">Username / Email</label>
                            <input type="email" name="username" class="input" style="width: 100%; padding: 0.75rem;" placeholder="sender@yourdomain.com" value="${settings.username || ''}" required>
                        </div>
                        
                        <div class="mb-4">
                            <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">Password</label>
                            <input type="password" name="password" class="input" style="width: 100%; padding: 0.75rem;" placeholder="••••••••" value="${settings.password || ''}" required>
                        </div>

                        <div class="mb-8">
                            <label style="display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">Security Type</label>
                            <select name="security_type" class="input" style="width: 100%; padding: 0.75rem;">
                                <option value="SSL" ${settings.security_type === 'SSL' ? 'selected' : ''}>SSL (Port 465)</option>
                                <option value="TLS" ${settings.security_type === 'TLS' ? 'selected' : ''}>TLS (Port 587)</option>
                                <option value="None" ${settings.security_type === 'None' ? 'selected' : ''}>None (Port 25)</option>
                            </select>
                        </div>

                        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 1rem; font-weight: 700; border-radius: var(--radius);">Save Settings</button>
                    </form>
                </div>
            </div>
        </div>
    `;
}

export function initSettings() {
    const form = document.getElementById('smtp-form');
    const presets = document.querySelectorAll('.preset-btn');
    const user = JSON.parse(localStorage.getItem('camp_user') || '{}');

    presets.forEach(btn => {
        btn.onclick = () => {
            const type = btn.dataset.preset;
            if (type === 'hostinger') {
                form.host.value = 'smtp.hostinger.com';
                form.port.value = '465';
                form.security_type.value = 'SSL';
            } else if (type === 'gmail') {
                form.host.value = 'smtp.gmail.com';
                form.port.value = '587';
                form.security_type.value = 'TLS';
            }
            showToast(`Applied ${type} presets`, 'info');
        };
    });

    if (form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            data.port = parseInt(data.port);
            data.account_id = user.id;

            try {
                await accountApi.saveSMTP(data);
                showToast('SMTP settings updated successfully!', 'success');
            } catch (err) {
                showToast('Failed to save settings: ' + err.message, 'error');
            }
        };
    }
}
