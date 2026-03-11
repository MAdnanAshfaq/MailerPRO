import { accountApi } from '../api';

export function Auth(type = 'signup') {
    const isSignup = type === 'signup';
    
    if (!isSignup) {
        return renderLogin();
    }

    return renderSignupWizard();
}

function renderLogin() {
    return `
        <div style="width: 100%; min-height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--bg-main); padding: 2rem;">
            <div class="card" style="width: 100%; max-width: 400px; padding: 2.5rem;">
                <div style="text-align: center; margin-bottom: 2rem;">
                    <span style="font-size: 3rem;">🏕️</span>
                    <h1 style="margin-top: 1rem;">Log in</h1>
                    <p class="text-muted" style="font-size: 0.875rem; margin-top: 0.5rem;">
                        Don't have an account? 
                        <a href="/signup" style="color: var(--primary); font-weight: 600; text-decoration: none;" data-link>Sign up</a>
                    </p>
                </div>
                <form id="auth-form">
                    <div class="mb-4">
                        <label class="label">Email address</label>
                        <input type="email" name="email" class="input" required placeholder="name@company.com">
                    </div>
                    <div class="mb-8">
                        <label class="label">Password</label>
                        <input type="password" name="password" class="input" required placeholder="••••••••">
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.75rem;">Log In</button>
                </form>
            </div>
        </div>
    `;
}

function renderSignupWizard() {
    return `
        <div style="width: 100%; min-height: 100vh; background: var(--bg-main); display: flex; align-items: center; justify-content: center; padding: 2rem;">
            <div class="card" style="width: 100%; max-width: 550px; padding: 3rem;">
                <!-- Wizard Header -->
                <div style="margin-bottom: 3rem; text-align: center;">
                    <span style="font-size: 2.5rem;">🚀</span>
                    <h1 id="wizard-title" style="margin-top: 1rem; font-size: 1.75rem;">Create your account</h1>
                    <div class="flex justify-center mt-6" style="gap: 0.5rem;" id="wizard-steps-indicator">
                        <div class="step-dot active" data-step="1"></div>
                        <div class="step-dot" data-step="2"></div>
                        <div class="step-dot" data-step="3"></div>
                    </div>
                </div>

                <form id="auth-form">
                    <!-- Step 1: Personal Info -->
                    <div id="step-1" class="wizard-step">
                        <div class="mb-4">
                            <label class="label">Full Name</label>
                            <input type="text" name="name" class="input" required placeholder="John Doe">
                        </div>
                        <div class="mb-4">
                            <label class="label">Work Email</label>
                            <input type="email" name="email" class="input" required placeholder="john@company.com">
                        </div>
                        <div class="mb-8">
                            <label class="label">Secure Password</label>
                            <input type="password" name="password" class="input" required placeholder="••••••••">
                        </div>
                        <button type="button" class="btn btn-primary next-btn" style="width: 100%;">Next: Business Details</button>
                    </div>

                    <!-- Step 2: Business Info -->
                    <div id="step-2" class="wizard-step" style="display: none;">
                        <div class="mb-4">
                            <label class="label">Company Name</label>
                            <input type="text" name="company_name" class="input" placeholder="Acme Corp">
                        </div>
                        <div class="mb-8">
                            <label class="label">Sending Domain</label>
                            <input type="text" name="domain" class="input" placeholder="acme.com">
                        </div>
                        <div class="flex gap-4">
                            <button type="button" class="btn btn-outline prev-btn" style="flex: 1;">Back</button>
                            <button type="button" class="btn btn-primary next-btn" style="flex: 2;">Next: SMTP Config</button>
                        </div>
                    </div>

                    <!-- Step 3: SMTP Settings -->
                    <div id="step-3" class="wizard-step" style="display: none;">
                        <p class="text-muted mb-6" style="font-size: 0.85rem; border-left: 3px solid var(--primary); padding-left: 1rem;">
                            Configure your company SMTP server for guaranteed inbox delivery.
                        </p>
                        <div class="grid-2 mb-4">
                            <div>
                                <label class="label">SMTP Host</label>
                                <input type="text" name="smtp_host" class="input" placeholder="smtp.gmail.com">
                            </div>
                            <div>
                                <label class="label">Port</label>
                                <input type="number" name="smtp_port" class="input" placeholder="587">
                            </div>
                        </div>
                        <div class="mb-4">
                            <label class="label">SMTP Username</label>
                            <input type="text" name="smtp_user" class="input" placeholder="user@domain.com">
                        </div>
                        <div class="mb-8">
                            <label class="label">SMTP Password</label>
                            <input type="password" name="smtp_pass" class="input" placeholder="••••••••">
                        </div>
                        <div class="flex gap-4">
                            <button type="button" class="btn btn-outline prev-btn" style="flex: 1;">Back</button>
                            <button type="submit" class="btn btn-primary" style="flex: 2;">Complete Setup & Start Warming</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `;
}

export function initAuth() {
    const form = document.getElementById('auth-form');
    if (!form) return;

    let currentStep = 1;

    // Navigation logic
    const showStep = (step) => {
        document.querySelectorAll('.wizard-step').forEach(s => s.style.display = 'none');
        document.getElementById(`step-${step}`).style.display = 'block';
        
        // Update dots
        document.querySelectorAll('.step-dot').forEach(dot => {
            dot.classList.toggle('active', dot.dataset.step == step);
        });

        // Update title
        const title = document.getElementById('wizard-title');
        if (title) {
            if (step === 1) title.textContent = 'Create your account';
            if (step === 2) title.textContent = 'Tell us about your business';
            if (step === 3) title.textContent = 'Guaranteed Inbox: SMTP Config';
        }
    };

    form.addEventListener('click', (e) => {
        if (e.target.classList.contains('next-btn')) {
            // Basic validation for step 1
            if (currentStep === 1) {
                const name = form.querySelector('[name="name"]').value;
                const email = form.querySelector('[name="email"]').value;
                const pass = form.querySelector('[name="password"]').value;
                if (!name || !email || !pass) {
                    alert('Please fill in all account details.');
                    return;
                }
            }
            currentStep++;
            showStep(currentStep);
        }
        if (e.target.classList.contains('prev-btn')) {
            currentStep--;
            showStep(currentStep);
        }
    });

    form.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            let userData;
            if (isSignup) {
                // 1. Signup
                const signupRes = await accountApi.signup({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    company_name: data.company_name,
                    domain: data.domain
                });

                // 2. Save SMTP Settings if provided
                if (data.smtp_host) {
                    await accountApi.saveSMTP({
                        account_id: signupRes.id,
                        host: data.smtp_host,
                        port: parseInt(data.smtp_port),
                        username: data.smtp_user,
                        password: data.smtp_pass,
                        security_type: 'tls'
                    });
                }

                userData = {
                    id: signupRes.id,
                    name: data.name,
                    email: data.email
                };
            } else {
                // Login
                const loginRes = await accountApi.login({
                    email: data.email,
                    password: data.password
                });
                userData = loginRes;
            }

            localStorage.setItem('camp_user', JSON.stringify(userData));
            window.sessionStorage.setItem('isLoggedIn', 'true');
            alert(isSignup ? 'Setup complete! Welcome to the premium inbox experience.' : 'Welcome back!');
            window.location.href = '/';
        } catch (err) {
            alert((isSignup ? 'Setup failed: ' : 'Login failed: ') + err.message);
        }
    };
}
