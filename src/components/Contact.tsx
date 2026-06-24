import React, { useState, FormEvent } from 'react';
import { Mail, Github, Linkedin, Send, AlertTriangle, CheckCircle } from 'lucide-react';

interface ContactProps {
  userEmail: string;
}

export default function Contact({ userEmail }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [outcomeMessage, setOutcomeMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmission = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setOutcomeMessage(null);

    // Simple validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setOutcomeMessage({ type: 'error', text: 'All form fields are strictly required.' });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const body = await response.json();

      if (response.ok) {
        setOutcomeMessage({
          type: 'success',
          text: body.message || 'Thank you! Your message has been saved successfully.'
        });
        // Clear form
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setOutcomeMessage({
          type: 'error',
          text: body.error || 'Failed to deliver the message. Please check your spelling.'
        });
      }
    } catch (err: any) {
      setOutcomeMessage({
        type: 'error',
        text: 'Communications channel offline. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden scroll-mt-28">
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-cyan-600/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-2 xs:px-4 md:px-8 relative z-10">

        {/* Section Heading */}
        <div className="mb-12 text-center md:text-left">
          <span className="text-xs font-bold tracking-widest text-[#22d3ee]/80 uppercase block mb-2 font-mono">05. Communication Center</span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Contact & Connection Hub</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400 mt-3 rounded-full mx-auto md:mx-0" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-stretch" id="contact-hub-workspace">
          {/* Left Block: Connection details */}
          <div className="lg:col-span-5 bento-card p-4 xs:p-6 md:p-8 flex flex-col justify-between gap-6">
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-3">Let's Build Something High-Grade</h3>
              <p className="text-white/50 text-xs sm:text-sm leading-relaxed">
                Thank you for reviewing my CSE portfolios. I am on the lookout for exciting entry-level Data Science roles, analyst projects, and end-to-end full-stack AI model deployments. Reach out directly for collaboration inquiries!
              </p>
            </div>

            {/* Direct contact references */}
            <div className="space-y-4" id="direct-references-box">
              <div className="flex items-center space-x-3.5 p-3 xs:p-4 rounded-xl bg-white/[0.02]/50 border border-white/5 hover:border-cyan-400/30 transition-colors min-w-0">
                <div className="p-3 bg-violet-500/10 rounded-xl text-violet-400 flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-grow">
                  <span className="block text-[8px] font-mono text-white/40 uppercase">Direct Email</span>
                  <a href={`mailto:${userEmail}`} className="text-xs sm:text-sm font-semibold text-white hover:text-cyan-400 transition-colors break-all safe-wrap">
                    {userEmail}
                  </a>
                </div>
              </div>

              {/* GitHub reference */}
              <div className="flex items-center space-x-3.5 p-3 xs:p-4 rounded-xl bg-white/[0.02]/50 border border-white/5 hover:border-cyan-400/30 transition-colors min-w-0">
                <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 flex-shrink-0">
                  <Github className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-grow">
                  <span className="block text-[8px] font-mono text-white/40 uppercase">GitHub Catalog</span>
                  <a href="https://github.com/gaurav1642" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm font-semibold text-white hover:text-cyan-400 transition-colors break-all safe-wrap">
                    github.com/gaurav1642
                  </a>
                </div>
              </div>

              {/* LinkedIn reference */}
              <div className="flex items-center space-x-3.5 p-3 xs:p-4 rounded-xl bg-white/[0.02]/50 border border-white/5 hover:border-cyan-400/30 transition-colors min-w-0">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 flex-shrink-0">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-grow">
                  <span className="block text-[8px] font-mono text-white/40 uppercase">Professional Network</span>
                  <a href="https://linkedin.com/in/gaurav1642" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm font-semibold text-white hover:text-cyan-400 transition-colors break-all safe-wrap">
                    linkedin.com/in/gaurav1642
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Block: Active verified Form */}
          <div className="lg:col-span-7">
            <div className="bento-card p-4 xs:p-6 md:p-8">
              <h4 className="font-display text-white font-bold text-lg mb-6">Forward an Instant Inquiry</h4>

              <form id="contact-inquiry-form" onSubmit={handleFormSubmission} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-[10px] font-mono text-white/40 mb-1.5 uppercase tracking-wider">Your Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Jane Doe"
                      required
                      className="w-full text-xs sm:text-sm py-2.5 px-4 bg-white/[0.02] border border-white/5 rounded-xl text-white focus:outline-none focus:border-cyan-400 placeholder-white/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-[10px] font-mono text-white/40 mb-1.5 uppercase tracking-wider">Your Email</label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="jane@example.com"
                      required
                      className="w-full text-xs sm:text-sm py-2.5 px-4 bg-white/[0.02] border border-white/5 rounded-xl text-white focus:outline-none focus:border-cyan-400 placeholder-white/20"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-[10px] font-mono text-white/40 mb-1.5 uppercase tracking-wider">Message Subject</label>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Project Collaboration Opportunity"
                    required
                    className="w-full text-xs sm:text-sm py-2.5 px-4 bg-white/[0.02] border border-white/5 rounded-xl text-white focus:outline-none focus:border-cyan-400 placeholder-white/20"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-[10px] font-mono text-white/40 mb-1.5 uppercase tracking-wider">Message Details</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Dear Gaurav, let's connect..."
                    required
                    className="w-full text-xs sm:text-sm py-2.5 px-4 bg-white/[0.02] border border-white/5 rounded-xl text-white focus:outline-none focus:border-cyan-400 placeholder-white/20 resize-none"
                  />
                </div>

                {/* Submissions Alerts */}
                {outcomeMessage && (
                  <div
                    id="contact-alert-banner"
                    className={`flex items-start space-x-2.5 p-4 rounded-xl text-xs leading-relaxed border ${outcomeMessage.type === 'success'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border-red-500/15'
                      }`}
                  >
                    {outcomeMessage.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    )}
                    <span>{outcomeMessage.text}</span>
                  </div>
                )}

                <button
                  id="submit-contact-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2 h-11 rounded-full text-xs tracking-widest uppercase font-bold text-white bg-gradient-to-r from-violet-600 via-cyan-500 to-emerald-500 shadow-xl shadow-violet-500/5 hover:scale-[1.005] cursor-pointer hover:shadow-cyan-500/10 transition-all disabled:opacity-50"
                >
                  <Send className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-pulse' : ''}`} />
                  <span>{isSubmitting ? 'Transmitting Inquiries...' : 'Send Message'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
