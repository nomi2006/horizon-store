import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  Check,
  CreditCard,
  Loader2,
  MapPin,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import toast from 'react-hot-toast';

import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import { couponService } from '../services/couponService';

const RED = '#DB4444';
const SHIPPING_COST = 0;

const checkoutSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, 'First name is required'),

  companyName: z
    .string()
    .optional(),

  streetAddress: z
    .string()
    .trim()
    .min(5, 'Street address is required'),

  apartment: z
    .string()
    .optional(),

  townCity: z
    .string()
    .trim()
    .min(2, 'Town/City is required'),

  phoneNumber: z
    .string()
    .trim()
    .min(10, 'Phone number is required'),

  emailAddress: z
    .string()
    .trim()
    .email('Enter a valid email address'),

  saveInformation: z
    .boolean()
    .optional(),
});

const formatPrice = (value) => {
  return `$${Number(value || 0).toFixed(2)}`;
};

export function CheckoutPage() {
  const navigate = useNavigate();

  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const items = cart?.items || [];

  const [paymentMethod, setPaymentMethod] = useState('cod');

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');

  const [placingOrder, setPlacingOrder] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: '',
      companyName: '',
      streetAddress: '',
      apartment: '',
      townCity: '',
      phoneNumber: '',
      emailAddress: user?.email || '',
      saveInformation: true,
    },
  });

  useEffect(() => {
    if (user?.email) {
      setValue('emailAddress', user.email);
    }
  }, [user?.email, setValue]);

  /*
   * If the cart is empty, checkout should never remain accessible.
   * We redirect after render rather than rendering a broken checkout.
   */
  useEffect(() => {
    if (!items.length) {
      navigate('/cart', { replace: true });
    }
  }, [items.length, navigate]);

  const subtotal = useMemo(() => {
    return Number(cartTotal || 0);
  }, [cartTotal]);

  const shipping = SHIPPING_COST;

  const total = useMemo(() => {
    return Math.max(0, subtotal + shipping - couponDiscount);
  }, [subtotal, shipping, couponDiscount]);

  const handleApplyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();

    if (!code) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    if (couponApplied) {
      return;
    }

    setCouponError('');

    try {
      const result = await couponService.validate(code, subtotal);

      if (!result.valid) {
        setCouponError(result.error || 'Invalid coupon code.');
        return;
      }

      let discount = Number(result.discount || 0);

      if (result.isFreeShipping) {
        discount = shipping;
      }

      /*
       * Never allow a coupon to reduce the order below zero.
       */
      discount = Math.min(discount, subtotal + shipping);

      setCouponDiscount(discount);
      setCouponApplied(true);
      setCouponError('');

      toast.success('Coupon applied successfully.');
    } catch (error) {
      setCouponError('Unable to validate this coupon. Please try again.');
    }
  };

  const handlePlaceOrder = async (formData) => {
    if (!user?.id) {
      toast.error('Please sign in before placing your order.');
      navigate('/login', {
        state: {
          from: '/checkout',
        },
      });
      return;
    }

    if (!items.length) {
      toast.error('Your cart is empty.');
      navigate('/cart');
      return;
    }

    setPlacingOrder(true);

    try {
      const orderNumber = await orderService.generateOrderNumber();

      /*
       * Keep the complete customer/billing information inside the
       * existing shipping_address JSON field used by the project.
       *
       * This avoids changing the existing database contract.
       */
      const shippingAddress = {
        name: formData.firstName,
        firstName: formData.firstName,
        companyName: formData.companyName || '',
        streetAddress: formData.streetAddress,
        apartment: formData.apartment || '',
        townCity: formData.townCity,
        phoneNumber: formData.phoneNumber,
        emailAddress: formData.emailAddress,
        country: 'Pakistan',
      };

      const orderData = {
        order_number: orderNumber,
        user_id: user.id,
        status: 'pending',
        total,
        subtotal,
        shipping_cost: shipping,
        discount_amount: couponDiscount,
        shipping_address: shippingAddress,
        payment_status: 'pending',
      };

      const { data: order, error: orderError } =
        await orderService.create(orderData);

      if (orderError || !order) {
        throw orderError || new Error('Unable to create your order.');
      }

      /*
       * Create order items from the SAME cart that generated the subtotal.
       * No duplicate product/cart state is introduced.
       */
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_price: Number(item.price || 0),
        quantity: Number(item.quantity || 1),
        total:
          Number(item.price || 0) * Number(item.quantity || 1),
      }));

      const { error: orderItemsError } =
        await orderService.createOrderItems(orderItems);

      if (orderItemsError) {
        throw orderItemsError;
      }

      /*
       * COD:
       * The order remains pending because payment has not happened yet.
       *
       * Bank:
       * The order also remains pending until the bank payment is
       * manually verified/processed.
       *
       * We deliberately do NOT mark either method as "paid".
       */
      if (paymentMethod === 'cod') {
        await orderService.updateStatus(order.id, 'processing');
      }

      /*
       * Only increment coupon usage AFTER the order has successfully
       * been created.
       */
      if (couponApplied) {
        const couponResult =
          await couponService.getByCode(couponCode.trim().toUpperCase());

        if (couponResult?.data?.id) {
          await couponService.incrementUsed(couponResult.data.id);
        }
      }

      /*
       * Save checkout information locally only if the user requested it.
       * Do not store sensitive payment information.
       */
      if (formData.saveInformation) {
        localStorage.setItem(
          'horizon_checkout_information',
          JSON.stringify({
            firstName: formData.firstName,
            companyName: formData.companyName || '',
            streetAddress: formData.streetAddress,
            apartment: formData.apartment || '',
            townCity: formData.townCity,
            phoneNumber: formData.phoneNumber,
            emailAddress: formData.emailAddress,
          })
        );
      } else {
        localStorage.removeItem('horizon_checkout_information');
      }

      /*
       * The cart is cleared only AFTER the order and order items
       * have been successfully created.
       */
      clearCart();

      toast.success('Order placed successfully!');

      navigate('/order-success', {
        replace: true,
        state: {
          orderId: order.order_number || order.id,
          paymentMethod,
        },
      });
    } catch (error) {
      console.error('Checkout error:', error);

      toast.error(
        error?.message ||
          'Something went wrong while placing your order.'
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (!items.length) {
    return null;
  }

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
              to="/account"
              className="text-gray-400 hover:text-black transition-colors"
            >
              My Account
            </Link>

            <span className="text-gray-300">/</span>

            <Link
              to="/shop"
              className="text-gray-400 hover:text-black transition-colors"
            >
              Product
            </Link>

            <span className="text-gray-300">/</span>

            <Link
              to="/cart"
              className="text-gray-400 hover:text-black transition-colors"
            >
              View Cart
            </Link>

            <span className="text-gray-300">/</span>

            <span className="text-black font-medium">
              Checkout
            </span>
          </nav>
        </section>

        {/* Main Checkout */}
        <section className="max-w-[1170px] mx-auto px-4 sm:px-6 lg:px-0 pt-12 sm:pt-16 lg:pt-[58px] pb-20 lg:pb-[115px]">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_405px] gap-12 lg:gap-[90px]">
{/* biling details */}
            <div>
              <h1 className="text-[32px] sm:text-[36px] lg:text-[38px] leading-tight font-medium tracking-[0.01em] mb-10 lg:mb-[34px]">
                Billing Details
              </h1>

              <form
                id="checkout-form"
                onSubmit={handleSubmit(handlePlaceOrder)}
                noValidate
                className="space-y-6"
              >
                {/* First Name */}
                <CheckoutField
                  label="First Name"
                  required
                  error={errors.firstName?.message}
                >
                  <input
                    {...register('firstName')}
                    type="text"
                    autoComplete="given-name"
                    className={inputClass(errors.firstName)}
                  />
                </CheckoutField>

                {/* Company */}
                <CheckoutField
                  label="Company Name"
                  error={errors.companyName?.message}
                >
                  <input
                    {...register('companyName')}
                    type="text"
                    autoComplete="organization"
                    className={inputClass(errors.companyName)}
                  />
                </CheckoutField>

                {/* Street */}
                <CheckoutField
                  label="Street Address"
                  required
                  error={errors.streetAddress?.message}
                >
                  <input
                    {...register('streetAddress')}
                    type="text"
                    autoComplete="street-address"
                    className={inputClass(errors.streetAddress)}
                  />
                </CheckoutField>

                {/* Apartment */}
                <CheckoutField
                  label="Apartment, floor, etc. (optional)"
                  error={errors.apartment?.message}
                >
                  <input
                    {...register('apartment')}
                    type="text"
                    autoComplete="address-line2"
                    className={inputClass(errors.apartment)}
                  />
                </CheckoutField>

                {/* City */}
                <CheckoutField
                  label="Town/City"
                  required
                  error={errors.townCity?.message}
                >
                  <input
                    {...register('townCity')}
                    type="text"
                    autoComplete="address-level2"
                    className={inputClass(errors.townCity)}
                  />
                </CheckoutField>

                {/* Phone */}
                <CheckoutField
                  label="Phone Number"
                  required
                  error={errors.phoneNumber?.message}
                >
                  <input
                    {...register('phoneNumber')}
                    type="tel"
                    autoComplete="tel"
                    className={inputClass(errors.phoneNumber)}
                  />
                </CheckoutField>

                {/* Email */}
                <CheckoutField
                  label="Email Address"
                  required
                  error={errors.emailAddress?.message}
                >
                  <input
                    {...register('emailAddress')}
                    type="email"
                    autoComplete="email"
                    className={inputClass(errors.emailAddress)}
                  />
                </CheckoutField>

                {/* Save information */}
                <label className="flex items-center gap-3 pt-1 cursor-pointer select-none">
                  <input
                    {...register('saveInformation')}
                    type="checkbox"
                    className="peer sr-only"
                  />

                  <span className="w-[19px] h-[19px] rounded-[3px] border border-gray-300 flex items-center justify-center transition-colors peer-checked:bg-[#DB4444] peer-checked:border-[#DB4444]">
                    <Check
                      size={14}
                      strokeWidth={3}
                      className="text-white opacity-0 peer-checked:opacity-100"
                    />
                  </span>

                  <span className="text-[14px] sm:text-[15px] text-gray-700">
                    Save this information for faster check-out next time
                  </span>
                </label>
              </form>
            </div>

{/* order summary */}
            <aside className="lg:pt-[88px]">
              <div className="w-full">
                {/* Products */}
                <div className="space-y-5 mb-7">
                  {items.map((item) => {
                    const image =
                      item.images?.[0] ||
                      item.image ||
                      '/placeholder.jpg';

                    const itemTotal =
                      Number(item.price || 0) *
                      Number(item.quantity || 1);

                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-4"
                      >
                        <div className="relative w-[58px] h-[58px] shrink-0 bg-gray-50 flex items-center justify-center overflow-hidden">
                          <img
                            src={image}
                            alt={item.name}
                            className="w-full h-full object-contain"
                            onError={(event) => {
                              event.currentTarget.src =
                                '/placeholder.jpg';
                            }}
                          />

                          {item.quantity > 1 && (
                            <span className="absolute -top-1 -right-1 min-w-[19px] h-[19px] px-1 rounded-full bg-[#DB4444] text-white text-[10px] flex items-center justify-center font-medium">
                              {item.quantity}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] sm:text-[15px] text-black truncate">
                            {item.name}
                          </p>

                          {item.quantity > 1 && (
                            <p className="text-[12px] text-gray-500 mt-1">
                              Qty: {item.quantity}
                            </p>
                          )}
                        </div>

                        <span className="text-[14px] sm:text-[15px] text-black shrink-0">
                          {formatPrice(itemTotal)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Totals */}
                <div className="border-b border-gray-300">
                  <SummaryRow
                    label="Subtotal:"
                    value={formatPrice(subtotal)}
                  />

                  <SummaryRow
                    label="Shipping:"
                    value={
                      shipping === 0
                        ? 'Free'
                        : formatPrice(shipping)
                    }
                  />

                  {couponDiscount > 0 && (
                    <SummaryRow
                      label="Discount:"
                      value={`-${formatPrice(couponDiscount)}`}
                      valueClassName="text-[#DB4444]"
                    />
                  )}

                  <SummaryRow
                    label="Total:"
                    value={formatPrice(total)}
                    strong
                  />
                </div>

                {/* Payment methods */}
                <div className="mt-7 space-y-5">
                  <PaymentOption
                    id="bank"
                    value="bank"
                    checked={paymentMethod === 'bank'}
                    onChange={setPaymentMethod}
                    title="Bank"
                  >
                    <div className="flex items-center gap-2 ml-auto">
                      <PaymentBadge text="bKash" />
                      <PaymentBadge text="VISA" />
                      <PaymentBadge text="MC" />
                      <PaymentBadge text="Nagad" />
                    </div>
                  </PaymentOption>

                  <PaymentOption
                    id="cod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={setPaymentMethod}
                    title="Cash on delivery"
                  />
                </div>

                {/* Coupon */}
                <div className="mt-7">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(event) => {
                        setCouponCode(
                          event.target.value.toUpperCase()
                        );

                        if (couponApplied) {
                          setCouponApplied(false);
                          setCouponDiscount(0);
                        }

                        setCouponError('');
                      }}
                      placeholder="Coupon Code"
                      disabled={couponApplied}
                      className="h-[44px] flex-1 border border-gray-900 rounded-[3px] px-4 text-[14px] outline-none placeholder:text-gray-400 disabled:bg-gray-50"
                    />

                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={
                        couponApplied ||
                        !couponCode.trim()
                      }
                      className="h-[44px] px-7 bg-[#DB4444] hover:bg-[#c83b3b] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-[3px] text-[14px] font-medium transition-colors"
                    >
                      {couponApplied
                        ? 'Applied'
                        : 'Apply Coupon'}
                    </button>
                  </div>

                  {couponError && (
                    <p className="text-[12px] text-red-600 mt-2">
                      {couponError}
                    </p>
                  )}

                  {couponApplied && (
                    <p className="text-[12px] text-green-600 mt-2">
                      Coupon applied successfully.
                    </p>
                  )}
                </div>

                {/* Place order */}
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={placingOrder}
                  className="mt-6 min-w-[145px] h-[44px] px-6 bg-[#DB4444] hover:bg-[#c83b3b] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-[3px] text-[14px] font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {placingOrder ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>

                {/* Trust indicators */}
                <div className="mt-8 pt-6 border-t border-gray-100 space-y-4">
                  <div className="flex items-center gap-3 text-gray-500">
                    <ShieldCheck size={20} strokeWidth={1.5} />
                    <span className="text-[12px]">
                      Secure checkout
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-500">
                    <Truck size={20} strokeWidth={1.5} />
                    <span className="text-[12px]">
                      Free shipping on this order
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}

// Reusable Checkout Components

function CheckoutField({
  label,
  required = false,
  error,
  children,
}) {
  return (
    <div>
      <label className="block text-[13px] sm:text-[14px] text-gray-500 mb-2">
        {label}
        {required && (
          <span className="text-[#DB4444] ml-[2px]">
            *
          </span>
        )}
      </label>

      {children}

      {error && (
        <p className="mt-1.5 text-[12px] text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function SummaryRow({
  label,
  value,
  strong = false,
  valueClassName = '',
}) {
  return (
    <div
      className={`flex items-center justify-between py-3 ${
        strong
          ? 'text-black font-medium'
          : 'text-black'
      }`}
    >
      <span className="text-[14px]">{label}</span>

      <span
        className={`text-[14px] ${valueClassName}`}
      >
        {value}
      </span>
    </div>
  );
}

function PaymentOption({
  id,
  value,
  checked,
  onChange,
  title,
  children,
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-3 cursor-pointer"
    >
      <span className="relative flex items-center justify-center shrink-0">
        <input
          id={id}
          type="radio"
          name="paymentMethod"
          value={value}
          checked={checked}
          onChange={() => onChange(value)}
          className="sr-only peer"
        />

        <span className="w-[19px] h-[19px] rounded-full border border-black flex items-center justify-center peer-checked:border-black">
          {checked && (
            <span className="w-[11px] h-[11px] rounded-full bg-black" />
          )}
        </span>
      </span>

      <span className="text-[14px] text-black">
        {title}
      </span>

      {children}
    </label>
  );
}

function PaymentBadge({ text }) {
  return (
    <span className="text-[8px] sm:text-[9px] font-bold tracking-tight text-gray-500">
      {text}
    </span>
  );
}

function inputClass(error) {
  return `
    w-full
    h-[44px]
    bg-[#F5F5F5]
    border
    ${error ? 'border-red-500' : 'border-transparent'}
    rounded-[3px]
    px-4
    text-[14px]
    text-black
    outline-none
    transition-all
    focus:bg-white
    focus:border-gray-300
    focus:ring-0
  `;
}