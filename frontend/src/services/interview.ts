// Interview service for mock interviews
import * as api from './api';

export interface InterviewQuestion {
  id: string;
  text: string;
  category: string;
  expected_points?: string[];
}

export interface InterviewAnswer {
  question_id: string;
  text: string;
  time_spent: number;
}

export interface AIFeedback {
  strengths: string[];
  weaknesses: string[];
  tips: string[];
  overall_assessment: string;
with  recommendation?: string;
}

export interface DetailedReview {
  question_id: string;
  answer_review: string;
  score: number;
  suggestions: string;
}

export interface ChecklistItem {
  criterion: string;
  passed: boolean;
}

export interface InterviewSession {
  id: string;
  topic: string;
  questions: InterviewQuestion[];
  answers: InterviewAnswer[];
  status: 'in_progress' | 'completed' | 'abandoned';
  score?: number;
  feedback?: string;
  ai_feedback?: AIFeedback;
  detailed_review?: DetailedReview[];
  checklist?: ChecklistItem[];
  can_retake?: boolean;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  started_at?: string;
  ended_at?: string;
  duration_sec?: number;
}

export interface InterviewSessionCreate {
  topic: string;
}

export const interviewService = {
  /**
   * Create a new interview session
   */
  async createSession(data: InterviewSessionCreate): Promise<InterviewSession> {
    return api.createInterviewSession(data as unknown as Record<string, unknown>);
  },

  /**
   * Get all interview sessions for the current user
   */
  async listSessions(): Promise<InterviewSession[]> {
    return api.listInterviewSessions();
  },

  /**
   * Get a specific interview session by ID
   */
  async getSession(sessionId: string): Promise<InterviewSession> {
    return api.getInterviewSession(sessionId);
  },

  /**
   * Save or update an answer during the interview
   */
  async saveAnswer(
    sessionId: string,
    data: { question_id: string; text: string; time_spent: number }
  ): Promise<InterviewSession> {
    return api.saveInterviewAnswer(sessionId, data as unknown as Record<string, unknown>);
  },

  /**
   * Submit the interview for evaluation
   */
  async submitInterview(sessionId: string): Promise<InterviewSession> {
    return api.submitInterview(sessionId);
  },

  /**
   * Get an AI hint for a specific question
   */
  async getHint(
    sessionId: string,
    questionId: string,
    currentAnswer?: string
  ): Promise<{ hint: string }> {
    return api.getInterviewHint(sessionId, {
      question_id: questionId,
      current_answer: currentAnswer || '',
    } as unknown as Record<string, unknown>);
  },

  /**
   * Retake an interview (create new session based on completed one)
   */
  async retakeInterview(sessionId: string): Promise<InterviewSession> {
    return api.retakeInterview(sessionId);
  },

  /**
   * Get available interview topics
   */
  getAvailableTopics(): string[] {
    return ['frontend-basics', 'backend-basics', 'algorithms', 'system-design', 'behavioral'];
  },
};

