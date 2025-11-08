// Central export for all services
export * from './api';
export * from './auth';
export * from './profile';
export * from './trainer';
export * from './interview';
export * from './files';

// Re-export services as named exports
export { authService } from './auth';
export { profileService } from './profile';
export { trainerService } from './trainer';
export { interviewService } from './interview';
export { filesService } from './files';

