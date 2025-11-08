// React Query hooks for API services
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  authService,
  profileService,
  interviewService,
  trainerService,
  filesService
} from '../services';

// ============ Authentication Hooks ============

export function useCurrentUser() {
  return useQuery({
    queryKey: ['me'],
    queryFn: authService.getCurrentUser,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

// ============ Profile Hooks ============

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: profileService.getProfile,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

// ============ CV Hooks ============

export function useCVs() {
  return useQuery({
    queryKey: ['cvs'],
    queryFn: profileService.listCVs,
  });
}

export function useCV(id: string) {
  return useQuery({
    queryKey: ['cv', id],
    queryFn: () => profileService.getCV(id),
    enabled: !!id,
  });
}

export function useCreateCV() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileService.createCV,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cvs'] });
    },
  });
}

export function useUpdateCV() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      profileService.updateCV(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cv', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['cvs'] });
    },
  });
}

export function useDeleteCV() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileService.deleteCV,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cvs'] });
    },
  });
}

export function useExportCV() {
  return useMutation({
    mutationFn: ({ id, format }: { id: string; format: 'pdf' | 'docx' }) =>
      profileService.exportCV(id, format),
    onSuccess: ({ blob, filename }) => {
      // Automatically download the file
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
  });
}

// ============ Interview Hooks ============

export function useInterviewSessions() {
  return useQuery({
    queryKey: ['interview-sessions'],
    queryFn: interviewService.listSessions,
  });
}

export function useInterviewSession(sessionId: string) {
  return useQuery({
    queryKey: ['interview-session', sessionId],
    queryFn: () => interviewService.getSession(sessionId),
    enabled: !!sessionId,
  });
}

export function useCreateInterviewSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: interviewService.createSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interview-sessions'] });
    },
  });
}

export function useSaveInterviewAnswer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, data }: { sessionId: string; data: { question_id: string; text: string; time_spent: number } }) =>
      interviewService.saveAnswer(sessionId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['interview-session', variables.sessionId]
      });
    },
  });
}

export function useSubmitInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: interviewService.submitInterview,
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ queryKey: ['interview-session', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['interview-sessions'] });
    },
  });
}

// ============ Trainer Hooks ============

export function useTrainerCategories() {
  return useQuery({
    queryKey: ['trainer-categories'],
    queryFn: trainerService.getCategories,
  });
}

export function useTrainerQuestions(category: string, count: number = 10) {
  return useQuery({
    queryKey: ['trainer-questions', category, count],
    queryFn: () => trainerService.getQuestions(category, count),
    enabled: !!category,
  });
}

export function useTrainerResults() {
  return useQuery({
    queryKey: ['trainer-results'],
    queryFn: trainerService.getResults,
  });
}

export function useTrainerResult(resultId: string) {
  return useQuery({
    queryKey: ['trainer-result', resultId],
    queryFn: () => trainerService.getResult(resultId),
    enabled: !!resultId,
  });
}

export function useSubmitTrainerAttempt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: trainerService.submitAttempt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainer-results'] });
    },
  });
}

// ============ File Hooks ============

export function useUploadFile() {
  return useMutation({
    mutationFn: filesService.uploadFile,
  });
}

export function useDeleteFile() {
  return useMutation({
    mutationFn: filesService.deleteFile,
  });
}

// ============ Data Export Hooks ============

export function useExportAllData() {
  return useMutation({
    mutationFn: profileService.exportAllData,
    onSuccess: (data) => {
      // Automatically download the exported data
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `user-data-export-${new Date().toISOString()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },
  });
}

export function useRequestDataErasure() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileService.requestDataErasure,
    onSuccess: () => {
      queryClient.clear();
    },
  });
}

