const API_URL = '/api';

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
        return response.json();
    },

    async patch(path, data) {
        const response = await fetch(`${API_URL}${path}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
        return response.json();
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

export const statsApi = {
    getOverview: () => api.get('/stats/overview'),
};

export const accountApi = {
    signup: (data) => api.post('/signup', data),
    login: (data) => api.post('/login', data),
    saveSMTP: (data) => api.post('/settings/smtp', data),
    getWarming: (accountID) => api.get(`/stats/warming?account_id=${accountID}`),
};

export const domainApi = {
    getHealth: (domain) => api.get(`/domain/health?domain=${domain}`),
};
