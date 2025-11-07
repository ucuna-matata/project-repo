// @ts-expect-error - MSW v2 types may not be fully resolved
import { http, HttpResponse } from 'msw';

const API = import.meta.env.VITE_API_ORIGIN || 'http://localhost:8000';

export const handlers = [
  http.get(`${API}/me`, () => {
    return HttpResponse.json({
      id: 'user-123',
      email: 'alice@example.com',
      full_name: 'Alice Example',
      avatar_url: '',
      locale: 'en',
      profile: {
        links: { linkedin: 'https://linkedin.com/in/alice' },
        education: [],
        experience: [],
        skills: ['JavaScript', 'React'],
      },
    });
  }),

  http.get(`${API}/cv`, () => {
    return HttpResponse.json([]);
  }),

  http.post(`${API}/cv/generate`, async ({ request }: any) => {
    const body = await request.json() as any;
    const sections = {
      summary: 'Generated summary for ' + (body.targetRole || 'your target role'),
      experience: [],
      education: [],
      skills: ['React', 'TypeScript'],
    };
    return HttpResponse.json({ sections, notes: 'AI draft' }, { status: 200 });
  }),

  http.post(`${API}/cv/:id/export`, ({ params }: any) => {
    const url = 'https://example.com/fake-signed/cv-' + params.id + '.pdf';
    return HttpResponse.json({ url, ttl_seconds: 300 });
  }),

  http.post(`${API}/interview/session`, () => {
    const id = 'session-123';
    const questions = [
      { id: 'q1', text: 'Explain the event loop in JS', time_limit_sec: 60 },
      { id: 'q2', text: 'What is closure?', time_limit_sec: 45 },
    ];
    return HttpResponse.json({ id, questions }, { status: 201 });
  }),

  http.put(`${API}/interview/session/:id/answer`, () => {
    return HttpResponse.json({ status: 'ok' });
  }),

  http.post(`${API}/interview/session/:id/submit`, () => {
    return HttpResponse.json({
      score: 80,
      checklist: [{ id: 'c1', text: 'Structured answer', passed: true }],
      ai_feedback: 'Good job',
    });
  }),

  http.post(`${API}/trainer/attempt`, () => {
    const id = 'attempt-1';
    const questions = [
      { id: 't1', text: 'What is var?', choices: ['a', 'b', 'c'], time_limit_sec: 30 },
    ];
    return HttpResponse.json({ id, questions }, { status: 201 });
  }),

  http.post(`${API}/trainer/attempt/:id/submit`, () => {
    return HttpResponse.json({ score: 100 });
  }),

  http.post(`${API}/export`, () => {
    const url = 'https://example.com/fake-profile/user-123.json';
    return HttpResponse.json({ url, ttl_seconds: 300 });
  }),

  http.post(`${API}/erase`, () => {
    return HttpResponse.json({ status: 'scheduled' });
  }),
];

