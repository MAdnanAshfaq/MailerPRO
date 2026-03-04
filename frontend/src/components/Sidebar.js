export function Sidebar(currentPath) {
    const menuItems = [
        { path: '/', title: 'Overview', icon: '▦' },
        { path: '/campaigns', title: 'Campaign', icon: '✉' },
        { path: '/contacts', title: 'Contacts', icon: '👥' },
        { path: '/automation', title: 'Automation', icon: '⚙' },
        { path: '/analytics', title: 'Analytics', icon: '📊' },
        { path: '/schedule', title: 'Schedule', icon: '🕒', hasChevron: true },
        { path: '/templates', title: 'Templates', icon: '📄', hasChevron: true },
        { path: '/integration', title: 'Integration', icon: '📦' },
    ];

    const bottomItems = [
        { path: '/help', title: 'Help Center', icon: '?' },
        { path: '/settings', title: 'Setting', icon: '⚙' },
    ];

    const user = JSON.parse(localStorage.getItem('camp_user') || '{"name": "Sarah M", "email": "sarah@sendable.com"}');

    return `
        <div class="sidebar">
            <div class="logo">
                <div style="width: 32px; height: 32px; background: var(--primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.25rem;">✦</div>
                <div style="display: flex; flex-direction: column; line-height: 1.2;">
                    <span style="font-size: 1.25rem; font-weight: 800; color: #1a1a1a;">Sendable</span>
                    <span style="font-size: 0.625rem; font-weight: 500; color: var(--text-muted);">www.sendable.com</span>
                </div>
            </div>
            
            <div class="nav-label">Menu</div>
            <ul class="nav-links">
                ${menuItems.map(item => `
                    <li>
                        <a href="${item.path}" class="nav-link ${currentPath === item.path ? 'active' : ''} ${item.hasChevron ? 'nav-link-with-chevron' : ''}" data-link>
                            <div style="display: flex; align-items: center; gap: 0.875rem;">
                                <span style="font-size: 1.1rem;">${item.icon}</span>
                                <span style="font-weight: 500;">${item.title}</span>
                            </div>
                            ${item.hasChevron ? '<span style="font-size: 0.75rem;">⌵</span>' : ''}
                        </a>
                    </li>
                `).join('')}
            </ul>

            <div style="margin-top: auto;">
                <div class="flex justify-between items-center mb-6" style="padding: 0 1rem;">
                    <div class="flex items-center gap-2" style="font-size: 0.9375rem; font-weight: 500; color: var(--text-muted);">
                        <span>☾</span>
                        <span>Dark Mode</span>
                    </div>
                    <div id="dark-mode-toggle" style="width: 40px; height: 20px; background: var(--border); border-radius: 20px; position: relative; cursor: pointer;">
                        <div id="dark-mode-circle" style="width: 16px; height: 16px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: all 0.2s;"></div>
                    </div>
                </div>

                <ul class="nav-links mb-6">
                    ${bottomItems.map(item => `
                        <li>
                            <a href="${item.path}" class="nav-link ${currentPath === item.path ? 'active' : ''}" data-link>
                                <span style="font-size: 1.1rem;">${item.icon}</span>
                                <span>${item.title}</span>
                            </a>
                        </li>
                    `).join('')}
                </ul>

                <div style="padding-top: 1.5rem; border-top: 1px solid var(--border); display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem;">
                        ${user.name.charAt(0)}
                    </div>
                    <div style="overflow: hidden; flex: 1;">
                        <p style="font-size: 0.875rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${user.name}
                        </p>
                        <p style="font-size: 0.75rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${user.email}
                        </p>
                    </div>
                    <a href="/logout" id="logout-btn" style="text-decoration: none; font-size: 1rem;" title="Logout">🚪</a>
                </div>
            </div>
        </div>
    `;
}
