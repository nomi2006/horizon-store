import { supabase } from './supabase'

export const categoryService = {
  async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name')
    return { data, error }
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  },

  async adminGetAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    return { data, error }
  },

  async create(category) {
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single()
    return { data, error }
  },

  async update(id, category) {
    const { data, error } = await supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async delete(id) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
    return { error }
  }
}