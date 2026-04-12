import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, Trash2, Edit2, Image as ImageIcon, ExternalLink, Loader2 } from 'lucide-react'

interface Promo {
  id: string
  title: string
  subtitle: string
  image_url: string
  action_url: string
  created_at: string
}

export default function AdminPromos() {
  const [promos, setPromos] = useState<Promo[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    action_url: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchPromos()
  }, [])

  async function fetchPromos() {
    setLoading(true)
    const { data, error } = await supabase
      .from('promos')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching promos:', error)
    } else {
      setPromos(data || [])
    }
    setLoading(false)
  }

  const handleOpenModal = (promo?: Promo) => {
    if (promo) {
      setEditingPromo(promo)
      setFormData({
        title: promo.title,
        subtitle: promo.subtitle,
        image_url: promo.image_url,
        action_url: promo.action_url
      })
    } else {
      setEditingPromo(null)
      setFormData({ title: '', subtitle: '', image_url: '', action_url: '' })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      if (editingPromo) {
        const { error } = await supabase
          .from('promos')
          .update(formData)
          .eq('id', editingPromo.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('promos')
          .insert([formData])
        if (error) throw error
      }
      
      setIsModalOpen(false)
      fetchPromos()
    } catch (error: any) {
      alert(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this promo?')) return
    
    const { error } = await supabase
      .from('promos')
      .delete()
      .eq('id', id)
    
    if (error) {
      alert(error.message)
    } else {
      fetchPromos()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Promo Banners</h1>
          <p className="text-muted-foreground">Manage homepage scrolling banners for the mobile app.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="size-4" />
          Add New Promo
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {promos.map((promo) => (
          <div 
            key={promo.id} 
            className="group relative bg-white rounded-2xl border shadow-sm overflow-hidden dark:bg-zinc-900 dark:border-zinc-800"
          >
            <div className="aspect-[21/9] relative overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              {promo.image_url ? (
                <img 
                  src={promo.image_url} 
                  alt={promo.title} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-400">
                  <ImageIcon className="size-12" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 p-4 flex flex-col justify-end">
                <h3 className="text-xl font-bold text-white leading-tight">{promo.title}</h3>
                <p className="text-white/80 text-sm line-clamp-1">{promo.subtitle}</p>
              </div>
            </div>

            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ExternalLink className="size-3" />
                <span className="truncate max-w-[120px]">
                  {promo.action_url || 'No destination'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenModal(promo)}
                  className="p-2 text-zinc-600 hover:bg-zinc-100 rounded-lg dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  <Edit2 className="size-4" />
                </button>
                <button
                  onClick={() => handleDelete(promo.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {promos.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed rounded-2xl">
            <ImageIcon className="size-12 mx-auto mb-4 text-zinc-300" />
            <p className="text-zinc-500">No active promos. Add your first banner!</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl shadow-2xl animate-in zoom-in-95">
            <div className="p-6 border-b dark:border-zinc-800">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                {editingPromo ? 'Edit Promo' : 'Add New Promo'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-zinc-900 dark:text-zinc-100">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 bg-zinc-50 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none dark:bg-zinc-800 dark:border-zinc-700"
                  placeholder="e.g. Summer Sale 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-zinc-900 dark:text-zinc-100">Subtitle</label>
                <input
                  type="text"
                  required
                  value={formData.subtitle}
                  onChange={e => setFormData({...formData, subtitle: e.target.value})}
                  className="w-full px-4 py-2 bg-zinc-50 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none dark:bg-zinc-800 dark:border-zinc-700"
                  placeholder="e.g. Up to 50% off on all items"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-zinc-900 dark:text-zinc-100">Image URL</label>
                <input
                  type="text"
                  required
                  value={formData.image_url}
                  onChange={e => setFormData({...formData, image_url: e.target.value})}
                  className="w-full px-4 py-2 bg-zinc-50 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none dark:bg-zinc-800 dark:border-zinc-700"
                  placeholder="Cloudinary or Supabase URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-zinc-900 dark:text-zinc-100">Action URL (Optional)</label>
                <input
                  type="text"
                  value={formData.action_url}
                  onChange={e => setFormData({...formData, action_url: e.target.value})}
                  className="w-full px-4 py-2 bg-zinc-50 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none dark:bg-zinc-800 dark:border-zinc-700"
                  placeholder="Deep link or category ID"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-zinc-900 text-white rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50 dark:bg-white dark:text-zinc-900"
                >
                  {submitting ? 'Processing...' : editingPromo ? 'Save Changes' : 'Create Promo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
