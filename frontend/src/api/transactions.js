import client from './client';

export const createTransactionApi = (payload) =>
  client.post('/transactions', payload).then(r => r.data.data);

// Dipanggil setelah popup Snap Midtrans selesai (onSuccess/onPending), untuk
// langsung menarik status terbaru dari Midtrans tanpa perlu menunggu webhook
// (webhook tidak bisa menjangkau localhost tanpa tunnel publik seperti ngrok).
export const syncTransactionApi = (id) =>
  client.post(`/transactions/${id}/sync`).then(r => r.data);

export const getMyTransactionsApi = () =>
  client.get('/transactions').then(r => r.data.data);
