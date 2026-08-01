import client from './client';

export const getAdminStatsApi = () =>
  client.get('/admin/stats').then(r => r.data.data);

export const getAdminTransactionsApi = (params = {}) =>
  client.get('/admin/transactions', { params }).then(r => r.data);

export const updateTransactionStatusApi = (id, status) =>
  client.patch(`/admin/transactions/${id}/status`, { status }).then(r => r.data);

export const getAdminUsersApi = () =>
  client.get('/admin/users').then(r => r.data.data);
