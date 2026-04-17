import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { uploadToSupabaseStorage } from '../../lib/supabaseStorage'
import { Edit2, Trash2, X, Check, Package, Plus, Upload } from 'lucide-react'

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock_quantity: number
  image_url: string
  is_available: boolean
  category_id: number
  categories?: { name: string }
}

interface Category {
  id: number
  name: string
}

export default function VendorProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', description: '', price: '', stock_quantity: '', image_url: '' })
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryId, setCategoryId] = useState('')
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState({ name: '', description: '', price: '', stock_quantity: '', image_url: '', is_available: true })
  const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({})

  useEffect(() => { 
    loadData() 
  }, [])

  async function loadCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, is_active')
      .order('name')
    
    if (error) {
      console.error('Categories load error:', error)
    } else {
      setCategories(data?.filter(c => c.is_active) || [])
    }
  }

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { 
      setLoading(false) 
      loadCategories()
      return 
    }
    
    const { data: vendor } = await supabase.from('vendors').select('id').eq('owner_id', user.id).single()
    
    const [productsResult, categoriesResult] = await Promise.all([
      vendor 
        ? supabase.from('products').select('*, categories(name)').eq('vendor_id', vendor.id).order('created_at', { ascending: false })
        : Promise.resolve({ data: [] }),
      supabase.from('categories').select('id, name, is_active').order('name')
    ])
    
    setProducts(productsResult.data || [])
    if (categoriesResult.data) {
      setCategories(categoriesResult.data.filter((c: any) => c.is_active))
    }
    setLoading(false)
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, isEdit = false) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    
    const result = await uploadToSupabaseStorage(file, 'products', 'uploads')
    
    if (result.success && result.url) {
      if (isEdit) {
        setEditData({ ...editData, image_url: result.url })
      } else {
        setFormData({ ...formData, image_url: result.url })
      }
    } else {
      console.error('Upload failed:', result.error)
      alert('Image upload failed: ' + (result.error || 'Unknown error. Please ensure the products bucket exists in Supabase Storage.'))
    }
    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('Please login first')
      return
    }
    
    const { data: vendor } = await supabase.from('vendors').select('id').eq('owner_id', user.id).single()
    if (!vendor) {
      alert('Vendor profile not found')
      return
    }
    
    const { error } = await supabase.from('products').insert({ 
      vendor_id: vendor.id, 
      category_id: categoryId ? parseInt(categoryId) : null, 
      name: formData.name, 
      description: formData.description || null, 
      price: parseFloat(formData.price), 
      stock_quantity: parseInt(formData.stock_quantity) || 0, 
      image_url: formData.image_url || null,
      is_available: true
    })
    
    if (error) {
      console.error('Insert error:', error)
      alert('Error saving product: ' + error.message)
      return
    }
    
    alert('Product saved successfully!')
    setFormData({ name: '', description: '', price: '', stock_quantity: '', image_url: '' })
    setCategoryId('')
    setShowForm(false)
    loadData()
  }

  async function toggleAvailability(id: string, isAvailable: boolean) {
    await supabase.from('products').update({ is_available: !isAvailable }).eq('id', id)
    loadData()
  }

  async function deleteProduct(id: string) {
    if (confirm('Delete this product?')) { 
      await supabase.from('products').delete().eq('id', id); 
      loadData() 
    }
  }

  function startEdit(product: Product) {
    setEditingId(product.id)
    setEditData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stock_quantity: product.stock_quantity.toString(),
      image_url: product.image_url || '',
      is_available: product.is_available
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setEditData({ name: '', description: '', price: '', stock_quantity: '', image_url: '', is_available: true })
  }

  async function saveEdit(id: string) {
    await supabase.from('products').update({
      name: editData.name,
      description: editData.description,
      price: parseFloat(editData.price),
      stock_quantity: parseInt(editData.stock_quantity) || 0,
      image_url: editData.image_url,
      is_available: editData.is_available
    }).eq('id', id)
    
    setEditingId(null)
    setEditData({ name: '', description: '', price: '', stock_quantity: '', image_url: '', is_available: true })
    loadData()
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">Product Catalog</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage and monitor your digital inventory.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto px-6 py-3 bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white rounded-2xl font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {showForm ? <X className="size-4" /> : <Plus className="size-4" />}
          {showForm ? 'Close Editor' : 'Create Product'}
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-[32px] border border-zinc-100 shadow-xl shadow-zinc-200/50 dark:bg-zinc-900 dark:border-zinc-800 space-y-6">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-orange-500/10 rounded-xl">
               <Package className="size-5 text-orange-600" />
             </div>
             <h2 className="text-xl font-black text-zinc-900 dark:text-white">Product Entry</h2>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block pl-1">Name / Identifier</label>
              <input 
                placeholder="e.g. Premium Samosas" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                className="w-full h-14 px-5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block pl-1">Taxonomy / Category</label>
              <select 
                value={categoryId} 
                onChange={e => setCategoryId(e.target.value)}
                className="w-full h-14 px-5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium appearance-none"
              >
                <option value="">Select Sector</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block pl-1">Feature Description</label>
            <textarea 
              placeholder="What makes this product special?" 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              className="w-full p-5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl h-32 outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium resize-none"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block pl-1">Unit Pricing (TZS)</label>
              <input 
                type="number" 
                step="0.01"
                placeholder="0.00" 
                value={formData.price} 
                onChange={e => setFormData({...formData, price: e.target.value})} 
                className="w-full h-14 px-5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all font-bold text-orange-600"
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block pl-1">Current Stock Count</label>
              <input 
                type="number" 
                placeholder="0" 
                value={formData.stock_quantity} 
                onChange={e => setFormData({...formData, stock_quantity: e.target.value})} 
                className="w-full h-14 px-5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block pl-1">Product Visual</label>
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-2xl">
              <div className="flex-1">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleImageUpload(e, false)} 
                  disabled={uploading}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-6 file:rounded-xl file:border-0 file:bg-zinc-900 dark:file:bg-white file:text-white dark:file:text-zinc-900 file:font-black file:uppercase file:text-[10px] file:tracking-widest cursor-pointer disabled:opacity-50"
                />
              </div>
              {formData.image_url && (
                <div className="relative size-24 rounded-2xl overflow-hidden border-2 border-orange-500/20">
                  <img src={formData.image_url} alt="preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <button type="submit" className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-500/20 hover:scale-[1.01] active:scale-95 transition-all">
            Commit to Catalog
          </button>
        </form>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="p-20 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border-2 border-dashed border-zinc-100 dark:border-zinc-800">
          <Package className="size-16 mx-auto mb-4 text-zinc-300 opacity-50" />
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Your catalog is empty</h2>
          <p className="text-zinc-500 mt-2 max-w-sm mx-auto">Start adding products to enable your digital storefront for CheetahBuy customers.</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-[32px] border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800 overflow-hidden group hover:shadow-2xl transition-all duration-500">
              {/* Product Image */}
              <div className="aspect-square bg-zinc-50 dark:bg-zinc-800 relative group-hover:scale-105 transition-transform duration-700">
                {product.image_url ? (
                  <>
                    {imageLoading[product.id] !== false && (
                      <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                    )}
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                      onLoad={() => setImageLoading(prev => ({ ...prev, [product.id]: false }))}
                    />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300">
                    <Package className="size-16" />
                  </div>
                )}
                
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                   <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md ${
                     product.is_available ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'
                   }`}>
                     {product.is_available ? 'In Stock' : 'Out of Stock'}
                   </div>
                   {product.categories && (
                     <div className="px-3 py-1 rounded-full bg-zinc-900/80 text-white text-[9px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md">
                        {product.categories.name}
                     </div>
                   )}
                </div>
              </div>

              {/* Product Details */}
              <div className="relative p-6 bg-white dark:bg-zinc-900 border-t border-zinc-50 dark:border-zinc-800">
                {editingId === product.id ? (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-zinc-400">Title</label>
                      <input 
                        value={editData.name}
                        onChange={e => setEditData({...editData, name: e.target.value})}
                        className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border rounded-xl font-bold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-zinc-400">Price</label>
                        <input 
                          type="number"
                          value={editData.price}
                          onChange={e => setEditData({...editData, price: e.target.value})}
                          className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border rounded-xl font-bold text-orange-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-zinc-400">Stock</label>
                        <input 
                          type="number"
                          value={editData.stock_quantity}
                          onChange={e => setEditData({...editData, stock_quantity: e.target.value})}
                          className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={() => saveEdit(product.id)}
                        className="flex-1 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-black uppercase text-[10px] tracking-widest"
                      >
                        Commit
                      </button>
                      <button 
                        onClick={cancelEdit}
                        className="px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-500 font-black uppercase text-[10px]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col mb-4">
                       <h3 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight leading-tight mb-1">{product.name}</h3>
                       <span className="text-2xl font-black text-orange-500">TSH {parseFloat(product.price.toString()).toLocaleString()}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-auto pt-6">
                      <button 
                        onClick={() => startEdit(product)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-100 transition-all"
                      >
                        <Edit2 className="size-3.5" /> Modify
                      </button>
                      <button 
                        onClick={() => toggleAvailability(product.id, product.is_available)}
                        className={`px-4 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all ${product.is_available ? 'bg-orange-500/10 text-orange-600' : 'bg-emerald-500/10 text-emerald-600'}`}
                      >
                        {product.is_available ? <X className="size-4" /> : <Check className="size-4" />}
                      </button>
                      <button 
                        onClick={() => deleteProduct(product.id)}
                        className="px-4 py-3 bg-red-500/10 text-red-600 rounded-2xl hover:bg-red-500 hover:text-white transition-all ml-auto"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}