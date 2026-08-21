import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ChevronDown,
  Download,
  Upload,
  X
} from 'lucide-react'
import { productService } from '../../services/productService'
import { categoryService } from '../../services/categoryService'
import { LoadingSpinner } from '../../components/LoadingSpinner'
import toast from 'react-hot-toast'

export function ProductsPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [showBulkActions, setShowBulkActions] = useState(false)

  useEffect(() => {
    fetchData()
  }, [search, categoryFilter, statusFilter])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productService.adminGetAll({ search, category: categoryFilter, status: statusFilter }),
        categoryService.adminGetAll()
      ])
      setProducts(productsRes.data || [])
      setCategories(categoriesRes.data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      await productService.delete(id)
      toast.success('Product deleted successfully')
      fetchData()
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} products?`)) return
    try {
      await productService.bulkDelete(selectedIds)
      toast.success(`${selectedIds.length} products deleted`)
      setSelectedIds([])
      fetchData()
    } catch (error) {
      toast.error('Failed to delete products')
    }
  }

  const handleBulkStatus = async (status) => {
    try {
      await productService.bulkUpdateStatus(selectedIds, status)
      toast.success(`${selectedIds.length} products updated`)
      setSelectedIds([])
      fetchData()
    } catch (error) {
      toast.error('Failed to update products')
    }
  }

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(products.map(p => p.id))
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      {/* Header - responsive stack */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Products
        </h1>
        <Link to="/admin/products/new" className="btn-primary inline-flex items-center justify-center">
          <Plus className="h-5 w-5 mr-2" />
          Add Product
        </Link>
      </div>

      {/* Filters - responsive wrap */}
      <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 mb-6">
        <div className="flex-1 min-w-[200px] w-full sm:w-auto relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="input-field pl-10 w-full"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="select-field w-full sm:w-auto"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="select-field w-full sm:w-auto"
        >
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {/* Bulk Actions - responsive wrap */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 mb-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {selectedIds.length} selected
          </span>
          <button
            onClick={handleBulkDelete}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Delete
          </button>
          <button
            onClick={() => handleBulkStatus(true)}
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            Activate
          </button>
          <button
            onClick={() => handleBulkStatus(false)}
            className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
          >
            Deactivate
          </button>
          <button
            onClick={() => setSelectedIds([])}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium ml-auto"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Table - already responsive with overflow-x-auto */}
      <div className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800">
                <th className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === products.length && products.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                  Image
                </th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                  Product Name
                </th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                  Price
                </th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                  Stock
                </th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-400 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-600 dark:text-gray-400">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-100 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <img
                        src={product.images?.[0] || '/placeholder.jpg'}
                        alt={product.name}
                        className="h-12 w-12 rounded object-cover"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {product.categories?.name || 'Uncategorized'}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                        {product.stock_quantity > 0 ? product.stock_quantity : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`badge ${product.is_active ? 'badge-success' : 'badge-danger'}`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                        >
                          <Edit className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </Link>
                        <Link
                          to={`/product/${product.id}`}
                          target="_blank"
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
                        >
                          <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-200 dark:border-dark-700 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Showing {products.length} products</span>
        </div>
      </div>
    </div>
  )
}