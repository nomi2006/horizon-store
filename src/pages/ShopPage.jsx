import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { productService } from '../services/productService'
import { categoryService } from '../services/categoryService'
import ProductCard from '../components/ProductCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { Filter, X, ChevronDown } from 'lucide-react'

export function ShopPage() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    sort: 'newest',
    minPrice: '',
    maxPrice: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' }
  ]

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [filters])

  const fetchCategories = async () => {
    const { data } = await categoryService.getAll()
    setCategories(data || [])
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data } = await productService.getAll(filters)
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const applyPriceFilter = () => {
    setFilters(prev => ({
      ...prev,
      minPrice: priceRange.min,
      maxPrice: priceRange.max
    }))
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      search: '',
      sort: 'newest',
      minPrice: '',
      maxPrice: ''
    })
    setPriceRange({ min: '', max: '' })
  }

  const hasActiveFilters = filters.category || filters.search || filters.minPrice || filters.maxPrice

  return (
    <div className="container-custom py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Shop</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
          >
            <Filter className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 h-2 w-2 rounded-full bg-primary-600"></span>
            )}
          </button>
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="select-field w-auto"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
          <div className="lg:sticky lg:top-24 space-y-6 w-full lg:w-64">
            <div className="flex items-center justify-between lg:hidden">
              <h2 className="font-semibold text-gray-900 dark:text-white">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search */}
            <div>
              <label className="label">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search products..."
                className="input-field"
              />
            </div>

            {/* Category */}
            <div>
              <label className="label">Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="select-field"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="label">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  placeholder="Min"
                  className="input-field"
                />
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  placeholder="Max"
                  className="input-field"
                />
              </div>
              <button
                onClick={applyPriceFilter}
                className="mt-2 w-full btn-primary text-sm py-2"
              >
                Apply Price
              </button>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            {loading ? 'Loading...' : `${products.length} products found`}
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No products found</p>
              <button
                onClick={clearFilters}
                className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}