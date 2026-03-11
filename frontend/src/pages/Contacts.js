import { contactsApi } from '../api';

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

    // --- Import Logic ---
    if (importBtn && importFile) {
        importBtn.onclick = () => importFile.click();
        
        importFile.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            importBtn.classList.add('loading');
            
            const reader = new FileReader();
            reader.onload = async (evt) => {
                try {
                    const data = new Uint8Array(evt.target.result);
                    // Use XLSX from global injected via HTML
                    const workbook = window.XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const rows = window.XLSX.utils.sheet_to_json(sheet);
                    
                    let count = 0;
                    let errors = 0;
                    for (const row of rows) {
                        try {
                            console.log(`Processing import row ${count + 1}/${rows.length}...`);
                            const email = row.Email || row.email || row.EMAIL || row['Email Address'] || row['Contact Email'];
                            if (!email) continue;
                            
                            // Try to extract Fname/Lname
                            let fname = row['First Name'] || row.first_name || row.fname || row.FNAME || row['Given Name'] || '';
                            let lname = row['Last Name'] || row.last_name || row.lname || row.LNAME || row['Family Name'] || '';
                            
                            // Basic fallback if only "Name" exists
                            if (!fname && !lname) {
                                const nameVal = row.Name || row.name || row.NAME || row['Full Name'] || row.Contact || '';
                                if (nameVal) {
                                    const parts = nameVal.trim().split(' ');
                                    fname = parts[0];
                                    lname = parts.slice(1).join(' ');
                                }
                            }

                            // Tags handling
                            const tagsRaw = row.Tags || row.tags || row.TAGS || row['Segments'] || '';
                            const tagList = tagsRaw ? String(tagsRaw).split(',').map(t => ({ text: t.trim() })).filter(t => t.text) : [];

                            await contactsApi.create({
                                first_name: fname,
                                last_name: lname,
                                email: email.trim().toLowerCase(),
                                phone: String(row.Phone || row.phone || row.PHONE || row.Mobile || row['Phone Number'] || ''),
                                tags: tagList
                            });
                            count++;
                        } catch (err) {
                            console.error('Row import failed:', err);
                            errors++;
                        }
                    }
                    
                    importBtn.classList.remove('loading');
                    if (errors > 0) {
                        alert(`Import finished: ${count} successful, ${errors} failed. Check console for details.`);
                        console.warn(`Import partially failed with ${errors} errors.`);
                    } else {
                        alert(`Successfully imported ${count} contacts.`);
                        console.log(`Import completed successfully: ${count} rows.`);
                    }
                    window.location.reload();
                } catch (err) {
                    importBtn.classList.remove('loading');
                    alert('Import failed: ' + err.message);
                    console.error('Import error:', err);
                }
            };
            reader.readAsArrayBuffer(file);
        };
    }

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
                alert('Action failed: ' + err.message);
            }
        };
    };

    const addBtn = document.getElementById('add-contact-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => renderModal());
    }
}
