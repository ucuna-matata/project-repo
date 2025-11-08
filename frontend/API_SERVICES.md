# API Services Documentation

This document describes all available API services connecting the frontend with the backend.

## Table of Contents
1. [Authentication](#authentication)
2. [Profile & CV Management](#profile--cv-management)
3. [Interview Module](#interview-module)
4. [Trainer Module](#trainer-module)
5. [File Management](#file-management)
6. [System](#system)

---

## Authentication

**Service:** `authService` from `services/auth.ts`

### Methods

#### `getGoogleAuthUrl()`
Get the Google OAuth authentication URL.
- **Returns:** `Promise<{ auth_url: string }>`
- **Backend:** `GET /api/auth/google/start`

#### `getCurrentUser()`
Get the current authenticated user information.
- **Returns:** `Promise<User>`
- **Backend:** `GET /api/auth/me`

#### `logout()`
Log out the current user.
- **Returns:** `Promise<void>`
- **Backend:** `POST /api/auth/logout`

---

## Profile & CV Management

**Service:** `profileService` from `services/profile.ts`

### Profile Methods

#### `getProfile()`
Get the user's profile information.
- **Returns:** `Promise<Profile>`
- **Backend:** `GET /api/profile/`

#### `updateProfile(data)`
Update the user's profile.
- **Parameters:** `Partial<Profile>`
- **Returns:** `Promise<Profile>`
- **Backend:** `PUT /api/profile/`

#### `exportAllData()`
Export all user data as JSON (GDPR compliance).
- **Returns:** `Promise<any>`
- **Backend:** `POST /api/export/`

#### `requestDataErasure()`
Request data erasure (GDPR compliance).
- **Returns:** `Promise<any>`
- **Backend:** `POST /api/erase/`

### CV Methods

#### `listCVs()`
List all CVs for the current user.
- **Returns:** `Promise<CV[]>`
- **Backend:** `GET /api/cvs/`

#### `getCV(id)`
Get a specific CV by ID.
- **Parameters:** `id: string`
- **Returns:** `Promise<CV>`
- **Backend:** `GET /api/cvs/{id}/`

#### `createCV(data)`
Create a new CV.
- **Parameters:** `{ title: string; template_key?: string; sections?: Record<string, any> }`
- **Returns:** `Promise<CV>`
- **Backend:** `POST /api/cvs/`

#### `updateCV(id, data)`
Update a specific CV.
- **Parameters:** `id: string, data: Partial<CV>`
- **Returns:** `Promise<CV>`
- **Backend:** `PUT /api/cvs/{id}/`

#### `deleteCV(id)`
Delete a specific CV.
- **Parameters:** `id: string`
- **Returns:** `Promise<void>`
- **Backend:** `DELETE /api/cvs/{id}/`

#### `exportCV(id, format)`
Export a CV as PDF or DOCX.
- **Parameters:** `id: string, format: 'pdf' | 'docx'`
- **Returns:** `Promise<{ blob: Blob; filename: string }>`
- **Backend:** `GET /api/cvs/{id}/export/?format={format}`

#### `generateCV(data, signal?)`
Generate a CV using AI (if implemented).
- **Parameters:** `data: any, signal?: AbortSignal`
- **Returns:** `Promise<CV>`
- **Backend:** `POST /api/cvs/generate/`

---

## Interview Module

**Service:** `interviewService` from `services/interview.ts`

### Methods

#### `createSession(data)`
Create a new interview session.
- **Parameters:** `{ topic: string }`
- **Returns:** `Promise<InterviewSession>`
- **Backend:** `POST /api/interview/sessions`

#### `listSessions()`
List all interview sessions.
- **Returns:** `Promise<InterviewSession[]>`
- **Backend:** `GET /api/interview/sessions/list`

#### `getSession(sessionId)`
Get a specific interview session.
- **Parameters:** `sessionId: string`
- **Returns:** `Promise<InterviewSession>`
- **Backend:** `GET /api/interview/sessions/{sessionId}`

#### `saveAnswer(sessionId, data)`
Save or update an answer during the interview.
- **Parameters:** `sessionId: string, data: { question_id: string; text: string; time_spent: number }`
- **Returns:** `Promise<InterviewSession>`
- **Backend:** `PUT /api/interview/sessions/{sessionId}/answer`

#### `submitInterview(sessionId)`
Submit the interview for evaluation.
- **Parameters:** `sessionId: string`
- **Returns:** `Promise<InterviewSession>`
- **Backend:** `POST /api/interview/sessions/{sessionId}/submit`

#### `getAvailableTopics()`
Get available interview topics (client-side method).
- **Returns:** `string[]`
- **Topics:** `['frontend-basics', 'backend-basics', 'algorithms', 'system-design', 'behavioral']`

---

## Trainer Module

**Service:** `trainerService` from `services/trainer.ts`

### Methods

#### `getCategories()`
Get all available training categories.
- **Returns:** `Promise<{ categories: string[] }>`
- **Backend:** `GET /api/trainer/categories/`

#### `getQuestions(category, count?)`
Get random questions for a specific category.
- **Parameters:** `category: string, count?: number (default: 10)`
- **Returns:** `Promise<TrainerQuestionsResponse>`
- **Backend:** `GET /api/trainer/questions/{category}/?n={count}`

#### `startAttempt(data)`
Start a new training attempt.
- **Parameters:** `{ module_key: string; questions: any[] }`
- **Returns:** `Promise<TrainerAttempt>`
- **Backend:** `POST /api/trainer/start`

#### `submitAttempt(data)`
Submit training results.
- **Parameters:** `{ module_key: string; score: number; max_score: number; metadata: any }`
- **Returns:** `Promise<TrainerAttempt>`
- **Backend:** `POST /api/trainer/submit`

#### `getResults()`
Get all training results for the current user.
- **Returns:** `Promise<TrainerAttempt[]>`
- **Backend:** `GET /api/trainer/results`

#### `getResult(resultId)`
Get a specific training result by ID.
- **Parameters:** `resultId: string`
- **Returns:** `Promise<TrainerAttempt>`
- **Backend:** `GET /api/trainer/results/{resultId}`

---

## File Management

**Service:** `filesService` from `services/files.ts`

### Methods

#### `uploadFile(file)`
Upload a file (CV, documents, etc.).
- **Parameters:** `file: File`
- **Returns:** `Promise<UploadedFile>`
- **Backend:** `POST /api/files/upload/`

#### `deleteFile(fileId)`
Delete a specific file by ID.
- **Parameters:** `fileId: number`
- **Returns:** `Promise<void>`
- **Backend:** `DELETE /api/files/{fileId}/`

#### `getFile(fileId)`
Get file details by ID.
- **Parameters:** `fileId: number`
- **Returns:** `Promise<UploadedFile>`
- **Backend:** `GET /api/files/{fileId}/`

---

## System

**Additional API methods** from `services/api.ts`

### Methods

#### `healthCheck()`
Check if the API is healthy and responsive.
- **Returns:** `Promise<any>`
- **Backend:** `GET /api/healthz/`

#### `askLlama(payload)`
Ask a question to the Llama AI model.
- **Parameters:** `{ prompt: string }`
- **Returns:** `Promise<any>`
- **Backend:** `POST /ask-llama/`

---

## Usage Examples

### Authentication Example
```typescript
import { authService } from './services';

// Login with Google
const { auth_url } = await authService.getGoogleAuthUrl();
window.location.href = auth_url;

// Get current user
const user = await authService.getCurrentUser();
console.log(user);

// Logout
await authService.logout();
```

### Profile Management Example
```typescript
import { profileService } from './services';

// Get profile
const profile = await profileService.getProfile();

// Update profile
const updated = await profileService.updateProfile({
  full_name: 'John Doe',
  summary: 'Experienced developer...'
});
```

### CV Management Example
```typescript
import { profileService } from './services';

// List all CVs
const cvs = await profileService.listCVs();

// Create a new CV
const newCV = await profileService.createCV({
  title: 'Software Engineer CV',
  template_key: 'modern'
});

// Export CV as PDF
const { blob, filename } = await profileService.exportCV(newCV.id, 'pdf');
const url = URL.createObjectURL(blob);
const link = document.createElement('a');
link.href = url;
link.download = filename;
link.click();
```

### Interview Example
```typescript
import { interviewService } from './services';

// Create a new session
const session = await interviewService.createSession({
  topic: 'frontend-basics'
});

// Save an answer
await interviewService.saveAnswer(session.id, {
  question_id: 'fe1',
  text: 'My answer here...',
  time_spent: 120
});

// Submit interview
await interviewService.submitInterview(session.id);
```

### Trainer Example
```typescript
import { trainerService } from './services';

// Get categories
const { categories } = await trainerService.getCategories();

// Get questions
const { questions } = await trainerService.getQuestions('frontend-basics', 10);

// Submit results
await trainerService.submitAttempt({
  module_key: 'frontend-basics',
  score: 8,
  max_score: 10,
  metadata: {
    questions,
    answers: userAnswers,
    time_taken: 300
  }
});
```

### File Upload Example
```typescript
import { filesService } from './services';

// Upload file
const handleFileUpload = async (file: File) => {
  const uploaded = await filesService.uploadFile(file);
  console.log('File uploaded:', uploaded);
};
```

---

## Type Definitions

All services include comprehensive TypeScript type definitions for request and response data. Import types from the service files:

```typescript
import { User } from './services/auth';
import { Profile, CV, Education, Experience } from './services/profile';
import { InterviewSession, InterviewQuestion } from './services/interview';
import { TrainerCategory, TrainerQuestion, TrainerAttempt } from './services/trainer';
import { UploadedFile } from './services/files';
```

---

## Error Handling

All API methods throw errors on failure. Use try-catch blocks:

```typescript
try {
  const profile = await profileService.getProfile();
} catch (error) {
  console.error('Failed to load profile:', error);
  // Handle error (show notification, etc.)
}
```

With React Query:

```typescript
import { useQuery } from '@tanstack/react-query';
import { profileService } from './services';

const { data, isLoading, error } = useQuery({
  queryKey: ['profile'],
  queryFn: profileService.getProfile
});
```

