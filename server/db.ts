import * as fs from 'fs';
import * as path from 'path';
import mongoose, { Schema, model, connect, connection } from 'mongoose';
import { Project, Experience, Skill, ContactMessage, EducationEntry, ProfileBio } from '../src/types';
import dotenv from 'dotenv';

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;
const DATA_DIR = path.join(process.cwd(), 'data');
const JSON_DB_PATH = path.join(DATA_DIR, 'portfolio_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure local JSON DB file exists with pre-seeded data if empty
const defaultProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'HireHub',
    description: 'Developed an AI-powered student job portal using React.js and FastAPI, integrating external APIs to provide real-time job listings. Implemented an AI chatbot for job search assistance and career guidance, and designed a skill-based job recommendation and filtering system.',
    features: [
      'Developed an AI-powered student job portal using React.js and FastAPI',
      'Integrating external APIs (Adzuna, Remotive, Muse) to provide real-time job listings',
      'Implemented an AI chatbot for job search assistance and career guidance',
      'Designed a skill-based job recommendation and filtering system to reduce information overload'
    ],
    techStack: ['React.js', 'FastAPI', 'Adzuna API', 'Remotive API', 'Muse API', 'Tailwind CSS', 'MongoDB'],
    category: 'AI/ML',
    liveUrl: '#',
    githubUrl: 'https://github.com/gaurav1642/hireHub',
    iconType: 'cpu'
  },
  {
    id: 'proj-2',
    title: 'Prompt2art',
    description: 'Built a full-stack AI text-to-image generator using the MERN stack, integrating the Clipdrop API to generate high-quality images from user prompts. Implemented secure Razorpay payments and REST APIs with Node.js & Express.',
    features: [
      'Built full-stack AI text-to-image generator using MERN stack',
      'Integrating Clipdrop API to generate high-quality images from user prompts',
      'Implemented secure Razorpay payments and REST APIs with Node.js & Express',
      'MongoDB handling user data, prompts, images, and transaction records'
    ],
    techStack: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Tailwind CSS', 'Clipdrop API', 'Razorpay SDK'],
    category: 'AI/ML',
    liveUrl: '#',
    githubUrl: 'https://github.com/gaurav1642/prompt2art',
    iconType: 'image'
  },
  {
    id: 'proj-3',
    title: 'Poke Vision',
    description: 'Built a responsive React web app that integrates with the PokéAPI to display detailed Pokémon data including types, abilities, stats, and images. Implemented real-time search functionality with dynamic rendering using React hooks.',
    features: [
      'Built a responsive React web app integrating with PokéAPI',
      'Display detailed Pokémon data including types, abilities, stats, and images',
      'Implemented real-time search functionality with dynamic rendering using React hooks',
      'Applied modular code structure and responsive CSS design'
    ],
    techStack: ['React.js', 'JavaScript', 'HTML', 'CSS', 'PokéAPI'],
    category: 'Web Dev',
    liveUrl: '#',
    githubUrl: 'https://github.com/gaurav1642/poke-vision',
    iconType: 'globe'
  }
];

const defaultExperiences: Experience[] = [
  {
    id: 'exp-1',
    role: 'Freelance Web Designer',
    organization: 'Growbyte, Czech Republic (Remote)',
    duration: 'Jan 2025 - May 2025',
    highlights: [
      'Delivered high-impact website redesigns through detailed client requirement analysis and competitor research.',
      'Used AI-powered tools to streamline prototyping and accelerate delivery time.',
      'Improved customer satisfaction by 25% via user-centric UI/UX strategies.',
      'Collaborated directly with international clients, ensuring high-quality project execution.'
    ],
    type: 'experience',
    badge: 'Remote'
  },
  {
    id: 'exp-2',
    role: 'B.Tech Computer Science Candidate',
    organization: 'J.B. Institute of Technology',
    duration: '2022 - 2026',
    highlights: [
      'Studying core areas: ML modeling, database management systems, and data structures.',
      'Completed various technical tracks on algorithm design and full-stack engineering.'
    ],
    type: 'milestone',
    badge: 'Dehradun'
  },
  {
    id: 'exp-3',
    role: 'PCM Graduate',
    organization: 'Spring Bells School',
    duration: '2020 - 2022',
    highlights: [
      'Completed secondary pre-university board training with exceptional focus on Physics, Chemistry, and Mathematics.',
      'Obtained pre-university certification with strong metrics in quantitative sciences.'
    ],
    type: 'milestone',
    badge: 'Pre-University'
  }
];

