export function Landing() {
    return `
        <div class="landing-page" style="width: 100%; display: flex; flex-direction: column; align-items: center; background: white; color: var(--text-main);">
            <style>
                @media (max-width: 640px) {
                    .landing-nav-links { display: none !important; }
                    .landing-hamburger { display: flex !important; }
                }
                .landing-mobile-drawer {
                    display: none; position: fixed; inset: 0; z-index: 999;
                }
                .landing-mobile-drawer.open { display: block; }
                .landing-drawer-overlay {
                    position: absolute; inset: 0; background: rgba(0,0,0,0.4);
                }
                .landing-drawer-panel {
                    position: absolute; top: 0; right: 0; width: 220px; height: 100%;
                    background: #fff; box-shadow: -4px 0 20px rgba(0,0,0,0.15);
                    padding: 1.5rem 1.25rem; display: flex; flex-direction: column; gap: 0.75rem;
                    transform: translateX(100%); transition: transform 0.25s ease;
                }
                .landing-mobile-drawer.open .landing-drawer-panel {
                    transform: translateX(0);
                }
                .landing-drawer-link {
                    display: block; padding: 0.65rem 0.5rem; font-weight: 600;
                    color: #111; text-decoration: none; border-radius: 8px;
                    font-size: 0.9rem; transition: background 0.15s;
                }
                .landing-drawer-link:hover { background: #f4f4f5; }
                .landing-drawer-close {
                    align-self: flex-end; background: none; border: none;
                    font-size: 1.4rem; cursor: pointer; color: #666; margin-bottom: 0.5rem;
                    padding: 0.25rem;
                }
            </style>

            <header style="width: 100%; padding: 1.25rem 5%; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: white; z-index: 100;">
                <div class="logo" style="margin-bottom: 0;">
                    <span style="font-size: 1.75rem;">🏕️</span>
                    <span style="font-size: 1.4rem; font-weight: 800; font-family: var(--font-heading);">MailerPRO</span>
                </div>

                <!-- Desktop Nav -->
                <nav class="landing-nav-links" style="display: flex; gap: 1.5rem; align-items: center;">
                    <a href="#plans" style="text-decoration: none; color: #333; font-weight: 600; font-size: 0.9rem;">Pricing</a>
                    <a href="/docs" data-link style="text-decoration: none; color: #333; font-weight: 600; font-size: 0.9rem;">Docs</a>
                    <a href="/login" class="btn btn-outline" data-link style="padding: 0.5rem 1rem; font-size: 0.875rem;">Log In</a>
                    <a href="/signup" class="btn btn-primary" data-link style="padding: 0.5rem 1rem; font-size: 0.875rem;">Sign Up Free</a>
                </nav>

                <!-- Mobile Hamburger -->
                <button class="landing-hamburger" id="landing-menu-btn"
                    style="display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 6px;"
                    aria-label="Open menu">
                    <span style="display:block;width:22px;height:2px;background:#333;border-radius:2px;"></span>
                    <span style="display:block;width:22px;height:2px;background:#333;border-radius:2px;"></span>
                    <span style="display:block;width:22px;height:2px;background:#333;border-radius:2px;"></span>
                </button>
            </header>

            <!-- Mobile Drawer -->
            <div class="landing-mobile-drawer" id="landing-drawer">
                <div class="landing-drawer-overlay" id="landing-drawer-overlay"></div>
                <div class="landing-drawer-panel">
                    <button class="landing-drawer-close" id="landing-drawer-close">✕</button>
                    <a href="#plans" class="landing-drawer-link" id="landing-drawer-pricing">Pricing</a>
                    <a href="/docs" class="landing-drawer-link" data-link id="landing-drawer-docs">📖 Docs</a>
                    <a href="/login" class="landing-drawer-link" data-link>Log In</a>
                    <a href="/signup" class="btn btn-primary" data-link style="text-align:center;margin-top:0.5rem;text-decoration:none;padding:0.65rem;">Sign Up Free</a>
                </div>
            </div>

            <main style="width: 100%; max-width: 1200px; padding: 4rem 2rem; text-align: center;">
                <section class="hero mb-8">
                    <h1 style="font-size: 3.5rem; line-height: 1.1; margin-bottom: 1.5rem;">Grow your business with <span style="color: var(--primary);">Camp</span></h1>
                    <p class="text-muted" style="font-size: 1.25rem; max-width: 600px; margin: 0 auto 2.5rem;">The #1 email marketing and automation platform. Spend less to grow more with our smart tools.</p>
                    <div class="flex gap-2 justify-center" style="justify-content: center;">
                        <a href="/signup" class="btn btn-primary" style="padding: 1rem 2rem; font-size: 1.125rem;" data-link>Start Free Trial</a>
                        <a href="#plans" class="btn btn-secondary" style="padding: 1rem 2rem; font-size: 1.125rem;">Compare Plans</a>
                    </div>
                </section>

                <section id="plans" style="padding-top: 4rem;">
                    <h2 style="font-size: 2.5rem; margin-bottom: 3rem;">Ready to find your plan?</h2>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; text-align: left;">
                        <!-- Free Plan -->
                        <div class="card" style="display: flex; flex-direction: column; padding: 2.5rem;">
                            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Free</h3>
                            <p class="text-muted" style="font-size: 0.875rem; min-height: 3rem;">Use core features to manage early growth.</p>
                            <div style="margin: 2rem 0;">
                                <span style="font-size: 2.5rem; font-weight: 800;">$0</span>
                                <span class="text-muted">/mo</span>
                            </div>
                            <ul style="list-style: none; margin-bottom: 2.5rem; flex-grow: 1;">
                                <li style="margin-bottom: 0.75rem;">✅ Up to 500 contacts</li>
                                <li style="margin-bottom: 0.75rem;">✅ 1,000 monthly sends</li>
                                <li style="margin-bottom: 0.75rem;">✅ Basic email templates</li>
                                <li style="margin-bottom: 0.75rem;">✅ Forms & Landing pages</li>
                            </ul>
                            <a href="/signup" class="btn btn-secondary" style="width: 100%;" data-link>Sign Up Free</a>
                        </div>

                        <!-- Essentials Plan -->
                        <div class="card" style="display: flex; flex-direction: column; padding: 2.5rem; border-color: var(--border);">
                            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Essentials</h3>
                            <p class="text-muted" style="font-size: 0.875rem; min-height: 3rem;">Send the right content at the right time.</p>
                            <div style="margin: 2rem 0;">
                                <span style="font-size: 2.5rem; font-weight: 800;">$6.50</span>
                                <span class="text-muted">/mo</span>
                                <p style="font-size: 0.75rem; color: var(--success); font-weight: 600;">Save 50% for 12 months</p>
                            </div>
                            <ul style="list-style: none; margin-bottom: 2.5rem; flex-grow: 1;">
                                <li style="margin-bottom: 0.75rem;">✅ All Free features</li>
                                <li style="margin-bottom: 0.75rem;">✅ 24/7 Support</li>
                                <li style="margin-bottom: 0.75rem;">✅ Email Scheduling</li>
                                <li style="margin-bottom: 0.75rem;">✅ A/B Testing</li>
                            </ul>
                            <a href="/signup" class="btn btn-secondary" style="width: 100%;" data-link>Buy Now</a>
                        </div>

                        <!-- Standard Plan (Featured) -->
                        <div class="card" style="display: flex; flex-direction: column; padding: 2.5rem; border: 2px solid var(--primary); position: relative; transform: scale(1.05); z-index: 10; background: #fafafa;">
                            <div style="position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--primary); color: white; padding: 0.25rem 1rem; border-radius: 999px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">Best Value</div>
                            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Standard</h3>
                            <p class="text-muted" style="font-size: 0.875rem; min-height: 3rem;">Sell even more with personalization tools.</p>
                            <div style="margin: 2rem 0;">
                                <span style="font-size: 2.5rem; font-weight: 800;">$10</span>
                                <span class="text-muted">/mo</span>
                                <p style="font-size: 0.75rem; color: var(--success); font-weight: 600;">Save 50% for 12 months</p>
                            </div>
                            <ul style="list-style: none; margin-bottom: 2.5rem; flex-grow: 1;">
                                <li style="margin-bottom: 0.75rem;">✅ All Essentials features</li>
                                <li style="margin-bottom: 0.75rem;">✅ Predictive Segmentation</li>
                                <li style="margin-bottom: 0.75rem;">✅ Enhanced Automations</li>
                                <li style="margin-bottom: 0.75rem;">✅ Custom Email Templates</li>
                            </ul>
                            <a href="/signup" class="btn btn-primary" style="width: 100%;" data-link>Buy Now</a>
                        </div>

                        <!-- Premium Plan -->
                        <div class="card" style="display: flex; flex-direction: column; padding: 2.5rem;">
                            <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Premium</h3>
                            <p class="text-muted" style="font-size: 0.875rem; min-height: 3rem;">Scale fast with dedicated onboarding.</p>
                            <div style="margin: 2rem 0;">
                                <span style="font-size: 2.5rem; font-weight: 800;">$175</span>
                                <span class="text-muted">/mo</span>
                                <p style="font-size: 0.75rem; color: var(--success); font-weight: 600;">Save 50% for 12 months</p>
                            </div>
                            <ul style="list-style: none; margin-bottom: 2.5rem; flex-grow: 1;">
                                <li style="margin-bottom: 0.75rem;">✅ All Standard features</li>
                                <li style="margin-bottom: 0.75rem;">✅ Unlimited Contacts</li>
                                <li style="margin-bottom: 0.75rem;">✅ Priority Support</li>
                                <li style="margin-bottom: 0.75rem;">✅ Personal Onboarding</li>
                            </ul>
                            <a href="/signup" class="btn btn-secondary" style="width: 100%;" data-link>Buy Now</a>
                        </div>
                    </div>
                </section>
            </main>

            <footer style="width: 100%; padding: 4rem 5%; background: var(--bg-main); border-top: 1px solid var(--border); margin-top: 4rem;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 3rem;">
                    <div>
                        <div class="logo">
                            <span style="font-size: 1.5rem;">🏕️</span>
                            <span>Camp</span>
                        </div>
                        <p class="text-muted" style="font-size: 0.875rem; margin-top: 1rem;">The world's leading email marketing platform for creators and small businesses.</p>
                    </div>
                    <div>
                        <h4 class="mb-4">Product</h4>
                        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.875rem;" class="text-muted">
                            <li>Features</li>
                            <li>Pricing</li>
                            <li>Integrations</li>
                            <li>Status</li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="mb-4">Resources</h4>
                        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.875rem;" class="text-muted">
                            <li>Blog</li>
                            <li>Help Center</li>
                            <li>Developers</li>
                            <li>Community</li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="mb-4">Company</h4>
                        <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.875rem;" class="text-muted">
                            <li>About</li>
                            <li>Careers</li>
                            <li>Privacy</li>
                            <li>Terms</li>
                        </ul>
                    </div>
                </div>
                <div style="margin-top: 4rem; padding-top: 2rem; border-top: 1px solid var(--border); text-align: center;" class="text-muted">
                    <p style="font-size: 0.75rem;">© 2001-2026 Camp Email Marketing Platform. All rights reserved.</p>
                </div>
            </footer>
        </div>
    `;
}
