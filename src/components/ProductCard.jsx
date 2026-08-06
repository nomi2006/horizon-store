import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Heart, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

export function ProductCard({ product }) {
  const { addItem } = useCart()
  const { addItem: addWishlist, removeItem: removeWishlist, isInWishlist } = useWishlist()

  const isWishlisted = isInWishlist(product.id)

  const handleWishlist = (e) => {
    e.preventDefault()
    if (isWishlisted) {
      removeWishlist(product.id)
    } else {
      addWishlist(product)
    }
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    addItem(product)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group relative bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700 overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-dark-800">
          <img
            src={product.images?.[0] || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-dark-800/90 rounded-full shadow-md hover:scale-110 transition-transform"
          >
            <Heart
              className={`h-5 w-5 ${
                isWishlisted
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            />
          </button>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
              Sale
            </span>
          )}
          {product.stock_quantity === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="px-3 py-1 bg-white text-gray-900 font-semibold rounded-full text-sm">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center gap-1 mb-1">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.floor(product.rating || 0)
                      ? 'fill-secondary-500 text-secondary-500'
                      : 'text-gray-300 dark:text-dark-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({product.reviews_count || 0})
            </span>
          </div>

          <h3 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ${product.price.toFixed(2)}
              </span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.compare_at_price.toFixed(2)}
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock_quantity === 0}
              className="p-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}