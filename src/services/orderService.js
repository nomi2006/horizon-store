import { supabase } from './supabase'
import { format } from 'date-fns'

export const orderService = {
  async getUserOrders(userId) {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async getOrderById(id) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .eq('id', id)
      .single()
    return { data, error }
  },

  async create(order) {
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single()
    return { data, error }
  },

  async createOrderItems(items) {
    const { data, error } = await supabase
      .from('order_items')
      .insert(items)
      .select()
    return { data, error }
  },

  async adminGetAll(filters = {}) {
    let query = supabase
      .from('orders')
      .select('*, order_items(count)')

    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    if (filters.search) {
      query = query.or(`order_number.ilike.%${filters.search}%, shipping_address->>name.ilike.%${filters.search}%`)
    }

    query = query.order('created_at', { ascending: false })

    const { data, error } = await query
    return { data, error }
  },

  async adminGetOrderById(id) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .eq('id', id)
      .single()
    return { data, error }
  },

  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async updatePaymentStatus(id, paymentStatus) {
    const { data, error } = await supabase
      .from('orders')
      .update({ payment_status: paymentStatus })
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async addNote(id, note) {
    const { data, error } = await supabase
      .from('orders')
      .update({ admin_notes: note })
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  async getStats() {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('status, total')

    if (error) return { error }

    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      revenue: orders
        .filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + o.total, 0)
    }

    return { data: stats, error: null }
  },

  async generateOrderNumber() {
    const { data } = await supabase
      .from('orders')
      .select('order_number')
      .order('created_at', { ascending: false })
      .limit(1)

    if (!data || data.length === 0) return 'ORD-000001'

    const last = data[0].order_number
    const num = parseInt(last.split('-')[1]) + 1
    return `ORD-${String(num).padStart(6, '0')}`
  }
}