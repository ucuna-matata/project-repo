// Trainer service for quiz and learning modules
import * as api from './api';

export interface TrainerCategory {
  id: string;
  name: string;
}

export interface TrainerQuestion {
  id: string;
  text: string;
  options: string[];
  correct: number;
}

export interface TrainerQuestionsResponse {
  category: string;
  count: number;
  questions: TrainerQuestion[];
}

export interface TrainerAttempt {
  id: string;
  module_key: string;
  score: number;
  max_score: number;
  attempts: number;
  metadata: {
    questions: Array<Record<string, unknown>>;
    answers: Array<Record<string, unknown>>;
    time_taken?: number;
  };
  created_at: string;
}

export const trainerService = {
  /**
   * Get all available training categories
   */
  async getCategories(): Promise<{ categories: string[] }> {
    return api.getTrainerCategories();
  },

  /**
   * Get random questions for a specific category
   */
  async getQuestions(category: string, count: number = 10): Promise<TrainerQuestionsResponse> {
    return api.getTrainerQuestions(category, count);
  },

  /**
   * Start a new training attempt
   */
  async startAttempt(data: { module_key: string; questions: Array<Record<string, unknown>> }): Promise<TrainerAttempt> {
    return api.startTrainerAttempt(data);
  },

  /**
   * Submit training results
   */
  async submitAttempt(data: {
    module_key: string;
    score: number;
    max_score: number;
    metadata: Record<string, unknown>;
  }): Promise<TrainerAttempt> {
    return api.submitTrainerAttempt(data);
  },

  /**
   * Get all training results for the current user
   */
  async getResults(): Promise<TrainerAttempt[]> {
    return api.listTrainerResults();
  },

  /**
   * Get a specific training result by ID
   */
  async getResult(resultId: string): Promise<TrainerAttempt> {
    return api.getTrainerResult(resultId);
  },
};

