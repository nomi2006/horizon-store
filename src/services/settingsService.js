import { supabase } from './supabase'

export const settingsService = {
  async get(key) {
    const { data, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .single()
    return { data: data?.value, error }
  },

  async getMany(keys) {
    const { data, error } = await supabase
      .from('settings')
      .select('key, value')
      .in('key', keys)
    return { data, error }
  },

  async set(key, value) {
    const { error } = await supabase
      .from('settings')
      .upsert({ key, value }, { onConflict: 'key' })
    return { error }
  },

  async getAll() {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
    return { data, error }
  },

  async getStoreSettings() {
    const keys = [
      'store_name', 'store_email', 'store_phone', 'store_address',
      'shipping_rate', 'shipping_free_threshold', 'currency',
      'currency_symbol', 'timezone', 'date_format', 'time_format',
      'tax_rate', 'enable_coupons', 'enable_wishlist', 'enable_reviews'
    ]
    return this.getMany(keys)
  }
}