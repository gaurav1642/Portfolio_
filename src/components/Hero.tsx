import { useState, useEffect } from 'react';
import { Cpu, ArrowRight, Kanban, Mail, TrendingUp, Sparkles, BrainCircuit } from 'lucide-react';

interface HeroProps {
  onNavigate: (section: string) => void;
}

const specializations = [
  'Full-Stack Developer',
  'Software Engineer',
  'React & Node.js Developer',
  'Python & SQL Developer'
];

export default function Hero({ onNavigate }: HeroProps) {
  const [currentText, setCurrentText] = useState('');
  const [specIndex, setSpecIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const activeText = specializations[specIndex];
    const typingSpeed = isDeleting ? 30 : 80;

    if (!isDeleting && charIndex === activeText.length) {
      // Delay before deleting
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setSpecIndex((prev) => (prev + 1) % specializations.length);
    } else {
      timer = setTimeout(() => {
        setCurrentText(
          isDeleting
            ? activeText.substring(0, charIndex - 1)
            : activeText.substring(0, charIndex + 1)
        );
        setCharIndex((prev) => (isDeleting ? prev - 1 : prev + 1));
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, specIndex]);

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center pt-24 xs:pt-32 pb-12 xs:pb-16 bg-grid-cyber overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-2 xs:px-4 md:px-8 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch pt-4 xs:pt-8">
        
        {/* Left Bento Block: Hero & Bio Section */}
        <div className="lg:col-span-7 bento-card p-4 xs:p-6 sm:p-8 md:p-12 relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <svg className="w-48 h-48 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>

          <div className="self-start inline-block px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] xs:text-[10px] font-bold tracking-widest uppercase mb-6 max-w-full break-words whitespace-normal leading-normal">
            B.Tech Computer Science & Engineering • 2026 Grad
          </div>

          <h1 className="font-display text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 tracking-tight text-white">
            Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400">Gaurav Kumar</span>
            <span className="block mt-3 text-lg xs:text-xl sm:text-2xl font-semibold tracking-tight text-white/70">
              Specialized <span className="cursor-blink text-cyan-400 font-mono">{currentText}</span>
            </span>
          </h1>

          <p className="text-white/60 text-xs xs:text-sm sm:text-base leading-relaxed max-w-xl mb-6 xs:mb-8">
            Pioneering scalable data pipelines, custom deep learning neural networks, and robust full-stack container environments. Combining high-level business analytics with live application structures.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
            <button
              id="hero-see-work-btn"
              onClick={() => onNavigate('projects')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white shadow-xl shadow-violet-500/10 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
            >
              Explore Projects
            </button>
            
            <button
              id="hero-contact-btn"
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase border border-white/10 hover:bg-white/5 text-white transition-all duration-300 cursor-pointer"
            >
              Contact Me &nbsp;→
            </button>
          </div>
        </div>

        {/* Right Bento Block: Visual Showcase / AI/ML Stats Matrix */}
        <div className="lg:col-span-5 bento-card p-4 xs:p-5 sm:p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-tr from-cyan-500 to-violet-500 rounded-full opacity-10 filter blur-2xl" />

          <div className="flex items-center justify-between mb-6 xs:mb-8">
            <div className="flex space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/40 border border-red-400/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/40 border border-yellow-400/50" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/40 border border-emerald-400/50" />
            </div>
            <span className="text-[10px] font-mono text-cyan-400/70 select-none">// SYSTEM MONITOR</span>
          </div>

          {/* Model Metrics */}
          <div className="space-y-4 my-auto">
            <div className="flex items-center justify-between p-3 xs:p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center space-x-3.5 min-w-0">
                <div className="p-2.5 bg-violet-500/10 rounded-xl text-violet-400 flex-shrink-0">
                  <Cpu className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold tracking-wide text-white uppercase truncate">Neural Network Acc.</h4>
                  <p className="text-[11px] text-white/50 truncate">MERN + Python Integrations</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <span className="text-sm font-mono font-bold text-violet-400">98.4%</span>
                <span className="block text-[9px] text-white/30">Validation</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 xs:p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center space-x-3.5 min-w-0">
                <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400 flex-shrink-0">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold tracking-wide text-white uppercase truncate">MERN Cloud API</h4>
                  <p className="text-[11px] text-white/50 truncate">Predictive serving models</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <span className="text-sm font-mono font-bold text-cyan-400">Active</span>
                <span className="block text-[9px] text-white/30">Node server</span>
              </div>
            </div>
          </div>

          {/* Stat footer */}
          <div className="flex items-center justify-between pt-4 xs:pt-6 border-t border-white/5 mt-6 xs:mt-8 text-[10px] xs:text-xs">
            <div>
              <span className="block text-[9px] font-mono text-white/40 uppercase">Global Scale</span>
              <span className="font-semibold text-white">Full-Stack Hub</span>
            </div>
            <div className="text-right">
              <span className="block text-[9px] font-mono text-white/40 uppercase">Experience</span>
              <span className="font-semibold text-emerald-400 flex items-center justify-end gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                Freelance Active
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
