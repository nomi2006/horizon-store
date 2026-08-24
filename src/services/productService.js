import { supabase } from './supabase'

export const productService = {
  async getAll(filters = {}) {
    let query = supabase
      .from('products')
      .select('*, categories(name, slug)')
      .eq('is_active', true)

    if (filters.category) {
      query = query.eq('category_id', filters.category)
    }

    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`)
    }

    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice)
    }

    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice)
    }

    if (filters.sort) {
      switch (filters.sort) {
        case 'price_asc': query = query.order('price', { ascending: true }); break
        case 'price_desc': query = query.order('price', { ascending: false }); break
        case 'rating': query = query.order('rating', { ascending: false }); break
        default: query = query.order('created_at', { ascending: false })
      }
    } else {
      query = query.order('created_at', { ascending: false })
    }

    const { data, error } = await query
    return { data, error }
  },

  async getById(identifier) {
    // First try the slug because ProductCard uses:
    // /product/${product.slug || product.id}

    const { data: slugData, error: slugError } = await supabase
      .from('products')
      .select('*, categories(*)')
      .eq('slug', identifier)
      .maybeSingle()

    if (slugData) {
      return {
        data: slugData,
        error: null,
      }
    }

    // If no slug matched, fall back to the product ID.
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(*)')
      .eq('id', identifier)
      .maybeSingle()

    return {
      data,
      error: error || slugError,
    }
  },

  async getFeatured() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(8)
    return { data, error }
  },

  async getBestSellers() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('rating', { ascending: false })
      .limit(6)
    return { data, error }
  },

  async getRelated(productId, categoryId) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .neq('id', productId)
      .limit(4)
    return { data, error }
  },

  // Admin functions
  async adminGetAll(filters = {}) {
    let query = supabase.from('products').select('*, categories(name, slug)')

    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`)
    }

    if (filters.category) {
      query = query.eq('category_id', filters.category)
    }

    // ✅ FIXED: Only apply status filter if it is strictly true or false
    if (filters.status === true || filters.status === false) {
      query = query.eq('is_active', filters.status)
    }

    query = query.order('created_at', { ascending: false })

    const { data, error } = await query
    return { data, error }
  },

  async create(product) {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single()
    return { data, error }
  },

  async update(id, product) {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async delete(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    return { error }
  },

  async bulkDelete(ids) {
    const { error } = await supabase
      .from('products')
      .delete()
      .in('id', ids)
    return { error }
  },

  async bulkUpdateStatus(ids, status) {
    const { error } = await supabase
      .from('products')
      .update({ is_active: status })
      .in('id', ids)
    return { error }
  }
}