import client from './client';

export const getPackagesApi = () =>
  client.get('/packages').then(r => r.data.data);