const defaultSkills: Skill[] = [
  { id: 'sk-1', name: 'React.js & Next.js', category: 'Core Tech', proficiency: 92 },
  { id: 'sk-2', name: 'Node.js & Express.js', category: 'Core Tech', proficiency: 88 },
  { id: 'sk-3', name: 'Tailwind CSS & Modern UX', category: 'Core Tech', proficiency: 95 },
  { id: 'sk-4', name: 'Python & C/C++', category: 'Languages & Data', proficiency: 90 },
  { id: 'sk-5', name: 'SQL & Relational Databases', category: 'Languages & Data', proficiency: 88 },
  { id: 'sk-6', name: 'JavaScript & TypeScript', category: 'Languages & Data', proficiency: 94 },
  { id: 'sk-7', name: 'Data Science (Pandas, Numpy, Seaborn)', category: 'Languages & Data', proficiency: 85 },
  { id: 'sk-8', name: 'Git & GitHub', category: 'AI/ML & Tools', proficiency: 90 },
  { id: 'sk-9', name: 'Cursor & GenAI Workflows', category: 'AI/ML & Tools', proficiency: 95 },
  { id: 'sk-10', name: 'Jupyter Notebook & Data Labs', category: 'AI/ML & Tools', proficiency: 86 },
  { id: 'sk-11', name: 'Postman, Netlify & Render Deployments', category: 'AI/ML & Tools', proficiency: 88 }
];

const defaultEducation: EducationEntry[] = [
  {
    id: 'edu-1',
    institution: 'J.B. Institute of Technology',
    degree: 'Bachelor of Technology – Computer Science',
    duration: '2022 - 2026',
    concentration: 'B.Tech Graduation in Dehradun. Key focus areas: ML modeling, database systems, data structures, and software engineering design.',
    badge: 'Dehradun'
  },
  {
    id: 'edu-2',
    institution: 'Spring Bells School',
    degree: 'PCM (Physics, Chemistry, Mathematics)',
    duration: '2020 - 2022',
    concentration: 'Secondary board pre-university training with high metrics in quantitative sciences.',
    badge: 'Saharanpur'
  }
];

const defaultProfileBio: ProfileBio = {
  id: 'bio-1',
  title: 'B.Tech Student & Software Engineer',
  subtitle: 'Computer Science Graduate & Full-Stack Developer',
  bioParagraph1: 'I am a final-year B.Tech Student in Computer Science and Engineering who is highly motivated to solve complex actual problems using software development and data science. Interfacing between high-quality frontend views, secure backend route controllers, and clean databases, I build robust, full-stack pipelines that deliver measurable user value.',
  bioParagraph2: 'My development interests span across clean interface styles, REST APIs with Node.js & Express, and data analysis using Python tools. I emphasize writing robust algorithms, maintaining clean directory architectures, and constructing reliable system integrations that deliver polished business products.',
  academicPillar1Title: 'Full-Stack Web Dev',
  academicPillar1Desc: 'Developing MERN solutions, React frontends, and Express API endpoints.',
  academicPillar2Title: 'Database Management (DBMS)',
  academicPillar2Desc: 'Enterprise query structuring, relational SQL databases, and JSON collection indexing.',
  academicPillar3Title: 'Data Structures & Algorithms',
  academicPillar3Desc: 'Optimizing runtime computation speeds, arrays, trees, and logic solvers.'
};

interface JsonDatabaseSchema {
  projects: Project[];
  experiences: Experience[];
  skills: Skill[];
  messages: ContactMessage[];
  education: EducationEntry[];
  profileBio: ProfileBio;
}

