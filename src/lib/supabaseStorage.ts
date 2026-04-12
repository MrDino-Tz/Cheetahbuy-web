import { supabase } from './supabase'

export async function uploadToSupabaseStorage(
  file: File,
  bucket: string = 'products',
  folder: string = ''
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const fileName = `${folder}/${Date.now()}-${file.name.replace(/\s+/g, '_')}`
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      })

    if (error) {
      console.error('Upload error:', error)
      return { success: false, error: error.message }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)

    return { success: true, url: urlData.publicUrl }
  } catch (err: any) {
    console.error('Upload exception:', err)
    return { success: false, error: err.message || 'Upload failed' }
  }
}

export function getSupabaseImageUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${path}`
}

export async function deleteFromSupabaseStorage(
  path: string,
  bucket: string = 'products'
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}