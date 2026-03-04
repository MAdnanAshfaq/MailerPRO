import './style.css';
import { Router } from './router';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Contacts, initContacts } from './pages/Contacts';
import { Campaigns, initCampaigns } from './pages/Campaigns';
import { Automation } from './pages/Automation';
import { Analytics } from './pages/Analytics';
import { Schedule } from './pages/Schedule';
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

    // Handle logout
    if (path === '/logout') {
        window.sessionStorage.removeItem('isLoggedIn');
        window.location.href = '/landing';
        return;
    }

    // Redirect to landing if not logged in
    if (!isLoggedIn && !['/login', '/signup', '/landing'].includes(path)) {
        window.history.replaceState({}, '', '/landing');
        path = '/landing';
    }

    // Redirect to dashboard if logged in and trying to access landing/auth
    if (isLoggedIn && ['/login', '/signup', '/landing'].includes(path)) {
        window.history.replaceState({}, '', '/');
        path = '/';
    }

    const pageFn = routes[path] || (isLoggedIn ? Dashboard : Landing);
    
    // Pages that don't need sidebar
    const noSidebarPages = ['/landing', '/login', '/signup'];
    const showSidebar = isLoggedIn && !noSidebarPages.includes(path);

    const contentHtml = await pageFn();

    if (showSidebar) {
        const sidebarHtml = Sidebar(path);
        app.innerHTML = `
            <div class="layout-container" style="width: 100%;">
                ${sidebarHtml}
                <div id="content-area" style="flex: 1;">
                    ${contentHtml}
                </div>
            </div>
        `;
    } else {
        app.innerHTML = `<div style="width: 100%;">${contentHtml}</div>`;
    }

    // Initialize page-specific logic
    if (path === '/contacts') initContacts();
    if (path === '/campaigns') initCampaigns();
    if (['/login', '/signup'].includes(path)) initAuth();
    
    // Logic for logout button in sidebar
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.onclick = (e) => {
            e.preventDefault();
            window.sessionStorage.removeItem('isLoggedIn');
            window.location.href = '/landing';
        };
    }
    
    // Initialize Dark Mode UI
    const circle = document.getElementById('dark-mode-circle');
    const toggle = document.getElementById('dark-mode-toggle');
    if (circle && toggle) {
        const isDark = document.body.classList.contains('dark-theme');
        circle.style.left = isDark ? '22px' : '2px';
        toggle.style.background = isDark ? 'var(--primary)' : 'var(--border)';
        
        toggle.onclick = () => {
            const currentDark = document.body.classList.toggle('dark-theme');
            localStorage.setItem('camp_dark_mode', currentDark);
            circle.style.left = currentDark ? '22px' : '2px';
            toggle.style.background = currentDark ? 'var(--primary)' : 'var(--border)';
        };
    }
}

// Initial Dark Mode Setup
if (localStorage.getItem('camp_dark_mode') === 'true') {
    document.body.classList.add('dark-theme');
}

new Router(routes, (path) => {
    render(path);
});
