import { GraduationCap, Award, ChevronRight } from 'lucide-react';
import { EducationEntry, ProfileBio } from '../types';

interface AboutProps {
  profileBio: ProfileBio | null;
  education: EducationEntry[];
  isLoading: boolean;
}

export default function About({ profileBio, education, isLoading }: AboutProps) {
  const bioTitle = profileBio?.title || "B.Tech Student & Data Scientist";
  const bioParagraph1 = profileBio?.bioParagraph1 || "I am a final-year B.Tech Student in Computer Science and Engineering who is highly motivated to solve complex actual problems using Artificial Intelligence and Data Analytics. Bridging the gap between secure cloud infrastructure and accurate data, I build robust, full-stack pipelines that gather, clean, model, and serve predictive analysis insights.";
  const bioParagraph2 = profileBio?.bioParagraph2 || "My developmental outlook spans across clean frontend styling, secure backend route controllers, and high-quality vector database lookups for LLM systems. I emphasize writing robust algorithms, maintaining clean directory architectures, and constructing reliable data integrations that deliver measurable business value.";

  const academicFocuses = [
    { 
      title: profileBio?.academicPillar1Title || 'Machine Learning & AI', 
      desc: profileBio?.academicPillar1Desc || 'Developing algorithms, neural maps, and predictive regression analytics.' 
    },
    { 
      title: profileBio?.academicPillar2Title || 'Database Management (DBMS)', 
      desc: profileBio?.academicPillar2Desc || 'Enterprise query structuring, relational SQL databases, and JSON collection indexing.' 
    },
    { 
      title: profileBio?.academicPillar3Title || 'Data Structures & Algorithms', 
      desc: profileBio?.academicPillar3Desc || 'Optimizing computation runtimes, structural arrays, trees, and logic solvers.' 
    }
  ];

  const educationTimeline = education.length > 0 ? education : [
    {
      id: 'edu-1',
      institution: 'Bachelor of Technology',
      degree: 'Computer Science & Engineering',
      duration: '2022 - 2026 (PRESENT STATUS)',
      concentration: 'Concentration Areas: ML Modeling, Deep Neural Nets, Granular Query Optimization, and Engineering Design.',
      badge: '2022 - 2026'
    },
    {
      id: 'edu-2',
      institution: 'Advanced Senior Secondary Certificate',
      degree: 'Physics, Chemistry, and Mathematics focus',
      duration: 'PRE-UNIVERSITY CERTIFICATION',
      concentration: 'Comprehensive secondary training with exceptional metrics in quantitative sciences and computer science.',
      badge: 'Pre-University'
    }
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden scroll-mt-28">
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-cyan-600/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-2 xs:px-4 md:px-8 relative z-10">
        {/* Section Heading */}
        <div className="mb-12">
          <span className="text-xs font-bold tracking-widest text-[#22d3ee]/80 uppercase block mb-2 font-mono">01. Profile Summary</span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">About & Education</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400 mt-3 rounded-full" />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-8 h-8 rounded-full border-t-2 border-cyan-400 animate-spin" />
            <p className="text-xs font-mono text-white/40 uppercase">Loading Profile Insights...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch" id="about-content-grid">
            {/* Biography Block - Bento Row */}
            <div className="lg:col-span-6 bento-card p-4 xs:p-6 sm:p-8 flex flex-col justify-between">
              <div className="space-y-6">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white leading-tight">
                  {bioTitle}
                </h3>

                <p className="text-white/70 text-sm leading-relaxed">
                  {bioParagraph1}
                </p>

                <p className="text-white/50 text-sm leading-relaxed">
                  {bioParagraph2}
                </p>
              </div>

              {/* Academic Concentration list */}
              <div className="space-y-4 pt-6 border-t border-white/5 mt-6">
                <h4 className="text-xs font-bold tracking-widest text-white/40 uppercase">Primary Academic Pillars</h4>
                <div className="grid grid-cols-1 gap-3">
                  {academicFocuses.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 xs:p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                      <ChevronRight className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h5 className="font-semibold text-white text-xs uppercase tracking-wider">{item.title}</h5>
                        <p className="text-[11px] text-white/50 mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Education Timeline Block - Bento Row */}
            <div className="lg:col-span-6 flex flex-col gap-6 md:gap-8">
              <div className="bento-card p-4 xs:p-6 sm:p-8 flex-grow">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white flex items-center mb-6">
                  <GraduationCap className="w-6 h-6 text-cyan-400 mr-2" />
                  Education Timeline
                </h3>

                <div className="relative border-l border-white/5 pl-6 ml-3 space-y-8 py-2">
                  {educationTimeline.map((item) => (
                    <div key={item.id || item._id} className="relative">
                      {/* node marker */}
                      <span className="absolute -left-[32px] top-1.5 w-3.5 h-3.5 bg-[#0B0F19] border border-cyan-400 rounded-full flex items-center justify-center">
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                      </span>
                      
                      <span className="inline-block px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono font-bold mb-2 max-w-full break-words whitespace-normal leading-normal">
                        {item.duration}
                      </span>
                      <h4 className="font-display text-base font-bold text-white leading-tight">{item.institution}</h4>
                      <p className="text-xs font-semibold text-violet-400 mt-1">{item.degree}</p>
                      
                      {item.concentration && (
                        <div className="mt-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-white/60 safe-wrap">
                          {item.concentration}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievement highlights container in education - Bento Row bottom */}
              <div className="bento-card p-4 xs:p-5 flex items-center space-x-3 xs:space-x-4">
                <div className="p-3 bg-gradient-to-br from-violet-600 to-cyan-500 rounded-xl text-white flex-shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-white text-sm">Key Honors &amp; Credentials</h4>
                  <p className="text-xs text-white/50 mt-1">Excellent standing across computer science tracks including national screening credentials and competitive symposia.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
