import { useState, useEffect, FormEvent } from 'react';
import {
  Lock, Mail, Kanban, Sliders, Calendar, Globe, AlertTriangle,
  Sparkles, Check, CheckCircle2, Trash2, Plus, MessageCircle,
  LogOut, Briefcase, GraduationCap, User, FileText, ChevronRight, Edit,
  MessageSquare, Send, CheckSquare, X
} from 'lucide-react';
import { Project, Skill, ContactMessage, Experience, EducationEntry, ProfileBio } from '../types';

interface AdminDashboardProps {
  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  education: EducationEntry[];
  profileBio: ProfileBio | null;
  onRefreshData: () => void;
  onExitAdmin: () => void;
}

export default function AdminDashboard({
  projects,
  skills,
  experiences,
  education,
  profileBio,
  onRefreshData,
  onExitAdmin
}: AdminDashboardProps) {
  // Authentication states
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('admin_auth_token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'messages' | 'projects' | 'skills' | 'experiences' | 'education' | 'profile'>('messages');

  // Operational states
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [statusNotification, setStatusNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // States for viewing full message / replying modal
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyBody, setReplyBody] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replyFilter, setReplyFilter] = useState<'all' | 'pending' | 'replied'>('all');

  // Custom modern deletion confirmation dialog state using state modal instead of iframe-blocked confirm window alerts
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    id: string;
    type: 'project' | 'skill' | 'experience' | 'education' | 'message';
    title: string;
    description: string;
  } | null>(null);

  const triggerDeleteConfirm = (
    id: string,
    type: 'project' | 'skill' | 'experience' | 'education' | 'message',
    title: string,
    description: string
  ) => {
    setDeleteConfirmation({ id, type, title, description });
  };

  // --- FORM STATES FOR RECURSIVE CRUD ---

  // Project formulation states (handles add vs edit)
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    featuresText: '', // split by newline
    techStackText: '', // split by comma
    category: 'Web Dev' as 'Web Dev' | 'AI/ML' | 'Data Analytics',
    liveUrl: '#',
    githubUrl: '#',
    iconType: 'globe' as 'globe' | 'cpu' | 'database' | 'image' | 'bookOpen'
  });

  // Skills formulation states (handles add vs edit)
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'Core Tech' as 'Core Tech' | 'Languages & Data' | 'AI/ML & Tools',
    proficiency: 80
  });

  // Experience Formulation states (handles add vs edit)
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [newExperience, setNewExperience] = useState({
    role: '',
    organization: '',
    duration: '',
    highlightsText: '', // split by newline
    type: 'experience' as 'experience' | 'milestone',
    badge: ''
  });

  // Education Formulation states (handles add vs edit)
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null);
  const [newEducation, setNewEducation] = useState({
    institution: '',
    degree: '',
    duration: '',
    concentration: '',
    badge: ''
  });

  // Profile biography state
  const [bioForm, setBioForm] = useState({
    title: '',
    subtitle: '',
    bioParagraph1: '',
    bioParagraph2: '',
    academicPillar1Title: '',
    academicPillar1Desc: '',
    academicPillar2Title: '',
    academicPillar2Desc: '',
    academicPillar3Title: '',
    academicPillar3Desc: ''
  });

  // Synchronize Biography formulation
  useEffect(() => {
    if (profileBio) {
      setBioForm({
        title: profileBio.title || '',
        subtitle: profileBio.subtitle || '',
        bioParagraph1: profileBio.bioParagraph1 || '',
        bioParagraph2: profileBio.bioParagraph2 || '',
        academicPillar1Title: profileBio.academicPillar1Title || '',
        academicPillar1Desc: profileBio.academicPillar1Desc || '',
        academicPillar2Title: profileBio.academicPillar2Title || '',
        academicPillar2Desc: profileBio.academicPillar2Desc || '',
        academicPillar3Title: profileBio.academicPillar3Title || '',
        academicPillar3Desc: profileBio.academicPillar3Desc || ''
      });
    }
  }, [profileBio]);

  useEffect(() => {
    if (authToken) {
      fetchMessages();
    }
  }, [authToken]);

  const displayNotice = (type: 'success' | 'error', text: string) => {
    setStatusNotification({ type, text });
    setTimeout(() => setStatusNotification(null), 4000);
  };

  const handleAdminLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const body = await res.json();

      if (res.ok && body.token) {
        localStorage.setItem('admin_auth_token', body.token);
        setAuthToken(body.token);
        displayNotice('success', 'Admin session authenticated successfully. Welcome Gaurav!');
      } else {
        setLoginError(body.error || 'Invalid credentials. Access Denied.');
      }
    } catch (err: any) {
      setLoginError('Authentication authority unreachable.');
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('admin_auth_token');
    setAuthToken(null);
    onExitAdmin();
  };

  const fetchMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const res = await fetch('/api/messages', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (res.ok) {
        const body = await res.json();
        setMessages(body);
      } else if (res.status === 401 || res.status === 403) {
        handleAdminLogout();
      }
    } catch (err) {
      console.error('Failed to load logs: ', err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
    if (!msgId) return;
    try {
      const res = await fetch(`/api/messages/${msgId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      if (res.ok) {
        setMessages((prev) => prev.filter(m => m.id !== msgId && m._id !== msgId));
        displayNotice('success', 'Inquiry message entry has been cleared.');
      } else {
        displayNotice('error', 'Failed to remove inquiry.');
      }
    } catch (err) {
      displayNotice('error', 'Operation communication error.');
    }
  };

  const handleSendReply = async (msgId: string) => {
    if (!msgId || !replyBody.trim()) return;
    setIsSendingReply(true);
    try {
      const res = await fetch(`/api/messages/${msgId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ replyText: replyBody })
      });

      if (res.ok) {
        const data = await res.json();
        const updatedMsg = data.item;

        // Update in list
        setMessages((prev) =>
          prev.map((m) => (m.id === msgId || m._id === msgId ? { ...m, ...updatedMsg } : m))
        );

        // Update selected message so the details pane reflects the reply
        if (selectedMessage && (selectedMessage.id === msgId || selectedMessage._id === msgId)) {
          setSelectedMessage((prev) => prev ? { ...prev, ...updatedMsg } : null);
        }

        setReplyBody('');
        displayNotice('success', data.message || 'Your reply has been saved!');
      } else {
        const errData = await res.json();
        displayNotice('error', errData.error || 'Failed to record reply.');
      }
    } catch (err) {
      displayNotice('error', 'Communication error submitting reply.');
    } finally {
      setIsSendingReply(false);
    }
  };

  // --- PROJECTS WORKFLOW (Add & Edit) ---
  const handleSaveProject = async (e: FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.description) {
      displayNotice('error', 'Project Title and Description are required!');
      return;
    }

    try {
      const payload = {
        title: newProject.title,
        description: newProject.description,
        features: newProject.featuresText.split('\n').map(f => f.trim()).filter(Boolean),
        techStack: newProject.techStackText.split(',').map(t => t.trim()).filter(Boolean),
        category: newProject.category,
        liveUrl: newProject.liveUrl,
        githubUrl: newProject.githubUrl,
        iconType: newProject.iconType
      };

      const url = editingProjectId ? `/api/projects/${editingProjectId}` : '/api/projects';
      const method = editingProjectId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
      });

      const body = await res.json();

      if (res.ok) {
        displayNotice('success', editingProjectId ? `Updated project detail "${newProject.title}" successfully.` : `Created project detail "${newProject.title}" successfully.`);
        setNewProject({
          title: '',
          description: '',
          featuresText: '',
          techStackText: '',
          category: 'Web Dev',
          liveUrl: '#',
          githubUrl: '#',
          iconType: 'globe'
        });
        setEditingProjectId(null);
        onRefreshData();
      } else {
        displayNotice('error', body.error || 'Failed to process project.');
      }
    } catch (err) {
      displayNotice('error', 'Operation communication error.');
    }
  };

  const handleStartEditProject = (proj: Project) => {
    setEditingProjectId((proj._id || proj.id)!);
    setNewProject({
      title: proj.title,
      description: proj.description,
      featuresText: (proj.features || []).join('\n'),
      techStackText: (proj.techStack || []).join(', '),
      category: proj.category,
      liveUrl: proj.liveUrl || '#',
      githubUrl: proj.githubUrl || '#',
      iconType: proj.iconType || 'globe'
    });
    // Scroll form into focus on small viewports
    document.getElementById('create-project-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDeleteProject = async (projId: string) => {
    if (!projId) return;

    try {
      const res = await fetch(`/api/projects/${projId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      if (res.ok) {
        displayNotice('success', 'Project successfully deleted.');
        if (editingProjectId === projId) {
          setEditingProjectId(null);
          setNewProject({
            title: '',
            description: '',
            featuresText: '',
            techStackText: '',
            category: 'Web Dev',
            liveUrl: '#',
            githubUrl: '#',
            iconType: 'globe'
          });
        }
        onRefreshData();
      } else {
        displayNotice('error', 'Could not delete project entry.');
      }
    } catch (err) {
      displayNotice('error', 'Connection issues during delete operation.');
    }
  };

  // --- SKILLS WORKFLOW (Add & Edit Slider & Delete) ---
  const handleSaveSkill = async (e: FormEvent) => {
    e.preventDefault();
    if (!newSkill.name) {
      displayNotice('error', 'Skill name is required!');
      return;
    }

    try {
      const url = editingSkillId ? `/api/skills/${editingSkillId}` : '/api/skills';
      const method = editingSkillId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(newSkill)
      });

      if (res.ok) {
        displayNotice('success', editingSkillId ? 'Skill data updated successfully!' : 'New skill added successfully!');
        setNewSkill({ name: '', category: 'Core Tech', proficiency: 80 });
        setEditingSkillId(null);
        onRefreshData();
      } else {
        const body = await res.json();
        displayNotice('error', body.error || 'Failed to commit skill.');
      }
    } catch (e) {
      displayNotice('error', 'Communication system outage.');
    }
  };

  const handleStartEditSkill = (skill: Skill) => {
    setEditingSkillId((skill._id || skill.id)!);
    setNewSkill({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency
    });
    // Smooth scroll to skills edit form so users know the fields are ready
    setTimeout(() => {
      document.getElementById('panel-skills-edit')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleDeleteSkill = async (id: string) => {
    if (!id) return;

    try {
      const res = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      if (res.ok) {
        displayNotice('success', 'Skill entry successfully deleted.');
        if (editingSkillId === id) {
          setEditingSkillId(null);
          setNewSkill({ name: '', category: 'Core Tech', proficiency: 80 });
        }
        onRefreshData();
      } else {
        displayNotice('error', 'Failed to remove skill.');
      }
    } catch (err) {
      displayNotice('error', 'Database write issue.');
    }
  };

  const handleUpdateSkillProficiency = async (skId: string, currentVal: number) => {
    if (!skId) return;
    try {
      const res = await fetch(`/api/skills/${skId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ proficiency: currentVal })
      });

      if (res.ok) {
        displayNotice('success', 'Skill proficiency index updated.');
        onRefreshData();
      } else {
        const body = await res.json();
        displayNotice('error', body.error || 'Failed to edit proficiency index.');
      }
    } catch (err) {
      displayNotice('error', 'Database write issue.');
    }
  };

  // --- EXPERIENCE TIMELINE WORKFLOW (Add & Edit & Delete) ---
  const handleSaveExperience = async (e: FormEvent) => {
    e.preventDefault();
    if (!newExperience.role || !newExperience.organization || !newExperience.duration) {
      displayNotice('error', 'Role, Organization and Duration are mandatory!');
      return;
    }

    try {
      const payload = {
        role: newExperience.role,
        organization: newExperience.organization,
        duration: newExperience.duration,
        highlights: newExperience.highlightsText.split('\n').map(h => h.trim()).filter(Boolean),
        type: newExperience.type,
        badge: newExperience.badge
      };

      const url = editingExperienceId ? `/api/experiences/${editingExperienceId}` : '/api/experiences';
      const method = editingExperienceId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        displayNotice('success', editingExperienceId ? 'Timeline milestone revised.' : 'Showcase milestone registered.');
        setNewExperience({ role: '', organization: '', duration: '', highlightsText: '', type: 'experience', badge: '' });
        setEditingExperienceId(null);
        onRefreshData();
      } else {
        const body = await res.json();
        displayNotice('error', body.error || 'Failed to save milestone.');
      }
    } catch (err) {
      displayNotice('error', 'Timeline service disconnected.');
    }
  };

  const handleStartEditExperience = (exp: Experience) => {
    setEditingExperienceId((exp._id || exp.id)!);
    setNewExperience({
      role: exp.role,
      organization: exp.organization,
      duration: exp.duration,
      highlightsText: (exp.highlights || []).join('\n'),
      type: exp.type,
      badge: exp.badge || ''
    });
    // Smooth scroll to experiences edit form so users know fields are ready
    setTimeout(() => {
      document.getElementById('panel-experiences')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleDeleteExperience = async (id: string) => {
    if (!id) return;

    try {
      const res = await fetch(`/api/experiences/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      if (res.ok) {
        displayNotice('success', 'Milestone purged from professional timeline.');
        if (editingExperienceId === id) {
          setEditingExperienceId(null);
          setNewExperience({ role: '', organization: '', duration: '', highlightsText: '', type: 'experience', badge: '' });
        }
        onRefreshData();
      } else {
        displayNotice('error', 'Purge operations failed.');
      }
    } catch (e) {
      displayNotice('error', 'Purge timeout.');
    }
  };

  // --- ACADEMIC EDUCATION WORKFLOW (Add & Edit & Delete) ---
  const handleSaveEducation = async (e: FormEvent) => {
    e.preventDefault();
    if (!newEducation.institution || !newEducation.degree || !newEducation.duration) {
      displayNotice('error', 'Institution degree and duration fields cannot be empty.');
      return;
    }

    try {
      const url = editingEducationId ? `/api/education/${editingEducationId}` : '/api/education';
      const method = editingEducationId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(newEducation)
      });

      if (res.ok) {
        displayNotice('success', editingEducationId ? 'Academic timeline point saved.' : 'Academic credentials registered.');
        setNewEducation({ institution: '', degree: '', duration: '', concentration: '', badge: '' });
        setEditingEducationId(null);
        onRefreshData();
      } else {
        const body = await res.json();
        displayNotice('error', body.error || 'Cannot apply changes.');
      }
    } catch (e) {
      displayNotice('error', 'Education collection closed.');
    }
  };

  const handleStartEditEducation = (edu: EducationEntry) => {
    setEditingEducationId((edu._id || edu.id)!);
    setNewEducation({
      institution: edu.institution,
      degree: edu.degree,
      duration: edu.duration,
      concentration: edu.concentration || '',
      badge: edu.badge || ''
    });
    // Smooth scroll to education edit form so users know fields are ready
    setTimeout(() => {
      document.getElementById('panel-education')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleDeleteEducation = async (id: string) => {
    if (!id) return;

    try {
      const res = await fetch(`/api/education/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      if (res.ok) {
        displayNotice('success', 'Academic record cleared.');
        if (editingEducationId === id) {
          setEditingEducationId(null);
          setNewEducation({ institution: '', degree: '', duration: '', concentration: '', badge: '' });
        }
        onRefreshData();
      } else {
        displayNotice('error', 'Failed to delete record.');
      }
    } catch (e) {
      displayNotice('error', 'Deletion timeout.');
    }
  };

  // --- PROFILE BIOGRAPHY WORKFLOW ---
  const handleUpdateBio = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/profile-bio', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(bioForm)
      });

      if (res.ok) {
        displayNotice('success', 'Biography narrative and primary academic pillars updated on live server!');
        onRefreshData();
      } else {
        displayNotice('error', 'Could not apply profile changes.');
      }
    } catch (err) {
      displayNotice('error', 'Network failure updating profile settings.');
    }
  };


  // Standard login viewport
  if (!authToken) {
    return (
      <section className="min-h-[85vh] pt-28 md:pt-36 pb-12 px-2 xs:px-4 flex items-center justify-center scroll-mt-28" id="admin-login-stage">
        <div className="w-full max-w-md glass-panel border-violet-500/25 rounded-2xl p-4 xs:p-6 sm:p-8 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 via-cyan-400 to-emerald-400 rounded-t-xl" />

          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/30 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-5 h-5 text-violet-400" />
            </div>
            <h3 className="font-display font-bold text-white text-xl">Admin Security Vault</h3>
            <p className="text-xs text-gray-400 mt-1">Provide credentials to modify live portfolio configurations</p>
          </div>

          <form id="admin-validation-form" onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-user-input" className="block text-xs font-mono text-gray-400 mb-1.5 uppercase">Admin Username</label>
              <input
                id="admin-user-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                className="w-full text-sm py-2.5 px-4 bg-[#0B0F19]/80 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-violet-500 placeholder-gray-700"
              />
            </div>

            <div>
              <label htmlFor="admin-pass-input" className="block text-xs font-mono text-gray-400 mb-1.5 uppercase">Admin Password</label>
              <input
                id="admin-pass-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full text-sm py-2.5 px-4 bg-[#0B0F19]/80 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-violet-500 placeholder-gray-700"
              />
            </div>

            {loginError && (
              <div id="login-error-alert" className="p-3 text-xs text-red-400 bg-red-950/20 rounded border border-red-500/15 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* <div className="p-3.5 text-xs text-slate-400 bg-slate-900/60 rounded-lg border border-slate-800/80 flex flex-col space-y-1.5 font-mono">
              <span className="text-cyan-400 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Access Blueprint Guide
              </span>
              <p className="text-[11px] leading-relaxed">
                By default, this digital portfolio utilizes:
                <br />
                User: <span className="text-white font-semibold">admin</span>
                <br />
                Pass: <span className="text-white font-semibold">adminpassword123</span>
              </p>
              <button
                type="button"
                onClick={() => {
                  setUsername('admin');
                  setPassword('adminpassword123');
                }}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 underline cursor-pointer text-left font-semibold active:opacity-75 transition-opacity pt-0.5"
              >
                ⚡ Click to auto-fill default credentials
              </button>
            </div> */}

            <button
              id="admin-login-submit"
              type="submit"
              className="w-full flex items-center justify-center space-x-2 h-11 rounded-lg text-white font-display font-medium bg-gradient-to-r from-violet-600 to-cyan-500 shadow-lg shadow-violet-500/10 cursor-pointer hover:scale-[1.005] transition-transform"
            >
              <Lock className="w-4 h-4" />
              <span>Authenticate and Access Secure GUI</span>
            </button>
          </form>

          <button
            id="admin-cancel-btn"
            onClick={onExitAdmin}
            className="w-full mt-3 flex items-center justify-center space-x-2 h-11 rounded-lg text-gray-400 font-display font-semibold hover:text-white transition-all text-xs"
          >
            Cancel and Return Home
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-28 md:pt-36 pb-20 relative scroll-mt-28" id="authenticated-admin-panel">
      <div className="max-w-7xl mx-auto px-2 xs:px-4 md:px-8">

        {/* Header toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block mb-1">
              • Secure Operations Terminal
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center">
              <Sparkles className="w-5 h-5 text-yellow-400 mr-2" />
              Admin Dashboard Suite
            </h2>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 mt-4 sm:mt-0">
            <button
              id="exit-to-site"
              onClick={onExitAdmin}
              className="px-4 py-2 text-xs font-mono text-gray-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg cursor-pointer"
            >
              Return to Site View
            </button>

            <button
              id="admin-logout-btn"
              onClick={handleAdminLogout}
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-mono text-red-400 hover:text-red-300 bg-red-950/10 border border-red-500/15 rounded-lg cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Console</span>
            </button>
          </div>
        </div>

        {/* Global Action Notifications */}
        {statusNotification && (
          <div
            id="admin-success-toast"
            className={`fixed bottom-4 right-4 z-50 flex items-center space-x-2.5 p-4 rounded-xl shadow-2xl border ${statusNotification.type === 'success'
              ? 'bg-[#151B2E] border-emerald-500/30 text-emerald-400'
              : 'bg-[#151B2E] border-red-500/30 text-red-500'
              }`}
          >
            {statusNotification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-red-400" />
            )}
            <span className="text-sm font-semibold">{statusNotification.text}</span>
          </div>
        )}

        {/* Dashboard layout with Side controllers */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">

          {/* Navigation Controls (Bento layout grid style buttons wrapping perfectly on mobile) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 lg:col-span-3 gap-2">
            <button
              id="tab-messages-btn"
              onClick={() => setActiveTab('messages')}
              className={`flex items-center justify-between px-2 py-2.5 xs:px-3 md:px-4 md:py-3 rounded-xl border text-[10px] xs:text-xs sm:text-sm font-display font-semibold transition-all cursor-pointer truncate ${activeTab === 'messages'
                ? 'bg-gradient-to-r from-violet-600/10 to-cyan-500/10 text-cyan-300 border-cyan-500/40 shadow shadow-cyan-500/5'
                : 'bg-[#151B2E]/40 text-gray-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
            >
              <span className="flex items-center truncate">
                <MessageCircle className="w-4 h-4 mr-1.5 text-cyan-400 flex-shrink-0" />
                Inquiries
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-mono bg-cyan-500/10 text-cyan-400 rounded font-bold">{messages.length}</span>
            </button>

            <button
              id="tab-profile-btn"
              onClick={() => setActiveTab('profile')}
              className={`flex items-center px-2 py-2.5 xs:px-3 md:px-4 md:py-3 rounded-xl border text-[10px] xs:text-xs sm:text-sm font-display font-semibold transition-all cursor-pointer truncate ${activeTab === 'profile'
                ? 'bg-gradient-to-r from-violet-600/10 to-cyan-500/10 text-cyan-300 border-cyan-500/40 shadow shadow-cyan-500/5'
                : 'bg-[#151B2E]/40 text-gray-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
            >
              <User className="w-4 h-4 mr-1.5 text-blue-400 flex-shrink-0" />
              Biography
            </button>

            <button
              id="tab-projects-btn"
              onClick={() => setActiveTab('projects')}
              className={`flex items-center px-2 py-2.5 xs:px-3 md:px-4 md:py-3 rounded-xl border text-[10px] xs:text-xs sm:text-sm font-display font-semibold transition-all cursor-pointer truncate ${activeTab === 'projects'
                ? 'bg-gradient-to-r from-violet-600/10 to-cyan-500/10 text-cyan-300 border-cyan-500/40 shadow shadow-cyan-500/5'
                : 'bg-[#151B2E]/40 text-gray-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
            >
              <Kanban className="w-4 h-4 mr-1.5 text-violet-400 flex-shrink-0" />
              Projects
            </button>

            <button
              id="tab-skills-btn"
              onClick={() => setActiveTab('skills')}
              className={`flex items-center px-2 py-2.5 xs:px-3 md:px-4 md:py-3 rounded-xl border text-[10px] xs:text-xs sm:text-sm font-display font-semibold transition-all cursor-pointer truncate ${activeTab === 'skills'
                ? 'bg-gradient-to-r from-violet-600/10 to-cyan-500/10 text-cyan-300 border-cyan-500/40 shadow shadow-cyan-500/5'
                : 'bg-[#151B2E]/40 text-gray-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
            >
              <Sliders className="w-4 h-4 mr-1.5 text-emerald-400 flex-shrink-0" />
              Skills
            </button>

            <button
              id="tab-experiences-btn"
              onClick={() => setActiveTab('experiences')}
              className={`flex items-center px-2 py-2.5 xs:px-3 md:px-4 md:py-3 rounded-xl border text-[10px] xs:text-xs sm:text-sm font-display font-semibold transition-all cursor-pointer truncate ${activeTab === 'experiences'
                ? 'bg-gradient-to-r from-violet-600/10 to-cyan-500/10 text-cyan-300 border-cyan-500/40 shadow shadow-cyan-500/5'
                : 'bg-[#151B2E]/40 text-gray-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
            >
              <Briefcase className="w-4 h-4 mr-1.5 text-amber-500 flex-shrink-0" />
              Timeline
            </button>

            <button
              id="tab-education-btn"
              onClick={() => setActiveTab('education')}
              className={`flex items-center px-2 py-2.5 xs:px-3 md:px-4 md:py-3 rounded-xl border text-[10px] xs:text-xs sm:text-sm font-display font-semibold transition-all cursor-pointer truncate ${activeTab === 'education'
                ? 'bg-gradient-to-r from-violet-600/10 to-cyan-500/10 text-cyan-300 border-cyan-500/40 shadow shadow-cyan-500/5'
                : 'bg-[#151B2E]/40 text-gray-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
            >
              <GraduationCap className="w-4 h-4 mr-1.5 text-[#22d3ee] flex-shrink-0" />
              Education
            </button>
          </div>

          {/* Core Content boards */}
          <div className="lg:col-span-9 bg-[#111625]/40 border border-slate-800/80 rounded-2xl p-4 xs:p-5 sm:p-7 relative min-h-[460px]">

            {/* Tab: MESSAGE INBOX LOGS */}
            {activeTab === 'messages' && (() => {
              const filteredMessages = messages.filter(m => {
                if (replyFilter === 'replied') return !!m.replyText;
                if (replyFilter === 'pending') return !m.replyText;
                return true;
              });

              return (
                <div className="space-y-6" id="panel-messages">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display font-bold text-white text-lg">Inquiry Mailbox Inbox</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Track, archive, and write back to digital portfolio submissions</p>
                    </div>
                    <button
                      id="refresh-mailbox-btn"
                      onClick={fetchMessages}
                      className="text-xs font-mono text-cyan-400 hover:underline cursor-pointer"
                    >
                      Refresh Mailbox
                    </button>
                  </div>

                  {/* Reply Status Metric Trackers - Interactive filters */}
                  <div className="grid grid-cols-3 gap-3" id="reply-status-metrics-strip">
                    <button
                      type="button"
                      onClick={() => setReplyFilter('all')}
                      className={`flex flex-col p-3 rounded-xl border text-left transition-all cursor-pointer ${replyFilter === 'all'
                        ? 'bg-gradient-to-r from-cyan-950/20 to-blue-950/20 border-cyan-500/40 shadow-sm shadow-cyan-500/5'
                        : 'bg-[#151B2E]/40 border-slate-800/80 hover:border-slate-705/60'
                        }`}
                    >
                      <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">All Inquiries</span>
                      <span className="text-lg sm:text-xl font-display font-bold text-white mt-1">{messages.length}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setReplyFilter('replied')}
                      className={`flex flex-col p-3 rounded-xl border text-left transition-all cursor-pointer ${replyFilter === 'replied'
                        ? 'bg-gradient-to-r from-emerald-950/20 to-teal-950/20 border-emerald-500/40 shadow-sm shadow-emerald-500/5'
                        : 'bg-[#151B2E]/40 border-slate-800/80 hover:border-slate-705/60'
                        }`}
                    >
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Replied</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      </div>
                      <span className="text-lg sm:text-xl font-display font-bold text-emerald-400 mt-1">
                        {messages.filter(m => m.replyText).length}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setReplyFilter('pending')}
                      className={`flex flex-col p-3 rounded-xl border text-left transition-all cursor-pointer ${replyFilter === 'pending'
                        ? 'bg-gradient-to-r from-orange-950/20 to-amber-950/20 border-orange-500/40 shadow-sm shadow-orange-500/5'
                        : 'bg-[#151B2E]/40 border-slate-800/80 hover:border-slate-705/60'
                        }`}
                    >
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Pending</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                      </div>
                      <span className="text-lg sm:text-xl font-display font-bold text-orange-400 mt-1">
                        {messages.filter(m => !m.replyText).length}
                      </span>
                    </button>
                  </div>

                  {isLoadingMessages ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-3">
                      <div className="w-6 h-6 border-t-2 border-cyan-400 rounded-full animate-spin" />
                      <span className="text-xs font-mono text-gray-500">Querying inquiries...</span>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="glass-panel rounded-xl text-center p-12 border-slate-800/80">
                      <Mail className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                      <h4 className="font-display font-bold text-white text-sm">Inbox is Empty</h4>
                      <p className="text-xs text-gray-500 mt-1">Pending inquiries will pop up here instantly.</p>
                    </div>
                  ) : filteredMessages.length === 0 ? (
                    <div className="glass-panel rounded-xl text-center p-12 border-slate-800/80">
                      <CheckCircle2 className="w-10 h-10 text-emerald-500/60 mx-auto mb-3" />
                      <h4 className="font-display font-bold text-white text-sm">No Messages Match</h4>
                      <p className="text-xs text-gray-500 mt-1">There are no inquiries matching the '{replyFilter}' filter category.</p>
                    </div>
                  ) : (
                    <div className="space-y-4" id="admin-messages-catalog">
                      {filteredMessages.map((m) => (
                        <div
                          id={`admin-msg-card-${m._id || m.id}`}
                          key={m._id || m.id}
                          onClick={() => {
                            setSelectedMessage(m);
                            setReplyBody(m.replyText || '');
                          }}
                          className="glass-panel border-slate-850/60 rounded-xl p-4 xs:p-5 hover:border-slate-700/60 transition-all flex flex-col justify-between cursor-pointer group hover:bg-slate-900/20"
                        >
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-display font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">{m.name}</span>
                                <span className="text-[10px] font-mono text-cyan-400">({m.email})</span>
                                {m.replyText ? (
                                  <span className="px-2 py-0.5 text-[9px] font-mono rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                                    <CheckSquare className="w-2.5 h-2.5" />
                                    <span>Replied</span>
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 text-[9px] font-mono rounded bg-[#ea580c]/10 text-orange-400 border border-orange-500/20 flex items-center space-x-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                                    <span>Pending</span>
                                  </span>
                                )}
                              </div>
                              <h4 className="text-xs font-semibold text-violet-400 mt-1 font-display">Subject: {m.subject}</h4>
                            </div>

                            <button
                              id={`delete-msg-btn-${m._id || m.id}`}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation(); // don't open details modal when deleting
                                triggerDeleteConfirm(
                                  (m._id || m.id)!,
                                  'message',
                                  m.name,
                                  `Are you sure you want to permanently delete this inquiry from "${m.name}"?`
                                );
                              }}
                              className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-955/20 rounded border border-transparent hover:border-red-500/20 cursor-pointer flex-shrink-0"
                              title="Clear Message"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <p className="text-xs text-gray-400 bg-[#0B0F19]/40 p-3 rounded-lg border border-slate-900/60 mt-3 line-clamp-2 leading-relaxed font-mono">
                            {m.message}
                          </p>

                          {m.replyText && (
                            <div className="mt-3 bg-emerald-950/10 border border-emerald-500/10 rounded-lg p-2.5">
                              <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center space-x-1">
                                <CheckSquare className="w-3 h-3" />
                                <span>ADMIN REPLY:</span>
                              </span>
                              <p className="text-[11px] text-gray-350 italic mt-0.5 line-clamp-1 font-mono">
                                "{m.replyText}"
                              </p>
                            </div>
                          )}

                          <div className="flex justify-between items-center mt-4 pt-1.5 border-t border-slate-900/40">
                            <span className="text-[10px] font-mono text-gray-500 flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {m.createdAt ? new Date(m.createdAt).toLocaleString() : 'N/A'}
                            </span>

                            <button
                              type="button"
                              className="py-1 px-3 text-[10px] font-mono font-bold rounded-lg border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-[#0B0F19] transition-all cursor-pointer flex items-center space-x-1"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>{m.replyText ? 'View Conversation' : 'Open & Reply'}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })()}

            {/* Tab: PROFILE BIOGRAPHY SETTINGS */}
            {activeTab === 'profile' && (
              <div className="space-y-6" id="panel-profile-edit">
                <div>
                  <h3 className="font-display font-bold text-white text-lg">Modify About &amp; Biography Details</h3>
                  <p className="text-xs text-gray-400 mt-1">Directly edit the primary bio paragraphs and academic pillars featured on the live showcase homepage.</p>
                </div>

                <form onSubmit={handleUpdateBio} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="bio-title-input" className="block text-xs font-mono text-gray-400 mb-1.5 uppercase">Primary Profile Title</label>
                      <input
                        id="bio-title-input"
                        type="text"
                        value={bioForm.title}
                        onChange={(e) => setBioForm(prev => ({ ...prev, title: e.target.value }))}
                        required
                        placeholder="B.Tech Student & Data Scientist"
                        className="w-full text-xs py-2.5 px-4 bg-[#0B0F19]/60 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label htmlFor="bio-subtitle-input" className="block text-xs font-mono text-gray-400 mb-1.5 uppercase">Profile Subtitle</label>
                      <input
                        id="bio-subtitle-input"
                        type="text"
                        value={bioForm.subtitle}
                        onChange={(e) => setBioForm(prev => ({ ...prev, subtitle: e.target.value }))}
                        required
                        placeholder="Artificial Intelligence"
                        className="w-full text-xs py-2.5 px-4 bg-[#0B0F19]/60 border border-slate-800 rounded-lg text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="bio-p1-input" className="block text-xs font-mono text-gray-400 mb-1.5 uppercase">Biography Paragraph 1 (Main Narrative)</label>
                    <textarea
                      id="bio-p1-input"
                      rows={4}
                      value={bioForm.bioParagraph1}
                      onChange={(e) => setBioForm(prev => ({ ...prev, bioParagraph1: e.target.value }))}
                      required
                      placeholder="Biography first section..."
                      className="w-full text-xs py-2.5 px-4 bg-[#0B0F19]/60 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400 resize-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label htmlFor="bio-p2-input" className="block text-xs font-mono text-gray-400 mb-1.5 uppercase">Biography Paragraph 2 (Focus Fields)</label>
                    <textarea
                      id="bio-p2-input"
                      rows={4}
                      value={bioForm.bioParagraph2}
                      onChange={(e) => setBioForm(prev => ({ ...prev, bioParagraph2: e.target.value }))}
                      required
                      placeholder="Biography second section..."
                      className="w-full text-xs py-2.5 px-4 bg-[#0B0F19]/60 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400 resize-none leading-relaxed"
                    />
                  </div>

                  {/* Academic Pillars editors */}
                  <div className="pt-4 border-t border-slate-800 space-y-4">
                    <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">Academic Pillar Milestones</h4>

                    <div className="grid grid-cols-1 gap-4">
                      {/* Pillar 1 */}
                      <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl space-y-3">
                        <span className="text-[10px] font-mono text-white/40 block">ACADEMIC PILLAR #1</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={bioForm.academicPillar1Title}
                            onChange={(e) => setBioForm(prev => ({ ...prev, academicPillar1Title: e.target.value }))}
                            placeholder="Pillar 1 Title"
                            required
                            className="sm:col-span-1 text-xs py-2 px-3 bg-[#0B0F19]/60 border border-slate-800 rounded text-white focus:outline-none"
                          />
                          <input
                            type="text"
                            value={bioForm.academicPillar1Desc}
                            onChange={(e) => setBioForm(prev => ({ ...prev, academicPillar1Desc: e.target.value }))}
                            placeholder="Pillar 1 Description text"
                            required
                            className="sm:col-span-2 text-xs py-2 px-3 bg-[#0B0F19]/60 border border-slate-800 rounded text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Pillar 2 */}
                      <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl space-y-3">
                        <span className="text-[10px] font-mono text-white/40 block">ACADEMIC PILLAR #2</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={bioForm.academicPillar2Title}
                            onChange={(e) => setBioForm(prev => ({ ...prev, academicPillar2Title: e.target.value }))}
                            placeholder="Pillar 2 Title"
                            required
                            className="sm:col-span-1 text-xs py-2 px-3 bg-[#0B0F19]/60 border border-slate-800 rounded text-white focus:outline-none"
                          />
                          <input
                            type="text"
                            value={bioForm.academicPillar2Desc}
                            onChange={(e) => setBioForm(prev => ({ ...prev, academicPillar2Desc: e.target.value }))}
                            placeholder="Pillar 2 Description text"
                            required
                            className="sm:col-span-2 text-xs py-2 px-3 bg-[#0B0F19]/60 border border-slate-800 rounded text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Pillar 3 */}
                      <div className="p-4 bg-slate-900/30 border border-slate-800 rounded-xl space-y-3">
                        <span className="text-[10px] font-mono text-white/40 block">ACADEMIC PILLAR #3</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={bioForm.academicPillar3Title}
                            onChange={(e) => setBioForm(prev => ({ ...prev, academicPillar3Title: e.target.value }))}
                            placeholder="Pillar 3 Title"
                            required
                            className="sm:col-span-1 text-xs py-2 px-3 bg-[#0B0F19]/60 border border-slate-800 rounded text-white focus:outline-none"
                          />
                          <input
                            type="text"
                            value={bioForm.academicPillar3Desc}
                            onChange={(e) => setBioForm(prev => ({ ...prev, academicPillar3Desc: e.target.value }))}
                            placeholder="Pillar 3 Description text"
                            required
                            className="sm:col-span-2 text-xs py-2 px-3 bg-[#0B0F19]/60 border border-slate-800 rounded text-white focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    id="save-bio-btn"
                    type="submit"
                    className="w-full flex items-center justify-center space-x-2 h-10 rounded-lg text-[#0B0F19] font-display font-medium bg-gradient-to-r from-cyan-400 to-emerald-400 shadow shadow-cyan-500/10 cursor-pointer"
                  >
                    <span>Save Biography Specifications</span>
                  </button>
                </form>
              </div>
            )}

            {/* Tab: PROJECTS EDITOR (CRUD) */}
            {activeTab === 'projects' && (
              <div className="space-y-8" id="panel-projects">
                {/* Form to CREATE or EDIT Project */}
                <div className="glass-panel border-violet-500/10 rounded-xl p-4 xs:p-5 sm:p-6">
                  <h3 className="font-display font-bold text-white text-base mb-4 flex items-center">
                    {editingProjectId ? (
                      <>
                        <Edit className="w-4.5 h-4.5 text-violet-400 mr-2" />
                        Edit Showcase Project Item
                      </>
                    ) : (
                      <>
                        <Plus className="w-4.5 h-4.5 text-cyan-400 mr-2" />
                        Publish Showcase Project Item
                      </>
                    )}
                  </h3>

                  <form id="create-project-form" onSubmit={handleSaveProject} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="p-title" className="block text-xs font-mono text-gray-400 mb-1.5 uppercase">Project Title</label>
                        <input
                          id="p-title"
                          type="text"
                          value={newProject.title}
                          onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g. HireHub AI"
                          required
                          className="w-full text-xs py-2.5 px-4 bg-[#0B0F19]/60 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label htmlFor="p-category" className="block text-xs font-mono text-gray-400 mb-1.5 uppercase">Category</label>
                          <select
                            id="p-category"
                            value={newProject.category}
                            onChange={(e) => setNewProject(prev => ({ ...prev, category: e.target.value as any }))}
                            className="w-full text-xs h-10 px-3 bg-[#0B0F19]/60 border border-slate-800 rounded-lg text-white focus:outline-none"
                          >
                            <option value="Web Dev">Web Dev</option>
                            <option value="AI/ML">AI/ML</option>
                            <option value="Data Analytics">Data Analytics</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="p-icon" className="block text-xs font-mono text-gray-400 mb-1.5 uppercase">Visual Icon</label>
                          <select
                            id="p-icon"
                            value={newProject.iconType}
                            onChange={(e) => setNewProject(prev => ({ ...prev, iconType: e.target.value as any }))}
                            className="w-full text-xs h-10 px-3 bg-[#0B0F19]/60 border border-slate-800 rounded-lg text-white focus:outline-none"
                          >
                            <option value="globe">Globe (Standard Portal)</option>
                            <option value="cpu">CPU (Machine Learning)</option>
                            <option value="database">Database (Analytics)</option>
                            <option value="image">Image Engine</option>
                            <option value="bookOpen">Open Book</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="p-desc" className="block text-xs font-mono text-gray-400 mb-1.5 uppercase">Core Description Narrative</label>
                      <textarea
                        id="p-desc"
                        rows={3}
                        value={newProject.description}
                        onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Detailed operational features, parameters, algorithms..."
                        required
                        className="w-full text-xs py-2.5 px-4 bg-[#0B0F19]/60 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="p-features" className="block text-xs font-mono text-gray-500 mb-1.5 uppercase">Key Features (One feature per line)</label>
                        <textarea
                          id="p-features"
                          rows={3}
                          value={newProject.featuresText}
                          onChange={(e) => setNewProject(prev => ({ ...prev, featuresText: e.target.value }))}
                          placeholder="Semantic matching candidate search&#10;Razorpay transaction order flows"
                          className="w-full text-xs py-2.5 px-4 bg-[#0B0F19]/60 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400 resize-none font-mono"
                        />
                      </div>

                      <div>
                        <label htmlFor="p-tech" className="block text-xs font-mono text-gray-505 mb-1.5 uppercase">Tech Badges (Comma-separated labels)</label>
                        <textarea
                          id="p-tech"
                          rows={3}
                          value={newProject.techStackText}
                          onChange={(e) => setNewProject(prev => ({ ...prev, techStackText: e.target.value }))}
                          placeholder="React, Express, MongoDB, NLP modules"
                          className="w-full text-xs py-2.5 px-4 bg-[#0B0F19]/60 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400 resize-none font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="p-live" className="block text-xs font-mono text-gray-400 mb-1.5 uppercase">Live Demo Link</label>
                        <input
                          id="p-live"
                          type="text"
                          value={newProject.liveUrl}
                          onChange={(e) => setNewProject(prev => ({ ...prev, liveUrl: e.target.value }))}
                          placeholder="#"
                          className="w-full text-xs py-2.5 px-4 bg-[#0B0F19]/60 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400 font-mono"
                        />
                      </div>

                      <div>
                        <label htmlFor="p-github" className="block text-xs font-mono text-gray-400 mb-1.5 uppercase">GitHub Codebase Link</label>
                        <input
                          id="p-github"
                          type="text"
                          value={newProject.githubUrl}
                          onChange={(e) => setNewProject(prev => ({ ...prev, githubUrl: e.target.value }))}
                          placeholder="https://github.com/srinivasan-ml/repo"
                          className="w-full text-xs py-2.5 px-4 bg-[#0B0F19]/60 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400 font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-3.5 pt-2">
                      <button
                        id="save-new-project-btn"
                        type="submit"
                        className="flex-grow flex items-center justify-center space-x-2 h-10 rounded-lg text-[#0B0F19] font-display font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 shadow-md shadow-cyan-500/10 cursor-pointer"
                      >
                        <span>{editingProjectId ? 'Save Project Details' : 'Add Project to Live Portfolio Catalog'}</span>
                      </button>

                      {editingProjectId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProjectId(null);
                            setNewProject({
                              title: '',
                              description: '',
                              featuresText: '',
                              techStackText: '',
                              category: 'Web Dev',
                              liveUrl: '#',
                              githubUrl: '#',
                              iconType: 'globe'
                            });
                          }}
                          className="px-4 h-10 border border-slate-800 hover:text-white rounded-lg text-xs font-mono cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* List of current projects */}
                <div className="space-y-3">
                  <h3 className="font-display font-semibold text-white text-base">Active Showcase Directory</h3>

                  <div className="grid grid-cols-1 gap-3">
                    {projects.map((proj) => (
                      <div
                        id={`admin-edit-proj-item-${proj._id || proj.id}`}
                        key={proj._id || proj.id}
                        className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3 truncate">
                          <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-cyan-400">
                            <Globe className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-display font-bold text-white text-sm">{proj.title}</h4>
                            <span className="text-[10px] font-mono text-violet-400 uppercase">{proj.category}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            id={`admin-edit-proj-btn-${proj._id || proj.id}`}
                            onClick={() => handleStartEditProject(proj)}
                            className="p-2 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded border border-transparent"
                            title="Edit Project Details"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            id={`admin-del-proj-${proj._id || proj.id}`}
                            onClick={() => triggerDeleteConfirm((proj._id || proj.id)!, 'project', proj.title, 'Are you sure you want to permanently delete this project milestone from your portfolio?')}
                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-950/20 rounded border border-transparent hover:border-red-500/20 cursor-pointer"
                            title="Delete Project Entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: SKILLS PROFICIENCY PANEL */}
            {activeTab === 'skills' && (
              <div className="space-y-6" id="panel-skills-edit">
                <div>
                  <h3 className="font-display font-bold text-white text-lg">Tune Skills Database</h3>
                  <p className="text-xs text-gray-400 mt-1">Add new skill categories or prune existing ones. Use the sliders to change proficiency indexes instantly.</p>
                </div>

                {/* Form to CREATE / EDIT Skills */}
                <div className="glass-panel border-violet-500/10 rounded-xl p-5">
                  <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-3">
                    {editingSkillId ? 'Edit Skill Record' : 'Register New Skill'}
                  </h4>

                  <form onSubmit={handleSaveSkill} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                    <div className="sm:col-span-4">
                      <label htmlFor="sk-name" className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Skill Name</label>
                      <input
                        id="sk-name"
                        type="text"
                        value={newSkill.name}
                        onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. PyTorch"
                        required
                        className="w-full text-xs h-10 px-3 bg-[#0B0F19]/60 border border-slate-800 rounded text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label htmlFor="sk-cat" className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Category</label>
                      <select
                        id="sk-cat"
                        value={newSkill.category}
                        onChange={(e) => setNewSkill(prev => ({ ...prev, category: e.target.value as any }))}
                        className="w-full text-xs h-10 px-2 bg-[#0B0F19]/60 border border-slate-800 rounded text-white focus:outline-none"
                      >
                        <option value="Core Tech">Core Tech</option>
                        <option value="Languages & Data">Languages & Data</option>
                        <option value="AI/ML & Tools">AI/ML & Tools</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="sk-proficiency" className="block text-[10px] font-mono text-gray-400 mb-1 uppercase">Proficiency ({newSkill.proficiency}%)</label>
                      <input
                        id="sk-proficiency"
                        type="number"
                        min="0"
                        max="100"
                        value={newSkill.proficiency}
                        onChange={(e) => setNewSkill(prev => ({ ...prev, proficiency: parseInt(e.target.value) || 0 }))}
                        required
                        className="w-full text-xs h-10 px-3 bg-[#0B0F19]/60 border border-slate-800 rounded text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="sm:col-span-2 flex space-x-2">
                      <button
                        type="submit"
                        className="flex-grow h-10 rounded text-xs font-display font-bold bg-cyan-400 text-[#0B0F19] cursor-pointer"
                      >
                        Save
                      </button>
                      {editingSkillId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSkillId(null);
                            setNewSkill({ name: '', category: 'Core Tech', proficiency: 80 });
                          }}
                          className="px-2 h-10 border border-slate-850 hover:bg-slate-900 rounded text-xs font-mono cursor-pointer"
                        >
                          X
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-3">
                  {skills.map((skill) => (
                    <div
                      id={`admin-skill-editor-card-${skill._id || skill.id}`}
                      key={skill._id || skill.id}
                      className="glass-panel border-slate-850/60 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="sm:max-w-[40%] flex-shrink-0">
                        <span className="text-[9px] font-mono font-bold text-violet-400 uppercase tracking-widest">{skill.category}</span>
                        <h4 className="font-display font-semibold text-white text-sm mt-0.5">{skill.name}</h4>
                      </div>

                      {/* Slider and Update actions */}
                      <div className="flex flex-col sm:flex-row flex-grow items-stretch sm:items-center justify-between gap-3 sm:gap-4 w-full">
                        <div className="flex-grow flex items-center space-x-3.5">
                          <input
                            id={`skill-slider-${skill._id || skill.id}`}
                            type="range"
                            min="0"
                            max="100"
                            defaultValue={skill.proficiency}
                            className="flex-grow accent-cyan-400 cursor-pointer h-1.5 rounded-full bg-slate-850"
                            onChange={(e) => {
                              const badge = document.getElementById(`skill-val-badge-${skill._id || skill.id}`);
                              if (badge) badge.innerText = e.target.value + '%';
                            }}
                          />
                          <span
                            id={`skill-val-badge-${skill._id || skill.id}`}
                            className="font-mono text-xs font-bold text-cyan-400 bg-cyan-400/5 px-2 py-0.5 border border-cyan-400/20 rounded min-w-[42px] text-center"
                          >
                            {skill.proficiency}%
                          </span>
                        </div>

                        <div className="flex items-center justify-end sm:justify-start space-x-1.5 flex-shrink-0">
                          <button
                            id={`skill-update-btn-${skill._id || skill.id}`}
                            onClick={() => {
                              const slider = document.getElementById(`skill-slider-${skill._id || skill.id}`) as HTMLInputElement;
                              const newVal = slider ? parseInt(slider.value) : skill.proficiency;
                              handleUpdateSkillProficiency((skill._id || skill.id)!, newVal);
                            }}
                            className="p-1 px-2.5 rounded text-[11px] font-mono font-medium text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/10 cursor-pointer"
                            title="Update Level Only"
                          >
                            Update
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStartEditSkill(skill)}
                            className="p-1.5 text-gray-400 hover:text-cyan-400 cursor-pointer"
                            title="Full Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => triggerDeleteConfirm((skill._id || skill.id)!, 'skill', skill.name, `Are you sure you want to permanently delete the skill metrics for "${skill.name}"?`)}
                            className="p-1.5 text-gray-500 hover:text-red-400 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: EXPERIENCES TIMELINE CRUD */}
            {activeTab === 'experiences' && (
              <div className="space-y-6" id="panel-experiences">
                <div>
                  <h3 className="font-display font-bold text-white text-lg">Manage Professional timeline</h3>
                  <p className="text-xs text-gray-400 mt-1">Register corporate internships, projects, competitive hacking statuses and operational developer roles.</p>
                </div>

                {/* Form to CREATE / EDIT Experience */}
                <div className="glass-panel border-violet-500/10 rounded-xl p-5">
                  <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-3">
                    {editingExperienceId ? 'Edit Experience Details' : 'Add Professional Milestone'}
                  </h4>

                  <form onSubmit={handleSaveExperience} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label htmlFor="exp-role" className="block text-[10px] font-mono text-gray-500 mb-1 uppercase">Title / Role</label>
                        <input
                          id="exp-role"
                          type="text"
                          value={newExperience.role}
                          onChange={(e) => setNewExperience(prev => ({ ...prev, role: e.target.value }))}
                          placeholder="e.g. Data Scientist Intern"
                          required
                          className="w-full text-xs h-10 px-3 bg-[#0B0F19]/60 border border-slate-800 rounded text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label htmlFor="exp-org" className="block text-[10px] font-mono text-gray-500 mb-1 uppercase">Organization</label>
                        <input
                          id="exp-org"
                          type="text"
                          value={newExperience.organization}
                          onChange={(e) => setNewExperience(prev => ({ ...prev, organization: e.target.value }))}
                          placeholder="e.g. Microsoft Azure Club"
                          required
                          className="w-full text-xs h-10 px-3 bg-[#0B0F19]/60 border border-slate-800 rounded text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label htmlFor="exp-duration" className="block text-[10px] font-mono text-gray-500 mb-1 uppercase">Duration Range</label>
                        <input
                          id="exp-duration"
                          type="text"
                          value={newExperience.duration}
                          onChange={(e) => setNewExperience(prev => ({ ...prev, duration: e.target.value }))}
                          placeholder="e.g. June 2025 - Present"
                          required
                          className="w-full text-xs h-10 px-3 bg-[#0B0F19]/60 border border-slate-800 rounded text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="exp-type" className="block text-[10px] font-mono text-gray-500 mb-1 uppercase">Type Category</label>
                        <select
                          id="exp-type"
                          value={newExperience.type}
                          onChange={(e) => setNewExperience(prev => ({ ...prev, type: e.target.value as any }))}
                          className="w-full text-xs h-10 px-2 bg-[#0B0F19]/60 border border-slate-800 rounded text-white focus:outline-none"
                        >
                          <option value="experience">Professional Experience</option>
                          <option value="milestone">Honor / Hacking Milestone</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="exp-badge" className="block text-[10px] font-mono text-gray-500 mb-1 uppercase">Custom Badge Text (Optional)</label>
                        <input
                          id="exp-badge"
                          type="text"
                          value={newExperience.badge}
                          onChange={(e) => setNewExperience(prev => ({ ...prev, badge: e.target.value }))}
                          placeholder="e.g. Highly Selective, National Winner"
                          className="w-full text-xs h-10 px-3 bg-[#0B0F19]/60 border border-slate-800 rounded text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="exp-highlights" className="block text-[10px] font-mono text-gray-500 mb-1.5 uppercase">Highlights / Key Focuses (One highlight bullet per line)</label>
                      <textarea
                        id="exp-highlights"
                        rows={3}
                        value={newExperience.highlightsText}
                        onChange={(e) => setNewExperience(prev => ({ ...prev, highlightsText: e.target.value }))}
                        placeholder="Built custom regression charts reducing prediction gaps by 12%&#10;Integrated Google Workspace APIs"
                        className="w-full text-xs py-2 px-3 bg-[#0B0F19]/60 border border-slate-800 rounded text-white focus:outline-none resize-none font-mono"
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      <button
                        type="submit"
                        className="flex-grow flex items-center justify-center h-10 rounded text-xs font-display font-medium bg-gradient-to-r from-cyan-400 to-emerald-400 text-[#0B0F19] cursor-pointer"
                      >
                        <span>{editingExperienceId ? 'Save Milestones details' : 'Register professional milestone'}</span>
                      </button>

                      {editingExperienceId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingExperienceId(null);
                            setNewExperience({ role: '', organization: '', duration: '', highlightsText: '', type: 'experience', badge: '' });
                          }}
                          className="px-4 h-10 border border-slate-800 rounded text-xs font-mono cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="space-y-2.5">
                  <h4 className="font-display font-bold text-white text-sm">Review Registered milestones</h4>
                  <div className="grid grid-cols-1 gap-2.5">
                    {experiences.map((exp) => (
                      <div
                        key={exp._id || exp.id}
                        className="p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl flex items-center justify-between"
                      >
                        <div className="truncate pr-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-white text-xs">{exp.role}</span>
                            <span className="text-[10px] text-gray-500">• {exp.organization}</span>
                          </div>
                          <span className="text-[9px] text-violet-400 font-mono tracking-wider">{exp.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartEditExperience(exp)}
                            className="p-1.5 text-gray-400 hover:text-cyan-400 cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => triggerDeleteConfirm((exp._id || exp.id)!, 'experience', exp.role, `Are you sure you want to permanently delete the professional milestone "${exp.role}"?`)}
                            className="p-1.5 text-gray-500 hover:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: ACADEMIC EDUCATION TIMELINE CRUD */}
            {activeTab === 'education' && (
              <div className="space-y-6" id="panel-education">
                <div>
                  <h3 className="font-display font-bold text-white text-lg">Manage Academic Credentials</h3>
                  <p className="text-xs text-gray-400 mt-1">Directly curate degrees, secondary qualifications, credentials, school details, and custom concentrations on the About card.</p>
                </div>

                <div className="glass-panel border-violet-500/10 rounded-xl p-5">
                  <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-3">
                    {editingEducationId ? 'Modify Credentials Details' : 'Register New Academic Record'}
                  </h4>

                  <form onSubmit={handleSaveEducation} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="edu-inst" className="block text-[10px] font-mono text-gray-500 mb-1 uppercase">Institution Name / Degree Category</label>
                        <input
                          id="edu-inst"
                          type="text"
                          value={newEducation.institution}
                          onChange={(e) => setNewEducation(prev => ({ ...prev, institution: e.target.value }))}
                          placeholder="e.g. Bachelor of Technology"
                          required
                          className="w-full text-xs h-10 px-3 bg-[#0B0F19]/60 border border-slate-800 rounded text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label htmlFor="edu-deg" className="block text-[10px] font-mono text-gray-500 mb-1 uppercase">Degree Name / Field Focus</label>
                        <input
                          id="edu-deg"
                          type="text"
                          value={newEducation.degree}
                          onChange={(e) => setNewEducation(prev => ({ ...prev, degree: e.target.value }))}
                          placeholder="e.g. Computer Science & Engineering"
                          required
                          className="w-full text-xs h-10 px-3 bg-[#0B0F19]/60 border border-slate-800 rounded text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="edu-dur" className="block text-[10px] font-mono text-gray-500 mb-1 uppercase">Timeframe / status</label>
                        <input
                          id="edu-dur"
                          type="text"
                          value={newEducation.duration}
                          onChange={(e) => setNewEducation(prev => ({ ...prev, duration: e.target.value }))}
                          placeholder="e.g. 2022 - 2026 (PRESENT STATUS)"
                          required
                          className="w-full text-xs h-10 px-3 bg-[#0B0F19]/60 border border-slate-800 rounded text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label htmlFor="edu-badge" className="block text-[10px] font-mono text-gray-500 mb-1 uppercase">Short Date Badge</label>
                        <input
                          id="edu-badge"
                          type="text"
                          value={newEducation.badge}
                          onChange={(e) => setNewEducation(prev => ({ ...prev, badge: e.target.value }))}
                          placeholder="e.g. 2022 - 2026"
                          className="w-full text-xs h-10 px-3 bg-[#0B0F19]/60 border border-slate-800 rounded text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="edu-concentration" className="block text-[10px] font-mono text-gray-500 mb-1.5 uppercase">Concentration Details / Notable Metrics</label>
                      <textarea
                        id="edu-concentration"
                        rows={2}
                        value={newEducation.concentration}
                        onChange={(e) => setNewEducation(prev => ({ ...prev, concentration: e.target.value }))}
                        placeholder="e.g. Concentration Areas: ML Modeling, Deep Neural Nets, and Engineering Design."
                        required
                        className="w-full text-xs py-2 px-3 bg-[#0B0F19]/60 border border-slate-800 rounded text-white focus:outline-none resize-none font-mono"
                      />
                    </div>

                    <div className="flex items-center space-x-2 pt-1">
                      <button
                        type="submit"
                        className="flex-grow flex items-center justify-center h-10 rounded text-xs font-display font-medium bg-[#22d3ee] text-[#0B0F19] cursor-pointer"
                      >
                        Save Academic details
                      </button>

                      {editingEducationId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingEducationId(null);
                            setNewEducation({ institution: '', degree: '', duration: '', concentration: '', badge: '' });
                          }}
                          className="px-4 h-10 border border-slate-800 rounded text-xs font-mono cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="space-y-2.5">
                  <h4 className="font-display font-bold text-white text-sm">Live Academic listings</h4>

                  <div className="grid grid-cols-1 gap-2">
                    {education.map((edu) => (
                      <div
                        key={edu._id || edu.id}
                        className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl flex items-center justify-between"
                      >
                        <div className="truncate pr-4">
                          <h5 className="font-bold text-white text-xs">{edu.institution}</h5>
                          <p className="text-[10px] text-gray-400 mt-0.5">{edu.degree} ({edu.duration})</p>
                        </div>

                        <div className="flex items-center space-x-1 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartEditEducation(edu)}
                            className="p-1.5 text-gray-400 hover:text-cyan-400 cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => triggerDeleteConfirm((edu._id || edu.id)!, 'education', edu.institution, `Are you sure you want to permanently delete the academic credentials for "${edu.institution}"?`)}
                            className="p-1.5 text-gray-500 hover:text-red-400 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Deletion Confirmation Dialog Overlay */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070b13]/85 backdrop-blur-md">
          <div className="w-full max-w-sm glass-panel border-red-500/25 rounded-2xl p-6 sm:p-8 relative shadow-2xl shadow-red-500/5 transition-all">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-650 via-red-500 to-yellow-500 rounded-t-xl" />

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-display font-bold text-white text-lg">Confirm Removal</h3>
              <p className="text-xs text-red-400/90 font-mono mt-1 uppercase tracking-wider">
                Removing {deleteConfirmation.type}
              </p>
            </div>

            <div className="text-center space-y-2 mb-6">
              <p className="text-sm font-semibold text-white">
                "{deleteConfirmation.title}"
              </p>
              <p className="text-xs text-white/50 leading-relaxed">
                {deleteConfirmation.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmation(null)}
                className="py-2.5 px-4 rounded-lg bg-slate-900 border border-slate-800 text-gray-300 hover:text-white font-medium text-xs cursor-pointer hover:bg-slate-850 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const { id, type } = deleteConfirmation;
                  if (type === 'project') await handleDeleteProject(id);
                  else if (type === 'skill') await handleDeleteSkill(id);
                  else if (type === 'experience') await handleDeleteExperience(id);
                  else if (type === 'education') await handleDeleteEducation(id);
                  else if (type === 'message') await handleDeleteMessage(id);
                  setDeleteConfirmation(null);
                }}
                className="py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold text-xs cursor-pointer transition-colors shadow-lg shadow-red-600/10"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Selected Message Detail & Replying Modal Overlay */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070b13]/90 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-2xl glass-panel border-[#22d3ee]/20 rounded-2xl p-4 xs:p-6 sm:p-8 relative shadow-2xl transition-all my-8 max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-emerald-500 rounded-t-xl" />

            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-base">Inquiry Conversation Detail</h3>
                  <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mt-0.5">
                    Sender Profile &amp; Messaging Trail
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedMessage(null);
                  setReplyBody('');
                }}
                className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-gray-400 hover:text-white cursor-pointer transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Conversation Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0B0F19]/60 p-4 border border-slate-850/80 rounded-xl mb-6 text-xs font-mono">
              <div className="space-y-1.5">
                <span className="text-gray-500 uppercase text-[10px] block">Sender Name</span>
                <span className="text-white font-bold text-sm block">{selectedMessage.name}</span>
              </div>
              <div className="space-y-1.5">
                <span className="text-gray-500 uppercase text-[10px] block">Email Address</span>
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                  className="text-cyan-400 hover:underline font-bold block"
                  title="Click to open global mail program"
                >
                  {selectedMessage.email} ↗
                </a>
              </div>
              <div className="space-y-1.5">
                <span className="text-gray-500 uppercase text-[10px] block">Subject</span>
                <span className="text-violet-300 font-semibold block">{selectedMessage.subject}</span>
              </div>
              <div className="space-y-1.5">
                <span className="text-gray-500 uppercase text-[10px] block">Received On</span>
                <span className="text-gray-300 block">
                  {selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>

            {/* Original message content */}
            <div className="mb-6 flex-1">
              <label className="block text-[10px] font-mono text-gray-500 mb-1.5 uppercase">
                Original Message
              </label>
              <div className="bg-[#0B0F19]/45 border border-slate-900 rounded-xl p-4 min-h-[100px] text-xs text-gray-300 leading-relaxed font-mono whitespace-pre-line">
                {selectedMessage.message}
              </div>
            </div>

            {/* Admin Response Tracking or compose */}
            <div className="space-y-4">
              {selectedMessage.replyText ? (
                <div className="bg-emerald-950/15 border border-emerald-500/25 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center space-x-1 uppercase">
                      <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-400" />
                      Saved Response
                    </span>
                    <span className="text-[9px] font-mono text-gray-500">
                      {selectedMessage.repliedAt ? new Date(selectedMessage.repliedAt).toLocaleString() : ''}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-mono whitespace-pre-line">
                    {selectedMessage.replyText}
                  </p>
                </div>
              ) : null}

              {/* Compose/edit form section */}
              <div>
                <label htmlFor="admin-reply-textbox" className="block text-[10px] font-mono text-gray-400 mb-1.5 uppercase flex items-center justify-between">
                  <span>{selectedMessage.replyText ? 'Overwrite Response / Update Reply Log' : 'Compose Administrative Response'}</span>
                  <span className="text-[9px] text-gray-500 italic font-mono uppercase">Saved in local portfolio data records</span>
                </label>
                <textarea
                  id="admin-reply-textbox"
                  rows={4}
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  placeholder={`Hi ${selectedMessage.name}, thank you for your query...`}
                  className="w-full text-xs py-2 px-3 bg-[#0B0F19]/80 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-400 font-mono leading-relaxed resize-none"
                />
              </div>

              {/* Modal control actions */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMessage(null);
                      setReplyBody('');
                    }}
                    className="py-2.5 px-4 rounded-lg bg-slate-900 border border-slate-800 text-gray-400 hover:text-white font-medium text-xs cursor-pointer hover:bg-slate-850 transition-colors flex items-center justify-center space-x-1.5 flex-1"
                  >
                    <span>Cancel &amp; Close</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSendingReply || !replyBody.trim()}
                    onClick={() => handleSendReply((selectedMessage._id || selectedMessage.id)!)}
                    className={`py-2.5 px-6 rounded-lg font-semibold text-xs transition-colors shadow-lg flex items-center justify-center space-x-1.5 cursor-pointer flex-1 ${isSendingReply || !replyBody.trim()
                      ? 'bg-slate-800 text-gray-500 border border-slate-850 cursor-not-allowed shadow-none'
                      : 'bg-cyan-500 hover:bg-cyan-400 text-[#0B0F19] shadow-cyan-500/10'
                      }`}
                  >
                    {isSendingReply ? (
                      <div className="w-3.5 h-3.5 border-t-2 border-[#0B0F19] rounded-full animate-spin" />
                    ) : (
                      <CheckSquare className="w-3.5 h-3.5" />
                    )}
                    <span>{selectedMessage.replyText ? 'Update & Dispatch Email' : 'Send & Dispatch Reply (Direct 1-Click)'}</span>
                  </button>
                </div>

                <div className="text-center pt-1">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}&body=${encodeURIComponent(replyBody)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-mono text-gray-500 hover:text-cyan-400 transition-colors inline-flex items-center space-x-1 underline decoration-dashed cursor-pointer"
                    title="Launches native mail app with current pre-filled reply text"
                  >
                    <Send className="w-3 h-3 mr-1" />
                    <span>Or, use your device's default mail client instead (launches app) ↗</span>
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
