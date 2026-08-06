import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingBag,
  DollarSign,
  Users,
  TrendingUp,
  Package,
  Eye,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { orderService } from '../../services/orderService'
import { productService } from '../../services/productService'
import { LoadingSpinner } from '../../components/LoadingSpinner'

export function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const [statsData, ordersData] = await Promise.all([
        orderService.getStats(),
        orderService.adminGetAll()
      ])
      setStats(statsData.data)
      setRecentOrders(ordersData.data?.slice(0, 5) || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  const statCards = [
    {
      label: 'Total Orders',
      value: stats?.total || 0,
      icon: ShoppingBag,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
    },
    {
      label: 'Revenue',
      value: `$${(stats?.revenue || 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
    },
    {
      label: 'Customers',
      value: stats?.customers || 0,
      icon: Users,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
    },
    {
      label: 'Pending Orders',
      value: stats?.pending || 0,
      icon: Package,
      color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
    }
  ]

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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Last updated: {new Date().toLocaleDateString()}
        </span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Orders
          </h2>
          <Link
            to="/admin/orders"
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            View All
            <Eye className="h-4 w-4" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No orders yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-dark-700">
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                    Order #
                  </th>
                  <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                    Customer
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
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}