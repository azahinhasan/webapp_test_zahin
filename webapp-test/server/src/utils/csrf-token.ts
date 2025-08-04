import * as crypto from 'crypto';

const CSRF_SECRET = 'test-secret';

export function generateCsrfToken(payload: { id: number; name: string }) {
  const nonce = crypto.randomBytes(16).toString('hex');
  const data = `${payload.id}:${payload.name}:${nonce}`;
  const hmac = crypto.createHmac('sha256', CSRF_SECRET).update(data).digest('hex');
  const token = Buffer.from(`${data}:${hmac}`).toString('base64');
  return token;
}

export function verifyCsrfToken(token: string, payload: { id: number; email: string }) {
  const decoded = Buffer.from(token, 'base64').toString('ascii');
  const [id, name, nonce, hmac] = decoded.split(':');
  const expectedData = `${payload.id}:${payload.email}:${nonce}`;
  const expectedHmac = crypto.createHmac('sha256', CSRF_SECRET).update(expectedData).digest('hex');

  return hmac === expectedHmac && id === String(payload.id) && name === payload.email;
}
