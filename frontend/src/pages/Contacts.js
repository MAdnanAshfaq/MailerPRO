import { contactsApi } from '../api';
import { showToast } from '../utils/toast';

let allContacts = [];
let renderTable = null;

export async function Contacts() {
    try {
        allContacts = await contactsApi.list();
    } catch (e) {
        console.error('Failed to fetch contacts', e);
    }

    // Attach search listener via setTimeout since it's injected HTML
    setTimeout(() => {
        const searchInput = document.getElementById('contact-search');
        if (searchInput) {
            searchInput.oninput = (e) => {
                const term = e.target.value.toLowerCase();
                const filtered = allContacts.filter(c => 
                    (c.first_name && c.first_name.toLowerCase().includes(term)) ||
                    (c.last_name && c.last_name.toLowerCase().includes(term)) ||
                    c.email.toLowerCase().includes(term) ||
                    (c.tags && c.tags.some(t => t.text.toLowerCase().includes(term)))
                );
                renderTable(filtered);
            };
        }
    }, 100);

    return `
        <div class="main-content">
            <header class="flex justify-between items-center mb-8">
                <div>
                    <h1 style="font-size: 2rem;">Contacts</h1>
                    <p class="text-muted">Manage your subscribers and their segments.</p>
                </div>
                <div class="flex gap-4 items-center">
                    <div style="position: relative;">
                        <input type="text" id="contact-search" placeholder="Search contacts..." class="input" style="padding-left: 2rem; width: 250px; border-radius: var(--radius-sm);">
                        <span style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 0.8rem;">🔍</span>
                    </div>
                    <input type="file" id="import-file" accept=".xlsx, .xls, .csv" style="display: none;">
                    <button class="btn btn-outline" id="import-btn">📥 Import</button>
                    <button class="btn btn-primary" id="add-contact-btn">
                        <span>+</span> Add Contact
                    </button>
                </div>
            </header>

            <div class="card" style="padding: 0; overflow: hidden;">
                <table class="campaign-table">
                    <thead>
                        <tr>
                            <th>Name ⌵</th>
                            <th>Email ⌵</th>
                            <th>Tags ⌵</th>
                            <th>Joined ⌵</th>
                            <th>Actions ⌵</th>
                        </tr>
                    </thead>
                    <tbody id="contacts-list-body">
                        <!-- Rendered dynamically -->
                    </tbody>
                </table>
            </div>

            <div id="modal-container"></div>
            
            <style>
                #import-btn.loading { position: relative; color: transparent; pointer-events: none; }
                #import-btn.loading::after { content: "⏳"; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); color: var(--text-main); font-size: 1rem; animation: spin 1s linear infinite; }
            </style>
        </div>
    `;
}

