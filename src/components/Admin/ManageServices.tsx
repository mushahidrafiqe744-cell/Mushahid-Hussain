import React, { useState, useEffect } from 'react';
import { cmsService } from '../../services/cms';
import { Plus, Trash2, Edit, Save, CheckCircle, Package } from 'lucide-react';

export const ManageServices: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState({ title: '', description: '', icon: 'Code' });

  useEffect(() => { loadServices(); }, []);

  const loadServices = async () => {
    try {
      const data = await cmsService.fetchData('services');
      setServices(data || []);
    } catch (e) {
      console.warn('Failed to load services', e);
    }
  };

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await cmsService.updateData('services', editingItem.id, formData);
        showNotification('Service updated successfully!');
      } else {
        await cmsService.insertData('services', formData);
        showNotification('New service added successfully!');
      }
      setIsFormOpen(false);
      setEditingItem(null);
      setFormData({ title: '', description: '', icon: 'Code' });
      loadServices();
    } catch (e) {
      showNotification('Failed to save service');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await cmsService.deleteData('services', id);
      showNotification('Service deleted successfully!');
      loadServices();
    } catch (e) {
      showNotification('Failed to delete service');
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-2xs max-w-4xl space-y-6">
      {successMsg && (
        <div className="p-4 rounded-2xl bg-[#0A3D22] text-[#50E364] flex items-center gap-2 font-bold text-sm shadow-md animate-fade-in">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-[#50E364]" />
          <div>
            <h2 className="text-xl font-bold text-[#0A3D22]">Manage Services</h2>
            <p className="text-xs text-gray-500">Define the solutions and services you offer to clients.</p>
          </div>
        </div>
        <button 
          onClick={() => { setEditingItem(null); setFormData({ title: '', description: '', icon: 'Code' }); setIsFormOpen(true); }} 
          className="bg-[#0A3D22] text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md hover:bg-[#114D2C]"
        >
          <Plus size={18}/>
          <span>Add Service</span>
        </button>
      </div>

      {isFormOpen && (
        <form onSubmit={handleSave} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Service Title</label>
            <input 
              className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold" 
              placeholder="e.g. Full-Stack Web Development" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Description</label>
            <textarea 
              rows={3}
              className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm" 
              placeholder="Detailed description of the service..." 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              required 
            />
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" className="bg-[#0A3D22] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase flex items-center gap-2 cursor-pointer shadow-md">
              <Save size={18} className="text-[#50E364]"/>
              <span>Save Service</span>
            </button>
            <button type="button" onClick={() => setIsFormOpen(false)} className="bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl font-bold text-xs cursor-pointer">Cancel</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map((s: any) => (
          <div key={s.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex justify-between items-start hover:border-[#50E364]/30 transition-all shadow-2xs">
            <div className="min-w-0">
              <h4 className="font-bold text-sm text-gray-900 truncate">{s.title}</h4>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{s.description}</p>
            </div>
            <div className="flex gap-1 ml-4 shrink-0">
                <button onClick={() => { setEditingItem(s); setFormData({ title: s.title, description: s.description, icon: s.icon || 'Code' }); setIsFormOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"><Edit size={16}/></button>
                <button onClick={() => handleDelete(s.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-3xl">
              <p className="text-sm font-bold text-gray-400">No services added yet.</p>
          </div>
      )}
    </div>
  );
};
