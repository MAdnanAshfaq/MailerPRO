import { campaignsApi, mailerApi, contactsApi } from '../api';
import { showToast } from '../utils/toast';

let allCampaigns = [];
let allSentEmails = [];
let allContacts = [];
let renderCampaignsTable = null;
let renderSentTable = null;

export async function Campaigns() {
    try {
        const [c, s, contacts] = await Promise.all([
            campaignsApi.list(), 
            mailerApi.listSent(),
            contactsApi.list()
        ]);
        allCampaigns = c;
        allSentEmails = s;
        allContacts = contacts;
    } catch (e) {
        console.error('Failed to fetch campaigns, sent emails, or contacts', e);
    }

    return `
        <div class="main-content">
            <header class="flex justify-between items-center mb-8">
                <div>
                    <h1 style="font-size: 2rem;">Campaigns</h1>
                    <p class="text-muted">Create and manage your email marketing efforts.</p>
                </div>
                <button class="btn btn-primary" id="create-campaign-btn">
                    <span>+</span> Create Campaign
                </button>
            </header>

            <div class="grid-cols-4 mb-8">
                <div class="card stat-card">
                    <div class="stat-info">
                        <span class="stat-label">Drafts</span>
                        <span class="stat-value">${allCampaigns.filter(c => c.status === 'draft').length}</span>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-info">
                        <span class="stat-label">Scheduled</span>
                        <span class="stat-value">${allCampaigns.filter(c => c.status === 'scheduled').length}</span>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-info">
                        <span class="stat-label">Sent</span>
                        <span class="stat-value">${allCampaigns.filter(c => c.status === 'sent').length}</span>
                    </div>
                </div>
                <div class="card stat-card">
                    <div class="stat-info">
                        <span class="stat-label">Paused</span>
                        <span class="stat-value">${allCampaigns.filter(c => c.status === 'paused').length}</span>
                    </div>
                </div>
            </div>

            <div class="flex gap-4 mb-6" id="campaign-tabs">
                <button class="btn btn-primary tab-btn" data-filter="all" style="padding: 0.5rem 1rem; border-radius: var(--radius-sm);">All</button>
                <button class="btn btn-outline tab-btn" data-filter="draft" style="padding: 0.5rem 1rem; border-radius: var(--radius-sm);">Drafts</button>
                <button class="btn btn-outline tab-btn" data-filter="scheduled" style="padding: 0.5rem 1rem; border-radius: var(--radius-sm);">Scheduled</button>
                <button class="btn btn-outline tab-btn" data-filter="sent" style="padding: 0.5rem 1rem; border-radius: var(--radius-sm);">Sent (Inbox)</button>
            </div>

            <div class="card" style="padding: 0; overflow: hidden;" id="table-card">
                <table class="campaign-table" id="main-table">
                    <thead id="table-head">
                        <tr>
                            <th>Campaign Name ⌵</th>
                            <th>Status ⌵</th>
                            <th>Open Rate ⌵</th>
                            <th>CTR ⌵</th>
                            <th>Conversions ⌵</th>
                            <th>Actions ⌵</th>
                        </tr>
                    </thead>
                    <tbody id="campaigns-list-body">
                        <!-- Rendered dynamically -->
                    </tbody>
                </table>
            </div>

            <div id="campaign-modal-container"></div>
        </div>
    `;
}