function initJsonDatabase() {
  if (!fs.existsSync(JSON_DB_PATH)) {
    const defaultData: JsonDatabaseSchema = {
      projects: defaultProjects,
      experiences: defaultExperiences,
      skills: defaultSkills,
      messages: [],
      education: defaultEducation,
      profileBio: defaultProfileBio
    };
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(defaultData, null, 2), 'utf-8');
  } else {
    // Migrate if keys are missing
    try {
      const raw = fs.readFileSync(JSON_DB_PATH, 'utf-8');
      const data = JSON.parse(raw);
      let changed = false;
      if (!data.education) {
        data.education = defaultEducation;
        changed = true;
      }
      if (!data.profileBio) {
        data.profileBio = defaultProfileBio;
        changed = true;
      }
      if (changed) {
        fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
      }
    } catch (e) {
      console.error('Error migrating json DB:', e);
    }
  }
}
initJsonDatabase();

// ----------------------------------------------------
// MONGOOSE MODE RULES: DEFINE SCHEMAS AND MODELS
// ----------------------------------------------------

const ProjectSchema = new Schema<Project>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  features: [{ type: String }],
  techStack: [{ type: String }],
  category: { type: String, enum: ['Web Dev', 'AI/ML', 'Data Analytics'], required: true },
  liveUrl: { type: String, default: '#' },
  githubUrl: { type: String, default: '#' },
  iconType: { type: String, enum: ['globe', 'cpu', 'database', 'image', 'bookOpen'], default: 'globe' }
});

const ExperienceSchema = new Schema<Experience>({
  role: { type: String, required: true },
  organization: { type: String, required: true },
  duration: { type: String, required: true },
  highlights: [{ type: String }],
  type: { type: String, enum: ['experience', 'milestone'], required: true },
  badge: { type: String }
});

const SkillSchema = new Schema<Skill>({
  name: { type: String, required: true },
  category: { type: String, enum: ['Core Tech', 'Languages & Data', 'AI/ML & Tools'], required: true },
  proficiency: { type: Number, required: true, min: 0, max: 100 }
});

const ContactMessageSchema = new Schema<ContactMessage>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toISOString() },
  replyText: { type: String },
  repliedAt: { type: String }
});

const EducationSchema = new Schema<EducationEntry>({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  duration: { type: String, required: true },
  concentration: { type: String, required: true },
  badge: { type: String }
});

const ProfileBioSchema = new Schema<ProfileBio>({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  bioParagraph1: { type: String, required: true },
  bioParagraph2: { type: String, required: true },
  academicPillar1Title: { type: String, required: true },
  academicPillar1Desc: { type: String, required: true },
  academicPillar2Title: { type: String, required: true },
  academicPillar2Desc: { type: String, required: true },
  academicPillar3Title: { type: String, required: true },
  academicPillar3Desc: { type: String, required: true }
});

// Register models
const MongoProject = mongoose.models.Project || model<Project>('Project', ProjectSchema);
const MongoExperience = mongoose.models.Experience || model<Experience>('Experience', ExperienceSchema);
const MongoSkill = mongoose.models.Skill || model<Skill>('Skill', SkillSchema);
const MongoContactMessage = mongoose.models.ContactMessage || model<ContactMessage>('ContactMessage', ContactMessageSchema);
const MongoEducation = mongoose.models.Education || model<EducationEntry>('Education', EducationSchema);
const MongoProfileBio = mongoose.models.ProfileBio || model<ProfileBio>('ProfileBio', ProfileBioSchema);

let isConnectedToMongo = false;

