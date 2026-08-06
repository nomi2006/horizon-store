import React from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2, Plus, Minus } from 'lucide-react'
import { useCart } from '../context/CartContext'

export function CartDrawer() {
  const { items, total, count, isOpen, toggleCart, removeItem, updateQuantity } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-dark-900 shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-dark-700 px-4 py-3 shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  Cart ({count})
                </span>
              </div>
              <button
                onClick={toggleCart}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors"
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag className="h-16 w-16 text-gray-300 dark:text-dark-600" />
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                    Your cart is empty
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Browse our collection and find something you'll love
                  </p>
                  <button
                    onClick={toggleCart}
                    className="mt-6 btn-primary"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 border-b border-gray-100 dark:border-dark-700 pb-4"
                    >
                      <img
                        src={item.images?.[0] || '/placeholder.jpg'}
                        alt={item.name}
                        className="h-20 w-20 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate">
                          {item.name}
                        </h4>
                        <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                          ${item.price.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center border border-gray-300 dark:border-dark-600 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-l-lg transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                            </button>
                            <span className="w-8 text-center text-sm text-gray-900 dark:text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-r-lg transition-colors"
                            >
                              <Plus className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 dark:border-dark-700 p-4 shrink-0">
                <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Link
                  to="/checkout"
                  onClick={toggleCart}
                  className="w-full btn-primary"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}