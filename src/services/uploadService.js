import { supabase } from './supabase'

export const uploadService = {
  async uploadImage(file) { 
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = fileName; 

    const { error } = await supabase.storage
      .from('products')
      .upload(filePath, file, { upsert: true }) 

    if (error) {
      console.log("Upload Error details:", error); 
      return { error };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath)

    return { url: publicUrl, error: null }
  },

  async uploadMultiple(files) { 
    const urls = []
    const errors = []

    for (const file of files) {
      const result = await this.uploadImage(file) 
      if (result.error) {
        errors.push(result.error)
      } else {
        urls.push(result.url)
      }
    }

    return { urls, errors }
  },

  async deleteImage(url) {
    const path = url.split('/').pop()
    const { error } = await supabase.storage
      .from('products')
      .remove([path])
    return { error }
  }
}