export function initContacts() {
    const tbody = document.getElementById('contacts-list-body');
    const modalContainer = document.getElementById('modal-container');
    const importBtn = document.getElementById('import-btn');
    const importFile = document.getElementById('import-file');

    renderTable = (contactsToRender) => {
        if (!tbody) return;
        tbody.innerHTML = contactsToRender.map(contact => `
            <tr>
                <td style="font-weight: 700;">
                    ${(contact.first_name || contact.last_name) ? `${contact.first_name || ''} ${contact.last_name || ''}` : `<span class="text-muted" style="font-weight: 400; font-style: italic;">${contact.email.split('@')[0]} (No Name)</span>`}
                </td>
                <td class="text-muted">${contact.email}</td>
                <td>
                    <div class="flex gap-1 flex-wrap">
                        ${contact.tags && contact.tags.length > 0 ? contact.tags.map(tag => `<span class="status-badge" style="background: rgba(138, 154, 91, 0.1); color: var(--primary); font-size: 0.65rem;">${tag.text}</span>`).join('') : '<span class="text-muted" style="font-size: 0.75rem;">None</span>'}
                    </div>
                </td>
                <td class="text-muted">${new Date(contact.created_at).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-outline edit-contact-btn" data-id="${contact.id}" style="padding: 0.4rem 0.8rem; font-size: 0.8125rem;">Edit</button>
                </td>
            </tr>
        `).join('') + (contactsToRender.length === 0 ? '<tr><td colspan="5" style="text-align: center; padding: 3rem;" class="text-muted">No contacts found.</td></tr>' : '');

        // Reattach edit listeners
        document.querySelectorAll('.edit-contact-btn').forEach(btn => {
            btn.onclick = (e) => {
                const id = e.target.dataset.id;
                const contact = allContacts.find(c => c.id == id);
                if (contact) renderModal(contact);
            };
        });
    };

    // Initial render
    renderTable(allContacts);

    // --- Smart Import Logic ---
    if (importBtn && importFile) {
        importBtn.onclick = () => importFile.click();
        
        importFile.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = async (evt) => {
                try {
                    const data = new Uint8Array(evt.target.result);
                    const workbook = window.XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const rows = window.XLSX.utils.sheet_to_json(sheet);
                    
                    if (rows.length === 0) {
                        showToast('The file is empty.', 'error');
                        return;
                    }

                    const headers = Object.keys(rows[0]);
                    renderMappingModal(headers, rows);
                } catch (err) {
                    showToast('Failed to read file: ' + err.message, 'error');
                }
            };
            reader.readAsArrayBuffer(file);
        };
    }

    const renderMappingModal = (headers, rows) => {
        // Fuzzy matching for initial guesses
        const guess = (h, targets) => {
            const lowerH = h.toLowerCase().replace(/[^a-z]/g, '');
            return targets.some(t => lowerH.includes(t.toLowerCase()) || t.toLowerCase().includes(lowerH));
        };

        const initialMapping = {
            email: headers.find(h => guess(h, ['email', 'mail', 'addr'])) || '',
            first_name: headers.find(h => guess(h, ['first', 'fname', 'given', 'name', 'full'])) || '',
            last_name: headers.find(h => guess(h, ['last', 'lname', 'sur'])) || '',
            phone: headers.find(h => guess(h, ['phone', 'mobile', 'tel'])) || '',
            tags: headers.find(h => guess(h, ['tag', 'segment', 'label'])) || ''
        };

        modalContainer.innerHTML = `
            <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000;" id="mapping-overlay">
                <div class="card" style="width: 100%; max-width: 600px; padding: 2rem; max-height: 90vh; overflow-y: auto;">
                    <h2 class="mb-2">Map Columns</h2>
                    <p class="text-muted mb-6">Tell us which columns match our contact fields.</p>
                    
                    <div class="mb-6" style="background: rgba(0,0,0,0.05); padding: 1rem; border-radius: var(--radius-sm); font-size: 0.8rem;">
                        <strong>Preview (Row 1):</strong>
                        <div style="overflow-x: auto; margin-top: 0.5rem; color: var(--text-muted);">
                            ${headers.map(h => `<span style="display: inline-block; margin-right: 1rem;"><strong>${h}:</strong> ${rows[0][h] || '-'}</span>`).join('')}
                        </div>
                    </div>

                    <form id="mapping-form">
                        ${['Email (Required)', 'First Name', 'Last Name', 'Phone', 'Tags'].map((label, idx) => {
                            const fieldKey = ['email', 'first_name', 'last_name', 'phone', 'tags'][idx];
                            return `
                                <div class="mb-4 flex items-center justify-between">
                                    <label style="font-weight: 700; flex: 1;">${label}</label>
                                    <select name="${fieldKey}" class="input" style="flex: 1.5; padding: 0.5rem;">
                                        <option value="">-- Skip --</option>
                                        ${headers.map(h => `<option value="${h}" ${initialMapping[fieldKey] === h ? 'selected' : ''}>${h}</option>`).join('')}
                                    </select>
                                </div>
                            `;
                        }).join('')}
                        
                        <div class="flex justify-between mt-8" style="gap: 1rem;">
                            <button type="button" class="btn btn-outline" id="close-mapping" style="flex: 1;">Cancel</button>
                            <button type="submit" class="btn btn-primary" id="confirm-import" style="flex: 1;">Start Import (${rows.length} rows)</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.getElementById('close-mapping').onclick = () => {
            modalContainer.innerHTML = '';
            importFile.value = '';
        };

        document.getElementById('mapping-form').onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const mapping = Object.fromEntries(formData.entries());

            if (!mapping.email) {
                showToast('Email mapping is required!', 'error');
                return;
            }

            const confirmBtn = document.getElementById('confirm-import');
            confirmBtn.disabled = true;
            confirmBtn.innerText = 'Importing...';

            let count = 0;
            let errors = 0;

            for (const row of rows) {
                try {
                    const email = row[mapping.email];
                    if (!email) continue;

                    const tagsRaw = mapping.tags ? row[mapping.tags] : '';
                    const tagList = tagsRaw ? String(tagsRaw).split(',').map(t => ({ text: t.trim() })).filter(t => t.text) : [];

                    await contactsApi.create({
                        first_name: String(mapping.first_name ? row[mapping.first_name] || '' : ''),
                        last_name: String(mapping.last_name ? row[mapping.last_name] || '' : ''),
                        email: String(email).trim().toLowerCase(),
                        phone: String(mapping.phone ? row[mapping.phone] || '' : ''),
                        tags: tagList
                    });
                    count++;
                } catch (err) {
                    console.error('Row import failed:', err);
                    errors++;
                }
            }

            modalContainer.innerHTML = '';
            showToast(`Import finished: ${count} successful, ${errors} failed.`, errors > 0 ? 'error' : 'success');
            window.location.reload();
        };
    };

    const renderModal = (contact = null) => {
        const isEdit = !!contact;
        modalContainer.innerHTML = `
            <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;" id="modal-overlay">
                <div class="card" style="width: 100%; max-width: 500px; padding: 2rem;">
                    <h2 class="mb-6">${isEdit ? 'Edit Contact' : 'Add New Contact'}</h2>
                    <form id="contact-form">
                        <div class="mb-4">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">First Name</label>
                            <input type="text" name="first_name" class="input" required placeholder="John" value="${contact?.first_name || ''}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                        </div>
                        <div class="mb-4">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Last Name</label>
                            <input type="text" name="last_name" class="input" required placeholder="Doe" value="${contact?.last_name || ''}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                        </div>
                        <div class="mb-4">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Email Address</label>
                            <input type="email" name="email" class="input" required placeholder="john@example.com" value="${contact?.email || ''}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                        </div>
                        <div class="mb-8">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Phone Number</label>
                            <input type="text" name="phone" class="input" placeholder="+1 (555) 000-0000" value="${contact?.phone || ''}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                        </div>
                        <div class="flex justify-between mt-8" style="gap: 1rem;">
                            <button type="button" class="btn btn-outline" id="close-modal" style="flex: 1;">Cancel</button>
                            <button type="submit" class="btn btn-primary" style="flex: 1;">${isEdit ? 'Update Contact' : 'Save Contact'}</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.getElementById('close-modal').onclick = () => modalContainer.innerHTML = '';
        document.getElementById('modal-overlay').onclick = (e) => {
            if (e.target.id === 'modal-overlay') modalContainer.innerHTML = '';
        };

        document.getElementById('contact-form').onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            try {
                if (isEdit) {
                    await contactsApi.update(contact.id, data);
                } else {
                    await contactsApi.create(data);
                }
                window.location.reload();
            } catch (err) {
                showToast('Action failed: ' + err.message, 'error');
            }
        };
    };

    const addBtn = document.getElementById('add-contact-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => renderModal());
    }
}
