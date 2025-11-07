// MSW browser entrypoint for dev:mock mode
// @ts-ignore - optional dev-only dependency; shim available in src/mocks/msw-shim.d.ts
import { setupWorker } from 'msw';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

export async function startMockServiceWorker() {
  if (typeof window === 'undefined') return;
  try {
    await worker.start({ onUnhandledRequest: 'bypass' });
    // console.log('[msw] Mock service worker started');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[msw] Failed to start mock worker', e);
  }
}
