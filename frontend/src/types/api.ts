// Comprehensive types for frontend based on technical spec
export type UUID = string;

export interface UserProfile {
  id: UUID;
  email: string;
  full_name?: string;
  avatar_url?: string;
  locale?: 'en' | 'uk';
  profile?: Profile;
}

export interface Profile {
  links?: Record<string, string>;
  education?: EducationEntry[];
  experience?: ExperienceEntry[];
  skills?: string[];
  summary?: string;
}

export interface EducationEntry {
  institution: string;
  degree: string;
  start_date: string;
  end_date?: string;
  location?: string;
  description?: string;
}

export interface ExperienceEntry {
  company: string;
  position: string;
  start_date: string;
  end_date?: string;
  location?: string;
  description?: string;
  achievements?: string[];
}

export interface CV {
  id: UUID;
  user_id: UUID;
  title: string;
  template_key: 'clean' | 'two-column' | 'modern' | 'professional';
  sections: CVSections;
  rendered_pdf_url?: string;
  version?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CVSections {
  personal?: PersonalInfo;
  summary?: string;
  experience?: ExperienceEntry[];
  education?: EducationEntry[];
  skills?: string[];
  projects?: ProjectEntry[];
  [key: string]: unknown;
}

export interface PersonalInfo {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
  photo?: string;
  title?: string;
}

export interface ProjectEntry {
  name: string;
  description?: string;
  url?: string;
  technologies?: string[];
}

export interface InterviewSession {
  id: UUID;
  questions: InterviewQuestion[];
  status?: 'in_progress' | 'completed';
}

export interface InterviewQuestion {
  id: string;
  text: string;
  time_limit_sec: number;
}

export interface InterviewResult {
  score: number;
  checklist: ChecklistItem[];
  ai_feedback: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  passed: boolean;
}

export interface TrainerAttempt {
  id: UUID;
  questions: TrainerQuestion[];
  status?: 'in_progress' | 'completed';
}

export interface TrainerQuestion {
  id: string;
  text: string;
  choices: string[];
  time_limit_sec?: number;
}

export interface TrainerResult {
  score: number;
  correct_count?: number;
  total_count?: number;
  details?: Array<Record<string, unknown>>;
}

export interface ExportResponse {
  url: string;
  ttl_seconds: number;
}

export interface GenerateCVRequest {
  targetRole: string;
  experienceLevel?: string;
  additionalContext?: string;
}

export interface GenerateCVResponse {
  sections: CVSections;
  notes?: string;
}
