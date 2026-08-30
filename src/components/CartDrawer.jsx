import React from 'react';

import { Link } from 'react-router-dom';

import { motion, AnimatePresence } from 'framer-motion';

import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
} from 'lucide-react';

import { useCart } from '../context/CartContext';

export function CartDrawer({ isOpen, onClose }) {
  const {
    cart,
    cartCount,
    cartTotal,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const items = cart?.items || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 shrink-0">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-gray-600" />

                <span className="font-semibold text-gray-900">
                  Cart ({cartCount})
                </span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close cart"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag className="h-16 w-16 text-gray-300" />

                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    Your cart is empty
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    Browse our collection and find something you'll love
                  </p>

                  <Link
                    to="/shop"
                    onClick={onClose}
                    className="mt-6 btn-primary"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => {
                    const price = Number(item.price || 0);
                    const quantity = Number(item.quantity || 1);

                    const image =
                      item.images?.[0] ||
                      item.image ||
                      '/placeholder.jpg';

                    return (
                      <div
                        key={item.id}
                        className="flex gap-4 border-b border-gray-100 pb-4"
                      >
                        {/* Product Image */}
                        <img
                          src={image}
                          alt={item.name}
                          className="h-20 w-20 rounded-lg object-cover bg-gray-50"
                          onError={(event) => {
                            if (
                              event.currentTarget.src.endsWith(
                                '/placeholder.jpg'
                              )
                            ) {
                              return;
                            }

                            event.currentTarget.src =
                              '/placeholder.jpg';
                          }}
                        />

                        {/* Product Information */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {item.name}
                          </h4>

                          <p className="text-sm font-semibold text-[#DB4444]">
                            ${price.toFixed(2)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    Math.max(1, quantity - 1)
                                  )
                                }
                                className="p-1.5 hover:bg-gray-100 rounded-l-lg transition-colors disabled:opacity-40"
                                disabled={quantity <= 1}
                                aria-label={`Decrease quantity of ${item.name}`}
                              >
                                <Minus className="h-3 w-3 text-gray-600" />
                              </button>

                              <span className="w-8 text-center text-sm text-gray-900">
                                {quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(
                                    item.id,
                                    quantity + 1
                                  )
                                }
                                className="p-1.5 hover:bg-gray-100 rounded-r-lg transition-colors"
                                aria-label={`Increase quantity of ${item.name}`}
                              >
                                <Plus className="h-3 w-3 text-gray-600" />
                              </button>
                            </div>

                            {/* Remove */}
                            <button
                              type="button"
                              onClick={() =>
                                removeFromCart(item.id)
                              }
                              className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                              aria-label={`Remove ${item.name} from cart`}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <p className="font-semibold text-gray-900 shrink-0">
                          ${(price * quantity).toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-4 shrink-0">
                <div className="flex justify-between text-lg font-semibold text-gray-900 mb-4">
                  <span>Total</span>

                  <span>
                    ${Number(cartTotal || 0).toFixed(2)}
                  </span>
                </div>

                <Link
                  to="/checkout"
                  onClick={onClose}
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
  );
}