import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Copy, X, Check } from 'lucide-react'
import { couponService } from '../../services/couponService'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import toast from 'react-hot-toast'

export function CouponsPage() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    description: '',
    min_order_amount: '',
    max_discount: '',
    usage_limit: '',
    valid_from: '',
    valid_to: '',
    is_active: true
  })
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(null)

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    setLoading(true)
    try {
      const { data } = await couponService.getAll()
      setCoupons(data || [])
    } catch (error) {
      console.error('Error fetching coupons:', error)
    } finally {
      setLoading(false)
    }
  }

  const openModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon)
      setFormData({
        code: coupon.code,
        type: coupon.type,
        value: coupon.value.toString(),
        description: coupon.description || '',
        min_order_amount: coupon.min_order_amount?.toString() || '',
        max_discount: coupon.max_discount?.toString() || '',
        usage_limit: coupon.usage_limit?.toString() || '',
        valid_from: coupon.valid_from ? coupon.valid_from.split('T')[0] : '',
        valid_to: coupon.valid_to ? coupon.valid_to.split('T')[0] : '',
        is_active: coupon.is_active
      })
    } else {
      setEditingCoupon(null)
      setFormData({
        code: '',
        type: 'percentage',
        value: '',
        description: '',
        min_order_amount: '',
        max_discount: '',
        usage_limit: '',
        valid_from: '',
        valid_to: '',
        is_active: true
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingCoupon(null)
    setFormData({
      code: '',
      type: 'percentage',
      value: '',
      description: '',
      min_order_amount: '',
      max_discount: '',
      usage_limit: '',
      valid_from: '',
      valid_to: '',
      is_active: true
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.code.trim() || !formData.value) {
      toast.error('Code and value are required')
      return
    }

    setSubmitting(true)
    try {
      const data = {
        ...formData,
        value: parseFloat(formData.value),
        min_order_amount: formData.min_order_amount ? parseFloat(formData.min_order_amount) : null,
        max_discount: formData.max_discount ? parseFloat(formData.max_discount) : null,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
        valid_from: formData.valid_from ? new Date(formData.valid_from).toISOString() : null,
        valid_to: formData.valid_to ? new Date(formData.valid_to).toISOString() : null
      }

      if (editingCoupon) {
        await couponService.update(editingCoupon.id, data)
        toast.success('Coupon updated successfully')
      } else {
        await couponService.create(data)
        toast.success('Coupon created successfully')
      }
      fetchCoupons()
      closeModal()
    } catch (error) {
      toast.error('Failed to save coupon')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return
    try {
      await couponService.delete(id)
      toast.success('Coupon deleted successfully')
      fetchCoupons()
    } catch (error) {
      toast.error('Failed to delete coupon')
    }
  }

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    setCopied(code)
    toast.success('Code copied!')
    setTimeout(() => setCopied(null), 2000)
  }

  const getTypeLabel = (type) => {
    const labels = {
      percentage: 'Percentage',
      fixed: 'Fixed Amount',
      free_shipping: 'Free Shipping'
    }
    return labels[type] || type
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Coupons
        </h1>
        <button onClick={() => openModal()} className="btn-primary">
          <Plus className="h-5 w-5 mr-2" />
          Add Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-600 dark:text-gray-400">
            No coupons found. Create your first coupon!
          </div>
        ) : (
          coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold font-mono text-gray-900 dark:text-white">
                      {coupon.code}
                    </span>
                    <button
                      onClick={() => copyCode(coupon.code)}
                      className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
                    >
                      {copied === coupon.code ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {coupon.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {coupon.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-sm">
                    <span className="font-semibold text-primary-600">
                      {coupon.type === 'percentage' && `${coupon.value}% off`}
                      {coupon.type === 'fixed' && `$${coupon.value.toFixed(2)} off`}
                      {coupon.type === 'free_shipping' && 'Free Shipping'}
                    </span>
                    <span className="badge badge-info">{getTypeLabel(coupon.type)}</span>
                    <span className={`badge ${coupon.is_active ? 'badge-success' : 'badge-danger'}`}>
                      {coupon.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                    {coupon.min_order_amount > 0 && (
                      <p>Min. Order: ${coupon.min_order_amount.toFixed(2)}</p>
                    )}
                    {coupon.usage_limit && (
                      <p>Used: {coupon.used_count || 0} / {coupon.usage_limit}</p>
                    )}
                    {coupon.valid_from && (
                      <p>Valid: {new Date(coupon.valid_from).toLocaleDateString()} - {coupon.valid_to ? new Date(coupon.valid_to).toLocaleDateString() : 'No expiry'}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openModal(coupon)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
                  >
                    <Edit className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(coupon.id)}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-900 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
              </h2>
              <button onClick={closeModal} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800">
                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="input-field font-mono"
                  placeholder="WELCOME10"
                />
              </div>

              <div>
                <label className="label">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="select-field"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                  <option value="free_shipping">Free Shipping</option>
                </select>
              </div>

              {formData.type !== 'free_shipping' && (
                <div>
                  <label className="label">Value *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="input-field"
                    placeholder={formData.type === 'percentage' ? '10' : '5.00'}
                  />
                </div>
              )}

              <div>
                <label className="label">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  placeholder="Brief description"
                />
              </div>

              <div>
                <label className="label">Min. Order Amount</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.min_order_amount}
                  onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
                  className="input-field"
                  placeholder="0.00"
                />
              </div>

              {formData.type === 'percentage' && (
                <div>
                  <label className="label">Max Discount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.max_discount}
                    onChange={(e) => setFormData({ ...formData, max_discount: e.target.value })}
                    className="input-field"
                    placeholder="50.00"
                  />
                </div>
              )}

              <div>
                <label className="label">Usage Limit</label>
                <input
                  type="number"
                  value={formData.usage_limit}
                  onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                  className="input-field"
                  placeholder="100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Valid From</label>
                  <input
                    type="date"
                    value={formData.valid_from}
                    onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">Valid To</label>
                  <input
                    type="date"
                    value={formData.valid_to}
                    onChange={(e) => setFormData({ ...formData, valid_to: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Active</span>
              </label>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 btn-primary"
                >
                  {submitting ? 'Saving...' : (editingCoupon ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}