import { contactsApi } from '../api';
import { showToast } from '../utils/toast';

let allContacts = [];
let renderTable = null;
let activeFolder = null; // null = All Contacts

export async function Contacts() {
    try {
        allContacts = await contactsApi.list();
    } catch (e) {
        console.error('Failed to fetch contacts', e);
    }

    setTimeout(() => {
        const searchInput = document.getElementById('contact-search');
        if (searchInput) {
            searchInput.oninput = (e) => {
                const term = e.target.value.toLowerCase();
                const base = activeFolder
                    ? allContacts.filter(c => c.tags && c.tags.some(t => t.text === activeFolder))
                    : allContacts;
                renderTable(base.filter(c =>
                    (c.first_name && c.first_name.toLowerCase().includes(term)) ||
                    (c.last_name && c.last_name.toLowerCase().includes(term)) ||
                    c.email.toLowerCase().includes(term) ||
                    (c.tags && c.tags.some(t => t.text.toLowerCase().includes(term)))
                ));
            };
        }
        initContacts();
    }, 50);

    return `
        <div class="main-content" style="display: flex; gap: 0; padding: 0; height: calc(100vh - 60px); overflow: hidden;">
            <!-- Folder Sidebar -->
            <aside id="folder-sidebar" style="width: 220px; min-width: 220px; background: var(--bg-card); border-right: 1px solid var(--border); overflow-y: auto; padding: 1.5rem 0;">
                <div style="padding: 0 1rem 1rem; font-size: 0.7rem; font-weight: 800; letter-spacing: 0.12em; color: var(--text-muted); text-transform: uppercase;">Folders</div>
                <div id="folder-list"></div>
                <div style="padding: 1rem; border-top: 1px solid var(--border); margin-top: 1rem;">
                    <button class="btn btn-outline" id="new-folder-btn" style="width: 100%; font-size: 0.8rem; padding: 0.5rem;">+ New Folder</button>
                </div>
            </aside>

            <!-- Main Table Area -->
            <div style="flex: 1; overflow-y: auto; padding: 2rem;">
                <header class="flex justify-between items-center mb-6">
                    <div>
                        <h1 id="folder-title" style="font-size: 1.75rem;">All Contacts</h1>
                        <p class="text-muted" id="folder-subtitle">Manage all your subscribers.</p>
                    </div>
                    <div class="flex gap-3 items-center">
                        <div style="position: relative;">
                            <input type="text" id="contact-search" placeholder="Search..." class="input" style="padding-left: 2rem; width: 200px; border-radius: var(--radius-sm);">
                            <span style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);">🔍</span>
                        </div>
                        <input type="file" id="import-file" accept=".xlsx,.xls,.csv,.json" style="display: none;">
                        <button class="btn btn-outline" id="import-btn">📥 Import</button>
                        <button class="btn btn-primary" id="add-contact-btn">+ Add Contact</button>
                    </div>
                </header>

                <div class="card" style="padding: 0; overflow: hidden;">
                    <table class="campaign-table">
                        <thead>
                            <tr>
                                <th style="width: 40px; padding-left: 1.5rem;">
                                    <input type="checkbox" id="select-all-contacts" class="checkbox-custom">
                                </th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Folders</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="contacts-list-body"></tbody>
                    </table>
                </div>
            </div>

            <!-- Bulk Actions Toolbar -->
            <div id="bulk-actions-bar" style="position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%) translateY(100px); background: var(--bg-card); border: 1px solid var(--primary); padding: 0.75rem 2rem; border-radius: 99px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 1.5rem; transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); z-index: 100;">
                <div style="font-size: 0.875rem; font-weight: 700; color: var(--primary);">
                    <span id="selected-count">0</span> Selected
                </div>
                <div style="height: 20px; width: 1px; background: var(--border);"></div>
                <div class="flex gap-2">
                    <button class="btn btn-outline" id="bulk-move-btn" style="font-size: 0.75rem; padding: 0.5rem 1rem;">📁 Move to Folder</button>
                    <button class="btn btn-outline" id="bulk-delete-btn" style="font-size: 0.75rem; padding: 0.5rem 1rem; color: #dc3545; border-color: #dc3545;">🗑️ Delete</button>
                </div>
                <button id="cancel-selection" style="background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 4px;">✕</button>
            </div>

            <div id="modal-container"></div>
        </div>
    `;
}

