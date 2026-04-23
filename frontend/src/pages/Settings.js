import { accountApi } from '../api';
import { showToast } from '../utils/toast';

export async function Settings() {
    const user = JSON.parse(localStorage.getItem('camp_user') || '{}');
    let settings = {};
    
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');

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
                ${success === 'google_connected' ? '<div style="margin-top: 1rem; padding: 1rem; background: rgba(0,255,136,0.1); border: 1px solid var(--emerald); border-radius: 8px; color: var(--emerald); font-weight: 600;">✅ Google Account connected successfully! Your emails will now be sent via Gmail API.</div>' : ''}
                ${error ? `<div style="margin-top: 1rem; padding: 1rem; background: rgba(255,50,50,0.1); border: 1px solid #ff3232; border-radius: 8px; color: #ff3232; font-weight: 600;">❌ Connection failed: ${error.replace(/_/g, ' ')}</div>` : ''}
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

                <!-- Google OAuth Section -->
                <div class="card" style="padding: 2rem; border: 1px solid var(--emerald); background: rgba(0,255,136,0.02);">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                        <div style="width: 48px; height: 48px; background: #fff; border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Logo.svg" style="width: 24px;" alt="Google">
                        </div>
                        <div>
                            <h3 style="font-weight: 700; margin-bottom: 2px;">Google Connection</h3>
                            <p style="font-size: 0.8rem; color: var(--text-muted);">Faster, safer, no passwords.</p>
                        </div>
                    </div>
                    <p style="font-size: 0.9rem; line-height: 1.6; margin-bottom: 1.5rem; color: rgba(255,255,255,0.7);">
                        Connect your Gmail account directly via Google OAuth. This is the **recommended** way to send emails with 100% deliverability.
                    </p>
                    <button id="google-connect-btn" class="btn btn-primary" style="width: 100%; padding: 0.85rem; background: #fff; color: #000; border: none; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 10px;">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Logo.svg" style="width: 18px;">
                        Connect with Google
                    </button>
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
                                <option value="ssl" ${settings.security_type?.toLowerCase() === 'ssl' ? 'selected' : ''}>SSL (Port 465)</option>
                                <option value="tls" ${settings.security_type?.toLowerCase() === 'tls' || !settings.security_type ? 'selected' : ''}>TLS (Port 587)</option>
                                <option value="none" ${settings.security_type?.toLowerCase() === 'none' ? 'selected' : ''}>None (Port 25)</option>
                            </select>
                        </div>

                        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 1rem; font-weight: 700; border-radius: var(--radius);">Save Settings</button>
                    </form>
                </div>

                <!-- Test Section -->
                <div class="card" style="padding: 2rem;">
                    <h3 class="mb-4" style="font-weight: 700;">Deliverability Test</h3>
                    <p class="text-muted mb-6" style="font-size: 0.9rem;">Send a single email to any address to verify your inbox deliverability and SMTP health.</p>
                    
                    <div style="display: flex; gap: 0.75rem;">
                        <input type="email" id="test-email-target" class="input" placeholder="inbox@example.com" style="flex: 1; padding: 0.75rem;">
                        <button id="send-test-btn" class="btn btn-outline" style="white-space: nowrap;">Send Test</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function initSettings() {
    const form = document.getElementById('smtp-form');
    const presets = document.querySelectorAll('.preset-btn');
    const testBtn = document.getElementById('send-test-btn');
    const testInput = document.getElementById('test-email-target');
    const user = JSON.parse(localStorage.getItem('camp_user') || '{}');

    if (testBtn && testInput) {
        testBtn.onclick = async () => {
            const target = testInput.value.trim();
            if (!target) {
                showToast('Please enter a target email address.', 'error');
                return;
            }

            testBtn.disabled = true;
            testBtn.textContent = 'Sending...';

            try {
                await accountApi.testSend({
                    account_id: user.id,
                    to_email: target
                });
                showToast(`Test email sent to ${target}! Check your inbox.`, 'success');
            } catch (err) {
                showToast('Test failed: ' + err.message, 'error');
            } finally {
                testBtn.disabled = false;
                testBtn.textContent = 'Send Test';
            }
        };
    }

    presets.forEach(btn => {
        btn.onclick = () => {
            const type = btn.dataset.preset;
            if (type === 'hostinger') {
                form.host.value = 'smtp.hostinger.com';
                form.port.value = '465';
                form.security_type.value = 'ssl';
            } else if (type === 'gmail') {
                form.host.value = 'smtp.gmail.com';
                form.port.value = '587';
                form.security_type.value = 'tls';
            }
            showToast(`Applied ${type} presets`, 'info');
        };
    });

    if (form) {
        const usernameInput = form.querySelector('[name="username"]');
        if (usernameInput) {
            usernameInput.onblur = async () => {
                if (usernameInput.value.toLowerCase().endsWith('@gmail.com')) {
                    const confirmOAuth = confirm("We identified you want to use a Gmail account. For better security and deliverability, we recommend using Google OAuth instead of manual SMTP. \n\nContinue with the automatic Google connection process?");
                    if (confirmOAuth) {
                        const googleBtn = document.getElementById('google-connect-btn');
                        if (googleBtn) googleBtn.click();
                    }
                }
            };
        }

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

    const googleBtn = document.getElementById('google-connect-btn');
    if (googleBtn) {
        googleBtn.onclick = async () => {
            try {
                const { url } = await accountApi.getGoogleAuthUrl(user.id);
                window.location.href = url;
            } catch (err) {
                showToast('Failed to start Google connection: ' + err.message, 'error');
            }
        };
    }
}
