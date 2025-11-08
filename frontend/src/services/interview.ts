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

export interface InterviewSession {
  id: string;
  topic: string;
  questions: InterviewQuestion[];
  answers: InterviewAnswer[];
  status: 'in_progress' | 'completed' | 'abandoned';
  score?: number;
  feedback?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface InterviewSessionCreate {
  topic: string;
}

export const interviewService = {
  /**
   * Create a new interview session
   */
  async createSession(data: InterviewSessionCreate): Promise<InterviewSession> {
    return api.createInterviewSession(data);
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
    return api.saveInterviewAnswer(sessionId, data);
  },

  /**
   * Submit the interview for evaluation
   */
  async submitInterview(sessionId: string): Promise<InterviewSession> {
    return api.submitInterview(sessionId);
  },

  /**
   * Get available interview topics
   */
  getAvailableTopics(): string[] {
    return ['frontend-basics', 'backend-basics', 'algorithms', 'system-design', 'behavioral'];
  },
};

