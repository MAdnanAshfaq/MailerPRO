export const routes = {
    '/': { title: 'Dashboard', icon: '📊' },
    '/contacts': { title: 'Contacts', icon: '👤' },
    '/campaigns': { title: 'Campaigns', icon: '✉️' }
};

export class Router {
    constructor(routes, onRouteMatch) {
        this.routes = routes;
        this.onRouteMatch = onRouteMatch;
        this.init();
    }

    init() {
        window.addEventListener('popstate', () => this.handleRoute());
        document.body.addEventListener('click', e => {
            const link = e.target.closest('a[data-link]');
            if (link) {
                e.preventDefault();
                this.navigate(link.getAttribute('href'));
            }
        });
        this.handleRoute();
    }

    navigate(path) {
        window.history.pushState({}, '', path);
        this.handleRoute();
    }

    handleRoute() {
        const path = window.location.pathname;
        const route = this.routes[path] || this.routes['/'];
        this.onRouteMatch(path, route);
    }
}
