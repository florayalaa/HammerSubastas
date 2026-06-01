export const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:4000/api';

async function request(path: string, init: RequestInit = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, init);
  let json: any = null;
  try {
    json = await res.json();
  } catch (e) {
    // ignore json parse errors
  }
  if (!res.ok) {
    const message = json?.message ?? `HTTP ${res.status}`;
    const err: any = new Error(message);
    err.status = res.status;
    err.body = json;
    throw err;
  }
  return json;
}

export async function apiGet(path: string, token?: string) {
  return request(path, {
    method: 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

export async function apiPost(path: string, body: any, token?: string) {
  return request(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
}

export default { API_BASE_URL, apiGet, apiPost };
