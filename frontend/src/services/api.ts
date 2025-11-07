// Minimal fetch-based API helper compatible with React Query usage
const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'http://localhost:8000';
// Get CSRF token from cookie
function getCsrfToken(): string | null {
  const name = 'csrftoken';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}
async function handleResponse(res: Response) {
  const ct = res.headers.get('content-type') || '';
  const isJson = ct.includes('application/json');
  if (res.ok) {
    if (isJson) return res.json();
    // return raw blob for files
    return res.blob();
  }
  // parse error body if available
  let errBody: any;
  try {
    if (isJson) errBody = await res.json();
    else errBody = await res.text();
  } catch (e) {
    errBody = { message: 'Unknown error' };
  }
  const error = new Error(errBody?.message || res.statusText || 'Request failed');
  (error as any).status = res.status;
  (error as any).body = errBody;
  throw error;
}
function jsonHeaders() {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const csrfToken = getCsrfToken();
  if (csrfToken) {
    headers['X-CSRFToken'] = csrfToken;
  }
  return headers;
}
function csrfHeaders() {
  const headers: Record<string, string> = {};
  const csrfToken = getCsrfToken();
  if (csrfToken) {
    headers['X-CSRFToken'] = csrfToken;
  }
  return headers;
}
export async function getMe() {
  const res = await fetch(`${API_ORIGIN}/api/auth/me`, { credentials: 'include' });
  return handleResponse(res);
}
export async function listCVs() {
  const res = await fetch(`${API_ORIGIN}/api/cvs/`, { credentials: 'include' });
  return handleResponse(res);
}
export async function createCV(payload: any) {
  const res = await fetch(`${API_ORIGIN}/api/cvs/`, {
    method: 'POST',
    credentials: 'include',
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
export async function updateCV(id: string, payload: any) {
  const res = await fetch(`${API_ORIGIN}/api/cvs/${id}/`, {
    method: 'PUT',
    credentials: 'include',
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
export async function generateCV(payload: any, signal?: AbortSignal) {
  const res = await fetch(`${API_ORIGIN}/api/cvs/generate/`, {
    method: 'POST',
    credentials: 'include',
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
    signal,
  });
  return handleResponse(res);
}
export async function requestCvExport(id: string, format = 'pdf') {
  const res = await fetch(`${API_ORIGIN}/api/cvs/${id}/export/?format=${encodeURIComponent(format)}`, {
    method: 'POST',
    credentials: 'include',
    headers: csrfHeaders(),
  });
  return handleResponse(res);
}
export async function createInterviewSession(payload: any) {
  const res = await fetch(`${API_ORIGIN}/api/interview/session/`, {
    method: 'POST',
    credentials: 'include',
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
export async function saveInterviewAnswer(sessionId: string, payload: any) {
  const res = await fetch(`${API_ORIGIN}/api/interview/session/${sessionId}/answer/`, {
    method: 'PUT',
    credentials: 'include',
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
export async function submitInterview(sessionId: string) {
  const res = await fetch(`${API_ORIGIN}/api/interview/session/${sessionId}/submit/`, {
    method: 'POST',
    credentials: 'include',
    headers: csrfHeaders(),
  });
  return handleResponse(res);
}
export async function startTrainerAttempt(payload: any) {
  const res = await fetch(`${API_ORIGIN}/api/trainer/attempt/`, {
    method: 'POST',
    credentials: 'include',
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
export async function submitTrainerAttempt(id: string, payload: any) {
  const res = await fetch(`${API_ORIGIN}/api/trainer/attempt/${id}/submit/`, {
    method: 'POST',
    credentials: 'include',
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
export async function exportProfile() {
  const res = await fetch(`${API_ORIGIN}/api/export/`, { 
    method: 'POST', 
    credentials: 'include',
    headers: csrfHeaders(),
  });
  return handleResponse(res);
}
export async function eraseData() {
  const res = await fetch(`${API_ORIGIN}/api/erase/`, { 
    method: 'POST', 
    credentials: 'include',
    headers: csrfHeaders(),
  });
  return handleResponse(res);
}
