import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';

export function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  const [promoCode, setPromoCode] = useState('');

  const items = cart?.items || [];

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );

  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 10;
  const total = subtotal + shipping;

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    updateQuantity(productId, newQuantity);
  };

  const handleRemove = (productId) => {
    if (window.confirm('Remove this item from cart?')) {
      removeFromCart(productId);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Clear entire cart?')) {
      clearCart();
    }
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();

    if (!promoCode.trim()) {
      return;
    }

    // Placeholder for future promo-code logic
    alert(`Promo code "${promoCode}" applied (demo)`);
    setPromoCode('');
  };

  const isEmpty = items.length === 0;

  return (
    <>
      {/* Global Header */}
      <TopBar />
      <Navbar />

      {/* Empty Cart */}
      {isEmpty ? (
        <section className="min-h-[60vh] flex flex-col items-center justify-center bg-white py-12 px-4">
          <ShoppingBag
            size={64}
            strokeWidth={1.5}
            className="text-gray-300 mb-4"
          />

          <h2 className="text-2xl font-semibold text-gray-700">
            Your cart is empty
          </h2>

          <p className="text-gray-500 mt-2 text-center">
            Browse our products and add items you love.
          </p>

          <Link
            to="/shop"
            className="mt-6 inline-flex items-center justify-center px-6 py-3 bg-[#DB4444] text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Continue Shopping
          </Link>
        </section>
      ) : (
        /* Cart */
        <section className="w-full bg-white py-8 md:py-12">
          <div className="max-w-[1170px] mx-auto px-4 lg:px-0">
            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {/* Header */}
                  <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-6 py-3 bg-gray-50 text-sm font-medium text-gray-600 border-b border-gray-200">
                    <span>Product</span>
                    <span className="text-center">Quantity</span>
                    <span className="text-right">Subtotal</span>
                    <span></span>
                  </div>

                  {/* Items */}
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_auto] gap-4 px-4 md:px-6 py-4 border-b border-gray-100 last:border-b-0 items-center"
                    >
                      {/* Product Info */}
                      <div className="flex items-center gap-4">
                        <img
                          src={item.images?.[0] || '/placeholder.jpg'}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />

                        <div>
                          <Link
                            to={`/product/${item.id}`}
                            className="text-sm font-medium text-gray-800 hover:text-[#DB4444] transition-colors"
                          >
                            {item.name}
                          </Link>

                          <p className="text-sm text-gray-500 mt-1">
                            ${Number(item.price || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-start md:justify-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              Number(item.quantity) - 1
                            )
                          }
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              Number(item.quantity) + 1
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Subtotal + Remove */}
                      <div className="flex items-center justify-between md:justify-end gap-4">
                        <span className="font-semibold text-gray-900">
                          $
                          {(
                            Number(item.price || 0) *
                            Number(item.quantity || 0)
                          ).toFixed(2)}
                        </span>

                        {/* Mobile Remove */}
                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          className="md:hidden text-red-500 hover:text-red-700 transition-colors p-1"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* Desktop Remove */}
                      <div className="hidden md:flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Cart Actions */}
                  <div className="flex flex-wrap justify-between items-center gap-4 px-4 md:px-6 py-4 bg-gray-50">
                    <button
                      type="button"
                      onClick={handleClearCart}
                      className="text-sm text-red-500 hover:text-red-700 transition-colors"
                    >
                      Clear Cart
                    </button>

                    <Link
                      to="/shop"
                      className="text-sm text-[#DB4444] hover:text-red-600 transition-colors"
                    >
                      ← Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 sticky top-24">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Order Summary
                  </h3>

                  <div className="space-y-3 text-sm">
                    {/* Subtotal */}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>

                      <span className="font-medium">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>

                    {/* Shipping */}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>

                      <span className="font-medium">
                        {shipping === 0
                          ? 'Free'
                          : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>

                    {/* Total */}
                    <div className="border-t border-gray-300 pt-3 flex justify-between text-base font-bold">
                      <span>Total</span>

                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Promo Code */}
                  <form
                    onSubmit={handleApplyPromo}
                    className="mt-6 flex gap-2"
                  >
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo code"
                      className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DB4444] text-sm"
                    />

                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#DB4444] text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
                    >
                      Apply
                    </button>
                  </form>

                  {/* Checkout */}
                  <Link
                    to="/checkout"
                    className="mt-6 w-full inline-flex justify-center items-center px-6 py-3 bg-[#DB4444] text-white font-medium rounded-md hover:bg-red-600 transition-colors"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default CartPage;