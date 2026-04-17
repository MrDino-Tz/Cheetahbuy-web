import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Save, Settings, MapPin, Phone, Store, CheckCircle } from 'lucide-react'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})
L.Marker.prototype.options.icon = defaultIcon

const DEFAULT_CENTER: [number, number] = [-6.7924, 39.2083]

export default function VendorSettings() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [vendorId, setVendorId] = useState<string | null>(null)
  const [shopData, setShopData] = useState({
    name: '',
    phone: '',
    address: '',
    description: '',
    shop_latitude: null as number | null,
    shop_longitude: null as number | null,
    shop_address: ''
  })

  useEffect(() => {
    loadVendorData()
  }, [])

  async function loadVendorData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: vendor } = await supabase
      .from('vendors')
      .select('*')
      .eq('owner_id', user.id)
      .single()
    
    if (vendor) {
      setVendorId(vendor.id)
      setShopData({
        name: vendor.name || '',
        phone: vendor.phone || '',
        address: vendor.address || '',
        description: vendor.description || '',
        shop_latitude: vendor.shop_latitude || null,
        shop_longitude: vendor.shop_longitude || null,
        shop_address: vendor.shop_address || ''
      })
    }
  }

  async function handleSave() {
    if (!vendorId) return
    
    setLoading(true)
    const { error } = await supabase
      .from('vendors')
      .update({
        name: shopData.name,
        phone: shopData.phone,
        address: shopData.address,
        description: shopData.description,
        shop_latitude: shopData.shop_latitude,
        shop_longitude: shopData.shop_longitude,
        shop_address: shopData.shop_address
      })
      .eq('id', vendorId)
    
    setLoading(false)
    if (!error) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } else {
      alert('Error saving: ' + error.message)
    }
  }

  function handleGetCurrentLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setShopData({
          ...shopData,
          shop_latitude: position.coords.latitude,
          shop_longitude: position.coords.longitude,
          shop_address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
        })
      },
      () => {
        alert('Unable to retrieve your location')
      }
    )
  }

  const mapPosition: [number, number] | null = shopData.shop_latitude && shopData.shop_longitude 
    ? [shopData.shop_latitude, shopData.shop_longitude] 
    : null

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-orange-500" /> Shop Settings
        </h1>
        <p className="text-zinc-500">Manage your shop details and delivery location.</p>
      </div>

      <div className="grid gap-6">
        
        {/* Shop Info */}
        <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-zinc-900 dark:text-white font-bold border-b pb-4 dark:border-zinc-800">
            <Store className="w-5 h-5 text-orange-500" /> Shop Information
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Shop Name</label>
              <input 
                type="text" 
                value={shopData.name}
                onChange={e => setShopData({...shopData, name: e.target.value})}
                placeholder="My Awesome Shop"
                className="w-full bg-zinc-50 dark:bg-zinc-800 border dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Phone Number</label>
              <input 
                type="tel" 
                value={shopData.phone}
                onChange={e => setShopData({...shopData, phone: e.target.value})}
                placeholder="+255 700 000 000"
                className="w-full bg-zinc-50 dark:bg-zinc-800 border dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium" 
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Shop Address</label>
              <input 
                type="text" 
                value={shopData.address}
                onChange={e => setShopData({...shopData, address: e.target.value})}
                placeholder="123 Main Street, Dar es Salaam"
                className="w-full bg-zinc-50 dark:bg-zinc-800 border dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium" 
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Shop Description</label>
              <textarea 
                value={shopData.description}
                onChange={e => setShopData({...shopData, description: e.target.value})}
                placeholder="Tell customers about your shop..."
                rows={3}
                className="w-full bg-zinc-50 dark:bg-zinc-800 border dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium resize-none" 
              />
            </div>
          </div>
        </section>

        {/* Shop Location for Map */}
        <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-2 mb-6 text-zinc-900 dark:text-white font-bold border-b pb-4 dark:border-zinc-800">
            <MapPin className="w-5 h-5 text-blue-500" /> Shop Location (For Map Display)
          </div>
          <p className="text-sm text-zinc-500 mb-6">
            Set your shop location so customers can see where to pick up orders and riders know where to deliver.
          </p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Latitude</label>
                <input 
                  type="number" 
                  step="any"
                  value={shopData.shop_latitude || ''}
                  onChange={e => setShopData({...shopData, shop_latitude: parseFloat(e.target.value) || null})}
                  placeholder="-6.7924"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Longitude</label>
                <input 
                  type="number" 
                  step="any"
                  value={shopData.shop_longitude || ''}
                  onChange={e => setShopData({...shopData, shop_longitude: parseFloat(e.target.value) || null})}
                  placeholder="39.2083"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium" 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Location Address / Description</label>
              <input 
                type="text" 
                value={shopData.shop_address}
                onChange={e => setShopData({...shopData, shop_address: e.target.value})}
                placeholder="Kariakoo Market, Dar es Salaam"
                className="w-full bg-zinc-50 dark:bg-zinc-800 border dark:border-zinc-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500 transition-all font-medium" 
              />
            </div>

            <button
              onClick={handleGetCurrentLocation}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              Use Current Location
            </button>

            {shopData.shop_latitude && shopData.shop_longitude && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Location Set</span>
                </div>
                <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                  {shopData.shop_latitude.toFixed(6)}, {shopData.shop_longitude.toFixed(6)}
                </p>
              </div>
            )}

            {/* Map Preview */}
            <div className="mt-4">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">Map Preview</label>
              <div className="h-[300px] rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
                <MapContainer
                  center={mapPosition || DEFAULT_CENTER}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {mapPosition && <Marker position={mapPosition} />}
                </MapContainer>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="flex items-center justify-end gap-4 pb-12">
        <button className="px-6 py-3 font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 transition-colors">Discard</button>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="bg-orange-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-600 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? (
             <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
          ) : success ? (
             <><CheckCircle className="w-5 h-5" /> Saved!</>
          ) : (
             <><Save className="w-5 h-5" /> Save Changes</>
          )}
        </button>
      </div>
    </div>
  )
}
