import { useState, useEffect } from 'react';
import { Layers, Database, Cpu, Milestone } from 'lucide-react';
import { Skill } from '../types';

interface SkillsProps {
  skills: Skill[];
  isLoading: boolean;
}

export default function Skills({ skills, isLoading }: SkillsProps) {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Core Tech' | 'Languages & Data' | 'AI/ML & Tools'>('All');

  const categories = [
    { id: 'All', label: 'All Domains', icon: Milestone },
    { id: 'Core Tech', label: 'Core Full-Stack', icon: Layers },
    { id: 'Languages & Data', label: 'Languages/Data', icon: Database },
    { id: 'AI/ML & Tools', label: 'AI/ML & Copilots', icon: Cpu }
  ];

  const filteredSkills = activeCategory === 'All' 
    ? skills 
    : skills.filter(s => s.category === activeCategory);

  return (
    <section id="skills" className="py-24 relative scroll-mt-28 overflow-hidden">
      <div className="absolute top-10 left-10 w-72 h-72 bg-violet-600/5 rounded-full filter blur-[80px]" />

      <div className="max-w-7xl mx-auto px-2 xs:px-4 md:px-8 relative z-10">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold tracking-widest text-[#22d3ee]/80 uppercase block mb-2 font-mono">02. Expertise Matrix</span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Technical Skills Matrix</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400 mt-3 rounded-full" />
          </div>

          {/* Tab Filters */}
          <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  id={`skill-filter-btn-${cat.id.replace(/\s+/g, '-')}`}
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as any)}
                  className={`flex items-center space-x-1.5 px-2.5 py-1.5 xs:px-4 xs:py-2 rounded-full text-[10px] xs:text-xs font-mono font-medium tracking-wide transition-all border cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-white/10 text-cyan-400 border-cyan-500/30 shadow-lg'
                      : 'bg-white/5 text-white/50 border-white/10 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Skills Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="skills-loader-grid">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="h-28 bg-[#151B2E]/40 border border-slate-800/80 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="skills-display-grid">
            {filteredSkills.map((skill) => (
              <div 
                key={skill.id || skill._id || skill.name}
                className="bento-card p-4 xs:p-6 relative overflow-hidden group"
              >
                {/* Accent glow on top */}
                <span className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-display font-bold text-white text-sm sm:text-base tracking-tight truncate max-w-[70%]">
                    {skill.name}
                  </h4>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {skill.proficiency}%
                  </span>
                </div>

                {/* Styled progress bar track */}
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>

                <div className="flex items-center justify-between mt-4 text-[9px] font-mono text-white/40 uppercase tracking-widest">
                  <span>Category</span>
                  <span className="text-violet-400 font-bold">{skill.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills visual footer accent */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between p-4 xs:p-6 bento-card relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 to-cyan-500/5 pointer-events-none" />
          <div className="flex items-center space-x-3 mb-3 sm:mb-0 relative z-10">
            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[11px] xs:text-xs sm:text-sm text-white/60">
              Active learning pipeline. Regularly updating competencies via advanced LLM-assisted codebases.
            </p>
          </div>
          <p className="text-xs font-mono text-violet-400 relative z-10 font-bold">
            Current Capstone Year: 2026
          </p>
        </div>
      </div>
    </section>
  );
}
