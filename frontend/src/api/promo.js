import client from './client';

export const applyPromoApi = (code, price) =>
  client.post('/promo/apply', { code, price }).then(r => r.data);
