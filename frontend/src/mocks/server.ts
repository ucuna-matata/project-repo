// MSW Node server for tests (Playwright or Node tests)
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

export function startServer() {
  server.listen({ onUnhandledRequest: 'bypass' });
}

export function stopServer() {
  server.close();
}

export function resetHandlers() {
  server.resetHandlers();
}