export function initContacts() {
    const tbody = document.getElementById('contacts-list-body');
    const modalContainer = document.getElementById('modal-container');
    const importBtn = document.getElementById('import-btn');
    const importFile = document.getElementById('import-file');

    const getCompanyName = (email) => {
        try {
            const domain = email.split('@')[1];
            if (!domain) return 'Unknown';
            const name = domain.split('.')[0];
            return name.charAt(0).toUpperCase() + name.slice(1);
        } catch { return 'Unknown'; }
    };

    // Derive unique folder names from all contacts' tags
    const getFolders = () => {
        const map = {};
        allContacts.forEach(c => {
            (c.tags || []).forEach(t => {
                if (!map[t.text]) map[t.text] = 0;
                map[t.text]++;
            });
        });
        return map; // { folderName: count }
    };

    const renderFolderSidebar = () => {
        const folderList = document.getElementById('folder-list');
        if (!folderList) return;
        const folders = getFolders();
        const sessionFolders = JSON.parse(sessionStorage.getItem('session_folders') || '[]');
        sessionFolders.forEach(f => { if (!folders[f]) folders[f] = 0; });

        const allCount = allContacts.length;

        const itemStyle = (name) => `
            display: flex; justify-content: space-between; align-items: center;
            padding: 0.55rem 1rem; cursor: pointer; border-radius: 0; font-size: 0.875rem;
            transition: background 0.15s;
            background: ${activeFolder === name ? 'rgba(138,154,91,0.15)' : 'transparent'};
            color: ${activeFolder === name ? 'var(--primary)' : 'var(--text-main)'};
            font-weight: ${activeFolder === name ? '700' : '400'};
            border-left: 3px solid ${activeFolder === name ? 'var(--primary)' : 'transparent'};
        `;

        folderList.innerHTML = `
            <div class="folder-item" data-folder="" style="${itemStyle(null)}">
                <span>📋 All Contacts</span>
                <span style="background: var(--bg-main); padding: 2px 8px; border-radius: 99px; font-size: 0.7rem; font-weight: 700;">${allCount}</span>
            </div>
            ${Object.entries(folders).map(([name, count]) => `
                <div class="folder-item" data-folder="${name}" style="${itemStyle(name)}" title="${name}">
                    <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;">📁 ${name}</span>
                    <div style="display: flex; align-items: center; gap: 4px; flex-shrink: 0;">
                        <span style="background: var(--bg-main); padding: 2px 8px; border-radius: 99px; font-size: 0.7rem; font-weight: 700;">${count}</span>
                        <button class="rename-folder-btn" data-folder="${name}" style="background: none; border: none; cursor: pointer; font-size: 0.75rem; padding: 2px 4px; color: var(--text-muted); opacity: 0.6;" title="Rename folder">✏️</button>
                    </div>
                </div>
            `).join('')}
        `;

        // Folder click
        folderList.querySelectorAll('.folder-item').forEach(item => {
            item.onclick = (e) => {
                if (e.target.closest('.rename-folder-btn')) return;
                const folder = item.dataset.folder || null;
                activeFolder = folder;
                const title = document.getElementById('folder-title');
                const subtitle = document.getElementById('folder-subtitle');
                if (title) title.textContent = folder || 'All Contacts';
                if (subtitle) subtitle.textContent = folder
                    ? `Contacts in folder "${folder}"`
                    : 'Manage all your subscribers.';
                renderFolderSidebar();
                const filtered = folder
                    ? allContacts.filter(c => c.tags && c.tags.some(t => t.text === folder))
                    : allContacts;
                renderTable(filtered);
            };
        });

        // Rename folder
        folderList.querySelectorAll('.rename-folder-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const oldName = btn.dataset.folder;
                renderRenameModal(oldName);
            };
        });
    };

    const renderRenameModal = (oldName) => {
        modalContainer.innerHTML = `
            <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 2000;" id="rename-modal-overlay">
                <div class="card" style="width: 100%; max-width: 400px; padding: 2rem; border: 1px solid var(--primary);">
                    <h2 class="mb-4" style="font-size: 1.5rem;">Rename Folder</h2>
                    <p class="text-muted mb-6">Changing "${oldName}" will update all associated contacts.</p>
                    <div class="mb-6">
                        <input type="text" id="rename-folder-input" class="input" value="${oldName}" style="width: 100%; padding: 0.75rem;" autofocus>
                    </div>
                    <div class="flex justify-between" style="gap: 1rem;">
                        <button type="button" class="btn btn-outline" id="close-rename-modal" style="flex: 1;">Cancel</button>
                        <button type="button" class="btn btn-primary" id="confirm-rename-btn" style="flex: 1;">Rename</button>
                    </div>
                </div>
            </div>`;

        const overlay = document.getElementById('rename-modal-overlay');
        const input = document.getElementById('rename-folder-input');
        const confirmBtn = document.getElementById('confirm-rename-btn');

        const close = () => modalContainer.innerHTML = '';
        document.getElementById('close-rename-modal').onclick = close;
        overlay.onclick = (e) => { if (e.target === overlay) close(); };

        confirmBtn.onclick = async () => {
            const newName = input.value.trim();
            if (!newName || newName === oldName) return close();

            confirmBtn.disabled = true;
            confirmBtn.textContent = 'Updating...';

            const affected = allContacts.filter(c => c.tags && c.tags.some(t => t.text === oldName));
            let done = 0;
            for (const c of affected) {
                const newTags = c.tags.map(t => t.text === oldName ? { text: newName } : t);
                try {
                    await contactsApi.update(c.id, { ...c, tags: newTags });
                    c.tags = newTags;
                    done++;
                } catch (err) { console.error('Rename failed', err); }
            }
            if (activeFolder === oldName) activeFolder = newName;
            renderFolderSidebar();
            renderTable(activeFolder ? allContacts.filter(c => c.tags && c.tags.some(t => t.text === activeFolder)) : allContacts);
            showToast(`Renamed "${oldName}" → "${newName}" for ${done} contacts`, 'success');
            close();
        };
    };

    renderTable = (contactsToRender) => {
        if (!tbody) return;
        tbody.innerHTML = contactsToRender.map(contact => `
            <tr data-contact-id="${contact.id}">
                <td style="padding-left: 1.5rem;">
                    <input type="checkbox" class="contact-checkbox checkbox-custom" data-id="${contact.id}">
                </td>
                <td style="font-weight: 700;">
                    ${(contact.first_name || contact.last_name)
                        ? `${contact.first_name || ''} ${contact.last_name || ''}`.trim()
                        : `<span class="text-muted" style="font-weight: 400; font-style: italic;">${getCompanyName(contact.email)}</span>`}
                </td>
                <td class="text-muted">${contact.email}</td>
                <td>
                    <div class="flex gap-1 flex-wrap">
                        ${contact.tags && contact.tags.length > 0
                            ? contact.tags.map(tag => `<span class="status-badge" style="background: rgba(138,154,91,0.12); color: var(--primary); font-size: 0.65rem; cursor: pointer;" data-folder-jump="${tag.text}">${tag.text}</span>`).join('')
                            : '<span class="text-muted" style="font-size: 0.75rem;">—</span>'}
                    </div>
                </td>
                <td class="text-muted">${new Date(contact.created_at).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-outline edit-contact-btn" data-id="${contact.id}" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; margin-right: 0.4rem;">Edit</button>
                    <button class="btn btn-outline delete-contact-btn" data-id="${contact.id}" style="padding: 0.4rem 0.8rem; font-size: 0.8rem; color: #dc3545; border-color: #dc3545;">Delete</button>
                </td>
            </tr>
        `).join('') + (contactsToRender.length === 0
            ? '<tr><td colspan="6" style="text-align: center; padding: 3rem;" class="text-muted">No contacts in this folder.</td></tr>'
            : '');

        // Update bulk selection logic
        const selectAll = document.getElementById('select-all-contacts');
        const checkboxes = document.querySelectorAll('.contact-checkbox');
        const bulkBar = document.getElementById('bulk-actions-bar');
        const countBadge = document.getElementById('selected-count');

        const updateBulkBar = () => {
            const selected = Array.from(checkboxes).filter(cb => cb.checked).map(cb => parseInt(cb.dataset.id));
            if (selected.length > 0) {
                bulkBar.style.transform = 'translateX(-50%) translateY(0)';
                countBadge.textContent = selected.length;
            } else {
                bulkBar.style.transform = 'translateX(-50%) translateY(100px)';
            }
            if (selectAll) selectAll.checked = selected.length === checkboxes.length && checkboxes.length > 0;
        };

        if (selectAll) {
            selectAll.onchange = () => {
                checkboxes.forEach(cb => cb.checked = selectAll.checked);
                updateBulkBar();
            };
        }

        checkboxes.forEach(cb => {
            cb.onchange = updateBulkBar;
        });

        document.getElementById('cancel-selection').onclick = () => {
            checkboxes.forEach(cb => cb.checked = false);
            if (selectAll) selectAll.checked = false;
            updateBulkBar();
        };

        document.getElementById('bulk-delete-btn').onclick = async () => {
            const selected = Array.from(checkboxes).filter(cb => cb.checked).map(cb => parseInt(cb.dataset.id));
            if (!confirm(`Delete ${selected.length} contacts?`)) return;
            try {
                await contactsApi.bulkDelete(selected);
                allContacts = allContacts.filter(c => !selected.includes(c.id));
                showToast(`Deleted ${selected.length} contacts`, 'success');
                renderFolderSidebar();
                renderTable(activeFolder ? allContacts.filter(c => c.tags && c.tags.some(t => t.text === activeFolder)) : allContacts);
                updateBulkBar();
            } catch (err) {
                showToast('Bulk delete failed: ' + err.message, 'error');
            }
        };

        document.getElementById('bulk-move-btn').onclick = () => {
            const selected = Array.from(checkboxes).filter(cb => cb.checked).map(cb => parseInt(cb.dataset.id));
            renderMoveModal(selected);
        };
    };

    const renderMoveModal = (selectedIds) => {
        const folders = Object.keys(getFolders());
        modalContainer.innerHTML = `
            <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 2000;" id="move-modal-overlay">
                <div class="card" style="width: 100%; max-width: 450px; padding: 2rem; border: 1px solid var(--primary);">
                    <h2 class="mb-4">Move ${selectedIds.length} Contacts</h2>
                    <p class="text-muted mb-6">Select an existing folder or create a new one.</p>
                    
                    <div class="mb-6">
                        <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--primary);">Select Folder</label>
                        <select id="folder-select" class="input" style="width: 100%; padding: 0.75rem;">
                            <option value="">-- Choose existing --</option>
                            ${folders.map(f => `<option value="${f}">${f}</option>`).join('')}
                        </select>
                    </div>

                    <div class="mb-8">
                        <label style="display: block; font-size: 0.8rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--primary);">Or New Folder</label>
                        <input type="text" id="new-folder-input" class="input" placeholder="e.g. VIP Clients" style="width: 100%; padding: 0.75rem;">
                    </div>

                    <div class="flex justify-between" style="gap: 1rem;">
                        <button type="button" class="btn btn-outline" id="close-move-modal" style="flex: 1;">Cancel</button>
                        <button type="button" class="btn btn-primary" id="confirm-move-btn" style="flex: 1;">Move Contacts</button>
                    </div>
                </div>
            </div>`;

        const overlay = document.getElementById('move-modal-overlay');
        const select = document.getElementById('folder-select');
        const input = document.getElementById('new-folder-input');
        const confirmBtn = document.getElementById('confirm-move-btn');

        const close = () => modalContainer.innerHTML = '';
        document.getElementById('close-move-modal').onclick = close;
        overlay.onclick = (e) => { if (e.target === overlay) close(); };

        confirmBtn.onclick = async () => {
            const folder = input.value.trim() || select.value;
            if (!folder) return showToast('Please select or enter a folder.', 'error');

            confirmBtn.disabled = true;
            confirmBtn.textContent = 'Moving...';

            try {
                await contactsApi.bulkMove(selectedIds, folder);
                selectedIds.forEach(id => {
                    const c = allContacts.find(x => x.id === id);
                    if (c) {
                        if (!c.tags) c.tags = [];
                        if (!c.tags.some(t => t.text === folder)) c.tags.push({ text: folder });
                    }
                });
                showToast(`Moved ${selectedIds.length} contacts to "${folder}"`, 'success');
                renderFolderSidebar();
                renderTable(activeFolder ? allContacts.filter(c => c.tags && c.tags.some(t => t.text === activeFolder)) : allContacts);
                
                // Hide bulk bar
                const bulkBar = document.getElementById('bulk-actions-bar');
                if (bulkBar) bulkBar.style.transform = 'translateX(-50%) translateY(100px)';
                
                close();
            } catch (err) {
                showToast('Move failed: ' + err.message, 'error');
                confirmBtn.disabled = false;
                confirmBtn.textContent = 'Move Contacts';
            }
        };
    };

        // Click folder badge → jump to that folder
        tbody.querySelectorAll('[data-folder-jump]').forEach(badge => {
            badge.onclick = () => {
                activeFolder = badge.dataset.folderJump;
                renderFolderSidebar();
                const title = document.getElementById('folder-title');
                const subtitle = document.getElementById('folder-subtitle');
                if (title) title.textContent = activeFolder;
                if (subtitle) subtitle.textContent = `Contacts in folder "${activeFolder}"`;
                renderTable(allContacts.filter(c => c.tags && c.tags.some(t => t.text === activeFolder)));
            };
        });

        document.querySelectorAll('.edit-contact-btn').forEach(btn => {
            btn.onclick = (e) => {
                const id = e.target.dataset.id;
                const contact = allContacts.find(c => c.id == id);
                if (contact) renderModal(contact);
            };
        });

        document.querySelectorAll('.delete-contact-btn').forEach(btn => {
            btn.onclick = async (e) => {
                if (!confirm('Delete this contact?')) return;
                const id = e.target.dataset.id;
                try {
                    await contactsApi.delete(id);
                    allContacts = allContacts.filter(c => c.id != id);
                    renderFolderSidebar();
                    renderTable(activeFolder ? allContacts.filter(c => c.tags && c.tags.some(t => t.text === activeFolder)) : allContacts);
                    showToast('Contact deleted', 'success');
                } catch (err) {
                    showToast('Failed to delete: ' + err.message, 'error');
                }
            };
        });
    };

    // Initial render
    renderFolderSidebar();
    renderTable(allContacts);

    // New folder button
    document.getElementById('new-folder-btn')?.addEventListener('click', () => renderNewFolderModal());

    const renderNewFolderModal = () => {
        modalContainer.innerHTML = `
            <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 2000;" id="new-folder-overlay">
                <div class="card" style="width: 100%; max-width: 400px; padding: 2rem; border: 1px solid var(--primary);">
                    <h2 class="mb-4">New Folder</h2>
                    <p class="text-muted mb-6">Create a new segment for your contacts.</p>
                    <div class="mb-6">
                        <input type="text" id="new-folder-name-input" class="input" placeholder="e.g. Q4 Leads" style="width: 100%; padding: 0.75rem;" autofocus>
                    </div>
                    <div class="flex justify-between" style="gap: 1rem;">
                        <button type="button" class="btn btn-outline" id="close-new-folder-modal" style="flex: 1;">Cancel</button>
                        <button type="button" class="btn btn-primary" id="confirm-new-folder-btn" style="flex: 1;">Create</button>
                    </div>
                </div>
            </div>`;

        const overlay = document.getElementById('new-folder-overlay');
        const input = document.getElementById('new-folder-name-input');
        const confirmBtn = document.getElementById('confirm-new-folder-btn');

        const close = () => modalContainer.innerHTML = '';
        document.getElementById('close-new-folder-modal').onclick = close;
        overlay.onclick = (e) => { if (e.target === overlay) close(); };

        confirmBtn.onclick = () => {
            const name = input.value.trim();
            if (!name) return close();

            const existing = getFolders();
            if (existing[name]) {
                showToast(`Folder "${name}" already exists.`, 'info');
                return close();
            }
            
            activeFolder = name;
            const title = document.getElementById('folder-title');
            const subtitle = document.getElementById('folder-subtitle');
            if (title) title.textContent = name;
            if (subtitle) subtitle.textContent = `New folder "${name}" created. Add contacts to see them here.`;
            
            const sessionFolders = JSON.parse(sessionStorage.getItem('session_folders') || '[]');
            if (!sessionFolders.includes(name)) {
                sessionFolders.push(name);
                sessionStorage.setItem('session_folders', JSON.stringify(sessionFolders));
            }
            
            renderFolderSidebar();
            renderTable([]);
            showToast(`Folder "${name}" created!`, 'success');
            close();
        };
    };

    // Add contact
    document.getElementById('add-contact-btn')?.addEventListener('click', () => renderModal(null));

    // Import
    if (importBtn && importFile) {
        importBtn.onclick = () => importFile.click();
        importFile.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async (evt) => {
                try {
                    let rows = [];
                    if (file.name.endsWith('.json')) {
                        const content = new TextDecoder().decode(evt.target.result);
                        rows = JSON.parse(content);
                        if (!Array.isArray(rows)) rows = [rows];
                    } else {
                        const data = new Uint8Array(evt.target.result);
                        const workbook = window.XLSX.read(data, { type: 'array' });
                        const sheet = workbook.Sheets[workbook.SheetNames[0]];
                        rows = window.XLSX.utils.sheet_to_json(sheet);
                    }
                    if (rows.length === 0) { showToast('File is empty.', 'error'); return; }
                    renderMappingModal(Object.keys(rows[0]), rows);
                } catch (err) { showToast('Failed to read file: ' + err.message, 'error'); }
            };
            reader.readAsArrayBuffer(file);
        };
    }

    const renderMappingModal = (headers, rows) => {
        const guess = (h, targets) => {
            const lH = h.toLowerCase().replace(/[^a-z]/g, '');
            return targets.some(t => lH.includes(t) || t.includes(lH));
        };
        const init = {
            email: headers.find(h => guess(h, ['email','mail','addr'])) || '',
            first_name: headers.find(h => guess(h, ['first','fname','given','name','full'])) || '',
            last_name: headers.find(h => guess(h, ['last','lname','sur'])) || '',
            phone: headers.find(h => guess(h, ['phone','mobile','tel'])) || '',
            tags: headers.find(h => guess(h, ['tag','folder','segment','list','label'])) || ''
        };

        modalContainer.innerHTML = `
            <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000;">
                <div class="card" style="width: 100%; max-width: 560px; padding: 2rem; max-height: 90vh; overflow-y: auto;">
                    <h2 class="mb-2">Map Columns</h2>
                    <p class="text-muted mb-6">Match your file's columns to contact fields.</p>
                    <form id="mapping-form">
                        ${['Email (Required)', 'First Name', 'Last Name', 'Phone', 'Folders'].map((label, idx) => {
                            const key = ['email','first_name','last_name','phone','tags'][idx];
                            return `<div class="mb-4 flex items-center justify-between">
                                <label style="font-weight: 700; flex: 1;">${label}</label>
                                <select name="${key}" class="input" style="flex: 1.5; padding: 0.5rem;">
                                    <option value="">-- Skip --</option>
                                    ${headers.map(h => `<option value="${h}" ${init[key]===h?'selected':''}>${h}</option>`).join('')}
                                </select>
                            </div>`;
                        }).join('')}
                        <div class="flex justify-between mt-6" style="gap: 1rem;">
                            <button type="button" class="btn btn-outline" id="close-mapping" style="flex: 1;">Cancel</button>
                            <button type="submit" class="btn btn-primary" id="confirm-import" style="flex: 1;">Import ${rows.length} rows</button>
                        </div>
                    </form>
                </div>
            </div>`;

        document.getElementById('close-mapping').onclick = () => { modalContainer.innerHTML = ''; importFile.value = ''; };
        document.getElementById('mapping-form').onsubmit = async (e) => {
            e.preventDefault();
            const mapping = Object.fromEntries(new FormData(e.target).entries());
            if (!mapping.email) { showToast('Email mapping required!', 'error'); return; }
            const btn = document.getElementById('confirm-import');
            btn.disabled = true;
            let count = 0, errors = 0;
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
                    btn.textContent = `Importing (${count}/${rows.length})...`;
                } catch { errors++; }
            }
            modalContainer.innerHTML = '';
            showToast(`Import done: ${count} added, ${errors} failed.`, errors > 0 ? 'error' : 'success');
            allContacts = await contactsApi.list();
            renderFolderSidebar();
            renderTable(allContacts);
        };
    };

    const renderModal = (contact = null) => {
        const isEdit = !!contact;
        const currentFolders = (contact?.tags || []).map(t => t.text).join(', ');
        modalContainer.innerHTML = `
            <div style="position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;" id="modal-overlay">
                <div class="card" style="width: 100%; max-width: 500px; padding: 2rem;">
                    <h2 class="mb-6">${isEdit ? 'Edit Contact' : 'Add Contact'}</h2>
                    <form id="contact-form">
                        <div class="mb-4">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">First Name</label>
                            <input type="text" name="first_name" class="input" placeholder="John" value="${contact?.first_name || ''}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                        </div>
                        <div class="mb-4">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Last Name</label>
                            <input type="text" name="last_name" class="input" placeholder="Doe" value="${contact?.last_name || ''}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                        </div>
                        <div class="mb-4">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Email</label>
                            <input type="email" name="email" class="input" required placeholder="john@example.com" value="${contact?.email || ''}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                        </div>
                        <div class="mb-4">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">Phone</label>
                            <input type="text" name="phone" class="input" placeholder="+1 (555) 000-0000" value="${contact?.phone || ''}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                        </div>
                        <div class="mb-8">
                            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 700;">📁 Folders <span style="font-weight: 400; color: var(--text-muted);">(comma-separated)</span></label>
                            <input type="text" name="folders_raw" class="input" placeholder="Leads, Warm, Q2 Prospects" value="${currentFolders}" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border); border-radius: var(--radius);">
                        </div>
                        <div class="flex justify-between mt-6" style="gap: 1rem;">
                            <button type="button" class="btn btn-outline" id="close-modal" style="flex: 1;">Cancel</button>
                            <button type="submit" class="btn btn-primary" style="flex: 1;">${isEdit ? 'Update' : 'Save'}</button>
                        </div>
                    </form>
                </div>
            </div>`;

        document.getElementById('close-modal').onclick = () => modalContainer.innerHTML = '';
        document.getElementById('modal-overlay').onclick = (e) => { if (e.target.id === 'modal-overlay') modalContainer.innerHTML = ''; };

        document.getElementById('contact-form').onsubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const raw = Object.fromEntries(formData.entries());
            const foldersRaw = raw.folders_raw || '';
            const tags = foldersRaw.split(',').map(t => t.trim()).filter(Boolean).map(t => ({ text: t }));
            const data = { first_name: raw.first_name, last_name: raw.last_name, email: raw.email, phone: raw.phone, tags };
            try {
                if (isEdit) {
                    await contactsApi.update(contact.id, data);
                    // Update in-memory
                    const idx = allContacts.findIndex(c => c.id === contact.id);
                    if (idx !== -1) allContacts[idx] = { ...allContacts[idx], ...data };
                    showToast('Contact updated!', 'success');
                } else {
                    const created = await contactsApi.create(data);
                    allContacts.push({ ...data, id: created?.id, created_at: new Date().toISOString() });
                    showToast('Contact added!', 'success');
                }
                modalContainer.innerHTML = '';
                renderFolderSidebar();
                renderTable(activeFolder ? allContacts.filter(c => c.tags && c.tags.some(t => t.text === activeFolder)) : allContacts);
            } catch (err) {
                showToast('Action failed: ' + err.message, 'error');
            }
        };
    };
}
