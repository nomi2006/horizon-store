import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Filter,
  X,
  ChevronDown,
  Search,
  SlidersHorizontal,
  RotateCcw,
} from 'lucide-react'

import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
import ProductCard from '../components/ProductCard'
import { LoadingSpinner } from '../components/LoadingSpinner'

import { productService } from '../services/productService'
import { categoryService } from '../services/categoryService'

export function ShopPage() {
  const [searchParams] = useSearchParams()

  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    sort: 'newest',
    minPrice: '',
    maxPrice: '',
  })

  const [priceRange, setPriceRange] = useState({
    min: '',
    max: '',
  })

  const sortOptions = [
    {
      value: 'newest',
      label: 'Newest First',
    },
    {
      value: 'price_asc',
      label: 'Price: Low to High',
    },
    {
      value: 'price_desc',
      label: 'Price: High to Low',
    },
    {
      value: 'rating',
      label: 'Highest Rated',
    },
  ]

  /*
   * Fetch categories once.
   */
  useEffect(() => {
    fetchCategories()
  }, [])

  /*
   * Fetch products whenever a filter changes.
   */
  useEffect(() => {
    fetchProducts()
  }, [filters])

  const fetchCategories = async () => {
    try {
      const { data } = await categoryService.getAll()
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([])
    }
  }

  const fetchProducts = async () => {
    setLoading(true)

    try {
      const { data } = await productService.getAll(filters)
      setProducts(data || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const applyPriceFilter = () => {
    setFilters((prev) => ({
      ...prev,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
    }))

    setShowFilters(false)
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      search: '',
      sort: 'newest',
      minPrice: '',
      maxPrice: '',
    })

    setPriceRange({
      min: '',
      max: '',
    })
  }

  const removeFilter = (key) => {
    setFilters((prev) => ({
      ...prev,
      [key]: '',
    }))

    if (key === 'minPrice' || key === 'maxPrice') {
      setPriceRange({
        min: '',
        max: '',
      })
    }
  }

  const selectedCategory = useMemo(() => {
    return categories.find(
      (category) => category.id === filters.category
    )
  }, [categories, filters.category])

  const hasActiveFilters =
    Boolean(filters.category) ||
    Boolean(filters.search) ||
    Boolean(filters.minPrice) ||
    Boolean(filters.maxPrice)

  const activeFilterCount = [
    filters.category,
    filters.search,
    filters.minPrice,
    filters.maxPrice,
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-dark-950 dark:text-white">

      <TopBar />
      <Navbar />
{/* shop header */}
      <main>
        {/* <section className="border-b border-gray-100 bg-gray-50/70 dark:border-dark-800 dark:bg-dark-900">
          <div className="container-custom">
            <div className="flex flex-col gap-5 py-8 sm:py-10">
              Breadcrumb
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Home</span>
                <span>/</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  Shop
                </span>
              </div>

              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-red-600">
                    Our Collection
                  </p>

                  <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Shop
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-400 sm:text-base">
                    Discover our latest products, best sellers, and everyday
                    essentials.
                  </p>
                </div>

                {/* Mobile filter + desktop sorting */}
                {/* <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowFilters(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 transition hover:border-gray-400 hover:bg-gray-50 lg:hidden dark:border-dark-700 dark:bg-dark-800 dark:text-gray-200 dark:hover:bg-dark-700"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters

                    {activeFilterCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-bold text-white">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  <div className="relative">
                    <select
                      value={filters.sort}
                      onChange={(e) =>
                        handleFilterChange('sort', e.target.value)
                      }
                      className="h-11 min-w-[180px] appearance-none rounded-lg border border-gray-300 bg-white pl-4 pr-10 text-sm font-medium text-gray-800 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10 dark:border-dark-700 dark:bg-dark-800 dark:text-gray-200"
                    >
                      {sortOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */} */}

        {/* ACTIVE FILTER */}
        {hasActiveFilters && (
          <section className="border-b border-gray-100 dark:border-dark-800">
            <div className="container-custom">
              <div className="flex flex-wrap items-center gap-2 py-4">
                <span className="mr-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                  Filters:
                </span>

                {filters.search && (
                  <button
                    type="button"
                    onClick={() => removeFilter('search')}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-dark-800 dark:text-gray-300 dark:hover:bg-dark-700"
                  >
                    Search: {filters.search}
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}

                {selectedCategory && (
                  <button
                    type="button"
                    onClick={() => removeFilter('category')}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-dark-800 dark:text-gray-300 dark:hover:bg-dark-700"
                  >
                    {selectedCategory.name}
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}

                {(filters.minPrice || filters.maxPrice) && (
                  <button
                    type="button"
                    onClick={() => {
                      removeFilter('minPrice')
                      removeFilter('maxPrice')
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-dark-800 dark:text-gray-300 dark:hover:bg-dark-700"
                  >
                    Price:{' '}
                    {filters.minPrice
                      ? `Rs. ${Number(filters.minPrice).toLocaleString()}`
                      : 'Any'}{' '}
                    -{' '}
                    {filters.maxPrice
                      ? `Rs. ${Number(filters.maxPrice).toLocaleString()}`
                      : 'Any'}
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={clearFilters}
                  className="ml-1 inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 transition hover:text-red-700"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Clear all
                </button>
              </div>
            </div>
          </section>
        )}

        {/* =========================
            SHOP CONTENT
        ========================== */}
        <section className="container-custom py-8 sm:py-10 lg:py-12">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* =========================
                DESKTOP FILTER SIDEBAR
            ========================== */}
            <aside className="hidden w-64 shrink-0 lg:block">
              <div className="sticky top-24 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-dark-800 dark:bg-dark-900">
                <div className="border-b border-gray-100 px-5 py-4 dark:border-dark-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <h2 className="font-semibold">
                        Filters
                      </h2>
                    </div>

                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="text-xs font-medium text-red-600 hover:text-red-700"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-7 p-5">
                  {/* Search */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Search
                    </label>

                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                      <input
                        type="text"
                        value={filters.search}
                        onChange={(e) =>
                          handleFilterChange(
                            'search',
                            e.target.value
                          )
                        }
                        placeholder="Search products..."
                        className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10 dark:border-dark-700 dark:bg-dark-800"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Category
                    </label>

                    <div className="relative">
                      <select
                        value={filters.category}
                        onChange={(e) =>
                          handleFilterChange(
                            'category',
                            e.target.value
                          )
                        }
                        className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 pr-9 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10 dark:border-dark-700 dark:bg-dark-800"
                      >
                        <option value="">
                          All Categories
                        </option>

                        {categories.map((category) => (
                          <option
                            key={category.id}
                            value={category.id}
                          >
                            {category.name}
                          </option>
                        ))}
                      </select>

                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Price Range
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        min="0"
                        value={priceRange.min}
                        onChange={(e) =>
                          setPriceRange((prev) => ({
                            ...prev,
                            min: e.target.value,
                          }))
                        }
                        placeholder="Min"
                        className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-red-500 dark:border-dark-700 dark:bg-dark-800"
                      />

                      <input
                        type="number"
                        min="0"
                        value={priceRange.max}
                        onChange={(e) =>
                          setPriceRange((prev) => ({
                            ...prev,
                            max: e.target.value,
                          }))
                        }
                        placeholder="Max"
                        className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-red-500 dark:border-dark-700 dark:bg-dark-800"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={applyPriceFilter}
                      className="mt-3 w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 active:scale-[0.98]"
                    >
                      Apply Price
                    </button>
                  </div>

                  {/* Category shortcuts */}
                  {categories.length > 0 && (
                    <div>
                      <p className="mb-3 text-sm font-semibold">
                        Browse Categories
                      </p>

                      <div className="space-y-1">
                        {categories.slice(0, 6).map((category) => (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() =>
                              handleFilterChange(
                                'category',
                                category.id
                              )
                            }
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                              filters.category === category.id
                                ? 'bg-red-50 font-semibold text-red-600 dark:bg-red-950/30'
                                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-dark-800'
                            }`}
                          >
                            <span>{category.name}</span>
                            <span>›</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </aside>

            {/* =========================
                PRODUCTS
            ========================== */}
            <div className="min-w-0 flex-1">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {loading
                      ? 'Finding products...'
                      : `${products.length} ${
                          products.length === 1
                            ? 'product'
                            : 'products'
                        } found`}
                  </p>
                </div>

                <div className="hidden items-center gap-2 text-sm text-gray-500 sm:flex dark:text-gray-400">
                  <span>Sort by:</span>

                  <span className="font-medium text-gray-900 dark:text-white">
                    {
                      sortOptions.find(
                        (option) =>
                          option.value === filters.sort
                      )?.label
                    }
                  </span>
                </div>
              </div>

              {loading ? (
                <div className="flex min-h-[420px] items-center justify-center rounded-xl border border-gray-100 bg-gray-50/50 dark:border-dark-800 dark:bg-dark-900/50">
                  <LoadingSpinner />
                </div>
              ) : products.length === 0 ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 px-6 text-center dark:border-dark-700">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-dark-800">
                    <Search className="h-7 w-7 text-gray-400" />
                  </div>

                  <h2 className="text-xl font-semibold">
                    No products found
                  </h2>

                  <p className="mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
                    We couldn't find any products matching your
                    current filters. Try changing your search or
                    removing some filters.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* =========================
          MOBILE FILTER DRAWER
      ========================== */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setShowFilters(false)}
            className="absolute inset-0 bg-black/50"
          />

          <div className="absolute right-0 top-0 h-full w-[min(380px,90vw)] overflow-y-auto bg-white shadow-2xl dark:bg-dark-900">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-dark-800">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" />
                <h2 className="font-semibold">
                  Filters
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="rounded-lg p-2 transition hover:bg-gray-100 dark:hover:bg-dark-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-7 p-5">
              {/* Search */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Search
                </label>

                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange(
                        'search',
                        e.target.value
                      )
                    }
                    placeholder="Search products..."
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 text-sm outline-none focus:border-red-500 dark:border-dark-700 dark:bg-dark-800"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Category
                </label>

                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange(
                      'category',
                      e.target.value
                    )
                  }
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-red-500 dark:border-dark-700 dark:bg-dark-800"
                >
                  <option value="">
                    All Categories
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Price Range
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    min="0"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange((prev) => ({
                        ...prev,
                        min: e.target.value,
                      }))
                    }
                    placeholder="Min"
                    className="h-10 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-red-500 dark:border-dark-700 dark:bg-dark-800"
                  />

                  <input
                    type="number"
                    min="0"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange((prev) => ({
                        ...prev,
                        max: e.target.value,
                      }))
                    }
                    placeholder="Max"
                    className="h-10 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-red-500 dark:border-dark-700 dark:bg-dark-800"
                  />
                </div>

                <button
                  type="button"
                  onClick={applyPriceFilter}
                  className="mt-3 w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Apply Price
                </button>
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-dark-700 dark:text-gray-300 dark:hover:bg-dark-800"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShopPage
