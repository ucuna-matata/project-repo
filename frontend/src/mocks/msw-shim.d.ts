// Minimal type shims for MSW to satisfy TypeScript in the editor environment.
declare module 'msw' {
  export const rest: any;
  export function setupWorker(...handlers: any[]): any;
}

declare module 'msw/node' {
  export function setupServer(...handlers: any[]): any;
}

