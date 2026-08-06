import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Search, FileText } from 'lucide-react'
import { orderService } from '../../services/orderService'
import { LoadingSpinner } from '../../components/LoadingSpinner'

export function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ status: '', search: '' })

  useEffect(() => {
    fetchOrders()
  }, [filters])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const { data } = await orderService.adminGetAll(filters)
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const classes = {
      pending: 'badge-warning',
      processing: 'badge-info',
      shipped: 'badge-info',
      delivered: 'badge-success',
      cancelled: 'badge-danger'
    }
    return classes[status] || 'badge-info'
  }

  const statusOptions = [
    { value: '', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Orders
        </h1>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Total: {orders.length}
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search by order # or customer..."
            className="input-field pl-10"
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="select-field w-auto"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800">
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                  Order #
                </th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                  Customer
                </th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                  Items
                </th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                  Total
                </th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-600 dark:text-gray-400">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-100 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {order.order_number}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {order.shipping_address?.firstName} {order.shipping_address?.lastName}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {order.order_items?.length || 0}
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`badge ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors inline-block"
                      >
                        <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}