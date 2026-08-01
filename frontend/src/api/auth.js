import client from './client';

export const loginApi = (username, password) =>
  client.post('/auth/login', { username, password }).then(r => r.data);

export const registerApi = (payload) =>
  client.post('/auth/register', payload).then(r => r.data);

export const getMeApi = () =>
  client.get('/auth/me').then(r => r.data);
