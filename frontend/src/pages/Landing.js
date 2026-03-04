export function Landing() {
    return `
        <div class="landing-page" style="width: 100%; display: flex; flex-direction: column; align-items: center; background: white; color: var(--text-main);">
            <header style="width: 100%; padding: 1.5rem 5%; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: white; z-index: 100;">
                <div class="logo" style="margin-bottom: 0;">
                    <span style="font-size: 2rem;">🏕️</span>
                    <span style="font-size: 1.5rem; font-weight: 800; font-family: var(--font-heading);">Camp</span>
                </div>
                <nav style="display: flex; gap: 2rem; align-items: center;">
                    <a href="#plans" style="text-decoration: none; color: var(--text-main); font-weight: 600;">Pricing</a>
                    <a href="/login" class="btn btn-secondary" data-link>Log In</a>
                    <a href="/signup" class="btn btn-primary" data-link>Sign Up Free</a>
                </nav>
            </header>

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
