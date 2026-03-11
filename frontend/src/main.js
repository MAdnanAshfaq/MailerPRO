import './style.css';
import './toast.css';
import { Router } from './router';
import { Sidebar } from './components/Sidebar';
import { Dashboard, initDashboard } from './pages/Dashboard';
import { Contacts, initContacts } from './pages/Contacts';
import { Campaigns, initCampaigns } from './pages/Campaigns';
import { Automation } from './pages/Automation';
import { Analytics } from './pages/Analytics';
import { Schedule, initSchedule } from './pages/Schedule';
import { Templates } from './pages/Templates';
import { Integration } from './pages/Integration';
import { Landing } from './pages/Landing';
import { Auth, initAuth } from './pages/Auth';

const app = document.getElementById('app');

const routes = {
    '/': Dashboard,
    '/contacts': Contacts,
    '/campaigns': Campaigns,
    '/automation': Automation,
    '/analytics': Analytics,
    '/schedule': Schedule,
    '/templates': Templates,
    '/integration': Integration,
    '/login': () => Auth('login'),
    '/signup': () => Auth('signup'),
    '/landing': Landing
};

async function render(path) {
    const isLoggedIn = window.sessionStorage.getItem('isLoggedIn') === 'true';

    if (path === '/logout') {
        window.sessionStorage.removeItem('isLoggedIn');
        window.location.href = '/landing';
        return;
    }

    if (!isLoggedIn && !['/login', '/signup', '/landing'].includes(path)) {
        window.history.replaceState({}, '', '/landing');
        path = '/landing';
    }

    if (isLoggedIn && ['/login', '/signup', '/landing'].includes(path)) {
        window.history.replaceState({}, '', '/');
        path = '/';
    }

    const pageFn = routes[path] || (isLoggedIn ? Dashboard : Landing);
    
    const noSidebarPages = ['/landing', '/login', '/signup'];
    const showSidebar = isLoggedIn && !noSidebarPages.includes(path);

    const contentHtml = await pageFn();

    if (showSidebar) {
        const sidebarHtml = Sidebar(path);
        app.innerHTML = `
            ${sidebarHtml}
            <div class="layout-container" style="width: 100%;">
                <div id="content-area" style="flex: 1; min-width: 0;">
                    ${contentHtml}
                </div>
            </div>
        `;
    } else {
        app.innerHTML = `<div style="width: 100%;">${contentHtml}</div>`;
    }

    // Wrap all tables in a scroll container for mobile
    document.querySelectorAll('.card table, .card .campaign-table').forEach(table => {
        if (!table.parentElement.classList.contains('table-wrapper')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-wrapper';
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        }
    });

    // ── Page-specific initializers ──
    if (path === '/contacts') initContacts();
    if (path === '/campaigns') initCampaigns();
    if (path === '/schedule') initSchedule();
    if (path === '/') initDashboard();
    if (['/login', '/signup'].includes(path)) initAuth();

    // ── Logout ──
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.onclick = (e) => {
            e.preventDefault();
            window.sessionStorage.removeItem('isLoggedIn');
            window.location.href = '/landing';
        };
    }

    // ── Dark Mode Toggle ──
    const circle = document.getElementById('dark-mode-circle');
    const toggle = document.getElementById('dark-mode-toggle');
    if (circle && toggle) {
        const isDark = document.body.classList.contains('dark-theme');
        circle.style.left = isDark ? '21px' : '3px';
        toggle.style.background = isDark ? 'var(--primary)' : 'var(--border)';

        toggle.onclick = () => {
            const currentDark = document.body.classList.toggle('dark-theme');
            localStorage.setItem('camp_dark_mode', currentDark);
            circle.style.left = currentDark ? '21px' : '3px';
            toggle.style.background = currentDark ? 'var(--primary)' : 'var(--border)';
        };
    }

    // ── Hamburger / Mobile Sidebar ──
    const hamburger = document.getElementById('hamburger-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    function openSidebar() {
        sidebar && sidebar.classList.add('open');
        overlay && overlay.classList.add('active');
        hamburger && hamburger.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        sidebar && sidebar.classList.remove('open');
        overlay && overlay.classList.remove('active');
        hamburger && hamburger.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (hamburger) hamburger.onclick = () => sidebar && sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    if (overlay)   overlay.onclick   = closeSidebar;

    // Close sidebar on nav-link click (mobile)
    document.querySelectorAll('.sidebar .nav-link[data-link]').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) closeSidebar();
        });
    });
}

// ── Initial Dark Mode (avoids flash) ──
if (localStorage.getItem('camp_dark_mode') === 'true') {
    document.body.classList.add('dark-theme');
}

new Router(routes, (path) => {
    render(path);
});
