import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, Heart, User, ShoppingBag, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import { orderService } from '../services/orderService'
import { LoadingSpinner } from '../components/LoadingSpinner'

export function DashboardPage() {
  const { user } = useAuth()
  const { count: wishlistCount } = useWishlist()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, spent: 0 })

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const { data } = await orderService.getUserOrders(user.id)
      setOrders(data || [])
      const delivered = data?.filter(o => o.status === 'delivered') || []
      setStats({
        total: data?.length || 0,
        spent: delivered.reduce((sum, o) => sum + o.total, 0)
      })
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const recentOrders = orders.slice(0, 3)

  const quickActions = [
    { icon: Package, label: 'My Orders', href: '/orders', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { icon: Heart, label: 'Wishlist', href: '/wishlist', color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
    { icon: User, label: 'Profile', href: '/profile', color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
    { icon: ShoppingBag, label: 'Shop', href: '/shop', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' }
  ]

  return (
    <div className="container-custom py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.user_metadata?.full_name || 'User'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your account
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.spent.toFixed(2)}</p>
        </div>
        <div className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Wishlist</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{wishlistCount} items</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            to={action.href}
            className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700 hover:shadow-lg transition-all"
          >
            <div className={`p-3 rounded-full ${action.color}`}>
              <action.icon className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {action.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Orders
          </h2>
          <Link
            to="/orders"
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : recentOrders.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No orders yet. Start shopping!
          </p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {order.order_number}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
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
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}