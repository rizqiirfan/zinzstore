import client from './client';

export const checkPlayerApi = (userId, zoneId) =>
  client.post('/player/check', { userId, zoneId }).then(r => r.data.data);