export async function connectToDatabase() {
  const isPlaceholder = !MONGODB_URI || 
                        MONGODB_URI.includes('cluster.mongodb.net') || 
                        MONGODB_URI.includes('user:pass') || 
                        MONGODB_URI.includes('your_connection_string') ||
                        MONGODB_URI.trim() === '';

  if (MONGODB_URI && !isPlaceholder) {
    try {
      console.log('Attempting to connect to MongoDB (3s timeout limit)...');
      await connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
      isConnectedToMongo = true;
      console.log('Successfully connected to MongoDB.');
      
      // Pre-seed MongoDB if collection is empty
      const projectCount = await MongoProject.countDocuments();
      if (projectCount === 0) {
        await MongoProject.insertMany(defaultProjects);
        await MongoExperience.insertMany(defaultExperiences);
        await MongoSkill.insertMany(defaultSkills);
        await MongoEducation.insertMany(defaultEducation);
        await MongoProfileBio.create(defaultProfileBio);
        console.log('Successfully pre-seeded MongoDB collections.');
      }
    } catch (err: any) {
      console.log(`Failed to connect to MongoDB (${err.name || 'Error'}: ${err.message || err}), falling back to local file storage.`);
      isConnectedToMongo = false;
    }
  } else {
    console.log('Using local file storage database fallback. (No custom MongoDB URI configured)');
    isConnectedToMongo = false;
  }
}

// ----------------------------------------------------
// DATABASE INTERFACE LAYER COMPATIBLE WITH BOTH MODES
// ----------------------------------------------------

