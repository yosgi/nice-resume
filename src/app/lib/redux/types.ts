export type ResumeContactField =
  | string
  | {
      value: string;
      label?: string;
    };

export interface ResumeProfile {
  name: string;
  email: string;
  phone: string;
  url: string;
  urlLabel: string;
  summary: string;
  location: string;
  title: string;
  additionalFields: ResumeContactField[];
  contactOrder: string[];
}

export interface ResumeWorkExperience {
  company: string;
  jobTitle: string;
  date: string;
  descriptions: string[];
  spacing?: number;
}

export interface ResumeEducation {
  school: string;
  degree: string;
  date: string;
  gpa: string;
  descriptions: string[];
  spacing?: number;
}

export interface ResumeProject {
  project: string;
  date: string;
  linkName: string;
  url: string;
  descriptions: string[];
  spacing?: number;
}

export interface FeaturedSkill {
  skill: string;
  rating: number;
}

export interface ResumeSkills {
  featuredSkills: FeaturedSkill[];
  descriptions: string[];
}

export interface ResumeCustom {
  descriptions: string[];
}

export interface Resume {
  profile: ResumeProfile;
  workExperiences: ResumeWorkExperience[];
  educations: ResumeEducation[];
  projects: ResumeProject[];
  skills: ResumeSkills;
  custom: ResumeCustom;
}

export type ResumeKey = keyof Resume;
