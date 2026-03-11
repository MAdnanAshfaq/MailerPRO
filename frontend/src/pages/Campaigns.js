import { campaignsApi } from '../api';

let allCampaigns = [];
let renderCampaignsTable = null;

export async function Campaigns() {
    try {
        allCampaigns = await campaignsApi.list();
    } catch (e) {
        console.error('Failed to fetch campaigns', e);
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

            <div class="card" style="padding: 0; overflow: hidden;">
                <table class="campaign-table">
                    <thead>
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
                    <span class="status-badge ${campaign.status === 'sent' ? 'status-sent' : (campaign.status === 'paused' ? 'status-paused' : 'status-draft')}">
                        ${campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                </td>
                <td style="font-weight: 700;">${campaign.open_rate}%</td>
                <td style="font-weight: 700;">${campaign.ctr}%</td>
                <td style="font-weight: 700;">${campaign.conversions}%</td>
                <td>
                    <button class="btn btn-outline edit-campaign-btn" data-id="${campaign.id}" style="padding: 0.4rem 0.8rem; font-size: 0.8125rem;">Edit</button>
                </td>
            </tr>
        `).join('') + (campaignsToRender.length === 0 ? '<tr><td colspan="6" style="text-align: center; padding: 3rem;" class="text-muted">No campaigns found for this view.</td></tr>' : '');

        // Reattach listeners
        document.querySelectorAll('.edit-campaign-btn').forEach(btn => {
            btn.onclick = (e) => {
                const id = e.target.dataset.id;
                const campaign = allCampaigns.find(c => c.id == id);
                if (campaign) renderModal(campaign);
            };
        });
    };

    // Initial render
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
            if (filter === 'all') {
                renderCampaignsTable(allCampaigns);
            } else {
                renderCampaignsTable(allCampaigns.filter(c => c.status === filter));
            }
        };
    });

    const renderModal = (campaign = null) => {
        const isEdit = !!campaign;
        modalContainer.innerHTML = `
            <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;" id="modal-overlay">
                <div class="card" style="width: 100%; max-width: 600px; padding: 2rem;">
                    <h2 class="mb-6">${isEdit ? 'Edit Campaign' : 'Create New Campaign'}</h2>
                    <form id="campaign-form">
                        <div class="mb-6 p-4" style="background: var(--bg-main); border: 1px dashed var(--primary); border-radius: var(--radius); text-align: center;">
                            <p style="font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1rem;">Let AI draft your campaign for you!</p>
                            <div class="flex gap-2">
                                <input type="text" id="ai-goal" class="input" placeholder="e.g. Welcome email for new subscribers" style="flex: 1; padding: 0.5rem;">
                                <button type="button" class="btn btn-primary" id="ai-magic-btn" style="padding: 0.5rem 1rem;">Magic Draft ✨</button>
                            </div>
                        </div>
                        <div class="mb-4">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Campaign Name</label>
                            <input type="text" name="name" class="input" required placeholder="Summer Sale 2026" value="${campaign?.name || ''}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                        </div>
                        <div class="mb-4">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Email Subject</label>
                            <input type="text" name="subject" class="input" required placeholder="Our biggest sale ever!" value="${campaign?.subject || ''}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                        </div>
                        <div class="mb-4">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Content (HTML)</label>
                            <textarea name="content" class="input" required placeholder="<h1>Hello!</h1>" style="width: 100%; min-height: 150px; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">${campaign?.content || ''}</textarea>
                        </div>
                        <div class="grid-2 mb-8" style="grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Status</label>
                                <select name="status" class="input" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                                    <option value="draft" ${campaign?.status === 'draft' ? 'selected' : ''}>Draft</option>
                                    <option value="sent" ${campaign?.status === 'sent' ? 'selected' : ''}>Sent</option>
                                    <option value="paused" ${campaign?.status === 'paused' ? 'selected' : ''}>Paused</option>
                                    <option value="scheduled" ${campaign?.status === 'scheduled' ? 'selected' : ''}>Scheduled</option>
                                </select>
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Open Rate (%)</label>
                                <input type="number" step="0.1" name="open_rate" class="input" value="${campaign?.open_rate || 0}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                            </div>
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
        
        const aiMagicBtn = document.getElementById('ai-magic-btn');
        const aiGoalInput = document.getElementById('ai-goal');
        const subjectInput = form.querySelector('[name="subject"]');
        const contentArea = form.querySelector('[name="content"]');

        aiMagicBtn.onclick = async () => {
            const goal = aiGoalInput.value.trim();
            if (!goal) {
                alert('Please describe your campaign goal first!');
                return;
            }

            aiMagicBtn.disabled = true;
            aiMagicBtn.textContent = 'Generating...';

            try {
                const res = await campaignsApi.generateAI({ goal });
                subjectInput.value = res.subject;
                contentArea.value = res.content;
                alert('Campaign draft generated! ✨');
            } catch (err) {
                alert('AI Generation failed: ' + err.message);
            } finally {
                aiMagicBtn.disabled = false;
                aiMagicBtn.textContent = 'Magic Draft ✨';
            }
        };

        document.getElementById('modal-overlay').onclick = (e) => {
            if (e.target.id === 'modal-overlay') modalContainer.innerHTML = '';
        };

        document.getElementById('campaign-form').onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const rawData = Object.fromEntries(formData.entries());
            
            // Numeric conversions
            const data = {
                ...rawData,
                open_rate: parseFloat(rawData.open_rate) || 0,
                ctr: parseFloat(campaign?.ctr || 0),
                conversions: parseFloat(campaign?.conversions || 0)
            };

            try {
                if (isEdit) {
                    await campaignsApi.update(campaign.id, data);
                } else {
                    await campaignsApi.create(data);
                }
                window.location.reload();
            } catch (err) {
                alert('Action failed: ' + err.message);
            }
        };
    };

    if (createBtn) {
        createBtn.onclick = () => renderModal();
    }
}
