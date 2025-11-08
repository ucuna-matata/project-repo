// MSW browser entrypoint for dev:mock mode
import { setupWorker } from 'msw';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

export async function startMockServiceWorker() {
  if (typeof window === 'undefined') return;
  try {
    await worker.start({ onUnhandledRequest: 'bypass' });
    // console.log('[msw] Mock service worker started');
  } catch (e) {
    console.warn('[msw] Failed to start mock worker', e);
  }
}
