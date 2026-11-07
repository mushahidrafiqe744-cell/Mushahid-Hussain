import React, { useState, useEffect } from 'react';
import { cmsService } from '../../services/cms';
import { Save, RotateCcw, CheckCircle, Globe, Image, Sparkles } from 'lucide-react';

const DEFAULT_AVATAR = '/assets/images/mushahid_admin_profile.jpg';

export const ManageHero: React.FC = () => {
  const [formData, setFormData] = useState({
    name: 'Mushahid Hussain',
    title: 'Web Developer',
    scriptSubhead: 'Web Developer & Engineer',
    badge: 'CRAFTING SCALABLE & INTUITIVE WEB EXPERIENCES.',
    bioHero: 'I build high-performance web applications, responsive interfaces, and robust backend services.',
    avatarUrl: DEFAULT_AVATAR,
    projectsCompleted: '30+',
    yearsOfExperience: '8+',
    happyClients: '99%',
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    loadHero();
  }, []);

  const loadHero = async () => {
    try {
      const data = await cmsService.fetchData('profiles');
      if (data && data[0]) {
        const fetched = data[0].avatarUrl;
        const validAvatar = (fetched && !fetched.includes('i.pinimg.com')) ? fetched : DEFAULT_AVATAR;
        setFormData({
          name: data[0].name || 'Mushahid Hussain',
          title: data[0].title || 'Web Developer',
          scriptSubhead: data[0].scriptSubhead || 'Web Developer & Engineer',
          badge: data[0].badge || 'CRAFTING SCALABLE & INTUITIVE WEB EXPERIENCES.',
          bioHero: data[0].bioHero || 'I build high-performance web applications...',
          avatarUrl: validAvatar,
          projectsCompleted: data[0].projectsCompleted || '30+',
          yearsOfExperience: data[0].yearsOfExperience || '8+',
          happyClients: data[0].happyClients || '99%',
        });
      }
    } catch (e) {
      console.warn('Load hero profile error', e);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await cmsService.fetchData('profiles');
      const existingId = data && data[0] ? data[0].id : '00000000-0000-0000-0000-000000000001';
      await cmsService.updateData('profiles', existingId, formData);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (e: any) {
      console.error('Hero save error:', e);
      alert('Failed to save Hero section to Supabase: ' + (e.message || String(e)));
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await cmsService.uploadFile('images', file);
      setFormData((prev) => ({ ...prev, avatarUrl: url }));
    } catch (err: any) {
      console.error('Upload error:', err);
      if (err.message?.includes('Bucket not found')) {
          alert('Error: "images" storage bucket nahi mila. Supabase Dashboard mein ja kar Storage mein "images" naam ka Public bucket banayein.');
      } else {
          alert('Failed to upload image. Please check your Supabase Storage settings.');
      }
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-2xs max-w-4xl">
      {successMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-[#0A3D22] text-[#50E364] flex items-center gap-2 font-bold text-sm">
          <CheckCircle className="w-5 h-5" />
          <span>Hero section updated and saved to Supabase!</span>
        </div>
      )}

      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <Globe className="w-6 h-6 text-[#50E364]" />
        <div>
          <h2 className="text-xl font-bold text-[#0A3D22]">Hero Section Settings</h2>
          <p className="text-xs text-gray-500">Edit the hero banner text, subhead, badge, and image.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-hidden focus:border-[#0A3D22]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Main Title / Role
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-hidden focus:border-[#0A3D22]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Script Subhead (Cursive text)
            </label>
            <input
              type="text"
              value={formData.scriptSubhead}
              onChange={(e) => setFormData({ ...formData, scriptSubhead: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-hidden focus:border-[#0A3D22]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Badge Text
            </label>
            <input
              type="text"
              value={formData.badge}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-hidden focus:border-[#0A3D22]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Projects Count
            </label>
            <input
              type="text"
              value={formData.projectsCompleted}
              onChange={(e) => setFormData({ ...formData, projectsCompleted: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-hidden focus:border-[#0A3D22]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Years Experience
            </label>
            <input
              type="text"
              value={formData.yearsOfExperience}
              onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-hidden focus:border-[#0A3D22]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Satisfaction %
            </label>
            <input
              type="text"
              value={formData.happyClients}
              onChange={(e) => setFormData({ ...formData, happyClients: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 focus:outline-hidden focus:border-[#0A3D22]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Hero Bio / Paragraph
          </label>
          <textarea
            rows={4}
            value={formData.bioHero}
            onChange={(e) => setFormData({ ...formData, bioHero: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-hidden focus:border-[#0A3D22]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            Profile Avatar Image
          </label>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-[#50E364] shrink-0 bg-gray-100 shadow-xs">
              <img
                src={formData.avatarUrl || DEFAULT_AVATAR}
                alt="Avatar preview"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_AVATAR;
                }}
                className="w-full h-full object-cover"
              />
            </div>
            <input
              type="text"
              placeholder="Image URL or upload file"
              value={formData.avatarUrl}
              onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-hidden focus:border-[#0A3D22]"
            />
            <label className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-colors">
              <Image className="w-4 h-4 text-emerald-700" />
              <span>Upload</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-[#0A3D22] hover:bg-[#114D2C] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Save className="w-4 h-4 text-[#50E364]" />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
          <button
            type="button"
            onClick={loadHero}
            className="px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </form>
    </div>
  );
};
