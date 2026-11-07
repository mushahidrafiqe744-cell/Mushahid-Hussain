import React, { useState, useEffect } from 'react';
import { cmsService } from '../../services/cms';
import { Plus, Trash2, Edit, Save, CheckCircle, Lightbulb, Zap } from 'lucide-react';

export const ManageWhyUs: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState({
    type: 'pillar', // 'pillar' or 'workflow'
    title: '',
    subtitle: '',
    description: '',
    icon: 'Lightbulb',
    stepNumber: 1,
    displayOrder: 0
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const data = await cmsService.fetchData('why_us');
    setItems(data || []);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await cmsService.updateData('why_us', editingItem.id, formData);
      } else {
        await cmsService.insertData('why_us', formData);
      }
      setSuccessMsg('Value Proposition updated!');
      setIsFormOpen(false);
      setEditingItem(null);
      loadData();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error('Save error:', err);
      if (err.code === 'PGRST205' || err.message?.includes('why_us')) {
        setSuccessMsg('Error: "why_us" table nahi mili. SQL setup script run karein.');
      } else {
        setSuccessMsg('Failed to save data. Table check karein.');
      }
      setTimeout(() => setSuccessMsg(''), 5000);
    }
  };

  const pillars = items.filter(i => i.type === 'pillar');
  const workflow = items.filter(i => i.type === 'workflow');

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-2xs max-w-5xl space-y-8">
      {successMsg && <div className="p-4 bg-[#0A3D22] text-[#50E364] rounded-2xl font-bold flex items-center gap-2 animate-fade-in"><CheckCircle size={20}/>{successMsg}</div>}
      
      <div className="flex justify-between items-center pb-4 border-b">
        <div>
          <h2 className="text-xl font-bold text-[#0A3D22]">Value Proposition & Workflow</h2>
          <p className="text-xs text-gray-500">Edit the 'Why Choose Me' section pillars and development process steps.</p>
        </div>
        <button onClick={() => { setEditingItem(null); setFormData({ type: 'pillar', title: '', subtitle: '', description: '', icon: 'Lightbulb', stepNumber: workflow.length + 1, displayOrder: items.length * 10 }); setIsFormOpen(true); }} className="bg-[#0A3D22] text-white px-4 py-2 rounded-xl font-bold text-xs uppercase flex items-center gap-2"><Plus size={18}/>Add New</button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSave} className="bg-gray-50 p-6 rounded-2xl border space-y-4">
          <div className="flex gap-4 mb-2">
            <button type="button" onClick={() => setFormData({...formData, type: 'pillar'})} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${formData.type === 'pillar' ? 'bg-[#11261B] text-white' : 'bg-white border'}`}>Pillar</button>
            <button type="button" onClick={() => setFormData({...formData, type: 'workflow'})} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${formData.type === 'workflow' ? 'bg-[#11261B] text-white' : 'bg-white border'}`}>Workflow Step</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input className="w-full p-2.5 bg-white border rounded-xl text-sm" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
            {formData.type === 'pillar' ? (
                <input className="w-full p-2.5 bg-white border rounded-xl text-sm" placeholder="Subtitle" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} />
            ) : (
                <input type="number" className="w-full p-2.5 bg-white border rounded-xl text-sm" placeholder="Step Number" value={formData.stepNumber} onChange={e => setFormData({...formData, stepNumber: parseInt(e.target.value)})} />
            )}
          </div>
          <textarea className="w-full p-2.5 bg-white border rounded-xl text-sm" rows={2} placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
          <div className="flex gap-2">
            <button type="submit" className="bg-[#0A3D22] text-white px-6 py-2 rounded-xl font-bold text-xs uppercase flex items-center gap-2"><Save size={18} className="text-[#50E364]"/>Save</button>
            <button type="button" onClick={() => setIsFormOpen(false)} className="bg-gray-200 px-4 py-2 rounded-xl font-bold text-xs uppercase">Cancel</button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        <div>
            <h3 className="text-sm font-bold text-[#0A3D22] uppercase tracking-wider mb-3 flex items-center gap-2"><Lightbulb size={16}/> Core Pillars</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pillars.map(p => (
                    <div key={p.id} className="p-4 bg-gray-50 border rounded-2xl flex justify-between items-center">
                        <div className="min-w-0">
                            <h4 className="font-bold text-sm truncate">{p.title}</h4>
                            <p className="text-[10px] text-gray-500 truncate">{p.subtitle}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                            <button onClick={() => { setEditingItem(p); setFormData(p); setIsFormOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16}/></button>
                            <button onClick={async () => { if(confirm('Delete?')) { await cmsService.deleteData('why_us', p.id); loadData(); } }} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div>
            <h3 className="text-sm font-bold text-[#0A3D22] uppercase tracking-wider mb-3 flex items-center gap-2"><Zap size={16}/> Engineering Workflow</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {workflow.map(w => (
                    <div key={w.id} className="p-4 bg-gray-50 border rounded-2xl flex justify-between items-center">
                        <div className="min-w-0 flex items-center gap-3">
                            <span className="w-7 h-7 rounded-full bg-[#11261B] text-[#DFC285] flex items-center justify-center font-bold text-xs shrink-0">{w.stepNumber}</span>
                            <h4 className="font-bold text-sm truncate">{w.title}</h4>
                        </div>
                        <div className="flex gap-1 shrink-0">
                            <button onClick={() => { setEditingItem(w); setFormData(w); setIsFormOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16}/></button>
                            <button onClick={async () => { if(confirm('Delete?')) { await cmsService.deleteData('why_us', w.id); loadData(); } }} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
