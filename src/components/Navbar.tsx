import { useState, useEffect } from 'react';
import { Terminal, Download, Menu, X, Lock } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface NavbarProps {
  currentSection: string;
  onNavigate: (section: string) => void;
  isAdminMode: boolean;
  onToggleAdmin: () => void;
}

export default function Navbar({ currentSection, onNavigate, isAdminMode, onToggleAdmin }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleDownloadCV = () => {
    const doc = new jsPDF();
    
    // Set Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Gaurav Kumar", 105, 20, { align: "center" });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Email: gauravchauhan1903@gmail.com  |  Phone: +91 9193959511  |  Dehradun", 105, 28, { align: "center" });
    doc.text("GitHub: github.com/gaurav1642", 105, 34, { align: "center" });
    
    // Horizontal divider
    doc.setLineWidth(0.4);
    doc.line(20, 38, 190, 38);
    
    let y = 46;
    
    // Section Header Helper
    const addSectionHeader = (title: string) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(title, 20, y);
      doc.setLineWidth(0.2);
      doc.line(20, y + 2, 190, y + 2);
      y += 9;
    };
    
    // --- EDUCATION ---
    addSectionHeader("EDUCATION");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.text("Bachelor of Technology - Computer Science", 20, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.text("2022 - 2026  |  Dehradun", 190, y, { align: "right" });
    y += 5;
    doc.setFont("helvetica", "italic");
    doc.text("J.B. Institute of Technology", 20, y);
    y += 8;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.text("PCM (Physics, Chemistry, Mathematics)", 20, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.text("2020 - 2022  |  Saharanpur", 190, y, { align: "right" });
    y += 5;
    doc.setFont("helvetica", "italic");
    doc.text("Spring Bells School", 20, y);
    y += 12;
    
    // --- EXPERIENCE ---
    addSectionHeader("EXPERIENCE");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.text("Freelance Web Designer", 20, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.text("01/2025 - 05/2025  |  Remote", 190, y, { align: "right" });
    y += 5;
    doc.setFont("helvetica", "italic");
    doc.text("Growbyte, Czech Republic", 20, y);
    y += 6;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const expBullets = [
      "Delivered high-impact website redesigns through detailed client requirement analysis and competitor research.",
      "Used AI-powered tools to streamline prototyping and accelerate delivery time.",
      "Improved customer satisfaction by 25% via user-centric UI/UX strategies.",
      "Collaborated directly with international clients, ensuring high-quality project execution."
    ];
    expBullets.forEach(bullet => {
      doc.text("- " + bullet, 24, y);
      y += 4.5;
    });
    y += 6;
    
    // --- PROJECTS ---
    addSectionHeader("PROJECTS");
    
    // HireHub
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.text("HireHub", 20, y);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.text("React.js, FastAPI, Tailwind CSS, MongoDB, Adzuna/Remotive/Muse APIs", 38, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const p1Bullets = [
      "Developed an AI-powered student job portal using React.js and FastAPI, integrating external APIs to provide real-time job listings.",
      "Implemented an AI chatbot for job search assistance and career guidance, enabling users to interact using natural language queries.",
      "Designed a skill-based job recommendation and filtering system to deliver relevant opportunities and reduce information overload."
    ];
    p1Bullets.forEach(bullet => {
      const splitText = doc.splitTextToSize(bullet, 162);
      splitText.forEach((line: string, index: number) => {
        doc.text(index === 0 ? "- " + line : "  " + line, 24, y);
        y += 4.5;
      });
    });
    y += 3;
    
    // Prompt2art
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.text("Prompt2art", 20, y);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.text("MERN Stack, Clipdrop API, Razorpay SDK, Tailwind CSS", 43, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const p2Bullets = [
      "Built a full-stack AI text-to-image generator using the MERN stack, integrating the Clipdrop API to generate high-quality images from user prompts.",
      "Implemented secure Razorpay payments and REST APIs with Node.js & Express, with MongoDB handling user data, prompts, images, and transaction records.",
      "Developed a responsive React + Tailwind frontend enabling a smooth flow: login -> prompt submission -> AI generation -> image preview & download."
    ];
    p2Bullets.forEach(bullet => {
      const splitText = doc.splitTextToSize(bullet, 162);
      splitText.forEach((line: string, index: number) => {
        doc.text(index === 0 ? "- " + line : "  " + line, 24, y);
        y += 4.5;
      });
    });
    y += 3;
    
    // Poke Vision
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.text("Poke Vision", 20, y);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.text("React.js, JavaScript, HTML, CSS, PokéAPI", 43, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const p3Bullets = [
      "Built a responsive React web app that integrates with the PokéAPI to display detailed Pokémon data including types, abilities, stats, and images.",
      "Implemented real-time search functionality with dynamic rendering using React hooks to deliver a smooth, interactive user experience.",
      "Applied modular code structure and responsive CSS design, ensuring cross-device compatibility."
    ];
    p3Bullets.forEach(bullet => {
      const splitText = doc.splitTextToSize(bullet, 162);
      splitText.forEach((line: string, index: number) => {
        doc.text(index === 0 ? "- " + line : "  " + line, 24, y);
        y += 4.5;
      });
    });
    y += 6;
    
    // --- TECHNICAL SKILLS ---
    addSectionHeader("TECHNICAL SKILLS");
    doc.setFontSize(9.2);
    
    doc.setFont("helvetica", "bold");
    doc.text("Languages: ", 20, y);
    doc.setFont("helvetica", "normal");
    doc.text("Python, C/C++, JavaScript, HTML/CSS, SQL", 42, y);
    y += 4.5;
    
    doc.setFont("helvetica", "bold");
    doc.text("Libraries: ", 20, y);
    doc.setFont("helvetica", "normal");
    doc.text("Pandas, Numpy, Seaborn", 42, y);
    y += 4.5;
    
    doc.setFont("helvetica", "bold");
    doc.text("Frameworks: ", 20, y);
    doc.setFont("helvetica", "normal");
    doc.text("React, Node.js, Express.js, Next.js", 44, y);
    y += 4.5;
    
    doc.setFont("helvetica", "bold");
    doc.text("Developer Tools: ", 20, y);
    doc.setFont("helvetica", "normal");
    doc.text("Git, GitHub, Cursor, Jupyter Notebook, Postman, Netlify, Render", 49, y);
    
    // Output PDF
    doc.save("Gaurav_Kumar_Resume.pdf");
  };

  return (
    <header 
      id="main-navbar"
      className="fixed top-2 xs:top-4 left-0 w-full z-50 px-2 xs:px-4 md:px-8 transition-all duration-300"
    >
      <div className={`max-w-7xl mx-auto rounded-xl xs:rounded-2xl px-3 py-2.5 xs:px-6 xs:py-3 transition-all duration-300 flex items-center justify-between ${
        isScrolled 
          ? 'bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-[#0B0F19]' 
          : 'bg-white/5 backdrop-blur-md border border-white/10'
      }`}>
        {/* Brand Logo */}
        <div 
          id="navbar-brand"
          className="flex items-center space-x-2 xs:space-x-3 cursor-pointer group"
          onClick={() => {
            onNavigate('home');
            window.location.hash = '';
          }}
        >
          <div className="w-7 h-7 xs:w-8 h-8 bg-gradient-to-br from-cyan-500 via-violet-500 to-emerald-500 rounded-lg flex items-center justify-center font-bold text-xs xs:text-sm tracking-tighter text-white shadow-lg shadow-violet-500/10">
            GA
          </div>
          <div>
            <span className="font-semibold tracking-wide text-xs xs:text-sm opacity-90 uppercase text-white group-hover:text-cyan-400 transition-colors">
              Gaurav <span className="hidden sm:inline text-cyan-400 opacity-50 text-[10px] ml-1 font-mono">// PORTFOLIO V2.6</span>
            </span>
          </div>
        </div>

        {/* Desktop Nav Actions */}
        <nav id="desktop-nav" className="hidden md:flex items-center space-x-8 text-[11px] font-medium tracking-[0.1em] uppercase">
          {navItems.map((item) => (
            <button
              id={`nav-link-${item.id}`}
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`transition-colors relative py-1 cursor-pointer ${
                currentSection === item.id 
                  ? 'text-cyan-400' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {item.label}
              {currentSection === item.id && (
                <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-cyan-400 to-violet-400 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Secondary controls: Admin portal, CV Download */}
        <div className="hidden md:flex items-center space-x-3">
          <button
            id="toggle-admin-btn"
            onClick={onToggleAdmin}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border text-[11px] font-mono transition-all duration-300 ${
              isAdminMode 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Lock className="w-3 h-3" />
            <span>{isAdminMode ? 'ADMIN ACTIVE' : 'ADMIN PORTAL'}</span>
          </button>

          <button
            id="download-cv-btn"
            onClick={handleDownloadCV}
            className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 text-white transition-all duration-200 cursor-pointer"
          >
            <span>DOWNLOAD CV</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center space-x-3">
          <button
            id="toggle-admin-mobile"
            onClick={onToggleAdmin}
            className={`p-2 rounded-md border ${
              isAdminMode 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-violet-500/5 text-violet-400 border-violet-500/15'
            }`}
          >
            <Lock className="w-4 h-4" />
          </button>
          
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div id="mobile-nav-panel" className="md:hidden absolute top-full left-0 w-full bg-[#151B2E] border-b border-violet-500/15 py-6 px-4 space-y-4 shadow-xl">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <button
                id={`mobile-nav-link-${item.id}`}
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left py-2 font-display text-base font-semibold tracking-wide ${
                  currentSection === item.id ? 'text-cyan-400 pl-2 border-l-2 border-cyan-400' : 'text-gray-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="pt-4 border-t border-violet-500/15 flex items-center justify-between">
            <button
              id="mobile-drawer-admin"
              onClick={() => {
                onToggleAdmin();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 text-sm font-mono text-violet-400 hover:text-cyan-300"
            >
              <Lock className="w-4 h-4" />
              <span>{isAdminMode ? 'Dashboard Open' : 'Open Admin Portal'}</span>
            </button>

            <button
              id="mobile-drawer-cv"
              onClick={() => {
                handleDownloadCV();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-display font-medium text-[#0B0F19] bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-lg"
            >
              <Download className="w-4 h-4" />
              <span>Download CV</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
