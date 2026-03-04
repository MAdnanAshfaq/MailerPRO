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
        return response.status === 204 ? null : response.json();
    }
};

export const contactsApi = {
    list: async () => (await api.get('/contacts')) || [],
    create: (data) => api.post('/contacts', data),
    update: (id, data) => api.put(`/contacts/${id}`, data),
    addTag: (data) => api.post('/contacts/tag', data),
    removeTag: (id, data) => api.patch(`/contacts/${id}/tag`, data)
};

export const campaignsApi = {
    list: async () => (await api.get('/campaigns')) || [],
    get: (id) => api.get(`/campaigns/${id}`),
    create: (data) => api.post('/campaigns', data),
    update: (id, data) => api.put(`/campaigns/${id}`, data)
};

export const statsApi = {
    getOverview: () => api.get('/stats/overview'),
};

export const accountApi = {
    signup: (data) => api.post('/signup', data),
    saveSMTP: (data) => api.post('/settings/smtp', data),
    getWarming: (accountID) => api.get(`/stats/warming?account_id=${accountID}`),
};

export const domainApi = {
    getHealth: (domain) => api.get(`/domain/health?domain=${domain}`),
};