function readLocalDb(): JsonDatabaseSchema {
  try {
    initJsonDatabase();
    const raw = fs.readFileSync(JSON_DB_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local file DB:', err);
    return { projects: [], experiences: [], skills: [], messages: [], education: defaultEducation, profileBio: defaultProfileBio };
  }
}

function writeLocalDb(data: JsonDatabaseSchema) {
  try {
    fs.writeFileSync(JSON_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local file DB:', err);
  }
}

const ProjectModel = MongoProject as any;
const ExperienceModel = MongoExperience as any;
const SkillModel = MongoSkill as any;
const ContactMessageModel = MongoContactMessage as any;
const EducationModel = MongoEducation as any;
const ProfileBioModel = MongoProfileBio as any;

export const db = {
  // --- PROJECTS CRUD ---
  getProjects: async (): Promise<Project[]> => {
    if (isConnectedToMongo) {
      const items = await ProjectModel.find({});
      return items.map((p: any) => ({
        _id: p._id.toString(),
        id: p._id.toString(),
        title: p.title,
        description: p.description,
        features: p.features,
        techStack: p.techStack,
        category: p.category,
        liveUrl: p.liveUrl,
        githubUrl: p.githubUrl,
        iconType: p.iconType
      }));
    } else {
      return readLocalDb().projects;
    }
  },

  createProject: async (proj: Omit<Project, 'id' | '_id'>): Promise<Project> => {
    if (isConnectedToMongo) {
      const newProj = new MongoProject(proj);
      const saved = await newProj.save();
      return { ...proj, _id: saved._id.toString(), id: saved._id.toString() };
    } else {
      const local = readLocalDb();
      const newProj: Project = {
        ...proj,
        id: 'proj-' + Math.random().toString(36).substr(2, 9)
      };
      local.projects.push(newProj);
      writeLocalDb(local);
      return newProj;
    }
  },

  updateProject: async (id: string, proj: Partial<Project>): Promise<Project | null> => {
    if (isConnectedToMongo) {
      const updated = await ProjectModel.findByIdAndUpdate(id, proj, { new: true });
      if (!updated) return null;
      return {
        _id: updated._id.toString(),
        id: updated._id.toString(),
        title: updated.title,
        description: updated.description,
        features: updated.features,
        techStack: updated.techStack,
        category: updated.category,
        liveUrl: updated.liveUrl,
        githubUrl: updated.githubUrl,
        iconType: updated.iconType
      };
    } else {
      const local = readLocalDb();
      const index = local.projects.findIndex(p => p.id === id);
      if (index === -1) return null;
      local.projects[index] = { ...local.projects[index], ...proj };
      writeLocalDb(local);
      return local.projects[index];
    }
  },

  deleteProject: async (id: string): Promise<boolean> => {
    if (isConnectedToMongo) {
      const res = await ProjectModel.findByIdAndDelete(id);
      return !!res;
    } else {
      const local = readLocalDb();
      const initialLength = local.projects.length;
      local.projects = local.projects.filter(p => p.id !== id);
      if (local.projects.length === initialLength) return false;
      writeLocalDb(local);
      return true;
    }
  },

  // --- EXPERIENCE CRUD ---
  getExperiences: async (): Promise<Experience[]> => {
    if (isConnectedToMongo) {
      const items = await ExperienceModel.find({});
      return items.map((e: any) => ({
        _id: e._id.toString(),
        id: e._id.toString(),
        role: e.role,
        organization: e.organization,
        duration: e.duration,
        highlights: e.highlights,
        type: e.type,
        badge: e.badge
      }));
    } else {
      return readLocalDb().experiences;
    }
  },

  createExperience: async (exp: Omit<Experience, 'id' | '_id'>): Promise<Experience> => {
    if (isConnectedToMongo) {
      const newExp = new MongoExperience(exp);
      const saved = await newExp.save();
      return { ...exp, _id: saved._id.toString(), id: saved._id.toString() };
    } else {
      const local = readLocalDb();
      const newExp: Experience = {
        ...exp,
        id: 'exp-' + Math.random().toString(36).substr(2, 9)
      };
      local.experiences.push(newExp);
      writeLocalDb(local);
      return newExp;
    }
  },

  updateExperience: async (id: string, exp: Partial<Experience>): Promise<Experience | null> => {
    if (isConnectedToMongo) {
      const updated = await ExperienceModel.findByIdAndUpdate(id, exp, { new: true });
      if (!updated) return null;
      return {
        _id: updated._id.toString(),
        id: updated._id.toString(),
        role: updated.role,
        organization: updated.organization,
        duration: updated.duration,
        highlights: updated.highlights,
        type: updated.type,
        badge: updated.badge
      };
    } else {
      const local = readLocalDb();
      const index = local.experiences.findIndex(e => e.id === id);
      if (index === -1) return null;
      local.experiences[index] = { ...local.experiences[index], ...exp };
      writeLocalDb(local);
      return local.experiences[index];
    }
  },

  deleteExperience: async (id: string): Promise<boolean> => {
    if (isConnectedToMongo) {
      const res = await ExperienceModel.findByIdAndDelete(id);
      return !!res;
    } else {
      const local = readLocalDb();
      const initialLength = local.experiences.length;
      local.experiences = local.experiences.filter(e => e.id !== id);
      if (local.experiences.length === initialLength) return false;
      writeLocalDb(local);
      return true;
    }
  },

  // --- SKILLS CRUD ---
  getSkills: async (): Promise<Skill[]> => {
    if (isConnectedToMongo) {
      const items = await SkillModel.find({});
      return items.map((s: any) => ({
        _id: s._id.toString(),
        id: s._id.toString(),
        name: s.name,
        category: s.category,
        proficiency: s.proficiency
      }));
    } else {
      return readLocalDb().skills;
    }
  },

  createSkill: async (skill: Omit<Skill, 'id' | '_id'>): Promise<Skill> => {
    if (isConnectedToMongo) {
      const newSkill = new MongoSkill(skill);
      const saved = await newSkill.save();
      return { ...skill, _id: saved._id.toString(), id: saved._id.toString() };
    } else {
      const local = readLocalDb();
      const newSkill: Skill = {
        ...skill,
        id: 'sk-' + Math.random().toString(36).substr(2, 9)
      };
      local.skills.push(newSkill);
      writeLocalDb(local);
      return newSkill;
    }
  },

  updateSkill: async (id: string, skill: Partial<Skill>): Promise<Skill | null> => {
    if (isConnectedToMongo) {
      const updated = await SkillModel.findByIdAndUpdate(id, skill, { new: true });
      if (!updated) return null;
      return {
        _id: updated._id.toString(),
        id: updated._id.toString(),
        name: updated.name,
        category: updated.category,
        proficiency: updated.proficiency
      };
    } else {
      const local = readLocalDb();
      const index = local.skills.findIndex(s => s.id === id);
      if (index === -1) return null;
      local.skills[index] = { ...local.skills[index], ...skill };
      writeLocalDb(local);
      return local.skills[index];
    }
  },

  deleteSkill: async (id: string): Promise<boolean> => {
    if (isConnectedToMongo) {
      const res = await SkillModel.findByIdAndDelete(id);
      return !!res;
    } else {
      const local = readLocalDb();
      const initialLength = local.skills.length;
      local.skills = local.skills.filter(s => s.id !== id);
      if (local.skills.length === initialLength) return false;
      writeLocalDb(local);
      return true;
    }
  },

  updateSkillProficiency: async (id: string, proficiency: number): Promise<Skill | null> => {
    if (isConnectedToMongo) {
      const updated = await SkillModel.findByIdAndUpdate(id, { proficiency }, { new: true });
      if (!updated) return null;
      return {
        _id: updated._id.toString(),
        id: updated._id.toString(),
        name: updated.name,
        category: updated.category,
        proficiency: updated.proficiency
      };
    } else {
      const local = readLocalDb();
      const index = local.skills.findIndex(s => s.id === id);
      if (index === -1) return null;
      local.skills[index].proficiency = proficiency;
      writeLocalDb(local);
      return local.skills[index];
    }
  },

  // --- EDUCATION CRUD ---
  getEducationEntries: async (): Promise<EducationEntry[]> => {
    if (isConnectedToMongo) {
      const items = await EducationModel.find({});
      return items.map((edu: any) => ({
        _id: edu._id.toString(),
        id: edu._id.toString(),
        institution: edu.institution,
        degree: edu.degree,
        duration: edu.duration,
        concentration: edu.concentration,
        badge: edu.badge
      }));
    } else {
      return readLocalDb().education;
    }
  },

  createEducationEntry: async (edu: Omit<EducationEntry, 'id' | '_id'>): Promise<EducationEntry> => {
    if (isConnectedToMongo) {
      const newEdu = new MongoEducation(edu);
      const saved = await newEdu.save();
      return { ...edu, _id: saved._id.toString(), id: saved._id.toString() };
    } else {
      const local = readLocalDb();
      const newEdu: EducationEntry = {
        ...edu,
        id: 'edu-' + Math.random().toString(36).substr(2, 9)
      };
      local.education.push(newEdu);
      writeLocalDb(local);
      return newEdu;
    }
  },

  updateEducationEntry: async (id: string, edu: Partial<EducationEntry>): Promise<EducationEntry | null> => {
    if (isConnectedToMongo) {
      const updated = await EducationModel.findByIdAndUpdate(id, edu, { new: true });
      if (!updated) return null;
      return {
        _id: updated._id.toString(),
        id: updated._id.toString(),
        institution: updated.institution,
        degree: updated.degree,
        duration: updated.duration,
        concentration: updated.concentration,
        badge: updated.badge
      };
    } else {
      const local = readLocalDb();
      const index = local.education.findIndex(e => e.id === id);
      if (index === -1) return null;
      local.education[index] = { ...local.education[index], ...edu };
      writeLocalDb(local);
      return local.education[index];
    }
  },

  deleteEducationEntry: async (id: string): Promise<boolean> => {
    if (isConnectedToMongo) {
      const res = await EducationModel.findByIdAndDelete(id);
      return !!res;
    } else {
      const local = readLocalDb();
      const initialLength = local.education.length;
      local.education = local.education.filter(e => e.id !== id);
      if (local.education.length === initialLength) return false;
      writeLocalDb(local);
      return true;
    }
  },

  // --- PROFILE/BIO MANAGEMENT ---
  getProfileBio: async (): Promise<ProfileBio> => {
    if (isConnectedToMongo) {
      const item = await ProfileBioModel.findOne({});
      if (item) {
        return {
          _id: item._id.toString(),
          id: item._id.toString(),
          title: item.title,
          subtitle: item.subtitle,
          bioParagraph1: item.bioParagraph1,
          bioParagraph2: item.bioParagraph2,
          academicPillar1Title: item.academicPillar1Title,
          academicPillar1Desc: item.academicPillar1Desc,
          academicPillar2Title: item.academicPillar2Title,
          academicPillar2Desc: item.academicPillar2Desc,
          academicPillar3Title: item.academicPillar3Title,
          academicPillar3Desc: item.academicPillar3Desc
        };
      }
      // Failover inside MongoDB
      const seeded = await ProfileBioModel.create(defaultProfileBio);
      return { ...defaultProfileBio, _id: seeded._id.toString(), id: seeded._id.toString() };
    } else {
      return readLocalDb().profileBio || defaultProfileBio;
    }
  },

  updateProfileBio: async (bio: Partial<ProfileBio>): Promise<ProfileBio> => {
    if (isConnectedToMongo) {
      const existing = await ProfileBioModel.findOne({});
      let updated;
      if (existing) {
        updated = await ProfileBioModel.findByIdAndUpdate(existing._id, bio, { new: true });
      } else {
        updated = await ProfileBioModel.create({ ...defaultProfileBio, ...bio });
      }
      return {
        _id: updated._id.toString(),
        id: updated._id.toString(),
        title: updated.title,
        subtitle: updated.subtitle,
        bioParagraph1: updated.bioParagraph1,
        bioParagraph2: updated.bioParagraph2,
        academicPillar1Title: updated.academicPillar1Title,
        academicPillar1Desc: updated.academicPillar1Desc,
        academicPillar2Title: updated.academicPillar2Title,
        academicPillar2Desc: updated.academicPillar2Desc,
        academicPillar3Title: updated.academicPillar3Title,
        academicPillar3Desc: updated.academicPillar3Desc
      };
    } else {
      const local = readLocalDb();
      local.profileBio = { ...local.profileBio, ...bio };
      writeLocalDb(local);
      return local.profileBio;
    }
  },

  // --- CONTACT MESSAGE CRUD ---
  getMessages: async (): Promise<ContactMessage[]> => {
    if (isConnectedToMongo) {
      const items = await ContactMessageModel.find({}).sort({ createdAt: -1 });
      return items.map((m: any) => ({
        _id: m._id.toString(),
        id: m._id.toString(),
        name: m.name,
        email: m.email,
        subject: m.subject,
        message: m.message,
        createdAt: m.createdAt,
        replyText: m.replyText,
        repliedAt: m.repliedAt
      }));
    } else {
      const msgs = readLocalDb().messages;
      return [...msgs].reverse(); // Output in newest-first order
    }
  },

  createMessage: async (msg: Omit<ContactMessage, 'id' | '_id' | 'createdAt'>): Promise<ContactMessage> => {
    const ts = new Date().toISOString();
    if (isConnectedToMongo) {
      const newMsg = new MongoContactMessage({ ...msg, createdAt: ts });
      const saved = await newMsg.save();
      return { ...msg, _id: saved._id.toString(), id: saved._id.toString(), createdAt: ts };
    } else {
      const local = readLocalDb();
      const newMsg: ContactMessage = {
        ...msg,
        id: 'msg-' + Math.random().toString(36).substr(2, 9),
        createdAt: ts
      };
      local.messages.push(newMsg);
      writeLocalDb(local);
      return newMsg;
    }
  },

  deleteMessage: async (id: string): Promise<boolean> => {
    if (isConnectedToMongo) {
      const res = await ContactMessageModel.findByIdAndDelete(id);
      return !!res;
    } else {
      const local = readLocalDb();
      const initialLength = local.messages.length;
      local.messages = local.messages.filter(m => m.id !== id);
      if (local.messages.length === initialLength) return false;
      writeLocalDb(local);
      return true;
    }
  },

  replyToMessage: async (id: string, replyText: string): Promise<ContactMessage | null> => {
    const ts = new Date().toISOString();
    if (isConnectedToMongo) {
      const updated = await ContactMessageModel.findByIdAndUpdate(
        id,
        { replyText, repliedAt: ts },
        { new: true }
      );
      if (!updated) return null;
      return {
        _id: updated._id.toString(),
        id: updated._id.toString(),
        name: updated.name,
        email: updated.email,
        subject: updated.subject,
        message: updated.message,
        createdAt: updated.createdAt,
        replyText: updated.replyText,
        repliedAt: updated.repliedAt
      };
    } else {
      const local = readLocalDb();
      const index = local.messages.findIndex(m => m.id === id);
      if (index === -1) return null;
      local.messages[index] = {
        ...local.messages[index],
        replyText,
        repliedAt: ts
      };
      writeLocalDb(local);
      return local.messages[index];
    }
  }
};
