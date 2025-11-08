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

  console.log('📡 Response:', {
    url: res.url,
    status: res.status,
    statusText: res.statusText,
    contentType: ct,
    ok: res.ok
  });

  if (res.ok) {
    if (isJson) return res.json();
    // return raw blob for files
    return res.blob();
  }
  // parse error body if available
  let errBody: unknown;
  try {
    if (isJson) errBody = await res.json();
    else errBody = await res.text();
  } catch {
    errBody = { message: 'Unknown error' };
  }

  console.error('❌ API Error:', {
    status: res.status,
    statusText: res.statusText,
    url: res.url,
    body: errBody
  });

  const error = new Error((errBody as { message?: string })?.message || res.statusText || 'Request failed');
  (error as Error & { status: number; body: unknown }).status = res.status;
  (error as Error & { status: number; body: unknown }).body = errBody;
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
export async function getProfile() {
  const res = await fetch(`${API_ORIGIN}/api/profile/`, { credentials: 'include' });
  return handleResponse(res);
}
export async function updateProfile(payload: Record<string, unknown>) {
  const res = await fetch(`${API_ORIGIN}/api/profile/`, {
    method: 'PUT',
    credentials: 'include',
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
export async function listCVs() {
  const res = await fetch(`${API_ORIGIN}/api/cvs/`, { credentials: 'include' });
  return handleResponse(res);
}
export async function getCV(id: string) {
  const res = await fetch(`${API_ORIGIN}/api/cvs/${id}/`, { credentials: 'include' });
  return handleResponse(res);
}
export async function deleteCV(id: string) {
  const res = await fetch(`${API_ORIGIN}/api/cvs/${id}/`, {
    method: 'DELETE',
    credentials: 'include',
    headers: csrfHeaders(),
  });
  return handleResponse(res);
}
export async function createCV(payload: Record<string, unknown>) {
  const res = await fetch(`${API_ORIGIN}/api/cvs/`, {
    method: 'POST',
    credentials: 'include',
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
export async function updateCV(id: string, payload: Record<string, unknown>) {
  const res = await fetch(`${API_ORIGIN}/api/cvs/${id}/`, {
    method: 'PUT',
    credentials: 'include',
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
export async function exportCV(id: string, format: 'pdf' | 'docx') {
  const url = `${API_ORIGIN}/api/cvs/${id}/export/?format=${format}`;
  console.log(`[API] exportCV: Fetching ${url}`);

  const res = await fetch(url, {
    credentials: 'include',
  });

  console.log(`[API] exportCV: Response status ${res.status}`);

  if (!res.ok) {
    const error = new Error('Export failed');
    (error as Error & { status: number }).status = res.status;
    console.error(`[API] exportCV: Request failed with status ${res.status}`);
    throw error;
  }

  // Return blob for download
  const blob = await res.blob();
  console.log(`[API] exportCV: Blob received, size=${blob.size}, type=${blob.type}`);

  // Ensure the blob has the correct type
  const correctBlob = format === 'pdf'
    ? new Blob([blob], { type: 'application/pdf' })
    : new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

  const contentDisposition = res.headers.get('Content-Disposition');
  console.log(`[API] exportCV: Content-Disposition header: ${contentDisposition}`);

  let filename = `cv_${Date.now()}.${format}`;

  if (contentDisposition) {
    const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
    if (matches != null && matches[1]) {
      filename = matches[1].replace(/['"]/g, '');
    }
  }

  console.log(`[API] exportCV: Using filename: ${filename}`);
  return { blob: correctBlob, filename };
}
export async function generateCV(payload: Record<string, unknown>, signal?: AbortSignal) {
  const res = await fetch(`${API_ORIGIN}/api/cvs/generate/`, {
    method: 'POST',
    credentials: 'include',
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
    signal,
  });
  return handleResponse(res);
}
export async function createInterviewSession(payload: Record<string, unknown>) {
  const res = await fetch(`${API_ORIGIN}/api/interview/sessions/`, {
    method: 'POST',
    credentials: 'include',
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
export async function listInterviewSessions() {
  const res = await fetch(`${API_ORIGIN}/api/interview/sessions/list/`, {
    credentials: 'include',
  });
  return handleResponse(res);
}
export async function getInterviewSession(sessionId: string) {
  const res = await fetch(`${API_ORIGIN}/api/interview/sessions/${sessionId}/`, {
    credentials: 'include',
  });
  return handleResponse(res);
}
export async function saveInterviewAnswer(sessionId: string, payload: Record<string, unknown>) {
  const res = await fetch(`${API_ORIGIN}/api/interview/sessions/${sessionId}/answer/`, {
    method: 'PUT',
    credentials: 'include',
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
export async function submitInterview(sessionId: string) {
  const res = await fetch(`${API_ORIGIN}/api/interview/sessions/${sessionId}/submit/`, {
    method: 'POST',
    credentials: 'include',
    headers: csrfHeaders(),
  });
  return handleResponse(res);
}
export async function getInterviewHint(sessionId: string, payload: Record<string, unknown>) {
  const res = await fetch(`${API_ORIGIN}/api/interview/sessions/${sessionId}/hint/`, {
    method: 'POST',
    credentials: 'include',
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
export async function getTrainerCategories() {
  const res = await fetch(`${API_ORIGIN}/api/trainer/categories/`, {
    credentials: 'include',
  });
  return handleResponse(res);
}
export async function getTrainerQuestions(category: string, n: number = 10) {
  const res = await fetch(`${API_ORIGIN}/api/trainer/questions/${category}/?n=${n}`, {
    credentials: 'include',
  });
  return handleResponse(res);
}
export async function startTrainerAttempt(payload: Record<string, unknown>) {
  const res = await fetch(`${API_ORIGIN}/api/trainer/start`, {
    method: 'POST',
    credentials: 'include',
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
export async function submitTrainerAttempt(payload: Record<string, unknown>) {
  const res = await fetch(`${API_ORIGIN}/api/trainer/submit/`, {
    method: 'POST',
    credentials: 'include',
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
export async function listTrainerResults() {
  const res = await fetch(`${API_ORIGIN}/api/trainer/results/`, {
    credentials: 'include',
  });
  return handleResponse(res);
}
export async function getTrainerResult(resultId: string) {
  const res = await fetch(`${API_ORIGIN}/api/trainer/results/${resultId}/`, {
    credentials: 'include',
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
export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const headers: Record<string, string> = {};
  const csrfToken = getCsrfToken();
  if (csrfToken) {
    headers['X-CSRFToken'] = csrfToken;
  }

  const res = await fetch(`${API_ORIGIN}/api/files/upload/`, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: formData,
  });
  return handleResponse(res);
}
export async function healthCheck() {
  const res = await fetch(`${API_ORIGIN}/api/healthz/`, {
    credentials: 'include',
  });
  return handleResponse(res);
}
export async function askLlama(payload: { prompt: string }) {
  const res = await fetch(`${API_ORIGIN}/ask-llama/`, {
    method: 'POST',
    credentials: 'include',
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}
export async function getFile(id: number) {
  const res = await fetch(`${API_ORIGIN}/api/files/${id}/`, {
    credentials: 'include',
  });
  return handleResponse(res);
}
