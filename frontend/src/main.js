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
import { Settings, initSettings } from './pages/Settings';
import { Auth, initAuth } from './pages/Auth';
import { accountApi } from './api';

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
    '/settings': Settings,
    '/login': () => Auth('login'),
    '/signup': () => Auth('signup'),
    '/landing': Landing
};

async function init() {
    // 1. Handle Post-Google Login Handshake (BLOCKING)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('login_success') === 'true') {
        const userId = urlParams.get('user_id');
        app.innerHTML = `
            <div style="height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #020b14; color: #fff; font-family: 'Outfit', sans-serif;">
                <div class="spinner" style="width: 40px; height: 40px; border: 3px solid rgba(0,255,136,0.1); border-top-color: #00ff88; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 1.5rem;"></div>
                <h2 style="font-weight: 800; letter-spacing: -0.02em;">Syncing Session...</h2>
                <p style="color: rgba(255,255,255,0.4); font-size: 0.875rem; margin-top: 0.5rem;">Connecting your Google account to MailerPRO</p>
            </div>
            <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
        `;

        try {
            console.log('Handshake starting for user:', userId);
            const user = await accountApi.getMe(userId);
            if (user) {
                console.log('User verified:', user.email);
                localStorage.setItem('camp_user', JSON.stringify(user));
                window.sessionStorage.setItem('isLoggedIn', 'true');
                
                // Add a small delay so the user can see the sync happening
                await new Promise(r => setTimeout(r, 1500));

                // Clean URL without full reload
                window.history.replaceState({}, '', '/');
                
                // Proceed to start the app normally
                app.innerHTML = '';
                new Router(routes, (path) => render(path));
                return;
            }
        } catch (err) {
            console.error('Handshake failed:', err);
            app.innerHTML = `
                <div style="height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #020b14; color: #fff; font-family: 'Outfit', sans-serif; padding: 2rem; text-align: center;">
                    <h2 style="color: #ff4d4d; margin-bottom: 1rem;">Authentication Error</h2>
                    <p style="color: rgba(255,255,255,0.6); margin-bottom: 2rem;">We couldn't verify your Google session. ${err.message}</p>
                    <a href="/login" class="btn btn-primary" style="text-decoration: none;">Return to Login</a>
                </div>
            `;
            return;
        }
    }

    // 2. Start Router (Standard path)
    new Router(routes, (path) => {
        render(path);
    });
}

async function render(path) {
    const isLoggedIn = window.sessionStorage.getItem('isLoggedIn') === 'true';
    const urlParams = new URLSearchParams(window.location.search);
    const isGoogleHandshake = urlParams.get('login_success') === 'true';
    
    // Auth Guards
    if (path === '/logout') {
        window.sessionStorage.removeItem('isLoggedIn');
        window.location.href = '/landing';
        return;
    }

    // CRITICAL: Do not redirect to landing if we are currently in a Google Handshake
    if (!isLoggedIn && !['/login', '/signup', '/landing'].includes(path) && !isGoogleHandshake) {
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
    if (path === '/settings') initSettings();
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

// Start the app
init();
