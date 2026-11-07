import React, { useState, useEffect } from 'react';
import { cmsService } from '../../services/cms';
import { Plus, Trash2, Edit, Save, CheckCircle, GraduationCap, Globe, Image as ImageIcon } from 'lucide-react';

export const ManageCourses: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    institution: '',
    institutionUrl: '',
    category: 'Development',
    period: '',
    description: '',
    skills: '',
    badgeImage: '',
    badgeUrl: '',
    credentialBadge: '',
    displayOrder: 0
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const data = await cmsService.fetchData('courses');
    setCourses(data || []);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
        ...formData,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
    };

    if (editingItem) {
      await cmsService.updateData('courses', editingItem.id, payload);
    } else {
      await cmsService.insertData('courses', payload);
    }
    setSuccessMsg('Course updated!');
    setIsFormOpen(false);
    setEditingItem(null);
    loadData();
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await cmsService.uploadFile('images', file);
      setFormData({ ...formData, badgeImage: url });
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-2xs max-w-5xl space-y-6">
      {successMsg && <div className="p-4 bg-[#0A3D22] text-[#50E364] rounded-2xl font-bold flex items-center gap-2"><CheckCircle size={20}/>{successMsg}</div>}
      
      <div className="flex justify-between items-center pb-4 border-b">
        <div>
          <h2 className="text-xl font-bold text-[#0A3D22]">Manage Courses</h2>
          <p className="text-xs text-gray-500">Add and edit your certifications and accreditations.</p>
        </div>
        <button onClick={() => { setEditingItem(null); setFormData({ title: '', institution: '', institutionUrl: '', category: 'Development', period: '', description: '', skills: '', badgeImage: '', badgeUrl: '', credentialBadge: '', displayOrder: courses.length * 10 }); setIsFormOpen(true); }} className="bg-[#0A3D22] text-white px-4 py-2 rounded-xl font-bold text-xs uppercase flex items-center gap-2"><Plus size={18}/>Add Course</button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSave} className="bg-gray-50 p-6 rounded-2xl border space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input className="w-full p-2.5 bg-white border rounded-xl text-sm" placeholder="Course Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            <input className="w-full p-2.5 bg-white border rounded-xl text-sm" placeholder="Institution" value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} required />
            <input className="w-full p-2.5 bg-white border rounded-xl text-sm" placeholder="Period (e.g. 2024)" value={formData.period} onChange={e => setFormData({...formData, period: e.target.value})} />
            <input className="w-full p-2.5 bg-white border rounded-xl text-sm" placeholder="Category" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input className="w-full p-2.5 bg-white border rounded-xl text-sm" placeholder="Institution URL" value={formData.institutionUrl} onChange={e => setFormData({...formData, institutionUrl: e.target.value})} />
            <input className="w-full p-2.5 bg-white border rounded-xl text-sm" placeholder="Verification Badge URL" value={formData.badgeUrl} onChange={e => setFormData({...formData, badgeUrl: e.target.value})} />
          </div>
          <textarea className="w-full p-2.5 bg-white border rounded-xl text-sm" rows={2} placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          <input className="w-full p-2.5 bg-white border rounded-xl text-sm" placeholder="Skills Covered (Comma separated)" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} />
          
          <div className="flex items-center gap-4">
             {formData.badgeImage && <img src={formData.badgeImage} className="w-12 h-12 rounded-full object-cover border"/>}
             <label className="flex-1 p-2.5 bg-white border rounded-xl text-sm cursor-pointer flex items-center justify-center gap-2 hover:bg-gray-100">
                <ImageIcon size={18}/>
                <span>{formData.badgeImage ? 'Change Badge Image' : 'Upload Badge Image'}</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
             </label>
          </div>

          <div className="flex gap-2">
            <button type="submit" className="bg-[#0A3D22] text-white px-6 py-2 rounded-xl font-bold text-xs uppercase flex items-center gap-2"><Save size={18} className="text-[#50E364]"/>Save</button>
            <button type="button" onClick={() => setIsFormOpen(false)} className="bg-gray-200 px-4 py-2 rounded-xl font-bold text-xs uppercase">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {courses.map(course => (
          <div key={course.id} className="bg-gray-50 border rounded-2xl p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#11261B] text-[#C5A059] flex items-center justify-center font-bold">
                    {course.badgeImage ? <img src={course.badgeImage} className="w-full h-full rounded-full object-cover"/> : <GraduationCap size={20}/>}
                </div>
                <div>
                    <h4 className="font-bold text-sm text-gray-900">{course.title}</h4>
                    <p className="text-[10px] text-gray-500">{course.institution} · {course.period}</p>
                </div>
            </div>
            <div className="flex gap-1">
                <button onClick={() => { setEditingItem(course); setFormData({ ...course, skills: Array.isArray(course.skills) ? course.skills.join(', ') : '' }); setIsFormOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl"><Edit size={16}/></button>
                <button onClick={async () => { if(confirm('Delete?')) { await cmsService.deleteData('courses', course.id); loadData(); } }} className="p-2 text-red-600 hover:bg-red-50 rounded-xl"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
