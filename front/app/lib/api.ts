export const API_BASE_URL = process.env.API_BASE_URL ?? 'http://127.0.0.1:3000/api';

async function request(path: string, init: RequestInit = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, init);
  let json: any = null;
  try {
    json = await res.json();
  } catch {
    // ignoramos errores de parseo json
  }
  if (!res.ok) {
    let message = json?.message ?? `HTTP ${res.status}`;
    if (json?.errors && Array.isArray(json.errors)) {
      message += ' - ' + json.errors.map((e: any) => e.message).join(', ');
    }
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

export async function apiPut(path: string, body: any, token?: string) {
  return request(path, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
}

export async function apiPostFormData(path: string, formData: FormData, token?: string) {
  // Sin Content-Type para que el runtime lo ponga automáticamente con el boundary correcto
  return request(path, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });
}

export default { API_BASE_URL, apiGet, apiPost, apiPut, apiPostFormData };