export function initCampaigns() {
    const tbody = document.getElementById('campaigns-list-body');
    const createBtn = document.getElementById('create-campaign-btn');
    const modalContainer = document.getElementById('campaign-modal-container');
    const tabBtns = document.querySelectorAll('.tab-btn');

    renderCampaignsTable = (campaignsToRender) => {
        if (!tbody) return;
        tbody.innerHTML = campaignsToRender.map(campaign => `
            <tr>
                <td style="font-weight: 700;">${campaign.name}</td>
                <td>
                    <div class="flex flex-col">
                        <span class="status-badge ${campaign.status === 'sent' ? 'status-sent' : (campaign.status === 'paused' ? 'status-paused' : (campaign.status === 'scheduled' ? 'status-scheduled' : 'status-draft'))}">
                            ${campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </span>
                        ${campaign.status === 'scheduled' && campaign.scheduled_at ? `<span style="font-size: 0.65rem; color: var(--text-muted); margin-top: 4px; font-weight: 600;">📅 ${new Date(campaign.scheduled_at).toLocaleString([], {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'})}</span>` : ''}
                    </div>
                </td>
                <td style="font-weight: 700;">${campaign.open_rate}%</td>
                <td style="font-weight: 700;">${campaign.ctr}%</td>
                <td style="font-weight: 700;">${campaign.conversions}%</td>
                <td>
                    <button class="btn btn-outline edit-campaign-btn" data-id="${campaign.id}" style="padding: 0.4rem 0.8rem; font-size: 0.8125rem; margin-right: 0.5rem;">Edit</button>
                    ${campaign.status !== 'scheduled' && campaign.status !== 'sent' ? `<button class="btn btn-primary schedule-campaign-btn" data-id="${campaign.id}" style="padding: 0.4rem 0.8rem; font-size: 0.8125rem;">Schedule</button>` : ''}
                </td>
            </tr>
        `).join('') + (campaignsToRender.length === 0 ? '<tr><td colspan="6" style="text-align: center; padding: 3rem;" class="text-muted">No campaigns found for this view.</td></tr>' : '');

        document.querySelectorAll('.edit-campaign-btn').forEach(btn => {
            btn.onclick = (e) => {
                const id = e.target.dataset.id;
                const campaign = allCampaigns.find(c => c.id == id);
                if (campaign) renderModal(campaign);
            };
        });

        document.querySelectorAll('.schedule-campaign-btn').forEach(btn => {
            btn.onclick = (e) => {
                const id = e.target.dataset.id;
                const campaign = allCampaigns.find(c => c.id == id);
                if (campaign) renderModal(campaign, true); // Open natively as 'scheduled'
            };
        });
    };

    renderSentTable = () => {
        if (!tbody) return;
        const thead = document.getElementById('table-head');
        thead.innerHTML = `
            <tr>
                <th>Recipient (Email) ⌵</th>
                <th>Subject ⌵</th>
                <th>Type ⌵</th>
                <th>Sent At ⌵</th>
            </tr>
        `;
        tbody.innerHTML = allSentEmails.map(email => `
            <tr>
                <td style="font-weight: 700;">${email.recipient}</td>
                <td>${email.subject}</td>
                <td>
                    <span class="status-badge ${email.type === 'warming' ? 'status-draft' : 'status-sent'}">
                        ${email.type === 'warming' ? '🔥 Warming' : '✉️ Campaign'}
                    </span>
                </td>
                <td class="text-muted">${new Date(email.sent_at).toLocaleString()}</td>
            </tr>
        `).join('') + (allSentEmails.length === 0 ? '<tr><td colspan="4" style="text-align: center; padding: 3rem;" class="text-muted">No sent emails recorded.</td></tr>' : '');
    };

    const renderCampaignHeaders = () => {
        const thead = document.getElementById('table-head');
        thead.innerHTML = `
            <tr>
                <th>Campaign Name ⌵</th>
                <th>Status ⌵</th>
                <th>Open Rate ⌵</th>
                <th>CTR ⌵</th>
                <th>Conversions ⌵</th>
                <th>Actions ⌵</th>
            </tr>
        `;
    };

    // Initial render
    renderCampaignHeaders();
    renderCampaignsTable(allCampaigns);

    // Tab Logic
    tabBtns.forEach(btn => {
        btn.onclick = (e) => {
            // Update active state
            tabBtns.forEach(b => {
                b.classList.remove('btn-primary');
                b.classList.add('btn-outline');
            });
            const clicked = e.currentTarget;
            clicked.classList.remove('btn-outline');
            clicked.classList.add('btn-primary');

            // Filter data
            const filter = clicked.dataset.filter;
            if (filter === 'sent') {
                renderSentTable();
            } else if (filter === 'all') {
                renderCampaignHeaders();
                renderCampaignsTable(allCampaigns);
            } else {
                renderCampaignHeaders();
                renderCampaignsTable(allCampaigns.filter(c => c.status === filter));
            }
        };
    });

    const renderModal = (campaign = null, autoSchedule = false) => {
        const isEdit = !!campaign;
        const initialStatus = autoSchedule ? 'scheduled' : (campaign?.status || 'draft');

        // Derive unique folder names from all contacts' tags
        const folderSet = new Set();
        allContacts.forEach(c => {
            (c.tags || []).forEach(t => folderSet.add(t.text));
        });
        const folders = Array.from(folderSet).sort();
        
        modalContainer.innerHTML = `
            <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;" id="modal-overlay">
                <div class="card" style="width: 100%; max-width: 800px; padding: 2rem; max-height: 90vh; overflow-y: auto;">
                    <h2 class="mb-6">${isEdit ? 'Edit Campaign' : 'Create New Campaign'}</h2>
                    <form id="campaign-form">
                        <div class="mb-6 p-4" style="background: var(--bg-main); border: 1px dashed var(--primary); border-radius: var(--radius); text-align: center;">
                            <p style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1rem;">Let AI draft your campaign for you!</p>
                            <div class="flex gap-2 flex-col">
                                <input type="text" id="ai-goal" class="input mb-2" placeholder="Goal (e.g. Welcome email for new subscribers)" style="width: 100%; padding: 0.5rem;">
                                <textarea id="ai-pain-point" class="input mb-2" placeholder="Target pain point to pitch (e.g. Teams struggle with slow manual email generation)" style="width: 100%; padding: 0.5rem;"></textarea>
                                <button type="button" class="btn btn-primary" id="ai-magic-btn" style="padding: 0.75rem 1rem; width: 100%;">Magic Draft ✨</button>
                            </div>
                        </div>
                        <div class="mb-4">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Campaign Name</label>
                            <input type="text" name="name" class="input" required placeholder="Summer Sale 2026" value="${campaign?.name || ''}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                        </div>
                        <div class="grid-2 mb-4" style="grid-template-columns: 2fr 1fr; gap: 1rem;">
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Email Subject</label>
                                <input type="text" name="subject" class="input" required placeholder="Our biggest sale ever!" value="${campaign?.subject || ''}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Target Folder</label>
                                <select name="target_folder" class="input" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                                    <option value="">Everyone (Full List)</option>
                                    ${folders.map(f => `<option value="${f}" ${campaign?.target_folder === f ? 'selected' : ''}>${f}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                        <div class="mb-4">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Content (Rich Text)</label>
                            <div id="rte-toolbar" style="display: flex; flex-wrap: wrap; gap: 4px; padding: 6px 8px; background: #2a2a2a; border: 1px solid var(--border); border-bottom: none; border-radius: var(--radius) var(--radius) 0 0;">
                                <button type="button" data-cmd="bold" title="Bold" style="min-width:30px;padding:4px 8px;background:#3a3a3a;border:1px solid #555;border-radius:4px;color:#fff;cursor:pointer;font-weight:700;">B</button>
                                <button type="button" data-cmd="italic" title="Italic" style="min-width:30px;padding:4px 8px;background:#3a3a3a;border:1px solid #555;border-radius:4px;color:#fff;cursor:pointer;font-style:italic;">I</button>
                                <button type="button" data-cmd="underline" title="Underline" style="min-width:30px;padding:4px 8px;background:#3a3a3a;border:1px solid #555;border-radius:4px;color:#fff;cursor:pointer;text-decoration:underline;">U</button>
                                <button type="button" data-cmd="strikeThrough" title="Strikethrough" style="min-width:30px;padding:4px 8px;background:#3a3a3a;border:1px solid #555;border-radius:4px;color:#fff;cursor:pointer;text-decoration:line-through;">S</button>
                                <span style="width:1px;background:#555;margin:2px 4px;"></span>
                                <button type="button" data-cmd="insertOrderedList" title="Ordered List" style="min-width:30px;padding:4px 8px;background:#3a3a3a;border:1px solid #555;border-radius:4px;color:#fff;cursor:pointer;">1.</button>
                                <button type="button" data-cmd="insertUnorderedList" title="Bullet List" style="min-width:30px;padding:4px 8px;background:#3a3a3a;border:1px solid #555;border-radius:4px;color:#fff;cursor:pointer;">•</button>
                                <span style="width:1px;background:#555;margin:2px 4px;"></span>
                                <select data-format="formatBlock" title="Heading" style="padding:4px 6px;background:#3a3a3a;border:1px solid #555;border-radius:4px;color:#fff;cursor:pointer;">
                                    <option value="p">Normal</option>
                                    <option value="h1">H1</option>
                                    <option value="h2">H2</option>
                                    <option value="h3">H3</option>
                                </select>
                                <span style="width:1px;background:#555;margin:2px 4px;"></span>
                                <label title="Text Color" style="min-width:30px;padding:4px 8px;background:#3a3a3a;border:1px solid #555;border-radius:4px;cursor:pointer;display:flex;align-items:center;gap:4px;">A<input type="color" data-cmd="foreColor" style="width:20px;height:16px;border:none;background:none;cursor:pointer;padding:0;"></label>
                                <span style="width:1px;background:#555;margin:2px 4px;"></span>
                                <button type="button" id="rte-link-btn" title="Insert Link" style="min-width:30px;padding:4px 8px;background:#3a3a3a;border:1px solid #555;border-radius:4px;color:#fff;cursor:pointer;">🔗</button>
                                <button type="button" data-cmd="removeFormat" title="Clear Formatting" style="min-width:30px;padding:4px 8px;background:#3a3a3a;border:1px solid #555;border-radius:4px;color:#fff;cursor:pointer;">✕</button>
                            </div>
                            <div id="rte-content" contenteditable="true" style="min-height: 250px; padding: 12px; background: white; color: #111; border: 1px solid var(--border); border-radius: 0 0 var(--radius) var(--radius); font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; outline: none; overflow-y: auto;"></div>
                            <input type="hidden" name="content" id="hidden-content">
                        </div>
                        <div class="grid-2 mb-8" style="grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Status</label>
                                <select name="status" class="input" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                                    <option value="draft" ${initialStatus === 'draft' ? 'selected' : ''}>Draft</option>
                                    <option value="sent" ${initialStatus === 'sent' ? 'selected' : ''}>Sent</option>
                                    <option value="paused" ${initialStatus === 'paused' ? 'selected' : ''}>Paused</option>
                                    <option value="scheduled" ${initialStatus === 'scheduled' ? 'selected' : ''}>Scheduled</option>
                                </select>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Open Rate (%)</label>
                                <input type="number" step="0.1" name="open_rate" class="input" value="${campaign?.open_rate || 0}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                            </div>
                        </div>
                        <div class="mb-8" id="schedule-field" style="display: ${initialStatus === 'scheduled' ? 'block' : 'none'};">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Send At (Date & Time)</label>
                            <input type="datetime-local" name="scheduled_at" id="scheduled_at_input" class="input" value="${campaign?.scheduled_at ? new Date(campaign.scheduled_at).toISOString().slice(0, 16) : ''}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius); background: #ffffff; color: #000000;">
                        </div>
                        <div class="mb-8 flex items-center gap-2">
                            <input type="checkbox" name="is_personalized" id="is_personalized" ${campaign?.is_personalized ? 'checked' : ''} style="width: 18px; height: 18px; cursor: pointer;">
                            <label for="is_personalized" style="font-weight: 700; cursor: pointer;">✨ Hyper-Personalization (AI Research each company)</label>
                        </div>
                        <div class="flex justify-between mt-8" style="gap: 1rem;">
                            <button type="button" class="btn btn-outline" id="close-modal" style="flex: 1;">Cancel</button>
                            <button type="submit" class="btn btn-primary" style="flex: 1;">${isEdit ? 'Update Campaign' : 'Create Draft'}</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.getElementById('close-modal').onclick = () => modalContainer.innerHTML = '';
        
        // --- Native Rich Text Editor setup ---
        const rteContent = document.getElementById('rte-content');
        const hiddenContent = document.getElementById('hidden-content');
        
        // Populate with existing content
        if (campaign?.content) rteContent.innerHTML = campaign.content;
        
        // Toolbar button commands
        document.getElementById('rte-toolbar').addEventListener('mousedown', (e) => {
            const btn = e.target.closest('[data-cmd]');
            if (btn) {
                e.preventDefault();
                if (btn.dataset.cmd === 'foreColor') return; // handled by color input
                document.execCommand(btn.dataset.cmd, false, null);
                rteContent.focus();
            }
        });
        
        // Color picker
        const colorInput = document.querySelector('#rte-toolbar [data-cmd="foreColor"]');
        if (colorInput) {
            colorInput.addEventListener('input', () => {
                document.execCommand('foreColor', false, colorInput.value);
            });
        }

        // Format block (headings)
        const formatSelect = document.querySelector('#rte-toolbar [data-format="formatBlock"]');
        if (formatSelect) {
            formatSelect.addEventListener('change', () => {
                document.execCommand('formatBlock', false, formatSelect.value);
                rteContent.focus();
            });
        }

        // Link button
        document.getElementById('rte-link-btn')?.addEventListener('click', () => {
            const url = prompt('Enter URL:');
            if (url) document.execCommand('createLink', false, url);
            rteContent.focus();
        });
        
        const form = document.getElementById('campaign-form');
        const aiMagicBtn = document.getElementById('ai-magic-btn');
        const aiGoalInput = document.getElementById('ai-goal');
        const aiPainPointInput = document.getElementById('ai-pain-point');
        const subjectInput = form.querySelector('[name="subject"]');

        aiMagicBtn.onclick = async () => {
            const goal = aiGoalInput.value.trim();
            const pain_point = aiPainPointInput.value.trim();
            if (!goal) {
                showToast('Please describe your campaign goal first!', 'info');
                return;
            }

            aiMagicBtn.disabled = true;
            aiMagicBtn.textContent = 'Generating...';

            try {
                const res = await campaignsApi.generateAI({ goal, pain_point });
                subjectInput.value = res.subject;
                rteContent.innerHTML = res.content || '';
                showToast('Campaign draft generated! ✨', 'success');
            } catch (err) {
                showToast('AI Generation failed: ' + err.message, 'error');
            } finally {
                aiMagicBtn.disabled = false;
                aiMagicBtn.textContent = 'Magic Draft ✨';
            }
        };

        const statusSelect = form.querySelector('[name="status"]');
        const updateScheduleVisibility = () => {
            const scheduleField = document.getElementById('schedule-field');
            const scheduleInput = document.getElementById('scheduled_at_input');
            const isScheduled = statusSelect.value === 'scheduled';
            scheduleField.style.display = isScheduled ? 'block' : 'none';
            if (isScheduled) {
                scheduleInput.setAttribute('required', 'true');
            } else {
                scheduleInput.removeAttribute('required');
            }
        };

        statusSelect.onchange = updateScheduleVisibility;
        // Initial check for edit mode
        updateScheduleVisibility();

        document.getElementById('modal-overlay').onclick = (e) => {
            if (e.target.id === 'modal-overlay') modalContainer.innerHTML = '';
        };

        document.getElementById('campaign-form').onsubmit = async (e) => {
            e.preventDefault();
            const hiddenContent = document.getElementById('hidden-content');
            hiddenContent.value = rteContent.innerHTML;

            const formData = new FormData(e.target);
            const rawData = Object.fromEntries(formData.entries());
            
            // Numeric conversions
            const data = {
                ...rawData,
                account_id: JSON.parse(localStorage.getItem('camp_user') || '{}').id || 1,
                open_rate: parseFloat(rawData.open_rate) || 0,
                ctr: parseFloat(campaign?.ctr || 0),
                conversions: parseFloat(campaign?.conversions || 0),
                scheduled_at: rawData.scheduled_at ? new Date(rawData.scheduled_at).toISOString() : null,
                is_personalized: form.querySelector('[name="is_personalized"]').checked,
                target_folder: rawData.target_folder || ""
            };

            try {
                if (isEdit) {
                    await campaignsApi.update(campaign.id, data);
                } else {
                    await campaignsApi.create(data);
                }
                window.location.reload();
            } catch (err) {
                showToast('Action failed: ' + err.message, 'error');
            }
        };
    };

    if (createBtn) {
        createBtn.onclick = () => renderModal();
    }
}
