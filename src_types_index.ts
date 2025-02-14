// Type definitions
export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  linkedInUrl?: string;
  resumeUrl?: string;
  analysis?: CandidateAnalysis;
  createdAt: Date;
  updatedAt: Date;
}

export interface CandidateAnalysis {
  strengths: string[];
  weaknesses: string[];
  skills: Skill[];
  experience: WorkExperience[];
  education: Education[];
  keyInsights: string[];
  aiScore: number;
  personalityTraits: string[];
}

export interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'expert';
  yearsOfExperience: number;
}

export interface WorkExperience {
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  responsibilities: string[];
  achievements: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  graduationDate: Date;
}