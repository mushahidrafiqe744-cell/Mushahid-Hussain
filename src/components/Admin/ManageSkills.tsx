import React, { useState, useEffect } from 'react';
import { cmsService } from '../../services/cms';
import { Plus, Trash2, Edit, Save, CheckCircle, Code } from 'lucide-react';

export const ManageSkills: React.FC = () => {
  const [skills, setSkills] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState({ name: '', percentage: 85, category: 'Frontend', icon: 'Code' });

  useEffect(() => { loadSkills(); }, []);

  const loadSkills = async () => {
    try {
      const data = await cmsService.fetchData('skills');
      setSkills(data || []);
    } catch (e) {
      console.warn('Failed to load skills', e);
    }
  };

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        await cmsService.updateData('skills', editingSkill.id, formData);
        showNotification('Skill updated successfully!');
      } else {
        await cmsService.insertData('skills', formData);
        showNotification('New skill added successfully!');
      }
      setIsFormOpen(false);
      setEditingSkill(null);
      setFormData({ name: '', percentage: 85, category: 'Frontend', icon: 'Code' });
      loadSkills();
    } catch (e) {
      showNotification('Failed to save skill');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    try {
      await cmsService.deleteData('skills', id);
      showNotification('Skill deleted successfully!');
      loadSkills();
    } catch (e) {
      showNotification('Failed to delete skill');
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-2xs max-w-4xl space-y-6">
      {successMsg && (
        <div className="p-4 rounded-2xl bg-[#0A3D22] text-[#50E364] flex items-center gap-2 font-bold text-sm">
          <CheckCircle className="w-5 h-5" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="flex justify-between items-center pb-4 border-b">
        <div>
          <h2 className="text-xl font-bold text-[#0A3D22]">Technical Skills</h2>
          <p className="text-xs text-gray-500">Add and manage your technical expertise and proficiency levels.</p>
        </div>
        <button 
          onClick={() => { setEditingSkill(null); setFormData({ name: '', percentage: 85, category: 'Frontend', icon: 'Code' }); setIsFormOpen(true); }} 
          className="bg-[#0A3D22] text-white px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer hover:bg-[#114D2C]"
        >
          <Plus size={18}/>
          <span>Add Skill</span>
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSave} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Skill Name</label>
              <input 
                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold" 
                placeholder="e.g. React / Node.js" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Category</label>
              <select 
                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Database">Database</option>
                <option value="DevOps">DevOps</option>
                <option value="Tools">Tools</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Proficiency Percentage ({formData.percentage}%)</label>
            <input 
              type="range" 
              min="10" 
              max="100" 
              className="w-full accent-[#0A3D22]" 
              value={formData.percentage} 
              onChange={e => setFormData({...formData, percentage: parseInt(e.target.value)})} 
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" className="bg-[#0A3D22] text-white px-6 py-2 rounded-xl font-bold text-xs uppercase flex items-center gap-2 cursor-pointer">
              <Save size={18} className="text-[#50E364]"/>
              <span>Save Skill</span>
            </button>
            <button type="button" onClick={() => setIsFormOpen(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold text-xs cursor-pointer">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {skills.map((skill: any) => (
          <div key={skill.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex justify-between items-center hover:border-[#50E364]/30 transition-all shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-50 rounded-lg">
                <Code className="w-4 h-4 text-[#0A3D22]" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">{skill.name}</h4>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#0A3D22] bg-[#EAF9EE] px-2 py-0.5 rounded-md uppercase tracking-tighter">{skill.category}</span>
                    <span className="text-[10px] font-semibold text-gray-400">{skill.percentage}%</span>
                </div>
              </div>
            </div>
            <div className="flex gap-1">
                <button onClick={() => { setEditingSkill(skill); setFormData({ name: skill.name, percentage: skill.percentage, category: skill.category || 'Frontend', icon: skill.icon || 'Code' }); setIsFormOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"><Edit size={16}/></button>
                <button onClick={() => handleDelete(skill.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>
      
      {skills.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-3xl">
              <p className="text-sm font-bold text-gray-400">No skills added yet.</p>
          </div>
      )}
    </div>
  );
};
