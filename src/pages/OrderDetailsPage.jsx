import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  ArrowLeft,
  Loader2,
  Package,
  MapPin,
  CreditCard,
} from 'lucide-react';

import toast from 'react-hot-toast';

import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';

import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';

const formatPrice = (value) => {
  return `$${Number(value || 0).toFixed(2)}`;
};

const formatDate = (date) => {
  if (!date) return '';

  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getStatusClasses = (status) => {
  switch (status) {
    case 'delivered':
      return 'bg-green-100 text-green-700';

    case 'shipped':
      return 'bg-blue-100 text-blue-700';

    case 'processing':
      return 'bg-yellow-100 text-yellow-700';

    case 'cancelled':
      return 'bg-red-100 text-red-700';

    case 'pending':
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export function OrderDetailsPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { user, loading: authLoading } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user?.id) {
      toast.error('Please sign in to view this order.');

      navigate('/login', {
        replace: true,
        state: {
          from: `/orders/${id}`,
        },
      });

      return;
    }

    const loadOrder = async () => {
      setLoading(true);

      try {
        const { data, error } =
          await orderService.getOrderById(id);

        if (error) {
          throw error;
        }

        /*
         * Extra client-side ownership check.
         *
         * RLS already protects this query at the database level,
         * but this prevents accidentally rendering an order that
         * doesn't belong to the currently authenticated user.
         */
        if (!data || data.user_id !== user.id) {
          toast.error('Order not found.');

          navigate('/orders', { replace: true });

          return;
        }

        setOrder(data);
      } catch (error) {
        console.error(
          'Failed to load order details:',
          error
        );

        toast.error(
          'Unable to load this order. Please try again.'
        );

        navigate('/orders', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id, user?.id, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white text-black">
        <TopBar />

        <Navbar />

        <main className="max-w-[1170px] mx-auto px-4 sm:px-6 lg:px-0 py-24">
          <div className="flex items-center justify-center gap-3 text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin" />

            <span>Loading order...</span>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const items = order.order_items || [];

  const shippingAddress =
    order.shipping_address || {};

  return (
    <div className="min-h-screen bg-white text-black">
      <TopBar />

      <Navbar />

      <main>
        {/* Breadcrumb */}
        <section className="max-w-[1170px] mx-auto px-4 sm:px-6 lg:px-0 pt-10 sm:pt-14 lg:pt-[70px]">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-[12px] sm:text-[13px]"
          >
            <Link
              to="/account"
              className="text-gray-400 hover:text-black transition-colors"
            >
              Account
            </Link>

            <span className="text-gray-300">/</span>

            <Link
              to="/orders"
              className="text-gray-400 hover:text-black transition-colors"
            >
              My Orders
            </Link>

            <span className="text-gray-300">/</span>

            <span className="text-black font-medium">
              Order Details
            </span>
          </nav>
        </section>

        {/* Main */}
        <section className="max-w-[1170px] mx-auto px-4 sm:px-6 lg:px-0 pt-12 sm:pt-16 lg:pt-[58px] pb-20 lg:pb-[115px]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">
            <div>
              <Link
                to="/orders"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-4 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to My Orders
              </Link>

              <h1 className="text-[30px] sm:text-[36px] font-medium">
                Order Details
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Order #
                <span className="font-medium text-black ml-1">
                  {order.order_number || order.id}
                </span>
              </p>
            </div>

            <span
              className={`inline-flex w-fit px-4 py-2 rounded-full text-xs font-medium capitalize ${getStatusClasses(
                order.status
              )}`}
            >
              {order.status || 'pending'}
            </span>
          </div>

          {/* Order Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="border border-gray-200 rounded-lg p-5">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-gray-500" />

                <div>
                  <p className="text-xs text-gray-500">
                    Order Date
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {formatDate(order.created_at)}
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-5">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-gray-500" />

                <div>
                  <p className="text-xs text-gray-500">
                    Payment Status
                  </p>

                  <p className="mt-1 text-sm font-medium capitalize">
                    {order.payment_status || 'pending'}
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-5">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-gray-500" />

                <div>
                  <p className="text-xs text-gray-500">
                    Items
                  </p>

                  <p className="mt-1 text-sm font-medium">
                    {items.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Products + Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
            {/* Products */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200">
                <h2 className="font-medium">
                  Ordered Products
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                {items.length === 0 ? (
                  <div className="p-8 text-center text-sm text-gray-500">
                    No order items found.
                  </div>
                ) : (
                  items.map((item) => {
                    const product = item.products || {};

                    const image =
                      product.images?.[0] ||
                      item.image ||
                      '/placeholder.jpg';

                    const price = Number(
                      item.product_price || 0
                    );

                    const quantity = Number(
                      item.quantity || 1
                    );

                    return (
                      <div
                        key={item.id}
                        className="flex gap-4 p-5"
                      >
                        <img
                          src={image}
                          alt={
                            item.product_name ||
                            product.name ||
                            'Product'
                          }
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-gray-50 object-contain shrink-0"
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

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm sm:text-base truncate">
                            {item.product_name ||
                              product.name ||
                              'Product'}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            ${price.toFixed(2)} × {quantity}
                          </p>
                        </div>

                        <div className="text-sm font-medium shrink-0">
                          {formatPrice(
                            item.total ||
                              price * quantity
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Summary */}
            <aside className="border border-gray-200 rounded-lg p-5 h-fit">
              <h2 className="font-medium mb-5">
                Order Summary
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span>
                    {formatPrice(order.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Shipping
                  </span>

                  <span>
                    {Number(order.shipping_cost || 0) ===
                    0
                      ? 'Free'
                      : formatPrice(order.shipping_cost)}
                  </span>
                </div>

                {Number(order.discount_amount || 0) >
                  0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Discount
                    </span>

                    <span className="text-[#DB4444]">
                      -
                      {formatPrice(
                        order.discount_amount
                      )}
                    </span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4 flex justify-between font-medium text-base">
                  <span>Total</span>

                  <span>
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </aside>
          </div>

          {/* Shipping Address */}
          <div className="mt-8 border border-gray-200 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-5">
              <MapPin className="h-5 w-5 text-gray-500" />

              <h2 className="font-medium">
                Shipping Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
              <div>
                <p className="text-xs text-gray-500">
                  Name
                </p>

                <p className="mt-1">
                  {shippingAddress.name ||
                    shippingAddress.firstName ||
                    '—'}
                </p>
              </div>

              {shippingAddress.companyName && (
                <div>
                  <p className="text-xs text-gray-500">
                    Company
                  </p>

                  <p className="mt-1">
                    {shippingAddress.companyName}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-500">
                  Address
                </p>

                <p className="mt-1">
                  {shippingAddress.streetAddress ||
                    '—'}
                  {shippingAddress.apartment && (
                    <>
                      <br />
                      {shippingAddress.apartment}
                    </>
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Town / City
                </p>

                <p className="mt-1">
                  {shippingAddress.townCity || '—'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Phone
                </p>

                <p className="mt-1">
                  {shippingAddress.phoneNumber || '—'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Email
                </p>

                <p className="mt-1 break-all">
                  {shippingAddress.emailAddress || '—'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Country
                </p>

                <p className="mt-1">
                  {shippingAddress.country || 'Pakistan'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
