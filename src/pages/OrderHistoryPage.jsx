import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  Package,
  ArrowLeft,
  Eye,
  Loader2,
  ShoppingBag,
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
    month: 'short',
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

export function OrderHistoryPage() {
  const navigate = useNavigate();

  const { user, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user?.id) {
      toast.error('Please sign in to view your orders.');

      navigate('/login', {
        replace: true,
        state: {
          from: '/orders',
        },
      });

      return;
    }

    const loadOrders = async () => {
      setLoading(true);

      try {
        const { data, error } =
          await orderService.getUserOrders(user.id);

        if (error) {
          throw error;
        }

        setOrders(data || []);
      } catch (error) {
        console.error('Failed to load orders:', error);

        toast.error(
          'Unable to load your orders. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user?.id, authLoading, navigate]);

  return (
    <div className="min-h-screen bg-white text-black">
      <TopBar />

      <Navbar />

      <main>
        {/* Breadcrumb */}
        <section className="max-w-[1170px] mx-auto px-4 sm:px-6 lg:px-0 pt-10 sm:pt-14 lg:pt-[70px]">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[12px] sm:text-[13px]"
          >
            <Link
              to="/account"
              className="text-gray-400 hover:text-black transition-colors"
            >
              Account
            </Link>

            <span className="text-gray-300">/</span>

            <span className="text-black font-medium">
              My Orders
            </span>
          </nav>
        </section>

        {/* Main Content */}
        <section className="max-w-[1170px] mx-auto px-4 sm:px-6 lg:px-0 pt-12 sm:pt-16 lg:pt-[58px] pb-20 lg:pb-[115px]">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-[30px] sm:text-[36px] font-medium">
                My Orders
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                View and track your previous orders.
              </p>
            </div>

            <Link
              to="/shop"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium hover:underline"
            >
              Continue Shopping
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="flex items-center gap-3 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading your orders...
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="border border-gray-200 rounded-lg px-6 py-16 text-center">
              <ShoppingBag className="mx-auto h-14 w-14 text-gray-300" />

              <h2 className="mt-5 text-xl font-medium">
                No orders yet
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                You haven't placed any orders yet.
              </p>

              <Link
                to="/shop"
                className="btn-primary inline-flex mt-6"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-hidden border border-gray-200 rounded-lg">
                <div className="grid grid-cols-[1.3fr_1fr_1fr_1fr_auto] gap-4 px-5 py-4 bg-gray-50 border-b border-gray-200 text-[13px] font-medium text-gray-600">
                  <span>Order</span>
                  <span>Date</span>
                  <span>Status</span>
                  <span>Total</span>
                  <span></span>
                </div>

                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="grid grid-cols-[1.3fr_1fr_1fr_1fr_auto] gap-4 items-center px-5 py-5 border-b border-gray-100 last:border-b-0"
                  >
                    <div>
                      <p className="font-medium text-sm">
                        {order.order_number || order.id}
                      </p>
                    </div>

                    <p className="text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </p>

                    <span
                      className={`inline-flex w-fit px-3 py-1 rounded-full text-[11px] font-medium capitalize ${getStatusClasses(
                        order.status
                      )}`}
                    >
                      {order.status || 'pending'}
                    </span>

                    <p className="text-sm font-medium">
                      {formatPrice(order.total)}
                    </p>

                    <Link
                      to={`/orders/${order.id}`}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                      aria-label={`View order ${
                        order.order_number || order.id
                      }`}
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs text-gray-500">
                          Order Number
                        </p>

                        <p className="mt-1 font-medium text-sm">
                          {order.order_number || order.id}
                        </p>
                      </div>

                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-[11px] font-medium capitalize ${getStatusClasses(
                          order.status
                        )}`}
                      >
                        {order.status || 'pending'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500">
                          Date
                        </p>

                        <p className="mt-1 text-sm">
                          {formatDate(order.created_at)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Total
                        </p>

                        <p className="mt-1 text-sm font-medium">
                          {formatPrice(order.total)}
                        </p>
                      </div>
                    </div>

                    <Link
                      to={`/orders/${order.id}`}
                      className="mt-5 w-full h-10 border border-gray-300 rounded-[3px] inline-flex items-center justify-center gap-2 text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      View Order
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
