import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  X,
  ChevronDown,
  ChevronRight,
  Search,
  SlidersHorizontal,
  RotateCcw,
  ShoppingBag,
} from 'lucide-react';

import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { LoadingSpinner } from '../components/LoadingSpinner';

import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';

export function ShopPage() {
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    sort: 'newest',
    minPrice: '',
    maxPrice: '',
  });

  const [priceRange, setPriceRange] = useState({
    min: '',
    max: '',
  });

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const { data } = await categoryService.getAll();
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await productService.getAll(filters);
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyPriceFilter = () => {
    setFilters((prev) => ({
      ...prev,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
    }));
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      search: '',
      sort: 'newest',
      minPrice: '',
      maxPrice: '',
    });
    setPriceRange({ min: '', max: '' });
  };

  const removeFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: '' }));
    if (key === 'minPrice' || key === 'maxPrice') {
      setPriceRange({ min: '', max: '' });
    }
  };

  const selectedCategory = useMemo(
    () => categories.find((cat) => cat.id === filters.category),
    [categories, filters.category]
  );

  const hasActiveFilters =
    Boolean(filters.category) ||
    Boolean(filters.search) ||
    Boolean(filters.minPrice) ||
    Boolean(filters.maxPrice);

  const activeFilterCount = [
    filters.category,
    filters.search,
    filters.minPrice,
    filters.maxPrice,
  ].filter(Boolean).length;

  const formatPrice = (value) => {
    if (!value) return 'Any';
    return `Rs. ${Number(value).toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <TopBar />
      <Navbar />

      <main>
        {/* ACTIVE FILTER CHIPS */}
        {hasActiveFilters && (
          <section className="border-b border-gray-100 bg-gray-50/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-center gap-2 py-4">
                <span className="mr-1 text-sm font-medium text-gray-600">
                  Filters:
                </span>

                {filters.search && (
                  <button
                    type="button"
                    onClick={() => removeFilter('search')}
                    className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100"
                  >
                    Search: {filters.search}
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}

                {selectedCategory && (
                  <button
                    type="button"
                    onClick={() => removeFilter('category')}
                    className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100"
                  >
                    {selectedCategory.name}
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}

                {(filters.minPrice || filters.maxPrice) && (
                  <button
                    type="button"
                    onClick={() => {
                      removeFilter('minPrice');
                      removeFilter('maxPrice');
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100"
                  >
                    Price: {formatPrice(filters.minPrice)} – {formatPrice(filters.maxPrice)}
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

        {/* SHOP CONTENT */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* DESKTOP FILTER SIDEBAR */}
            <aside className="hidden w-72 shrink-0 lg:block">
              <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-gray-500" />
                    <h2 className="text-lg font-semibold">Filters</h2>
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

                <div className="mt-5 space-y-6">
                  {/* Search */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Search
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        placeholder="Search products..."
                        className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10 text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Category
                    </label>
                    <div className="relative">
                      <select
                        value={filters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 pr-9 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10 text-gray-900"
                      >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                      Price Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        min="0"
                        value={priceRange.min}
                        onChange={(e) =>
                          setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                        }
                        placeholder="Min"
                        className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10 text-gray-900 placeholder:text-gray-400"
                      />
                      <input
                        type="number"
                        min="0"
                        value={priceRange.max}
                        onChange={(e) =>
                          setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                        }
                        placeholder="Max"
                        className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10 text-gray-900 placeholder:text-gray-400"
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

                  {/* Category Shortcuts */}
                  {categories.length > 0 && (
                    <div>
                      <p className="mb-3 text-sm font-semibold text-gray-700">
                        Browse Categories
                      </p>
                      <div className="space-y-1">
                        {categories.slice(0, 6).map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleFilterChange('category', cat.id)}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                              filters.category === cat.id
                                ? 'bg-red-50 font-semibold text-red-600'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <span>{cat.name}</span>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </aside>

            {/* PRODUCTS */}
            <div className="min-w-0 flex-1">
              {/* Header with sort and filter toggle */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">
                    {loading
                      ? 'Loading products...'
                      : `${products.length} ${products.length === 1 ? 'product' : 'products'} found`}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Mobile filter button */}
                  <button
                    type="button"
                    onClick={() => setShowFilters(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 lg:hidden"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  {/* Sort */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="hidden text-gray-500 sm:inline">
                      Sort by:
                    </span>
                    <select
                      value={filters.sort}
                      onChange={(e) => handleFilterChange('sort', e.target.value)}
                      className="rounded-lg border-0 bg-gray-100 px-3 py-2 text-sm font-medium text-gray-900 outline-none transition focus:ring-2 focus:ring-red-500"
                    >
                      {sortOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {loading ? (
                <div className="flex min-h-[420px] items-center justify-center rounded-2xl border border-gray-100 bg-gray-50/50">
                  <LoadingSpinner />
                </div>
              ) : products.length === 0 ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 px-6 text-center">
                  <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gray-200">
                    <ShoppingBag className="h-10 w-10 text-gray-400" />
                  </div>
                  <h2 className="text-xl font-semibold">No products found</h2>
                  <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                    We couldn't find any products matching your current filters. Try changing your search or removing some filters.
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      className="transition-shadow hover:shadow-lg rounded-lg"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* MOBILE FILTER DRAWER - WITH VISIBLE FIELDS */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-transform duration-300 ${
          showFilters ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Backdrop */}
        <button
          type="button"
          aria-label="Close filters"
          onClick={() => setShowFilters(false)}
          className="absolute inset-0 bg-black/50"
        />

        {/* Drawer - white background with visible inputs */}
        <div className="absolute right-0 top-0 h-full w-[min(380px,90vw)] overflow-y-auto bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            </div>
            <button
              type="button"
              onClick={() => setShowFilters(false)}
              className="rounded-lg p-2 transition hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>
          </div>

          <div className="space-y-6 p-5">
            {/* Search - VISIBLE */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search products..."
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10 text-gray-900"
                />
              </div>
            </div>

            {/* Category - VISIBLE */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Category
              </label>
              <div className="relative">
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 pr-9 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10 text-gray-900"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            {/* Price Range - VISIBLE */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Price Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="0"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                  }
                  placeholder="Min"
                  className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10 text-gray-900 placeholder:text-gray-400"
                />
                <input
                  type="number"
                  min="0"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                  }
                  placeholder="Max"
                  className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/10 text-gray-900 placeholder:text-gray-400"
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
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopPage;