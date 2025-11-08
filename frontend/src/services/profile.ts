// Profile and CV service for frontend
import * as api from './api';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  links: Record<string, string>;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
  summary: string;
  preferences: Record<string, any>;
  updated_at: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  description: string;
}

export interface Experience {
  title: string;
  company: string;
  start: string;
  end: string;
  description: string;
}

export interface Skill {
  name: string;
  category?: string;
  level: string;
}

export interface Project {
  title: string;
  description: string;
  tech: string;
  link: string;
}

export interface CV {
  id: string;
  title: string;
  template_key: string;
  sections: Record<string, any>;
  rendered_pdf_url?: string;
  version: number;
  changelog: any[];
  created_at: string;
  updated_at: string;
}

export const profileService = {
  async getProfile(): Promise<Profile> {
    return api.getProfile();
  },

  async updateProfile(data: Partial<Profile>): Promise<Profile> {
    return api.updateProfile(data);
  },

  async listCVs(): Promise<CV[]> {
    return api.listCVs();
  },

  async getCV(id: string): Promise<CV> {
    return api.getCV(id);
  },

  async createCV(data: { title: string; template_key?: string; sections?: Record<string, any> }): Promise<CV> {
    return api.createCV(data);
  },

  async updateCV(id: string, data: Partial<CV>): Promise<CV> {
    return api.updateCV(id, data);
  },

  async deleteCV(id: string): Promise<void> {
    return api.deleteCV(id);
  },

  async exportCV(id: string, format: 'pdf' | 'docx'): Promise<{ blob: Blob; filename: string }> {
    return api.exportCV(id, format);
  },

  async exportAllData(): Promise<any> {
    return api.exportProfile();
  },

  async requestDataErasure(): Promise<any> {
    return api.eraseData();
  },
};

