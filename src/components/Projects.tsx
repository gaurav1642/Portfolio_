import { useState, useEffect } from 'react';
import { Globe, Github, Cpu, Database, Image, BookOpen, Layers, ArrowRight, ExternalLink, X, Activity } from 'lucide-react';
import { Project } from '../types';

interface ProjectsProps {
  projects: Project[];
  isLoading: boolean;
}

export default function Projects({ projects, isLoading }: ProjectsProps) {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Web Dev' | 'AI/ML' | 'Data Analytics'>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProject]);

  const categories: ('All' | 'Web Dev' | 'AI/ML' | 'Data Analytics')[] = [
    'All', 'Web Dev', 'AI/ML', 'Data Analytics'
  ];

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  const getProjIcon = (type: string) => {
    switch (type) {
      case 'cpu': return <Cpu className="w-5 h-5 text-violet-400" />;
      case 'database': return <Database className="w-5 h-5 text-emerald-400" />;
      case 'image': return <Image className="w-5 h-5 text-cyan-400" />;
      case 'bookOpen': return <BookOpen className="w-5 h-5 text-yellow-400" />;
      default: return <Globe className="w-5 h-5 text-pink-400" />;
    }
  };

  return (
    <section id="projects" className="py-24 relative overflow-hidden scroll-mt-28">
      {/* Background radial highlight */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-cyan-600/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-violet-600/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-2 xs:px-4 md:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block mb-2">03. Selected Lab Records</span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Advanced Projects Showcase</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-violet-500 to-cyan-400 mt-3 rounded-full" />
          </div>

          {/* Categories Tab Selector */}
          <div className="flex flex-wrap gap-1.5 xs:gap-2 mt-6 md:mt-0" id="projects-filter-bar">
            {categories.map((cat) => (
              <button
                id={`projects-filter-${cat.replace(/\s+/g, '-')}`}
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1.5 xs:px-4 xs:py-2 rounded-lg text-[10px] xs:text-xs font-mono font-semibold transition-all border cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/35 shadow-lg shadow-cyan-500/5'
                    : 'bg-slate-900/40 text-gray-400 border-slate-800/80 hover:text-white hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-80 bg-[#151B2E]/40 border border-slate-800 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div 
            id="projects-grid-catalog"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((p) => (
              <article 
                id={`project-card-${p._id || p.id}`}
                key={p._id || p.id}
                className="group relative h-full flex flex-col justify-between bento-card p-4 xs:p-6"
              >
                <div>
                  {/* Category and Icon Line */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400">
                      {getProjIcon(p.iconType)}
                    </div>
                    <div className="flex gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-bold text-white/60 tracking-wider">
                        {p.category.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-bold text-white text-lg group-hover:text-cyan-400 transition-colors mb-2">
                    {p.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-white/50 text-xs leading-relaxed mb-5 line-clamp-3">
                    {p.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {p.techStack.map((tech) => (
                      <span 
                        key={tech} 
                        className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-cyan-400 font-bold border border-white/5 uppercase"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card footer CTA buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <button
                    id={`view-specs-btn-${p._id || p.id}`}
                    onClick={() => setSelectedProject(p)}
                    className="text-[10px] font-bold text-cyan-400 hover:underline tracking-widest uppercase flex items-center cursor-pointer"
                  >
                    <span>SPECIFICATIONS</span>
                    <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-0.5" />
                  </button>

                  <div className="flex items-center space-x-3.5">
                    <a
                      id={`project-github-link-${p._id || p.id}`}
                      href={p.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/40 hover:text-white transition-colors"
                      title="View Code on GitHub"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                    <a
                      id={`project-live-link-${p._id || p.id}`}
                      href={p.liveUrl}
                      className="text-white/40 hover:text-white transition-colors"
                      title="Open Live Demonstration"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Detailed Spec Modal */}
      {selectedProject && (
        <div 
          id="proj-detail-modal"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
        >
          <div className="relative w-full max-w-2xl bg-[#0B0F19] border border-white/10 rounded-3xl max-h-[85vh] overflow-y-auto no-scrollbar shadow-2xl p-4 xs:p-6 sm:p-8">
            <button
              id="close-modal-btn"
              onClick={() => setSelectedProject(null)}
              className="absolute top-3 right-3 xs:top-4 xs:right-4 p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                  Architectural Deep-Dive
                </span>
                <h3 className="font-display font-bold text-white text-2xl">
                  {selectedProject.title}
                </h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-[#22d3ee]/10 text-[#22d3ee] rounded-full border border-cyan-500/20">
                    {selectedProject.category.toUpperCase()}
                  </span>
                  {selectedProject.techStack.map((tech) => (
                    <span key={tech} className="text-[9px] font-mono px-2 py-0.5 bg-white/5 border border-white/5 text-white/70 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold tracking-widest text-white/40 mb-2 uppercase">
                  Project Overview
                </h4>
                <p className="text-white/70 text-xs sm:text-sm leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold tracking-widest text-white/40 mb-3 uppercase flex items-center">
                  <Layers className="w-4 h-4 text-cyan-400 mr-2" />
                  Core Platform Features
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedProject.features.map((feat, index) => (
                    <li 
                      key={index}
                      className="flex items-start space-x-2.5 text-xs text-white/70 bg-white/[0.02] p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 xs:pt-6 border-t border-white/5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                <div className="flex items-center space-x-2 text-xs text-emerald-400 font-mono font-bold leading-normal">
                  <Activity className="w-4 h-4 text-emerald-400 animate-pulse flex-shrink-0" />
                  <span className="safe-wrap">Validated deployment credentials matching production specs.</span>
                </div>

                <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5 w-full md:w-auto">
                  <a
                    id="modal-github-link"
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full xs:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-full border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-all text-xs font-mono"
                  >
                    <Github className="w-4 h-4" />
                    <span>CODEBASE</span>
                  </a>
                  
                  <a
                    id="modal-live-link"
                    href={selectedProject.liveUrl}
                    className="w-full xs:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white transition-all text-xs font-mono font-bold"
                  >
                    <Globe className="w-4 h-4" />
                    <span>LIVE SETUP</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
