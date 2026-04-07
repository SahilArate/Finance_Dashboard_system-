import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data: { name: string; email: string; password: string; role: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

// User APIs
export const userAPI = {
  getAll: () => api.get('/users'),
  getOne: (id: string) => api.get(`/users/${id}`),
  updateRole: (id: string, role: string) => api.patch(`/users/${id}/role`, { role }),
  toggleStatus: (id: string) => api.patch(`/users/${id}/status`),
  delete: (id: string) => api.delete(`/users/${id}`),
};

// Records APIs
export const recordAPI = {
  getAll: (filters?: {
    type?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
  }) => api.get('/records', { params: filters }),
  getOne: (id: string) => api.get(`/records/${id}`),
  create: (data: {
    amount: number;
    type: string;
    category: string;
    date: string;
    notes?: string;
  }) => api.post('/records', data),
  update: (id: string, data: any) => api.put(`/records/${id}`, data),
  delete: (id: string) => api.delete(`/records/${id}`),
};

// Dashboard APIs
export const dashboardAPI = {
  getSummary: () => api.get('/dashboard/summary'),
  getCategories: () => api.get('/dashboard/categories'),
  getMonthly: () => api.get('/dashboard/monthly'),
  getWeekly: () => api.get('/dashboard/weekly'),
  getRecent: () => api.get('/dashboard/recent'),
};

export default api;