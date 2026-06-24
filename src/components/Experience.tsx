import { Briefcase, Award, Milestone, Calendar, ChevronRight } from 'lucide-react';
import { Experience } from '../types';

interface ExperienceProps {
  experiences: Experience[];
  isLoading: boolean;
}

export default function ExperienceTimeline({ experiences, isLoading }: ExperienceProps) {
  return (
    <section id="experience" className="py-24 relative scroll-mt-28 overflow-hidden">
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-violet-600/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-2 xs:px-4 md:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="mb-16">
          <span className="text-xs font-bold tracking-widest text-[#22d3ee]/80 uppercase block mb-2 font-mono">04. Professional Chronology</span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Experience & Milestones</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400 mt-3 rounded-full" />
        </div>

        {isLoading ? (
          <div className="space-y-8 max-w-3xl mx-auto">
            {[1, 2].map((idx) => (
              <div key={idx} className="h-32 bg-[#151B2E]/40 border border-slate-800 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="relative max-w-4xl mx-auto" id="timeline-chronology-container">
            {/* Center Timeline line connector */}
            <div className="absolute left-2 xs:left-4 md:left-1/2 top-2 bottom-2 w-[1px] bg-white/10 pointer-events-none" />

            <div className="space-y-12">
              {experiences.map((exp, index) => {
                const isEven = index % 2 === 0;
                
                return (
                  <div 
                    id={`timeline-card-${exp._id || exp.id}`}
                    key={exp._id || exp.id}
                    className={`relative flex flex-col md:flex-row items-start ${
                      isEven ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Centered Timeline Marker node */}
                    <span className="absolute left-2 xs:left-4 md:left-1/2 -translate-x-[7px] md:-translate-x-1 top-6 z-20 w-3.5 h-3.5 rounded-full border border-cyan-400 bg-[#0B0F19] transition-all" />

                    {/* Timeline Content Card */}
                    <div className="w-full md:w-[45%] pl-6 xs:pl-10 md:pl-0">
                      <div className="bento-card p-4 xs:p-6 flex flex-col justify-between">
                        {/* Header duration/info */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                          <span className="flex items-center text-[9px] xs:text-[10px] font-mono text-cyan-400 font-bold bg-white/5 px-2 xs:px-3 py-1 rounded-full border border-white/10 max-w-full break-words whitespace-normal leading-normal">
                            <Calendar className="w-3.5 h-3.5 mr-1 text-cyan-400 flex-shrink-0" />
                            {exp.duration.toUpperCase()}
                          </span>
                          
                          {exp.badge && (
                            <span className="text-[9px] font-mono font-bold text-violet-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5 uppercase max-w-full break-words whitespace-normal leading-normal">
                              {exp.badge}
                            </span>
                          )}
                        </div>

                        {/* Title and Organization name */}
                        <div className="mb-4">
                          <h3 className="font-display font-bold text-white text-sm xs:text-base sm:text-lg mb-1 flex items-center leading-snug">
                            {exp.type === 'experience' ? (
                              <Briefcase className="w-4 h-4 text-cyan-400 mr-2 flex-shrink-0" />
                            ) : (
                              <Award className="w-4 h-4 text-violet-400 mr-2 flex-shrink-0" />
                            )}
                            {exp.role}
                          </h3>
                          <p className="text-xs font-mono text-white/40 leading-normal">
                            {exp.organization}
                          </p>
                        </div>

                        {/* Highlights list */}
                        <ul className="space-y-2.5 mt-2">
                          {exp.highlights.map((bullet, bIdx) => (
                            <li key={bIdx} className="flex items-start text-xs text-white/60 leading-relaxed safe-wrap">
                              <ChevronRight className="w-3.5 h-3.5 text-cyan-400 mr-1.5 mt-0.5 flex-shrink-0" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Empty spacer for grid alignment on desktop */}
                    <div className="hidden md:block w-[45%]" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
