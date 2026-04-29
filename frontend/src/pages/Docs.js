export function Docs() {
    return `
        <div style="display: flex; min-height: 100vh; background: var(--bg-main); font-family: var(--font-main); color: var(--text-main);">

            <!-- Docs Sidebar TOC -->
            <aside id="docs-toc" style="
                width: 260px; flex-shrink: 0; position: sticky; top: 0; height: 100vh;
                overflow-y: auto; border-right: 1px solid var(--border);
                padding: 2rem 1.25rem; background: var(--bg-sidebar);
            ">
                <div style="font-size: 1.1rem; font-weight: 800; color: var(--primary); margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.5rem;">
                    📖 <span>MailerPRO Docs</span>
                </div>
                <p style="font-size: 0.7rem; color: var(--text-muted); margin-bottom: 1.5rem;">v1.0 · Email Deliverability Engine</p>
                ${tocSection('Getting Started', [
                    ['#gs-intro', 'Introduction'],
                    ['#gs-account', 'Create an Account'],
                    ['#gs-google', 'Connect Gmail (OAuth)'],
                    ['#gs-smtp', 'SMTP Alternative'],
                ])}
                ${tocSection('Contacts', [
                    ['#c-import', 'Importing Contacts'],
                    ['#c-tags', 'Tags & Folders'],
                    ['#c-bulk', 'Bulk Actions'],
                ])}
                ${tocSection('Campaigns', [
                    ['#camp-create', 'Creating a Campaign'],
                    ['#camp-ai', 'AI Magic Draft'],
                    ['#camp-schedule', 'Scheduling'],
                    ['#camp-personalize', 'Hyper-Personalization'],
                    ['#camp-send', 'Sending'],
                ])}
                ${tocSection('Email Warming', [
                    ['#warm-what', 'What is Warming?'],
                    ['#warm-how', 'How MailerPRO Warms'],
                    ['#warm-status', 'Monitoring Progress'],
                ])}
                ${tocSection('Analytics', [
                    ['#an-overview', 'Overview Stats'],
                    ['#an-openrate', 'Open Rate Tracking'],
                    ['#an-ctr', 'CTR & Conversions'],
                ])}
                ${tocSection('Domain Health', [
                    ['#dh-spf', 'SPF Record'],
                    ['#dh-dkim', 'DKIM Record'],
                    ['#dh-dmarc', 'DMARC Record'],
                    ['#dh-check', 'Running a Health Check'],
                ])}
                ${tocSection('API Reference', [
                    ['#api-auth', 'Authentication'],
                    ['#api-contacts', 'Contacts API'],
                    ['#api-campaigns', 'Campaigns API'],
                    ['#api-health', 'Health Check'],
                ])}
            </aside>

            <!-- Docs Content -->
            <main style="flex: 1; min-width: 0; padding: 3rem 4rem; max-width: 860px;">

                <!-- ═══════════════ GETTING STARTED ═══════════════ -->
                <section id="gs-intro" class="docs-section">
                    <span class="docs-badge">Getting Started</span>
                    <h1 style="font-size: 2.2rem; font-weight: 900; margin: 0.5rem 0 1rem; letter-spacing: -0.02em;">Introduction</h1>
                    <p class="docs-lead">MailerPRO is a self-hosted email deliverability engine that lets you send campaigns, warm up your domain, and track opens — all from one dashboard.</p>
                    <div class="docs-callout docs-callout-info">
                        <strong>Who is MailerPRO for?</strong> Founders, agencies, and marketers who want full control over their email sending without paying per-seat SaaS fees.
                    </div>
                    <h3>Core Features</h3>
                    <ul class="docs-list">
                        <li>📧 <strong>Gmail OAuth sending</strong> — Send via your Google account without SMTP passwords</li>
                        <li>🔥 <strong>Email warming</strong> — Automated background warming to build sender reputation</li>
                        <li>🤖 <strong>AI campaign drafting</strong> — Generate subject lines and body copy with one click</li>
                        <li>🎯 <strong>Hyper-personalization</strong> — AI researches each recipient's company before sending</li>
                        <li>📅 <strong>Campaign scheduling</strong> — Set exact date/time for any campaign</li>
                        <li>🛡️ <strong>Domain health checker</strong> — Verify SPF, DKIM, and DMARC records instantly</li>
                        <li>📊 <strong>Open rate tracking</strong> — Invisible pixel tracking for real delivery intelligence</li>
                    </ul>
                </section>

                <hr class="docs-divider">

                <section id="gs-account" class="docs-section">
                    <h2>Create an Account</h2>
                    <p>Navigate to <code>/signup</code> and complete the 3-step wizard:</p>
                    <ol class="docs-list">
                        <li><strong>Step 1 — Personal Info:</strong> Name, work email, password. If you type a Gmail address, we'll suggest signing up with Google instead.</li>
                        <li><strong>Step 2 — Business Details:</strong> Company name and your sending domain (e.g. <code>yourcompany.com</code>)</li>
                        <li><strong>Step 3 — Network Config (Optional):</strong> SMTP settings if you're not using Gmail OAuth</li>
                    </ol>
                </section>

                <hr class="docs-divider">

                <section id="gs-google" class="docs-section">
                    <h2>Connect Gmail via OAuth</h2>
                    <p>Google OAuth is the recommended way to connect MailerPRO. It:</p>
                    <ul class="docs-list">
                        <li>Sends email directly through your Gmail account</li>
                        <li>Doesn't require an app password or SMTP port configuration</li>
                        <li>Uses a secure refresh token that auto-renews</li>
                    </ul>
                    <div class="docs-callout docs-callout-warning">
                        <strong>Heads up:</strong> If your Google Cloud project is in "Testing" mode, only accounts added as Test Users can log in. Switch to "Production" or add users under OAuth Consent Screen → Test Users.
                    </div>
                    <h3>Setup Steps</h3>
                    <ol class="docs-list">
                        <li>Go to <strong>Settings</strong> in the sidebar</li>
                        <li>Click <strong>Connect Gmail</strong></li>
                        <li>Authorize MailerPRO in the Google popup</li>
                        <li>You're connected — all campaigns will now send via Gmail API</li>
                    </ol>
                    <p><strong>Required Environment Variables (Render / Self-hosted):</strong></p>
                    <div class="docs-code">GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URL=https://mailerpro-rjoy.onrender.com/api/auth/google/callback</div>
                </section>

                <hr class="docs-divider">

                <section id="gs-smtp" class="docs-section">
                    <h2>SMTP Alternative</h2>
                    <p>If you prefer to use a dedicated SMTP provider (SendGrid, Mailgun, AWS SES), go to <strong>Settings → SMTP Configuration</strong> and fill in:</p>
                    <div class="docs-code">Host: smtp.sendgrid.net
Port: 587 (STARTTLS) or 465 (SSL)
Username: apikey
Password: &lt;your_api_key&gt;
Security: TLS</div>
                    <div class="docs-callout docs-callout-info">Gmail OAuth takes priority. If OAuth tokens exist, SMTP settings are ignored for that account.</div>
                </section>

                <hr class="docs-divider">

                <!-- ═══════════════ CONTACTS ═══════════════ -->
                <section id="c-import" class="docs-section">
                    <span class="docs-badge">Contacts</span>
                    <h2>Importing Contacts</h2>
                    <p>Go to <strong>Contacts</strong> in the sidebar. You can:</p>
                    <ul class="docs-list">
                        <li>Add contacts one by one using the <strong>Add Contact</strong> button</li>
                        <li>Import a CSV file (columns: <code>first_name, last_name, email, phone</code>)</li>
                        <li>Bulk-select and delete using the checkbox column</li>
                    </ul>
                </section>

                <hr class="docs-divider">

                <section id="c-tags" class="docs-section">
                    <h2>Tags & Folders</h2>
                    <p>Tags group contacts into folders for targeted sending. For example: <code>Newsletter</code>, <code>VIP</code>, <code>Trial Users</code>.</p>
                    <ul class="docs-list">
                        <li>Click <strong>+ Tag</strong> on any contact to add a tag</li>
                        <li>Use the <strong>Folders</strong> panel on the left to filter by tag</li>
                        <li>When creating a campaign, select a <strong>Target Folder</strong> to send only to contacts in that tag group</li>
                    </ul>
                </section>

                <hr class="docs-divider">

                <section id="c-bulk" class="docs-section">
                    <h2>Bulk Actions</h2>
                    <p>Select multiple contacts with the checkbox and use the action bar to:</p>
                    <ul class="docs-list">
                        <li><strong>Move to folder</strong> — Apply a tag to all selected contacts</li>
                        <li><strong>Delete</strong> — Permanently remove selected contacts</li>
                    </ul>
                </section>

                <hr class="docs-divider">

                <!-- ═══════════════ CAMPAIGNS ═══════════════ -->
                <section id="camp-create" class="docs-section">
                    <span class="docs-badge">Campaigns</span>
                    <h2>Creating a Campaign</h2>
                    <ol class="docs-list">
                        <li>Click <strong>+ Create Campaign</strong> in the Campaigns page</li>
                        <li>Enter a Campaign Name, Email Subject, and choose a Target Folder</li>
                        <li>Write your content in the rich text editor (supports bold, italics, headings, lists, links, colors)</li>
                        <li>Set the status to <strong>Draft</strong> to save, or <strong>Scheduled</strong> to set a send time</li>
                        <li>Click <strong>Create Draft</strong> or <strong>Update Campaign</strong></li>
                    </ol>
                </section>

                <hr class="docs-divider">

                <section id="camp-ai" class="docs-section">
                    <h2>AI Magic Draft ✨</h2>
                    <p>At the top of the campaign form, the <strong>Magic Draft</strong> panel lets you generate a full email with AI:</p>
                    <ol class="docs-list">
                        <li>Enter a <strong>Goal</strong> — e.g. "Welcome email for new trial users"</li>
                        <li>Enter a <strong>Pain Point</strong> — e.g. "Teams waste hours writing cold emails manually"</li>
                        <li>Click <strong>Magic Draft ✨</strong> — AI fills in the subject and body instantly</li>
                    </ol>
                    <div class="docs-callout docs-callout-info">Requires an <code>OPENAI_API_KEY</code> environment variable to be set.</div>
                </section>

                <hr class="docs-divider">

                <section id="camp-schedule" class="docs-section">
                    <h2>Scheduling a Campaign</h2>
                    <p>Set the campaign status to <strong>Scheduled</strong> to reveal the date/time picker. The scheduler runs every minute in the background and fires campaigns at their exact scheduled time.</p>
                    <div class="docs-callout docs-callout-warning">
                        <strong>Note:</strong> Render free tier spins down after inactivity. Use Render's "Health Check" URL (<code>/api/health</code>) or a free uptime monitor like UptimeRobot to keep the service alive.
                    </div>
                </section>

                <hr class="docs-divider">

                <section id="camp-personalize" class="docs-section">
                    <h2>Hyper-Personalization</h2>
                    <p>Check the <strong>Hyper-Personalization</strong> checkbox when creating a campaign. Before sending to each contact, MailerPRO will:</p>
                    <ol class="docs-list">
                        <li>Extract the company domain from the contact's email</li>
                        <li>Use AI to research the company and tailor the message</li>
                        <li>Insert a uniquely personalized version of your template</li>
                    </ol>
                    <p><em>Generic domains (gmail.com, outlook.com, etc.) are skipped and receive the base template.</em></p>
                </section>

                <hr class="docs-divider">

                <section id="camp-send" class="docs-section">
                    <h2>Sending a Campaign</h2>
                    <p>In the Campaigns table, click <strong>Edit</strong> on a draft campaign, change status to <strong>Sent</strong> (or use Schedule), then save. The backend worker picks it up and sends to all matching contacts.</p>
                </section>

                <hr class="docs-divider">

                <!-- ═══════════════ WARMING ═══════════════ -->
                <section id="warm-what" class="docs-section">
                    <span class="docs-badge">Email Warming</span>
                    <h2>What is Email Warming?</h2>
                    <p>When you start sending from a new domain or email, spam filters are suspicious. <strong>Warming</strong> gradually increases your sending volume to build a positive reputation with Gmail, Outlook, and Yahoo inboxes.</p>
                </section>

                <hr class="docs-divider">

                <section id="warm-how" class="docs-section">
                    <h2>How MailerPRO Warms</h2>
                    <p>A background worker runs every <strong>10 minutes</strong> and automatically:</p>
                    <ul class="docs-list">
                        <li>Picks natural-sounding email templates (meeting follow-ups, questions, etc.)</li>
                        <li>Sends to seed addresses (controlled inboxes to simulate real engagement)</li>
                        <li>Increases the daily sending limit by ~20% every 24 hours up to a target maximum</li>
                    </ul>
                </section>

                <hr class="docs-divider">

                <section id="warm-status" class="docs-section">
                    <h2>Monitoring Warming Progress</h2>
                    <p>The <strong>Dashboard</strong> shows a live warming progress card with:</p>
                    <ul class="docs-list">
                        <li><strong>Status:</strong> Active / Paused / Completed</li>
                        <li><strong>Daily Progress:</strong> Emails sent today vs. daily limit</li>
                    </ul>
                </section>

                <hr class="docs-divider">

                <!-- ═══════════════ ANALYTICS ═══════════════ -->
                <section id="an-overview" class="docs-section">
                    <span class="docs-badge">Analytics</span>
                    <h2>Overview Stats</h2>
                    <p>The Dashboard Overview shows live stats pulled from your database:</p>
                    <ul class="docs-list">
                        <li><strong>Total Sent</strong> — Cumulative emails sent across all campaigns</li>
                        <li><strong>Open Rate</strong> — % of recipients who opened (requires tracking pixel)</li>
                        <li><strong>CTR</strong> — Click-through rate set per campaign</li>
                        <li><strong>Revenue</strong> — Manual estimate field on campaigns</li>
                    </ul>
                </section>

                <hr class="docs-divider">

                <section id="an-openrate" class="docs-section">
                    <h2>Open Rate Tracking</h2>
                    <p>MailerPRO injects a 1×1 invisible tracking pixel into every campaign email. When a recipient opens the email, their client loads the pixel from:</p>
                    <div class="docs-code">GET /api/track/open?eid=&lt;email_log_id&gt;</div>
                    <p>This increments the <code>open_count</code> on the sent email record, which feeds into the campaign's open rate calculation.</p>
                    <div class="docs-callout docs-callout-info">Apple Mail Privacy Protection may inflate open rates. This is a known limitation across all email marketing platforms.</div>
                </section>

                <hr class="docs-divider">

                <section id="an-ctr" class="docs-section">
                    <h2>CTR & Conversions</h2>
                    <p>CTR (Click-Through Rate) and Conversions are manually set fields on each campaign. You can update them after sending based on your own analytics or link-click tracking from your website.</p>
                </section>

                <hr class="docs-divider">

                <!-- ═══════════════ DOMAIN HEALTH ═══════════════ -->
                <section id="dh-spf" class="docs-section">
                    <span class="docs-badge">Domain Health</span>
                    <h2>SPF Record</h2>
                    <p>SPF (Sender Policy Framework) tells receiving servers which IP addresses are allowed to send email from your domain.</p>
                    <p><strong>Example SPF for Gmail senders:</strong></p>
                    <div class="docs-code">v=spf1 include:_spf.google.com ~all</div>
                    <p>Add this as a <code>TXT</code> record in your DNS provider (Hostinger, Cloudflare, etc.).</p>
                </section>

                <hr class="docs-divider">

                <section id="dh-dkim" class="docs-section">
                    <h2>DKIM Record</h2>
                    <p>DKIM (DomainKeys Identified Mail) adds a cryptographic signature to your emails. Gmail generates DKIM keys automatically when you enable it in Google Workspace Admin.</p>
                    <p>After enabling, add the CNAME or TXT record provided by Google to your DNS.</p>
                </section>

                <hr class="docs-divider">

                <section id="dh-dmarc" class="docs-section">
                    <h2>DMARC Record</h2>
                    <p>DMARC builds on SPF + DKIM and tells servers what to do with emails that fail authentication.</p>
                    <p><strong>Minimal DMARC record to get started:</strong></p>
                    <div class="docs-code">v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com</div>
                    <p>Add as a <code>TXT</code> record at <code>_dmarc.yourdomain.com</code>.</p>
                </section>

                <hr class="docs-divider">

                <section id="dh-check" class="docs-section">
                    <h2>Running a Health Check</h2>
                    <ol class="docs-list">
                        <li>Go to the <strong>Dashboard</strong></li>
                        <li>In the <strong>Deliverability Health</strong> card, enter your domain (e.g. <code>yourdomain.com</code>)</li>
                        <li>Click <strong>🔍 Check</strong> — results show SPF ✅/❌, DKIM ✅/❌, DMARC ✅/❌</li>
                    </ol>
                    <p>DNS changes can take up to <strong>24–48 hours</strong> to propagate globally.</p>
                </section>

                <hr class="docs-divider">

                <!-- ═══════════════ API REFERENCE ═══════════════ -->
                <section id="api-auth" class="docs-section">
                    <span class="docs-badge">API Reference</span>
                    <h2>Authentication</h2>
                    <p>The API uses session-based auth stored in <code>localStorage</code> on the frontend. All API calls include the account ID in the request body or URL. No Bearer token is required for internal calls.</p>
                    <div class="docs-code">POST /api/login
Body: { "email": "you@co.com", "password": "..." }
Returns: { "id": 1, "name": "...", "email": "..." }

POST /api/signup
Body: { "name": "...", "email": "...", "password": "...", "company_name": "..." }</div>
                </section>

                <hr class="docs-divider">

                <section id="api-contacts" class="docs-section">
                    <h2>Contacts API</h2>
                    <div class="docs-code">GET    /api/contacts          — List all contacts
POST   /api/contacts          — Create contact
PUT    /api/contacts/:id       — Update contact
DELETE /api/contacts/:id       — Delete contact
POST   /api/contacts/tag       — Add tag to contact
DELETE /api/contacts/:id/tag   — Remove tag from contact
POST   /api/contacts/bulk-delete — Bulk delete
POST   /api/contacts/bulk-move   — Bulk tag (move to folder)</div>
                </section>

                <hr class="docs-divider">

                <section id="api-campaigns" class="docs-section">
                    <h2>Campaigns API</h2>
                    <div class="docs-code">GET  /api/campaigns          — List campaigns
POST /api/campaigns          — Create campaign
GET  /api/campaigns/:id      — Get campaign
PUT  /api/campaigns/:id      — Update campaign
POST /api/campaigns/generate-ai — AI draft generation</div>
                </section>

                <hr class="docs-divider">

                <section id="api-health" class="docs-section">
                    <h2>Health Check</h2>
                    <div class="docs-code">GET /api/health
Response: { "status": "ok", "version": "1.0.0" }</div>
                    <p>Use this endpoint with UptimeRobot or Render health checks to prevent the free-tier service from sleeping.</p>
                </section>

            </main>
        </div>

        <style>
            .docs-section { margin-bottom: 2.5rem; scroll-margin-top: 1.5rem; }
            .docs-section h2 { font-size: 1.5rem; font-weight: 800; margin-bottom: 0.75rem; letter-spacing: -0.01em; }
            .docs-section h3 { font-size: 1.1rem; font-weight: 700; margin: 1.25rem 0 0.5rem; }
            .docs-section p { color: rgba(255,255,255,0.75); line-height: 1.75; margin-bottom: 0.875rem; font-size: 0.925rem; }
            .docs-lead { font-size: 1.05rem; color: rgba(255,255,255,0.85) !important; }
            .docs-badge {
                display: inline-block; background: var(--primary-light); color: var(--primary);
                font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
                padding: 0.2rem 0.65rem; border-radius: 999px; margin-bottom: 0.5rem;
            }
            .docs-list { color: rgba(255,255,255,0.75); padding-left: 1.25rem; line-height: 2; font-size: 0.925rem; }
            .docs-list li { margin-bottom: 0.25rem; }
            .docs-code {
                background: rgba(0,0,0,0.4); border: 1px solid var(--border); border-radius: 10px;
                padding: 1rem 1.25rem; font-family: 'Courier New', monospace; font-size: 0.825rem;
                color: #00ff88; line-height: 1.7; white-space: pre-wrap; word-break: break-all;
                margin: 0.75rem 0 1rem; overflow-x: auto;
            }
            code { background: rgba(0,255,136,0.1); padding: 0.1rem 0.4rem; border-radius: 4px; font-size: 0.85em; color: #00ff88; font-family: monospace; }
            .docs-divider { border: none; border-top: 1px solid var(--border); margin: 2.5rem 0; }
            .docs-callout {
                border-radius: 10px; padding: 0.875rem 1.1rem; margin: 1rem 0;
                font-size: 0.875rem; line-height: 1.6; border-left: 3px solid;
            }
            .docs-callout-info { background: rgba(0,229,255,0.07); border-color: #00e5ff; color: rgba(255,255,255,0.8); }
            .docs-callout-warning { background: rgba(255,204,0,0.07); border-color: #ffcc00; color: rgba(255,255,255,0.8); }
            .docs-callout strong { color: #fff; }
            /* TOC links */
            .docs-toc-link {
                display: block; padding: 0.3rem 0.5rem; font-size: 0.8rem;
                color: var(--text-muted); text-decoration: none; border-radius: 6px;
                transition: all 0.15s; font-weight: 500;
            }
            .docs-toc-link:hover { color: var(--primary); background: var(--primary-light); }
            /* Mobile */
            @media (max-width: 768px) {
                #docs-toc { display: none; }
                main { padding: 2rem 1.25rem !important; }
            }
        </style>
    `;
}

function tocSection(title, links) {
    const linkHtml = links.map(function(item) {
        return '<a href="' + item[0] + '" class="docs-toc-link">' + item[1] + '</a>';
    }).join('');
    return (
        '<div style="margin-bottom: 1.25rem;">' +
            '<p style="font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 0.4rem; padding: 0 0.5rem;">' + title + '</p>' +
            linkHtml +
        '</div>'
    );
}
