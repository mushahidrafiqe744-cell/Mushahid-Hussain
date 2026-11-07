import React, { useState, useEffect } from 'react';
import { cmsService } from '../../services/cms';
import { Save, RotateCcw, CheckCircle, User, MapPin, Mail, Phone, Calendar } from 'lucide-react';

export const ManageAbout: React.FC = () => {
  const [formData, setFormData] = useState({
    bioAbout: 'I am a passionate Full-Stack Web Developer specializing in modern React ecosystems...',
    location: 'Pakistan',
    email: 'mushahidrafiqe744@gmail.com',
    phone: '03290725117',
    whatsapp: '03290725117',
    dob: '06th August 2016',
    github: 'https://github.com/mushahidhussain',
    linkedin: 'https://www.linkedin.com/in/mushahid-rafiqe-5b3259425/',
    tiktok: 'https://www.tiktok.com/@mushahidrafiqe699',
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    loadAbout();
  }, []);

  const loadAbout = async () => {
    try {
      const data = await cmsService.fetchData('profiles');
      if (data && data[0]) {
        setFormData({
          bioAbout: data[0].bioAbout || formData.bioAbout,
          location: data[0].location || formData.location,
          email: data[0].email || formData.email,
          phone: data[0].phone || formData.phone,
          whatsapp: data[0].whatsapp || formData.whatsapp,
          dob: data[0].dob || formData.dob,
          github: data[0].github || formData.github,
          linkedin: data[0].linkedin || formData.linkedin,
          tiktok: data[0].tiktok || formData.tiktok,
        });
      }
    } catch (e) {
      console.warn('Load about error', e);
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
      console.error('About save error:', e);
      alert('Failed to save About Me section to Supabase: ' + (e.message || String(e)));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-2xs max-w-4xl">
      {successMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-[#0A3D22] text-[#50E364] flex items-center gap-2 font-bold text-sm">
          <CheckCircle className="w-5 h-5" />
          <span>About Me details saved successfully!</span>
        </div>
      )}

      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <User className="w-6 h-6 text-[#50E364]" />
        <div>
          <h2 className="text-xl font-bold text-[#0A3D22]">About Me Settings</h2>
          <p className="text-xs text-gray-500">Edit bio description, contact coordinates, and social media links.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
            About Me Full Bio Paragraph
          </label>
          <textarea
            rows={5}
            value={formData.bioAbout}
            onChange={(e) => setFormData({ ...formData, bioAbout: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-hidden focus:border-[#0A3D22]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Location</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-emerald-600" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp / Phone</span>
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value, whatsapp: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              GitHub Profile Link
            </label>
            <input
              type="text"
              value={formData.github}
              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              LinkedIn Profile Link
            </label>
            <input
              type="text"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              TikTok / Social Link
            </label>
            <input
              type="text"
              value={formData.tiktok}
              onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900"
            />
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
            onClick={loadAbout}
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
