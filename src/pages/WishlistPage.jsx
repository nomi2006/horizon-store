import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

export function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist()
  const { addItem } = useCart()

  const handleAddToCart = (product) => {
    addItem(product)
    toast.success(`${product.name} added to cart`)
  }

  if (items.length === 0) {
    return (
      <div className="container-custom py-16 text-center">
        <div className="max-w-md mx-auto">
          <Heart className="h-24 w-24 text-gray-300 dark:text-dark-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Your wishlist is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Start saving your favorite items.
          </p>
          <Link to="/shop" className="btn-primary inline-flex">
            Start Shopping
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-custom py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Wishlist ({items.length})
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Items you've saved for later
          </p>
        </div>
        <button
          onClick={clearWishlist}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700 overflow-hidden hover:shadow-lg transition-all"
          >
            <Link to={`/product/${item.id}`}>
              <img
                src={item.images?.[0] || '/placeholder.jpg'}
                alt={item.name}
                className="w-full h-64 object-cover"
              />
            </Link>
            <div className="p-4">
              <Link
                to={`/product/${item.id}`}
                className="font-medium text-gray-900 dark:text-white hover:text-primary-600 transition-colors"
              >
                {item.name}
              </Link>
              <p className="text-lg font-bold text-primary-600 dark:text-primary-400 mt-1">
                ${item.price.toFixed(2)}
              </p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleAddToCart(item)}
                  className="flex-1 btn-primary text-sm py-2"
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Add to Cart
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 rounded-lg border border-gray-300 dark:border-dark-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}