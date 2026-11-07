'use client';

import React, { useState, useEffect } from 'react';
import { cmsService } from '../../services/cms';
import {
  FolderKanban,
  Code2,
  Package,
  MessageSquare,
  Sparkles,
  User,
  CheckCircle,
  Zap,
  Globe,
  Briefcase,
  GraduationCap
} from 'lucide-react';

interface AdminOverviewProps {
  onNavigate?: (tab: string) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    projectsCount: 0,
    skillsCount: 0,
    servicesCount: 0,
    messagesCount: 0,
    experienceCount: 0,
    coursesCount: 0
  });

  const LOCAL_ADMIN_IMAGE = '/assets/images/mushahid_admin_profile.jpg';

  const [heroForm, setHeroForm] = useState({
    name: 'Mushahid Hussain',
    title: 'Web Developer',
    description: 'Turn your ideas into a stunning website.',
    avatarUrl: LOCAL_ADMIN_IMAGE,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [projects, skills, services, messages, profile, experiences, courses] = await Promise.all([
        cmsService.fetchData('projects'),
        cmsService.fetchData('skills'),
        cmsService.fetchData('services'),
        cmsService.fetchData('messages'),
        cmsService.fetchData('profiles'),
        cmsService.fetchData('experiences'),
        cmsService.fetchData('courses'),
      ]);

      setStats({
        projectsCount: projects?.length || 0,
        skillsCount: skills?.length || 0,
        servicesCount: services?.length || 0,
        messagesCount: messages?.length || 0,
        experienceCount: experiences?.length || 0,
        coursesCount: courses?.length || 0
      });

      if (profile && profile[0]) {
        const p = profile[0];
        setHeroForm({
          name: p.name || 'Mushahid Hussain',
          title: p.title || 'Web Developer',
          description: p.bioHero || 'Turn your ideas into a stunning website.',
          avatarUrl: p.avatarUrl || LOCAL_ADMIN_IMAGE,
        });
      }
    } catch (e) {
      console.warn('Overview data load error', e);
    } finally {
      setLoading(false);
    }
  };

  const handleHeroSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const profiles = await cmsService.fetchData('profiles');
      const existingId = profiles && profiles[0] ? profiles[0].id : null;

      const payload = {
        name: heroForm.name,
        title: heroForm.title,
        bioHero: heroForm.description,
        avatarUrl: heroForm.avatarUrl || LOCAL_ADMIN_IMAGE,
      };

      if (existingId) {
        await cmsService.updateData('profiles', existingId, payload);
      } else {
        await cmsService.insertData('profiles', payload);
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      loadData();
    } catch (e) {
      alert('Error saving hero data.');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A3D22]"></div></div>;
  }

  return (
    <div className="space-y-6 pb-12">
      {savedSuccess && (
        <div className="fixed top-6 right-6 z-50 bg-[#0A3D22] text-[#50E364] px-5 py-3 rounded-2xl shadow-2xl border border-[#50E364]/40 flex items-center gap-2 animate-bounce font-bold text-sm">
          <CheckCircle className="w-5 h-5" />
          <span>Dashboard updated successfully!</span>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#EAF9EE] via-[#F2FBF4] to-[#DCFCE7] p-8 sm:p-10 border border-[#50E364]/20 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A3D22]/10 text-[#0A3D22] text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-[#50E364] animate-ping" />
              <span>Portfolio Live</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-bold">
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span>Supabase Connected</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0A3D22] tracking-tight leading-tight">
            Welcome Back, <br />
            <span className="text-[#052814]">{heroForm.name}!</span>
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#113821] font-medium">
            Your portfolio is fully synced with Supabase Realtime. 🚀
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/70 backdrop-blur-xs p-3 sm:p-4 rounded-2xl border border-[#50E364]/30 shadow-xs shrink-0">
          <img
            src={heroForm.avatarUrl || LOCAL_ADMIN_IMAGE}
            alt={heroForm.name}
            referrerPolicy="no-referrer"
            onError={(e) => { 
              e.currentTarget.onerror = null;
              e.currentTarget.src = LOCAL_ADMIN_IMAGE; 
            }}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#50E364] shadow-sm"
          />
          <div>
            <div className="text-sm font-extrabold text-[#0A3D22]">{heroForm.name}</div>
            <div className="text-xs text-gray-600 font-semibold">{heroForm.title}</div>
          </div>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
            { label: 'Projects', count: stats.projectsCount, icon: FolderKanban },
            { label: 'Skills', count: stats.skillsCount, icon: Code2 },
            { label: 'Services', count: stats.servicesCount, icon: Package },
            { label: 'Experience', count: stats.experienceCount, icon: Briefcase },
            { label: 'Courses', count: stats.coursesCount, icon: GraduationCap },
            { label: 'Messages', count: stats.messagesCount, icon: MessageSquare },
        ].map(s => (
            <div key={s.label} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0A3D22] flex items-center justify-center">
                    <s.icon className="w-5 h-5" />
                </div>
                <div>
                    <div className="text-xl font-black text-[#0A3D22]">{s.count}</div>
                    <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{s.label}</div>
                </div>
            </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Hero Management */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-2xs">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2 text-[#0A3D22] font-bold">
              <Sparkles className="w-5 h-5 text-[#50E364]" />
              <span>Quick Hero Update</span>
            </div>
            {onNavigate && (
              <button type="button" onClick={() => onNavigate('hero')} className="text-xs font-bold text-[#0A3D22] hover:underline cursor-pointer">
                Full Editor ↗
              </button>
            )}
          </div>

          <form onSubmit={handleHeroSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Display Name</label>
                    <input type="text" value={heroForm.name} onChange={e => setHeroForm({...heroForm, name: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Title / Role</label>
                    <input type="text" value={heroForm.title} onChange={e => setHeroForm({...heroForm, title: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold" />
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Hero Bio</label>
                <textarea rows={2} value={heroForm.description} onChange={e => setHeroForm({...heroForm, description: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" />
            </div>
            <button type="submit" className="w-full bg-[#0A3D22] text-white py-3 rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2 hover:bg-[#114D2C]">
                <CheckCircle className="w-4 h-4 text-[#50E364]" />
                <span>Save Changes</span>
            </button>
          </form>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-2xs">
          <div className="flex items-center gap-2 text-[#0A3D22] font-bold mb-6 pb-4 border-b border-gray-100">
            <Zap className="w-5 h-5 text-[#50E364]" />
            <span>Quick Nav</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
                { name: 'Projects', key: 'projects', icon: FolderKanban },
                { name: 'Experience', key: 'experiences', icon: Briefcase },
                { name: 'Courses', key: 'courses', icon: GraduationCap },
                { name: 'Value Prop', key: 'why_us', icon: Zap },
            ].map(item => (
                <button
                  type="button"
                  key={item.name}
                  onClick={() => onNavigate && onNavigate(item.key)}
                  className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 transition-all text-left border border-emerald-100 group cursor-pointer"
                >
                    <div className="w-8 h-8 rounded-lg bg-[#0A3D22] text-[#50E364] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <item.icon className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#0A3D22]">{item.name}</div>
                </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
