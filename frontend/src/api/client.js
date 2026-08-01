import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_URL,
});

// Sisipkan token JWT ke setiap request jika ada di localStorage
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('zinzstore_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
