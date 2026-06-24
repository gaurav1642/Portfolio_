import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import ExperienceTimeline from './components/Experience';
import Contact from './components/Contact';
import AdminDashboard from './components/AdminDashboard';
import { Project, Experience, Skill, EducationEntry, ProfileBio } from './types';
import { Terminal, Lock, Heart, Cpu } from 'lucide-react';

const OWNER_EMAIL = 'gc0605126@gmail.com';

export default function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Database lists
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<EducationEntry[]>([]);
  const [profileBio, setProfileBio] = useState<ProfileBio | null>(null);

  // Loading indicator flags
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isLoadingSkills, setIsLoadingSkills] = useState(true);
  const [isLoadingExperiences, setIsLoadingExperiences] = useState(true);
  const [isLoadingEducation, setIsLoadingEducation] = useState(true);
  const [isLoadingProfileBio, setIsLoadingProfileBio] = useState(true);

  const fetchAppData = async () => {
    // 1. Fetch Projects
    try {
      setIsLoadingProjects(true);
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (err) {
      console.error('Failed to query portfolio projects:', err);
    } finally {
      setIsLoadingProjects(false);
    }

    // 2. Fetch Skills
    try {
      setIsLoadingSkills(true);
      const res = await fetch('/api/skills');
      if (res.ok) {
        const data = await res.json();
        setSkills(data);
      }
    } catch (err) {
      console.error('Failed to query tech skills:', err);
    } finally {
      setIsLoadingSkills(false);
    }

    // 3. Fetch Experiences
    try {
      setIsLoadingExperiences(true);
      const res = await fetch('/api/experiences');
      if (res.ok) {
        const data = await res.json();
        setExperiences(data);
      }
    } catch (err) {
      console.error('Failed to query professional timeline:', err);
    } finally {
      setIsLoadingExperiences(false);
    }

    // 4. Fetch Education
    try {
      setIsLoadingEducation(true);
      const res = await fetch('/api/education');
      if (res.ok) {
        const data = await res.json();
        setEducation(data);
      }
    } catch (err) {
      console.error('Failed to query education history:', err);
    } finally {
      setIsLoadingEducation(false);
    }

    // 5. Fetch Profile Bio
    try {
      setIsLoadingProfileBio(true);
      const res = await fetch('/api/profile-bio');
      if (res.ok) {
        const data = await res.json();
        setProfileBio(data);
      }
    } catch (err) {
      console.error('Failed to query profile biography:', err);
    } finally {
      setIsLoadingProfileBio(false);
    }
  };

  useEffect(() => {
    fetchAppData();

    // Listen to hash changes for robust SPA routing fallback (e.g. #/admin-portal or #admin-portal)
    const handleHashRouter = () => {
      const hash = window.location.hash;
      if (hash.includes('admin-portal')) {
        setIsAdminMode(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setIsAdminMode(false);
        const secId = hash.replace('#', '');
        if (secId) {
          const element = document.getElementById(secId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setCurrentSection(secId);
          }
        }
      }
    };

    window.addEventListener('hashchange', handleHashRouter);
    // Trigger on initial load
    handleHashRouter();

    return () => window.removeEventListener('hashchange', handleHashRouter);
  }, []);

  const handleManualNavigation = (sectionId: string) => {
    setIsAdminMode(false);
    window.location.hash = sectionId;
    setCurrentSection(sectionId);

    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] relative text-gray-200 overflow-x-hidden">
      {/* Dynamic Grid Network Layer */}
      <div className="absolute inset-0 bg-grid-cyber opacity-[0.4] pointer-events-none" />

      {/* Global Header Navigation */}
      <Navbar
        currentSection={isAdminMode ? 'admin' : currentSection}
        onNavigate={handleManualNavigation}
        isAdminMode={isAdminMode}
        onToggleAdmin={() => {
          if (isAdminMode) {
            handleManualNavigation('home');
          } else {
            setIsAdminMode(true);
            window.location.hash = 'admin-portal';
          }
        }}
      />

      {/* Primary Routing view blocks */}
      <main id="app-content-body" className="transition-all duration-300">
        {isAdminMode ? (
          <AdminDashboard
            projects={projects}
            skills={skills}
            experiences={experiences}
            education={education}
            profileBio={profileBio}
            onRefreshData={fetchAppData}
            onExitAdmin={() => handleManualNavigation('home')}
          />
        ) : (
          <div className="space-y-8">
            <Hero onNavigate={handleManualNavigation} />
            <About profileBio={profileBio} education={education} isLoading={isLoadingEducation || isLoadingProfileBio} />
            <Skills skills={skills} isLoading={isLoadingSkills} />
            <Projects projects={projects} isLoading={isLoadingProjects} />
            <ExperienceTimeline experiences={experiences} isLoading={isLoadingExperiences} />
            <Contact userEmail={OWNER_EMAIL} />
          </div>
        )}
      </main>

      {/* Professional Footer Credits */}
      <footer id="app-footer" className="border-t border-white/5 bg-[#0B0F19] py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-2 xs:px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">

          {/* brand summary */}
          <div className="text-center md:text-left">
            <h4 className="font-display font-extrabold text-white text-xs uppercase tracking-widest">
              GAURAV CHAUHAN <span className="text-cyan-400">.</span>
            </h4>
            <p className="text-[10px] font-mono text-white/40 mt-1 uppercase tracking-wider">
              B.Tech Computer Science student • Portfolio Enterprise Showcase
            </p>
          </div>

          {/* Copyright badge */}
          <div className="flex items-center space-x-1.5 text-xs text-white/40">
            <span>© {new Date().getFullYear()} Gaurav Created with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>&</span>
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          </div>

          <div className="flex items-center space-x-4">
            <button
              id="footer-admin-link"
              onClick={() => {
                setIsAdminMode(true);
                window.location.hash = 'admin-portal';
              }}
              className="text-[10px] font-mono text-white/40 hover:text-cyan-400 flex items-center space-x-1 uppercase cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Console Login</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
