import { supabase } from './supabase'

export const couponService = {
  async getAll() {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  },

  async getByCode(code) {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single()
    return { data, error }
  },

  async validate(code, subtotal) {
    const { data, error } = await this.getByCode(code)
    if (error) return { valid: false, error: 'Invalid coupon code' }

    const now = new Date()
    if (data.valid_from && new Date(data.valid_from) > now) {
      return { valid: false, error: 'Coupon not yet active' }
    }
    if (data.valid_to && new Date(data.valid_to) < now) {
      return { valid: false, error: 'Coupon has expired' }
    }
    if (data.usage_limit && data.used_count >= data.usage_limit) {
      return { valid: false, error: 'Coupon usage limit reached' }
    }
    if (data.min_order_amount && subtotal < data.min_order_amount) {
      return { valid: false, error: `Minimum order of $${data.min_order_amount} required` }
    }

    let discount = 0
    if (data.type === 'percentage') {
      discount = (subtotal * data.value) / 100
      if (data.max_discount && discount > data.max_discount) {
        discount = data.max_discount
      }
    } else if (data.type === 'fixed') {
      discount = data.value
    } else if (data.type === 'free_shipping') {
      return { valid: true, data, discount: 0, isFreeShipping: true }
    }

    return { valid: true, data, discount, isFreeShipping: false }
  },

  async create(coupon) {
    coupon.code = coupon.code.toUpperCase()
    const { data, error } = await supabase
      .from('coupons')
      .insert([coupon])
      .select()
      .single()
    return { data, error }
  },

  async update(id, coupon) {
    if (coupon.code) coupon.code = coupon.code.toUpperCase()
    const { data, error } = await supabase
      .from('coupons')
      .update(coupon)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async delete(id) {
    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', id)
    return { error }
  },

  async incrementUsed(id) {
    const { data } = await this.getById(id)
    if (!data) return { error: 'Coupon not found' }

    const { error } = await supabase
      .from('coupons')
      .update({ used_count: (data.used_count || 0) + 1 })
      .eq('id', id)
    return { error }
  }
}