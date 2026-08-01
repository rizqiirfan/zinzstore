import client from './client';

export const getPaymentMethodsApi = () =>
  client.get('/payment-methods').then(r => r.data.data);
