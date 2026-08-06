import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, ChevronDown, ChevronUp } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { orderService } from '../services/orderService'
import { LoadingSpinner } from '../components/LoadingSpinner'

export function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [expandedId, setExpandedId] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const { data } = await orderService.getUserOrders(user.id)
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter)

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  if (loading) return <LoadingSpinner />

  return (
    <div className="container-custom py-8">
      <div className="flex items-center gap-3 mb-8">
        <Package className="h-8 w-8 text-primary-600" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Orders
        </h1>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === option.value
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 dark:text-dark-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700 overflow-hidden"
            >
              {/* Header */}
              <div
                className="flex flex-wrap items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {order.order_number}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${order.total.toFixed(2)}
                  </span>
                  <span className={`badge ${
                    order.status === 'delivered' ? 'badge-success' :
                    order.status === 'cancelled' ? 'badge-danger' :
                    order.status === 'pending' ? 'badge-warning' :
                    'badge-info'
                  }`}>
                    {order.status}
                  </span>
                  {expandedId === order.id ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === order.id && (
                <div className="border-t border-gray-200 dark:border-dark-700 p-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Items
                    </h4>
                    <div className="space-y-2">
                      {order.order_items?.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 text-sm">
                          <img
                            src={item.products?.images?.[0] || '/placeholder.jpg'}
                            alt={item.product_name}
                            className="h-12 w-12 rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-900 dark:text-white truncate">
                              {item.product_name}
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                              ${item.product_price.toFixed(2)} x {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            ${item.total.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-between gap-4 border-t border-gray-200 dark:border-dark-700 pt-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Shipping Address
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {order.shipping_address?.firstName} {order.shipping_address?.lastName}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.shipping_address?.address}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.zipCode}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Payment</p>
                      <p className={`text-sm font-medium ${
                        order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {order.payment_status === 'paid' ? '✓ Paid' : 'Pending'}
                      </p>
                      {order.tracking_number && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Tracking: {order.tracking_number}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}