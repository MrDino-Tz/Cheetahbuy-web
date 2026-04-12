import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { uploadToCloudinary } from '../../lib/cloudinary'
import { Edit2, Trash2, X, Check } from 'lucide-react'

interface Category {
  id: number
  name: string
  slug: string
  image_url: string
  is_active: boolean
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', slug: '', image_url: '' })
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editData, setEditData] = useState({ name: '', slug: '', image_url: '' })

  useEffect(() => { loadCategories() }, [])

  async function loadCategories() {
    const { data } = await supabase.from('categories').select('*').order('name')
    setCategories(data || [])
    setLoading(false)
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, isEdit = false) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    
    // Supabase Upload
    const fileExt = file.name.split('.').pop();
    const fileName = `cat_${Math.random()}.${fileExt}`;
    const { data, error } = await supabase.storage.from('category-images').upload(fileName, file, { upsert: true });
    
    if (error) {
       alert(`Supabase Bucket Error.\n` + error.message);

    } else {
       const { data: { publicUrl } } = supabase.storage.from('category-images').getPublicUrl(fileName);
       if (isEdit) {
         setEditData({ ...editData, image_url: publicUrl });
       } else {
         setFormData({ ...formData, image_url: publicUrl });
       }
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.slug) formData.slug = formData.name.toLowerCase().replace(/\s+/g, '-')
    await supabase.from('categories').insert([formData])
    setFormData({ name: '', slug: '', image_url: '' })
    setShowForm(false)
    loadCategories()
  }

  async function toggleActive(id: number, isActive: boolean) {
    await supabase.from('categories').update({ is_active: !isActive }).eq('id', id)
    loadCategories()
  }

  async function deleteCategory(id: number) {
    if (confirm('Delete this category?')) { 
      await supabase.from('categories').delete().eq('id', id); 
      loadCategories() 
    }
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id)
    setEditData({ name: cat.name, slug: cat.slug, image_url: cat.image_url || '' })
  }

  function cancelEdit() {
    setEditingId(null)
    setEditData({ name: '', slug: '', image_url: '' })
  }

  async function saveEdit(id: number) {
    if (!editData.slug) editData.slug = editData.name.toLowerCase().replace(/\s+/g, '-')
    await supabase.from('categories').update(editData).eq('id', id)
    setEditingId(null)
    setEditData({ name: '', slug: '', image_url: '' })
    loadCategories()
  }

  if (loading) return <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
  </div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Categories</h1>
          <p className="text-muted-foreground">Manage product categories</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 transition-colors"
        >
          {showForm ? 'Cancel' : '+ Add Category'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border shadow-sm dark:bg-zinc-900 dark:border-zinc-800 space-y-4">
          <h2 className="text-lg font-semibold">Add New Category</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <input 
              placeholder="Category Name" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              className="p-3 border rounded-2xl dark:bg-zinc-800 dark:border-zinc-700"
              required 
            />
            <input 
              placeholder="Slug (optional)" 
              value={formData.slug} 
              onChange={e => setFormData({...formData, slug: e.target.value})} 
              className="p-3 border rounded-2xl dark:bg-zinc-800 dark:border-zinc-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Category Image</label>
            <div className="flex items-center gap-4">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                disabled={uploading}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-2xl file:border-0 file:bg-orange-100 file:text-orange-600 file:font-medium file:cursor-pointer dark:file:bg-zinc-800 dark:file:text-orange-400"
              />
              {formData.image_url && (
                <img src={formData.image_url} alt="preview" className="w-16 h-16 object-cover rounded-2xl" />
              )}
            </div>
          </div>
          <button type="submit" className="px-4 py-2 bg-orange-500 text-white rounded-2xl hover:bg-orange-600">
            Save Category
          </button>
        </form>
      )}

      <div className="bg-white rounded-3xl border shadow-sm dark:bg-zinc-900 dark:border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-zinc-50 dark:bg-zinc-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {categories.map(cat => (
              <tr key={cat.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                <td className="px-6 py-4">
                  {editingId === cat.id ? (
                    <div className="flex flex-col gap-2">
                       <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, true)} disabled={uploading} className="w-24 text-xs file:py-1 file:px-2 file:rounded file:border-0 file:bg-orange-100 file:text-orange-600" />
                       {editData.image_url && <img src={editData.image_url} className="w-12 h-12 object-cover rounded-2xl" />}
                    </div>
                  ) : cat.image_url ? (
                    <img src={cat.image_url} alt={cat.name} className="w-12 h-12 object-cover rounded-2xl" />
                  ) : (
                    <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400">
                      -
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingId === cat.id ? (
                    <input 
                      value={editData.name}
                      onChange={e => setEditData({...editData, name: e.target.value})}
                      className="p-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
                    />
                  ) : (
                    <span className="font-medium text-zinc-900 dark:text-white">{cat.name}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">
                  {editingId === cat.id ? (
                    <input 
                      value={editData.slug}
                      onChange={e => setEditData({...editData, slug: e.target.value})}
                      className="p-2 border rounded dark:bg-zinc-800 dark:border-zinc-700"
                    />
                  ) : (
                    cat.slug
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${cat.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                    {cat.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {editingId === cat.id ? (
                      <>
                        <button 
                          onClick={() => saveEdit(cat.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-2xl"
                        >
                          <Check className="size-4" />
                        </button>
                        <button 
                          onClick={cancelEdit}
                          className="p-2 text-zinc-400 hover:bg-zinc-100 rounded-2xl"
                        >
                          <X className="size-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => startEdit(cat)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-2xl"
                        >
                          <Edit2 className="size-4" />
                        </button>
                        <button 
                          onClick={() => toggleActive(cat.id, cat.is_active)}
                          className={`px-3 py-1 text-xs rounded-2xl ${cat.is_active ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                        >
                          {cat.is_active ? 'Disable' : 'Enable'}
                        </button>
                        <button 
                          onClick={() => deleteCategory(cat.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-2xl"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No categories yet. Add one to get started.
          </div>
        )}
      </div>
    </div>
  )
}