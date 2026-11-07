import React, { useState, useEffect } from 'react';
import { cmsService } from '../../services/cms';
import { Plus, Trash2, Edit, Save, Star, User, Image, CheckCircle, Globe } from 'lucide-react';

export const ManageTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    review: '',
    avatarUrl: '',
    rating: 5,
    date: 'Recent',
    platform: 'google',
    flag: '🇵🇰',
  });

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const data = await cmsService.fetchData('testimonials');
      setTestimonials(data || []);
    } catch (e) {
      console.warn('Load testimonials error', e);
    }
  };

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
      };
      if (editingItem) {
        await cmsService.updateData('testimonials', editingItem.id, payload);
        showNotification('Testimonial updated successfully!');
      } else {
        await cmsService.insertData('testimonials', payload);
        showNotification('New testimonial added successfully!');
      }
      setIsFormOpen(false);
      setEditingItem(null);
      setFormData({ name: '', role: '', company: '', review: '', avatarUrl: '', rating: 5, date: 'Recent', platform: 'google', flag: '🇵🇰' });
      loadTestimonials();
    } catch (e: any) {
      showNotification('Failed to save testimonial: ' + (e.message || 'Unknown error'));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await cmsService.uploadFile('images', file);
      setFormData((prev) => ({ ...prev, avatarUrl: url }));
    } catch (err: any) {
      if (err.message?.includes('Bucket not found')) {
        showNotification('Error: "images" bucket nahi mila. Storage mein banayein.');
      } else {
        showNotification('Failed to upload client image');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await cmsService.deleteData('testimonials', id);
      showNotification('Testimonial deleted successfully!');
      loadTestimonials();
    } catch (e) {
      showNotification('Failed to delete testimonial');
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-2xs max-w-4xl space-y-6">
      {successMsg && (
        <div className="p-4 rounded-2xl bg-[#0A3D22] text-[#50E364] flex items-center gap-2 font-bold text-sm shadow-md animate-fade-in">
          <CheckCircle className="w-5 h-5" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Star className="w-6 h-6 text-[#50E364]" />
          <div>
            <h2 className="text-xl font-bold text-[#0A3D22]">Manage Testimonials</h2>
            <p className="text-xs text-gray-500">Add, edit, or delete client reviews (Google-style).</p>
          </div>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setFormData({ name: '', role: '', company: '', review: '', avatarUrl: '', rating: 5, date: 'Recent', platform: 'google', flag: '🇵🇰' });
            setIsFormOpen(true);
          }}
          className="bg-[#0A3D22] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md hover:bg-[#114D2C]"
        >
          <Plus size={16} />
          <span>Add Testimonial</span>
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSave} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Client Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Role / Title
              </label>
              <input
                type="text"
                placeholder="e.g. CEO / Startup Founder"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Company
              </label>
              <input
                type="text"
                placeholder="e.g. TechCorp"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Platform
              </label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold"
              >
                <option value="google">Google Review</option>
                <option value="upwork">Upwork</option>
                <option value="fiverr">Fiverr</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Review Content
            </label>
            <textarea
              rows={3}
              required
              value={formData.review}
              onChange={(e) => setFormData({ ...formData, review: e.target.value })}
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
              placeholder="The actual review text..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Rating (1-5)
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Date Display
              </label>
              <input
                type="text"
                placeholder="e.g. 4 weeks ago"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Flag Emoji
              </label>
              <input
                type="text"
                value={formData.flag}
                onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Client Photo (URL or Upload)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="https://..."
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
              />
              <label className="p-2.5 bg-gray-200 hover:bg-gray-300 rounded-xl cursor-pointer flex items-center gap-1">
                <Image size={18} />
                <span className="text-[10px] font-bold">UPLOAD</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="bg-[#0A3D22] text-white px-6 py-2.5 rounded-xl text-xs font-bold uppercase flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Save size={18} className="text-[#50E364]" />
              <span>Save Testimonial</span>
            </button>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-bold text-xs cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {testimonials.map((t: any) => (
          <div
            key={t.id}
            className="p-4 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-between hover:border-[#50E364]/30 transition-all shadow-2xs"
          >
            <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#0A3D22] text-white flex items-center justify-center font-bold shrink-0 overflow-hidden">
                    {t.avatarUrl ? <img src={t.avatarUrl} className="w-full h-full object-cover"/> : (t.name ? t.name[0] : 'U')}
                </div>
                <div className="min-w-0">
                    <h4 className="font-bold text-sm text-gray-900 truncate">{t.name}</h4>
                    <p className="text-[10px] text-gray-500 line-clamp-1">{t.role} {t.company ? `at ${t.company}` : ''}</p>
                    <div className="flex text-[#FBBC05]">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 fill-current" />
                      ))}
                    </div>
                </div>
            </div>
            <div className="flex gap-1 ml-4 shrink-0">
                <button onClick={() => { setEditingItem(t); setFormData({ ...t }); setIsFormOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"><Edit size={16}/></button>
                <button onClick={() => handleDelete(t.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
