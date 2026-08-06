import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, CreditCard, Truck, CheckCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { orderService } from '../services/orderService'
import { couponService } from '../services/couponService'
import { stripePromise } from '../services/stripe'
import toast from 'react-hot-toast'

const shippingSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Phone number is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'ZIP code is required'),
  country: z.string().min(2, 'Country is required')
})

export function CheckoutPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponError, setCouponError] = useState('')
  const navigate = useNavigate()
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(shippingSchema)
  })

  const shippingCost = 10
  const subtotal = total
  const discount = couponDiscount
  const grandTotal = subtotal + shippingCost - discount

  const handleApplyCoupon = async () => {
    if (!couponCode) return
    setCouponError('')
    try {
      const result = await couponService.validate(couponCode, subtotal)
      if (!result.valid) {
        setCouponError(result.error)
        return
      }
      if (result.isFreeShipping) {
        setCouponDiscount(shippingCost)
      } else {
        setCouponDiscount(result.discount)
      }
      setCouponApplied(true)
      toast.success('Coupon applied!')
    } catch (error) {
      setCouponError('Invalid coupon code')
    }
  }

  const onSubmitShipping = () => {
    setStep(2)
  }

  const handlePayment = async (data) => {
    setLoading(true)
    try {
      const stripe = await stripePromise
      if (!stripe) throw new Error('Stripe failed to load')

      const orderNumber = await orderService.generateOrderNumber()
      const orderData = {
        order_number: orderNumber,
        user_id: user.id,
        status: 'pending',
        total: grandTotal,
        subtotal: subtotal,
        shipping_cost: shippingCost,
        discount_amount: discount,
        shipping_address: data,
        payment_status: 'pending'
      }

      const { data: order, error: orderError } = await orderService.create(orderData)
      if (orderError) throw orderError

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity
      }))

      const { error: itemsError } = await orderService.createOrderItems(orderItems)
      if (itemsError) throw itemsError

      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(grandTotal * 100),
          orderId: order.id
        })
      })

      if (!response.ok) throw new Error('Payment failed')
      const { clientSecret } = await response.json()

      const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            element: document.getElementById('card-element')
          }
        }
      })

      if (stripeError) throw stripeError

      await orderService.updatePaymentStatus(order.id, 'paid')
      await orderService.updateStatus(order.id, 'processing')

      if (couponApplied) {
        const coupon = await couponService.getByCode(couponCode)
        if (coupon.data) await couponService.incrementUsed(coupon.data.id)
      }

      clearCart()
      toast.success('Order placed successfully!')
      navigate('/order-success', { state: { orderId: order.id } })

    } catch (error) {
      toast.error(error.message || 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    navigate('/cart')
    return null
  }

  return (
    <div className="container-custom py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Checkout
        </h1>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-dark-700'}`}>
              1
            </div>
            <span className="text-sm font-medium">Shipping</span>
          </div>
          <div className="flex-1 h-px bg-gray-200 dark:bg-dark-700" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-dark-700'}`}>
              2
            </div>
            <span className="text-sm font-medium">Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700 p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Shipping Information
                </h2>
                <form onSubmit={handleSubmit(onSubmitShipping)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">First Name</label>
                      <input {...register('firstName')} className="input-field" />
                      {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>}
                    </div>
                    <div>
                      <label className="label">Last Name</label>
                      <input {...register('lastName')} className="input-field" />
                      {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">Email</label>
                      <input {...register('email')} className="input-field" />
                      {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="label">Phone</label>
                      <input {...register('phone')} className="input-field" />
                      {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="label">Address</label>
                    <input {...register('address')} className="input-field" />
                    {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">City</label>
                      <input {...register('city')} className="input-field" />
                      {errors.city && <p className="text-red-600 text-sm mt-1">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className="label">State</label>
                      <input {...register('state')} className="input-field" />
                      {errors.state && <p className="text-red-600 text-sm mt-1">{errors.state.message}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="label">ZIP Code</label>
                      <input {...register('zipCode')} className="input-field" />
                      {errors.zipCode && <p className="text-red-600 text-sm mt-1">{errors.zipCode.message}</p>}
                    </div>
                    <div>
                      <label className="label">Country</label>
                      <input {...register('country')} className="input-field" />
                      {errors.country && <p className="text-red-600 text-sm mt-1">{errors.country.message}</p>}
                    </div>
                  </div>
                  <button type="submit" className="w-full btn-primary">
                    Continue to Payment
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </button>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700 p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5 text-primary-600" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Payment
                  </h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="label">Card Details</label>
                    <div id="card-element" className="input-field py-3"></div>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 btn-secondary"
                    >
                      <ChevronLeft className="h-5 w-5 mr-2" />
                      Back
                    </button>
                    <button
                      onClick={handlePayment}
                      disabled={loading}
                      className="flex-1 btn-primary"
                    >
                      {loading ? 'Processing...' : 'Place Order'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-sm">
                    <img
                      src={item.images?.[0] || '/placeholder.jpg'}
                      alt={item.name}
                      className="h-12 w-12 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 dark:text-white truncate">{item.name}</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        ${item.price.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Coupon code"
                  className="input-field"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="btn-primary py-2 px-4 text-sm"
                  disabled={couponApplied}
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-red-600 text-sm -mt-2 mb-2">{couponError}</p>}
              {couponApplied && (
                <p className="text-green-600 text-sm -mt-2 mb-2">✓ Coupon applied!</p>
              )}

              <div className="space-y-2 text-sm border-t border-gray-200 dark:border-dark-700 pt-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 dark:border-dark-700 pt-2 mt-2">
                  <div className="flex justify-between font-semibold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}