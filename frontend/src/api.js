// Use the Render URL in production, or /api (proxied) in development
const API_URL = import.meta.env.PROD 
    ? 'https://mailerpro-rjoy.onrender.com/api' 
    : '/api';

export const api = {
    async get(path) {
        const response = await fetch(`${API_URL}${path}`);
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        return response.json();
    },

    async post(path, data) {
        const response = await fetch(`${API_URL}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    },

    async patch(path, data) {
        const response = await fetch(`${API_URL}${path}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    },

    async put(path, data) {
        const response = await fetch(`${API_URL}${path}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        // 204 No Content or empty body — don't try to parse JSON
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    },

    async delete(path) {
        const response = await fetch(`${API_URL}${path}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    }
};

export const contactsApi = {
    list: async () => {
        const user = JSON.parse(localStorage.getItem('camp_user') || '{}');
        const qs = user.id ? `?account_id=${user.id}` : '';
        return (await api.get(`/contacts${qs}`)) || [];
    },
    create: (data) => {
        const user = JSON.parse(localStorage.getItem('camp_user') || '{}');
        if (user.id) data.account_id = parseInt(user.id);
        return api.post('/contacts', data);
    },
    update: (id, data) => api.put(`/contacts/${id}`, data),
    delete: (id) => api.delete(`/contacts/${id}`),
    bulkDelete: (ids) => api.post('/contacts/bulk-delete', { ids }),
    bulkMove: (ids, folder) => api.post('/contacts/bulk-move', { ids, folder }),
    addTag: (data) => api.post('/contacts/tag', data),
    removeTag: (id, data) => api.patch(`/contacts/${id}/tag`, data)
};

export const campaignsApi = {
    list: async () => (await api.get('/campaigns')) || [],
    get: (id) => api.get(`/campaigns/${id}`),
    create: (data) => api.post('/campaigns', data),
    update: (id, data) => api.put(`/campaigns/${id}`, data),
    generateAI: (data) => api.post('/campaigns/generate-ai', data)
};

export const mailerApi = {
    listSent: async () => {
        const user = JSON.parse(localStorage.getItem('camp_user') || '{}');
        const qs = user.id ? `?account_id=${user.id}` : '';
        return (await api.get(`/emails/sent${qs}`)) || [];
    }
};

export const statsApi = {
    getOverview: () => api.get('/stats/overview'),
};

export const accountApi = {
    signup: (data) => api.post('/signup', data),
    login: (data) => api.post('/login', data),
    getSMTP: (accountID) => api.get(`/settings/smtp?account_id=${accountID}`),
    saveSMTP: (data) => api.post('/settings/smtp', data),
    testSend: (data) => api.post('/mailer/test-send', data),
    getWarming: (accountID) => api.get(`/stats/warming?account_id=${accountID}`),
    getGoogleAuthUrl: (accountID) => api.get(`/auth/google/url?account_id=${accountID}`),
    getMe: (id) => api.get(`/account/me?id=${id || ''}`),
};

export const domainApi = {
    getHealth: (domain) => api.get(`/domain/health?domain=${domain}`),
};
