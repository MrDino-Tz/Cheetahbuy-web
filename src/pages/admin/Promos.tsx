import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { Plus, Trash2, Edit2, Image as ImageIcon, ExternalLink, Loader2, Upload, X, Check } from 'lucide-react'

interface Promo {
  id: string
  title: string
  subtitle: string
  image_url: string
  action_url: string
  is_active: boolean
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
    action_url: '',
    is_active: true
  })
  const [submitting, setSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
        action_url: promo.action_url || '',
        is_active: promo.is_active ?? true
      })
      setPreviewUrl(promo.image_url)
    } else {
      setEditingPromo(null)
      setFormData({ title: '', subtitle: '', image_url: '', action_url: '', is_active: true })
      setPreviewUrl(null)
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview locally first
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to Supabase Storage
    setUploadingImage(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `promo_${Date.now()}.${fileExt}`
      const filePath = `promos/${fileName}`

      const { data, error } = await supabase.storage
        .from('promos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('promos')
        .getPublicUrl(filePath)

      setFormData({ ...formData, image_url: urlData.publicUrl })
    } catch (error: any) {
      console.error('Upload error:', error)
      alert('Failed to upload image: ' + error.message)
      setPreviewUrl(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    } finally {
      setUploadingImage(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData({ ...formData, image_url: '' })
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.image_url) {
      alert('Please upload an image for the promo')
      return
    }
    
    setSubmitting(true)
    
    try {
      const promoData = {
        title: formData.title,
        subtitle: formData.subtitle,
        image_url: formData.image_url,
        action_url: formData.action_url || null,
        is_active: formData.is_active
      }
      
      if (editingPromo) {
        const { error } = await supabase
          .from('promos')
          .update(promoData)
          .eq('id', editingPromo.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('promos')
          .insert([promoData])
        if (error) throw error
      }
      
      handleCloseModal()
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

  const handleToggleActive = async (promo: Promo) => {
    const { error } = await supabase
      .from('promos')
      .update({ is_active: !promo.is_active })
      .eq('id', promo.id)
    
    if (error) {
      alert(error.message)
    } else {
      fetchPromos()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-orange-500 size-8" />
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
            className={`group relative bg-white rounded-2xl border shadow-sm overflow-hidden dark:bg-zinc-900 dark:border-zinc-800 ${!promo.is_active ? 'opacity-60' : ''}`}
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 flex flex-col justify-end">
                <h3 className="text-lg font-bold text-white leading-tight">{promo.title}</h3>
                <p className="text-white/80 text-sm line-clamp-1">{promo.subtitle}</p>
              </div>
              {!promo.is_active && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-zinc-900/80 text-white text-xs rounded-full">
                  Inactive
                </div>
              )}
            </div>

            <div className="p-4 space-y-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ExternalLink className="size-3 shrink-0" />
                <span className="truncate max-w-[140px]">
                  {promo.action_url || 'No destination'}
                </span>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t dark:border-zinc-800">
                <button
                  onClick={() => handleToggleActive(promo)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                    promo.is_active 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${promo.is_active ? 'bg-green-500' : 'bg-zinc-400'}`} />
                  {promo.is_active ? 'Active' : 'Inactive'}
                </button>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenModal(promo)}
                    className="p-2 text-zinc-600 hover:bg-zinc-100 rounded-lg dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Edit2 className="size-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(promo.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
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
            <div className="p-6 border-b dark:border-zinc-800 flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                {editingPromo ? 'Edit Promo' : 'Add New Promo'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="size-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-zinc-900 dark:text-zinc-100">Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2.5 bg-zinc-50 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none dark:bg-zinc-800 dark:border-zinc-700"
                  placeholder="e.g. Summer Sale 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-zinc-900 dark:text-zinc-100">Subtitle *</label>
                <input
                  type="text"
                  required
                  value={formData.subtitle}
                  onChange={e => setFormData({...formData, subtitle: e.target.value})}
                  className="w-full px-4 py-2.5 bg-zinc-50 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none dark:bg-zinc-800 dark:border-zinc-700"
                  placeholder="e.g. Up to 50% off on all items"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-zinc-900 dark:text-zinc-100">Banner Image *</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                
                <div className="border-2 border-dashed rounded-xl p-4 text-center">
                  {previewUrl ? (
                    <div className="relative">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-h-40 mx-auto rounded-lg object-contain"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="size-4" />
                      </button>
                      {uploadingImage && (
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                          <Loader2 className="animate-spin text-white size-6" />
                        </div>
                      )}
                      {formData.image_url && previewUrl === formData.image_url && (
                        <div className="absolute -bottom-2 -right-2 p-1.5 bg-green-500 text-white rounded-full">
                          <Check className="size-3" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="flex flex-col items-center gap-2 text-zinc-500 hover:text-orange-500 transition-colors"
                    >
                      {uploadingImage ? (
                        <>
                          <Loader2 className="size-8 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="size-8" />
                          <span>Click to upload image</span>
                          <span className="text-xs text-zinc-400">PNG, JPG, WebP (max 5MB)</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-zinc-900 dark:text-zinc-100">Action URL (Optional)</label>
                <input
                  type="text"
                  value={formData.action_url}
                  onChange={e => setFormData({...formData, action_url: e.target.value})}
                  className="w-full px-4 py-2.5 bg-zinc-50 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none dark:bg-zinc-800 dark:border-zinc-700"
                  placeholder="Deep link or category ID"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, is_active: !formData.is_active})}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    formData.is_active ? 'bg-orange-500' : 'bg-zinc-300 dark:bg-zinc-600'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    formData.is_active ? 'left-7' : 'left-1'
                  }`} />
                </button>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {formData.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 border rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !formData.image_url}
                  className="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : editingPromo ? (
                    'Save Changes'
                  ) : (
                    'Create Promo'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
