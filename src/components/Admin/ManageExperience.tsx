import React, { useState, useEffect } from 'react';
import { cmsService } from '../../services/cms';
import { Plus, Trash2, Edit, Save, CheckCircle, Briefcase, Calendar, MapPin, List } from 'lucide-react';

export const ManageExperience: React.FC = () => {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState({
    role: '',
    company: '',
    period: '',
    location: '',
    badge: '',
    description: '',
    achievements: '',
    stack: '',
    displayOrder: 0
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const data = await cmsService.fetchData('experiences');
    setExperiences(data || []);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
        ...formData,
        achievements: formData.achievements.split('\n').filter(Boolean),
        stack: formData.stack.split(',').map(s => s.trim()).filter(Boolean)
    };

    if (editingItem) {
      await cmsService.updateData('experiences', editingItem.id, payload);
    } else {
      await cmsService.insertData('experiences', payload);
    }
    setSuccessMsg('Experience updated!');
    setIsFormOpen(false);
    setEditingItem(null);
    loadData();
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-2xs max-w-5xl space-y-6">
      {successMsg && <div className="p-4 bg-[#0A3D22] text-[#50E364] rounded-2xl font-bold flex items-center gap-2"><CheckCircle size={20}/>{successMsg}</div>}
      
      <div className="flex justify-between items-center pb-4 border-b">
        <div>
          <h2 className="text-xl font-bold text-[#0A3D22]">Manage Career Journey</h2>
          <p className="text-xs text-gray-500">Edit your professional experience timeline.</p>
        </div>
        <button onClick={() => { setEditingItem(null); setFormData({ role: '', company: '', period: '', location: '', badge: '', description: '', achievements: '', stack: '', displayOrder: experiences.length * 10 }); setIsFormOpen(true); }} className="bg-[#0A3D22] text-white px-4 py-2 rounded-xl font-bold text-xs uppercase flex items-center gap-2"><Plus size={18}/>Add Experience</button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSave} className="bg-gray-50 p-6 rounded-2xl border space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input className="w-full p-2.5 bg-white border rounded-xl text-sm" placeholder="Role (e.g. Full-Stack Developer)" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} required />
            <input className="w-full p-2.5 bg-white border rounded-xl text-sm" placeholder="Company" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required />
            <input className="w-full p-2.5 bg-white border rounded-xl text-sm" placeholder="Period (e.g. 2024 - Present)" value={formData.period} onChange={e => setFormData({...formData, period: e.target.value})} required />
            <input className="w-full p-2.5 bg-white border rounded-xl text-sm" placeholder="Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
          </div>
          <textarea className="w-full p-2.5 bg-white border rounded-xl text-sm" rows={2} placeholder="Brief Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          <textarea className="w-full p-2.5 bg-white border rounded-xl text-sm" rows={4} placeholder="Achievements (One per line)" value={formData.achievements} onChange={e => setFormData({...formData, achievements: e.target.value})} />
          <input className="w-full p-2.5 bg-white border rounded-xl text-sm" placeholder="Tech Stack (Comma separated)" value={formData.stack} onChange={e => setFormData({...formData, stack: e.target.value})} />
          <div className="flex gap-2">
            <button type="submit" className="bg-[#0A3D22] text-white px-6 py-2 rounded-xl font-bold text-xs uppercase flex items-center gap-2"><Save size={18} className="text-[#50E364]"/>Save</button>
            <button type="button" onClick={() => setIsFormOpen(false)} className="bg-gray-200 px-4 py-2 rounded-xl font-bold text-xs uppercase">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {experiences.map((exp, idx) => (
          <div key={exp.id || idx} className="bg-gray-50 border rounded-2xl p-4 flex justify-between items-center group">
            <div>
                <h4 className="font-bold text-gray-900">{exp.role} @ {exp.company}</h4>
                <p className="text-xs text-gray-500">{exp.period} · {exp.location}</p>
            </div>
            <div className="flex gap-2">
                <button onClick={() => { setEditingItem(exp); setFormData({ ...exp, achievements: Array.isArray(exp.achievements) ? exp.achievements.join('\n') : '', stack: Array.isArray(exp.stack) ? exp.stack.join(', ') : '' }); setIsFormOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl"><Edit size={18}/></button>
                <button onClick={async () => { if(confirm('Delete?')) { await cmsService.deleteData('experiences', exp.id); loadData(); } }} className="p-2 text-red-600 hover:bg-red-50 rounded-xl"><Trash2 size={18}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
