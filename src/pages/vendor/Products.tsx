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
    if (result.success) {
      if (isEdit) {
        setEditData({ ...editData, image_url: result.url })
      } else {
        setFormData({ ...formData, image_url: result.url })
      }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white rounded-2xl font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
        >
          {showForm ? <X className="size-4" /> : <Plus className="size-4" />}
          {showForm ? 'Cancel' : 'New Product'}
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm dark:bg-zinc-900 dark:border-zinc-800 space-y-4">
          <h2 className="text-lg font-semibold">Add New Product</h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">Product Name *</label>
              <input 
                placeholder="Enter product name" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                className="w-full p-3 bg-zinc-50 border border-zinc-100 rounded-2xl dark:bg-zinc-800 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-orange-500"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-600 mb-1">Category</label>
              <select 
                value={categoryId} 
                onChange={e => setCategoryId(e.target.value)}
                className="w-full p-3 bg-zinc-50 border border-zinc-100 rounded-2xl dark:bg-zinc-800 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-orange-500 px-4"
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
              placeholder="Product description" 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              className="w-full p-3 bg-zinc-50 border border-zinc-100 rounded-2xl dark:bg-zinc-800 dark:border-zinc-700 h-24 outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">Price *</label>
              <input 
                type="number" 
                step="0.01"
                placeholder="0.00" 
                value={formData.price} 
                onChange={e => setFormData({...formData, price: e.target.value})} 
                className="w-full p-3 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock Quantity</label>
              <input 
                type="number" 
                placeholder="0" 
                value={formData.stock_quantity} 
                onChange={e => setFormData({...formData, stock_quantity: e.target.value})} 
                className="w-full p-3 border rounded-lg dark:bg-zinc-800 dark:border-zinc-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Product Image</label>
            <div className="flex items-center gap-4">
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => handleImageUpload(e, false)} 
                disabled={uploading}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-100 file:text-orange-600 file:font-medium file:cursor-pointer dark:file:bg-zinc-800 dark:file:text-orange-400"
              />
              {formData.image_url && (
                <img src={formData.image_url} alt="preview" className="w-20 h-20 object-cover rounded-lg border" />
              )}
            </div>
          </div>

          <button type="submit" className="px-8 py-3 bg-orange-500 text-white rounded-2xl font-black shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all">
            Save Product to Catalog
          </button>
        </form>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Package className="size-12 mx-auto mb-4 opacity-50" />
          <p>No products yet. Add your first product to get started!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-[32px] border border-zinc-100 shadow-sm dark:bg-zinc-900 dark:border-zinc-800 overflow-hidden group hover:shadow-xl transition-all">
              {/* Product Image */}
              <div className="aspect-square bg-zinc-100 dark:bg-zinc-800 relative">
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
                      onError={() => setImageLoading(prev => ({ ...prev, [product.id]: false }))}
                    />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    <Package className="size-12" />
                  </div>
                )}
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                  product.is_available ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {product.is_available ? 'Available' : 'Unavailable'}
                </div>
              </div>

              {/* Product Details */}
              <div className="p-4">
                {editingId === product.id ? (
                  <div className="space-y-3">
                    <input 
                      value={editData.name}
                      onChange={e => setEditData({...editData, name: e.target.value})}
                      className="w-full p-2 border rounded dark:bg-zinc-800"
                      placeholder="Name"
                    />
                    <textarea 
                      value={editData.description}
                      onChange={e => setEditData({...editData, description: e.target.value})}
                      className="w-full p-2 border rounded dark:bg-zinc-800 text-sm h-16"
                      placeholder="Description"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="number"
                        step="0.01"
                        value={editData.price}
                        onChange={e => setEditData({...editData, price: e.target.value})}
                        className="p-2 border rounded dark:bg-zinc-800"
                        placeholder="Price"
                      />
                      <input 
                        type="number"
                        value={editData.stock_quantity}
                        onChange={e => setEditData({...editData, stock_quantity: e.target.value})}
                        className="p-2 border rounded dark:bg-zinc-800"
                        placeholder="Stock"
                      />
                    </div>
                    <div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => handleImageUpload(e, true)}
                        className="w-full text-sm"
                      />
                      {editData.image_url && (
                        <div className="mt-2 relative inline-block">
                          {imageLoading[`edit-${editingId}`] !== false && (
                            <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-700 rounded animate-pulse" />
                          )}
                          <img src={editData.image_url} alt="preview" className="w-16 h-16 object-cover rounded" />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox"
                        checked={editData.is_available}
                        onChange={e => setEditData({...editData, is_available: e.target.checked})}
                        id={`available-${product.id}`}
                      />
                      <label htmlFor={`available-${product.id}`} className="text-sm">Available for sale</label>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => saveEdit(product.id)}
                        className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-1"
                      >
                        <Check className="size-4" /> Save
                      </button>
                      <button 
                        onClick={cancelEdit}
                        className="px-3 py-2 border rounded-lg hover:bg-zinc-50 flex items-center gap-1"
                      >
                        <X className="size-4" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col mb-2">
                       <h3 className="font-bold text-zinc-900 dark:text-white line-clamp-1">{product.name}</h3>
                       <span className="text-xl font-black text-orange-500">TSH {parseFloat(product.price.toString()).toLocaleString()}</span>
                    </div>
                    {product.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Stock: <span className="font-medium text-zinc-900 dark:text-white">{product.stock_quantity}</span>
                      </span>
                      {product.categories && (
                        <span className="text-muted-foreground">{product.categories.name}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                      <button 
                        onClick={() => startEdit(product)}
                        className="flex-1 px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center justify-center gap-1"
                      >
                        <Edit2 className="size-4" /> Edit
                      </button>
                      <button 
                        onClick={() => toggleAvailability(product.id, product.is_available)}
                        className={`px-3 py-2 rounded-lg flex items-center gap-1 ${product.is_available ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                      >
                        {product.is_available ? 'Disable' : 'Enable'}
                      </button>
                      <button 
                        onClick={() => deleteProduct(product.id)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
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