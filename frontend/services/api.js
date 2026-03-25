/**
 * api.js — Couche d'appels vers le backend Laravel
 *
 * Configurez l'URL de votre backend dans votre fichier .env :
 *   REACT_APP_API_URL=http://localhost:8000
 */

const BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

async function http(method, endpoint, body = null) {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    credentials: 'include',
  };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${endpoint}`, opts);

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const e = new Error(err.message || `Erreur ${res.status}`);
    e.status = res.status;
    e.errors = err.errors || {};
    throw e;
  }

  if (res.status === 204) return null;
  return res.json();
}

export async function initCsrf() {
  await fetch(`${BASE}/sanctum/csrf-cookie`, { credentials: 'include' });
}

export const getAuthUser   = ()                          => http('GET',  '/api/user').catch(() => null);
export const login         = (email, password)           => initCsrf().then(() => http('POST', '/login',    { email, password }));
export const register      = (name, email, pw, pwc)      => initCsrf().then(() => http('POST', '/register', { name, email, password: pw, password_confirmation: pwc }));
export const logout        = ()                          => http('POST', '/logout');

export const getPosts      = (page = 1, category = null) => http('GET', `/forum?page=${page}${category && category !== 'All' ? `&category=${encodeURIComponent(category)}` : ''}`);
export const createPost    = (title, content, category)  => http('POST', '/forum/posts', { title, content, category });

export const getProjects   = (page = 1)                  => http('GET', `/projects?page=${page}`);
export const importGithub  = (github_url)                => http('POST', '/projects/from-github', { github_url });

export const updateProfile = (data)                      => http('PATCH', '/profile', data);

export const getEvents     = ()                          => http('GET', '/api/events');
export const sendAiMessage = (message)                   => http('POST', '/ai/chat', { message });
export const getDevelopers = ()                          => http('GET', '/api/developers');
export const getStats      = ()                          => http('GET', '/api/stats');
