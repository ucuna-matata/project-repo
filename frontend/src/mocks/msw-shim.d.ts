// Minimal type shims for MSW to satisfy TypeScript in the editor environment.
/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'msw' {
  export const rest: any;
  export function setupWorker(...handlers: any[]): any;
}

declare module 'msw/node' {
  export function setupServer(...handlers: any[]): any;
}

