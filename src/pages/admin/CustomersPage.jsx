import React, { useState, useEffect } from 'react'
import { Search, Mail, Phone, MapPin, Eye } from 'lucide-react'
import { supabase } from '../../services/supabase'
import { orderService } from '../../services/orderService'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import { Link } from 'react-router-dom'

export function CustomersPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [customerOrders, setCustomerOrders] = useState([])
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchCustomers()
  }, [search])

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      let query = supabase.auth.admin.listUsers()

      // Note: In production, you'd want to use a more efficient approach
      // This is a simplified version using the admin API
      const { data, error } = await supabase
        .from('orders')
        .select('user_id')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Get unique user IDs
      const userIds = [...new Set(data.map(o => o.user_id).filter(Boolean))]

      // Fetch user details (simplified - in production use admin API)
      const users = await Promise.all(
        userIds.map(async (id) => {
          const { data: userData } = await supabase.auth.admin.getUserById(id)
          return userData?.user
        })
      )

      const filtered = users
        .filter(Boolean)
        .filter(u => {
          const name = u.user_metadata?.full_name || ''
          const email = u.email || ''
          const searchLower = search.toLowerCase()
          return name.toLowerCase().includes(searchLower) ||
                 email.toLowerCase().includes(searchLower)
        })

      setCustomers(filtered)
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const viewCustomerDetails = async (userId) => {
    setSelectedCustomer(customers.find(c => c.id === userId))
    try {
      const { data } = await orderService.getUserOrders(userId)
      setCustomerOrders(data || [])
      setShowModal(true)
    } catch (error) {
      console.error('Error fetching customer orders:', error)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Customers
        </h1>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Total: {customers.length}
        </span>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers..."
          className="input-field pl-10"
        />
      </div>

      <div className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700 overflow-hidden">
        {customers.length === 0 ? (
          <div className="py-12 text-center text-gray-600 dark:text-gray-400">
            No customers found
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-dark-700">
            {customers.map((customer) => (
              <div
                key={customer.id}
                className="flex flex-wrap items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                      {customer.user_metadata?.full_name?.[0]?.toUpperCase() || customer.email?.[0]?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {customer.user_metadata?.full_name || 'No Name'}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {customer.email}
                      </span>
                      {customer.user_metadata?.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {customer.user_metadata.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => viewCustomerDetails(customer.id)}
                  className="btn-secondary text-sm py-1.5 px-4"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Customer Details Modal */}
      {showModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Customer Details
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800"
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {selectedCustomer.user_metadata?.full_name?.[0]?.toUpperCase() || selectedCustomer.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedCustomer.user_metadata?.full_name || 'No Name'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedCustomer.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Member Since</p>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(selectedCustomer.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Total Orders</p>
                  <p className="text-gray-900 dark:text-white">{customerOrders.length}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Total Spent</p>
                  <p className="text-gray-900 dark:text-white">
                    ${customerOrders
                      .filter(o => o.status === 'delivered')
                      .reduce((sum, o) => sum + o.total, 0)
                      .toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-dark-700 pt-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  Order History
                </h4>
                {customerOrders.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400 text-sm">No orders yet</p>
                ) : (
                  <div className="space-y-2">
                    {customerOrders.slice(0, 5).map((order) => (
                      <Link
                        key={order.id}
                        to={`/admin/orders/${order.id}`}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors text-sm"
                      >
                        <span className="font-medium text-gray-900 dark:text-white">
                          {order.order_number}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          ${order.total.toFixed(2)}
                        </span>
                        <span className={`badge ${order.status === 'delivered' ? 'badge-success' : 'badge-info'}`}>
                          {order.status}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}