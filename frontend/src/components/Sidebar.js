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
        { path: '/docs', title: 'Documentation', icon: '📖' },
        { path: '/help', title: 'Help Center', icon: '?' },
        { path: '/settings', title: 'Setting', icon: '⚙' },
    ];

    const user = JSON.parse(localStorage.getItem('camp_user') || '{"name": "User", "email": "user@sendable.com"}');

    return `
        <!-- Mobile Topbar -->
        <div class="mobile-topbar">
            <div class="logo">
                <div style="width: 28px; height: 28px; background: var(--primary); border-radius: 7px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1rem;">✦</div>
                <span>MailerPRO</span>
            </div>
            <button class="hamburger" id="hamburger-btn" aria-label="Open menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>

        <!-- Sidebar Overlay (mobile) -->
        <div class="sidebar-overlay" id="sidebar-overlay"></div>

        <!-- Sidebar Drawer -->
        <div class="sidebar" id="sidebar">
            <div class="logo">
                <div style="width: 32px; height: 32px; background: var(--primary); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem; flex-shrink: 0;">✦</div>
                <div style="display: flex; flex-direction: column; line-height: 1.2; overflow: hidden;">
                    <span style="font-size: 1.1rem; font-weight: 800; color: var(--text-main);">MailerPRO</span>
                    <span style="font-size: 0.6rem; font-weight: 500; color: var(--text-muted);">Your Deliverability Engine</span>
                </div>
            </div>
            
            <div class="nav-label">Menu</div>
            <ul class="nav-links">
                ${menuItems.map(item => `
                    <li>
                        <a href="${item.path}" class="nav-link ${currentPath === item.path ? 'active' : ''} ${item.hasChevron ? 'nav-link-with-chevron' : ''}" data-link>
                            <div style="display: flex; align-items: center; gap: 0.75rem;">
                                <span style="font-size: 1rem; width: 20px; text-align: center;">${item.icon}</span>
                                <span>${item.title}</span>
                            </div>
                            ${item.hasChevron ? '<span style="font-size: 0.7rem; opacity: 0.6;">⌵</span>' : ''}
                        </a>
                    </li>
                `).join('')}
            </ul>

            <div style="margin-top: auto;">
                <div class="flex justify-between items-center mb-6" style="padding: 0 0.25rem;">
                    <div class="flex items-center gap-2" style="font-size: 0.875rem; font-weight: 500; color: var(--text-muted);">
                        <span>☾</span>
                        <span>Dark Mode</span>
                    </div>
                    <div id="dark-mode-toggle" style="width: 40px; height: 22px; background: var(--border); border-radius: 22px; position: relative; cursor: pointer; transition: background 0.2s; flex-shrink: 0;">
                        <div id="dark-mode-circle" style="width: 16px; height: 16px; background: white; border-radius: 50%; position: absolute; top: 3px; left: 3px; transition: left 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2);"></div>
                    </div>
                </div>

                <div class="nav-label" style="margin-top: 0;">Support</div>
                <ul class="nav-links mb-6">
                    ${bottomItems.map(item => `
                        <li>
                            <a href="${item.path}" class="nav-link ${currentPath === item.path ? 'active' : ''}" data-link>
                                <span style="font-size: 1rem; width: 20px; text-align: center;">${item.icon}</span>
                                <span>${item.title}</span>
                            </a>
                        </li>
                    `).join('')}
                </ul>

                <div style="padding-top: 1.25rem; border-top: 1px solid var(--border); display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 34px; height: 34px; border-radius: 50%; background: var(--primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.875rem; flex-shrink: 0;">
                        ${user.name.charAt(0).toUpperCase()}
                    </div>
                    <div style="overflow: hidden; flex: 1; min-width: 0;">
                        <p class="truncate" style="font-size: 0.875rem; font-weight: 600;">${user.name}</p>
                        <p class="truncate" style="font-size: 0.75rem; color: var(--text-muted);">${user.email}</p>
                    </div>
                    <a href="/logout" id="logout-btn" style="text-decoration: none; font-size: 1rem; flex-shrink: 0; opacity: 0.7; transition: opacity 0.2s;" title="Logout" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.7'">🚪</a>
                </div>
            </div>
        </div>
    `;
}
