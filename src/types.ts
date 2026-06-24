export interface Project {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  features: string[];
  techStack: string[];
  category: 'Web Dev' | 'AI/ML' | 'Data Analytics';
  liveUrl: string;
  githubUrl: string;
  iconType: 'globe' | 'cpu' | 'database' | 'image' | 'bookOpen';
}

export interface Experience {
  _id?: string;
  id?: string;
  role: string;
  organization: string;
  duration: string;
  highlights: string[];
  type: 'experience' | 'milestone';
  badge?: string;
}

export interface Skill {
  _id?: string;
  id?: string;
  name: string;
  category: 'Core Tech' | 'Languages & Data' | 'AI/ML & Tools';
  proficiency: number; // 0 to 100
}

export interface ContactMessage {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: string;
  replyText?: string;
  repliedAt?: string;
}

export interface EducationEntry {
  _id?: string;
  id?: string;
  institution: string;
  degree: string;
  duration: string;
  concentration: string;
  badge?: string;
}

export interface ProfileBio {
  _id?: string;
  id?: string;
  title: string;
  subtitle: string;
  bioParagraph1: string;
  bioParagraph2: string;
  academicPillar1Title: string;
  academicPillar1Desc: string;
  academicPillar2Title: string;
  academicPillar2Desc: string;
  academicPillar3Title: string;
  academicPillar3Desc: string;
}

