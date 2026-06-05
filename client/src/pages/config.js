import axios from 'axios';
import { io } from 'socket.io-client';

const BASE = '/api';
const SOCKET_BASE = '';

export const api = axios.create({
  baseURL: BASE,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bsp_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }

  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('bsp_token');
      localStorage.removeItem('bsp_user');
      window.location.href = '/login';
    }

    return Promise.reject(err.response?.data || err);
  }
);

export const booksApi = {
  list: (params) => api.get('/books', { params }),
  get: (id) => api.get(`/books/${id}`),
  create: (data) => api.post('/books', data),
  update: (id, data) => api.put(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`),
  stats: () => api.get('/books/stats'),
  categories: () => api.get('/books/categories/list'),
};

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
};

export const socket = io(SOCKET_BASE, {
  path: '/socket.io',
  autoConnect: false,
  transports: ['websocket', 'polling'],
});

socket.on('connect', () => {
  socket.emit('join:library');
});

export function connectSocket() {
  if (!socket.connected) {
    socket.connect();
  }
}

export function disconnectSocket() {
  if (socket.connected) {
    socket.disconnect();
  }
}
