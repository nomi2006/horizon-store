import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'

export function OrderSuccessPage() {
  const location = useLocation()
  const orderId = location.state?.orderId

  return (
    <div className="container-custom py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
          <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Thank you for your order. We'll send you a confirmation email shortly.
        </p>
        {orderId && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            Order Number: <span className="font-mono font-medium text-gray-900 dark:text-white">{orderId}</span>
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/orders"
            className="btn-primary inline-flex"
          >
            <Package className="h-5 w-5 mr-2" />
            View My Orders
          </Link>
          <Link
            to="/shop"
            className="btn-secondary inline-flex"
          >
            Continue Shopping
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  )
}