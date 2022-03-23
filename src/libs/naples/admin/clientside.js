import axios from 'axios';
const KEY_NAPLES_ADMIN_SECRET_KEY = 'naples_admin_secret';
const KEY_NAPLES_ADMIN_NAME_KEY = 'naples_admin_name';

export function isClient() {
  return typeof window !== 'undefined';
}

export function getSecret() {
  return localStorage.getItem(KEY_NAPLES_ADMIN_SECRET_KEY) || '';
}
export function getUsername() {
  return localStorage.getItem(KEY_NAPLES_ADMIN_NAME_KEY) || '';
}
export function saveSecret(secret) {
  return localStorage.setItem(KEY_NAPLES_ADMIN_SECRET_KEY, secret);
}
export function saveUsername(username) {
  return localStorage.setItem(KEY_NAPLES_ADMIN_NAME_KEY, username.trim());
}
export async function checkSecret(secret = '') {
  return axios.get('/api/naples/secret', { params: { secret } });
}
