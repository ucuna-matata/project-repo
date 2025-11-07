import { z } from 'zod';

export const personalInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().url().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
});

export const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  position: z.string().min(1, 'Position is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  achievements: z.array(z.string()).optional(),
});

export const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
});

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  url: z.string().url().optional().or(z.literal('')),
  technologies: z.array(z.string()).optional(),
});

export const cvFormSchema = z.object({
  title: z.string().min(1, 'CV title is required'),
  template_key: z.enum(['clean', 'two-column']),
  personal: personalInfoSchema,
  summary: z.string().optional(),
  experience: z.array(experienceSchema),
  education: z.array(educationSchema),
  skills: z.array(z.string()),
  projects: z.array(projectSchema).optional(),
});

export type CVFormData = z.infer<typeof cvFormSchema>;
