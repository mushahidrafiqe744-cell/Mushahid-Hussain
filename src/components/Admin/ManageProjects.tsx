import React, { useState, useEffect } from 'react';
import { cmsService } from '../../services/cms';
import { Plus, Trash2, Edit, Save, Image, Star, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react';

export const ManageProjects: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [projectToDelete, setProjectToDelete] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    categoryLabel: 'Web Application',
    technologies: '',
    imageUrl: '',
    liveUrl: '',
    githubUrl: '',
    featured: true,
    hidden: false,
    year: new Date().getFullYear().toString(),
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await cmsService.fetchData('projects');
      setProjects(data || []);
    } catch (e) {
      console.warn('Failed to load projects', e);
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
        technologies: formData.technologies
          ? formData.technologies.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
      };

      // Ensure we use the correct field names for the database
      // formData might have 'link' but database needs 'liveUrl'
      const dbPayload = {
        title: payload.title,
        description: payload.description,
        category: payload.category,
        categoryLabel: payload.categoryLabel,
        technologies: payload.technologies,
        imageUrl: payload.imageUrl,
        liveUrl: payload.liveUrl || (payload as any).link || '#',
        githubUrl: payload.githubUrl || '#',
        featured: payload.featured,
        hidden: payload.hidden,
        year: payload.year,
      };

      if (editingProject) {
        await cmsService.updateData('projects', editingProject.id, dbPayload);
        showNotification('Project updated successfully!');
      } else {
        await cmsService.insertData('projects', dbPayload);
        showNotification('New project added successfully!');
      }

      setIsFormOpen(false);
      setEditingProject(null);
      setFormData({
        title: '',
        description: '',
        category: '',
        categoryLabel: 'Web Application',
        technologies: '',
        imageUrl: '',
        liveUrl: '',
        githubUrl: '',
        featured: true,
        hidden: false,
        year: new Date().getFullYear().toString(),
      });
      loadProjects();
    } catch (e: any) {
      console.error('Save error:', e);
      if (e.message?.includes('category')) {
          showNotification('Error: "category" column nahi mila. Supabase projects table check karein.');
      } else {
          showNotification('Failed to save project: ' + (e.message || 'Unknown error'));
      }
    }
  };

  const handleToggleHighlight = async (proj: any) => {
    const updatedStatus = !proj.featured;
    await cmsService.updateData('projects', proj.id, { featured: updatedStatus });
    showNotification(updatedStatus ? 'Project highlighted as Featured!' : 'Project removed from Highlights.');
    loadProjects();
  };

  const handleToggleBlock = async (proj: any) => {
    const updatedStatus = !proj.hidden;
    await cmsService.updateData('projects', proj.id, { hidden: updatedStatus });
    showNotification(updatedStatus ? 'Project blocked / hidden from public site.' : 'Project unblocked and live on public site!');
    loadProjects();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await cmsService.uploadFile('images', file);
      setFormData((prev) => ({ ...prev, imageUrl: url }));
    } catch (err: any) {
      console.error('Upload error:', err);
      if (err.message?.includes('Bucket not found')) {
          showNotification('Error: "images" bucket nahi mila. Supabase Storage mein "images" bucket banayein.');
      } else {
          showNotification('Failed to upload project image');
      }
    }
  };

  // Perform permanent deletion
  const confirmDelete = async (id: string) => {
    try {
      // Optimistic update for immediate feedback
      setProjects((prev) => prev.filter((p) => String(p.id) !== String(id)));
      await cmsService.deleteData('projects', id);
      showNotification('Project deleted successfully!');
      setProjectToDelete(null);
      loadProjects();
    } catch (e) {
      showNotification('Failed to delete project');
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-2xs max-w-5xl space-y-6">
      {successMsg && (
        <div className="p-4 rounded-2xl bg-[#0A3D22] text-[#50E364] flex items-center gap-2 font-bold text-sm shadow-md animate-fade-in">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-[#0A3D22]">Manage Projects</h2>
          <p className="text-xs text-gray-500">Add, edit, delete, highlight, or block/hide projects on your public portfolio.</p>
        </div>
        <button
          onClick={() => {
            setEditingProject(null);
            setFormData({
              title: '',
              description: '',
              category: '',
              categoryLabel: 'Web Application',
              technologies: '',
              imageUrl: '',
              liveUrl: '',
              githubUrl: '',
              featured: true,
              hidden: false,
              year: new Date().getFullYear().toString(),
            });
            setIsFormOpen(true);
          }}
          className="bg-[#0A3D22] text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer hover:bg-[#114D2C] shadow-md"
        >
          <Plus size={18} />
          <span>Add New Project</span>
        </button>
      </div>

      {/* Form Modal / Inline Form */}
      {isFormOpen && (
        <form onSubmit={handleSave} className="bg-gray-50 p-6 sm:p-8 rounded-3xl border border-gray-200 space-y-4">
          <div className="flex items-center justify-between border-b pb-3 mb-2">
            <h3 className="font-bold text-sm text-[#0A3D22] uppercase tracking-wider">
              {editingProject ? 'Edit Project Details' : 'Add New Portfolio Project'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Project Title
              </label>
              <input
                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold"
                placeholder="e.g. BizTop Consulting Portal"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <input
                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold"
                placeholder="e.g. Full-Stack / E-Commerce / SaaS"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={3}
              className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm"
              placeholder="Full description of the project"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Technologies (Comma Separated)
              </label>
              <input
                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                placeholder="React, TypeScript, Node.js, Tailwind"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Live Demo Link
              </label>
              <input
                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                placeholder="https://live-site.com"
                value={formData.liveUrl}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                GitHub Repo Link
              </label>
              <input
                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                placeholder="https://github.com/..."
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Project Year
              </label>
              <input
                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                placeholder="2025"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Category Label
              </label>
              <input
                className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                placeholder="Web Application / Mobile App"
                value={formData.categoryLabel}
                onChange={(e) => setFormData({ ...formData, categoryLabel: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
              Project Image (URL or Upload File)
            </label>
            <div className="flex items-center gap-3">
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/assets/images/biztop_preview_1790852688158.jpg';
                  }}
                  className="w-12 h-12 rounded-xl object-cover border border-gray-200 shrink-0"
                />
              )}
              <input
                className="flex-1 p-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                placeholder="https://..."
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
              <label className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5 shrink-0">
                <Image size={16} />
                <span>Upload</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          {/* Visibility Options: Highlight + Block */}
          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-[#0A3D22] rounded accent-[#0A3D22]"
              />
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-[#C5A059]" /> Highlight as Featured Project
              </span>
            </label>

            <label className="inline-flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hidden}
                onChange={(e) => setFormData({ ...formData, hidden: e.target.checked })}
                className="w-4 h-4 text-red-600 rounded accent-red-600"
              />
              <span className="flex items-center gap-1 text-red-600">
                <EyeOff className="w-3.5 h-3.5" /> Block / Hide from Public Website
              </span>
            </label>
          </div>

          <div className="flex gap-2 pt-3 border-t border-gray-200">
            <button
              type="submit"
              className="bg-[#0A3D22] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer hover:bg-[#114D2C]"
            >
              <Save size={16} className="text-[#50E364]" />
              <span>Save Project</span>
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

      {/* Projects List with Quick Controls */}
      <div className="space-y-3">
        {projects.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-3xl p-6">
            <p className="text-sm font-bold text-gray-500">No projects in portfolio.</p>
            <p className="text-xs text-gray-400 mt-1">Click "Add New Project" above to create a project.</p>
          </div>
        ) : (
          projects.map((proj: any) => {
            const isFeatured = Boolean(proj.featured);
            const isHidden = Boolean(proj.hidden);

            return (
              <div
                key={proj.id}
                className={`bg-gray-50 border rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                  isHidden ? 'opacity-60 border-red-200 bg-red-50/20' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={
                      typeof proj.imageUrl === 'object' && proj.imageUrl?.src
                        ? proj.imageUrl.src
                        : typeof proj.image === 'object' && proj.image?.src
                        ? proj.image.src
                        : proj.imageUrl ||
                          proj.image ||
                          proj.image_url ||
                          '/assets/images/biztop_preview_1790852688158.jpg'
                    }
                    alt={proj.title}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/assets/images/biztop_preview_1790852688158.jpg';
                    }}
                    className="w-16 h-12 rounded-xl object-cover border border-gray-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-sm text-gray-900 truncate">{proj.title}</h4>
                      {isFeatured && (
                        <span className="px-2 py-0.5 rounded-md bg-[#50E364]/20 text-[#0A3D22] text-[10px] font-extrabold flex items-center gap-1">
                          <Star className="w-3 h-3 text-[#0A3D22] fill-[#0A3D22]" /> Highlighted
                        </span>
                      )}
                      {isHidden && (
                        <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-[10px] font-extrabold flex items-center gap-1">
                          <EyeOff className="w-3 h-3" /> Blocked / Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#0A3D22] font-semibold mt-0.5">{proj.category || 'Web Project'}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{proj.description}</p>
                  </div>
                </div>

                {/* Quick Action Controls: Highlight, Hide/Block, Edit, Delete */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {/* Highlight / Feature Button */}
                  <button
                    onClick={() => handleToggleHighlight(proj)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      isFeatured
                        ? 'bg-[#0A3D22] text-[#50E364] border-[#0A3D22]'
                        : 'bg-white text-gray-500 border-gray-200 hover:text-[#0A3D22]'
                    }`}
                    title={isFeatured ? 'Remove Highlight' : 'Highlight as Featured'}
                  >
                    <Star className="w-4 h-4" />
                  </button>

                  {/* Hide / Block Button */}
                  <button
                    onClick={() => handleToggleBlock(proj)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      isHidden
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-white text-gray-500 border-gray-200 hover:text-red-600'
                    }`}
                    title={isHidden ? 'Unblock / Show Project' : 'Block / Hide Project'}
                  >
                    {isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => {
                      setEditingProject(proj);
                      setFormData({
                        title: proj.title || '',
                        description: proj.description || '',
                        category: proj.category || '',
                        categoryLabel: proj.categoryLabel || 'Web Application',
                        technologies: Array.isArray(proj.technologies)
                          ? proj.technologies.join(', ')
                          : proj.technologies || '',
                        imageUrl: proj.imageUrl || proj.image_url || '',
                        liveUrl: proj.liveUrl || proj.link || '',
                        githubUrl: proj.githubUrl || '',
                        featured: proj.featured ?? true,
                        hidden: proj.hidden ?? false,
                        year: proj.year || new Date().getFullYear().toString(),
                      });
                      setIsFormOpen(true);
                    }}
                    className="p-2 text-blue-600 bg-white border border-gray-200 hover:bg-blue-50 rounded-xl cursor-pointer"
                    title="Edit Details"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {/* Delete Button - Triggers in-DOM modal confirmation */}
                  <button
                    onClick={() => setProjectToDelete(proj)}
                    className="p-2 text-red-600 bg-white border border-gray-200 hover:bg-red-50 hover:border-red-300 rounded-xl cursor-pointer transition-colors"
                    title="Permanently Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal (In-DOM, Never blocked by iframe sandboxes) */}
      {projectToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-red-100 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-bold text-lg text-gray-900">Delete Project?</h3>
              <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                Are you sure you want to delete <strong className="text-gray-900 font-semibold">"{projectToDelete.title}"</strong>? This will permanently remove it from your portfolio.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => confirmDelete(projectToDelete.id)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
