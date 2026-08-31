import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  User,
  Mail,
  MapPin,
  Lock,
  Heart,
  Package,
  RotateCcw,
  XCircle,
  CreditCard,
  BookOpen,
  Save
} from 'lucide-react'

import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../services/supabase'
import toast from 'react-hot-toast'

import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'
// import Footer from '../components/Footer'

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  address: z.string().optional()
})

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
})

export function ProfilePage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)

  const fullName = user?.user_metadata?.full_name || ''

  const nameParts = fullName.trim().split(' ')

  const initialFirstName =
    user?.user_metadata?.first_name ||
    nameParts[0] ||
    ''

  const initialLastName =
    user?.user_metadata?.last_name ||
    nameParts.slice(1).join(' ') ||
    ''

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: initialFirstName,
      lastName: initialLastName,
      email: user?.email || '',
      address: user?.user_metadata?.address || ''
    }
  })

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors }
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  })

  // Keep form values synchronized with the authenticated user.
  useEffect(() => {
    if (!user) return

    const currentFullName = user.user_metadata?.full_name || ''
    const currentParts = currentFullName.trim().split(' ')

    reset({
      firstName:
        user.user_metadata?.first_name ||
        currentParts[0] ||
        '',
      lastName:
        user.user_metadata?.last_name ||
        currentParts.slice(1).join(' ') ||
        '',
      email: user.email || '',
      address: user.user_metadata?.address || ''
    })
  }, [user, reset])

  // Protect the page if someone directly visits /profile.
  useEffect(() => {
    if (user === null) {
      navigate('/login', { replace: true })
    }
  }, [user, navigate])

  if (!user) {
    return null
  }

  const displayName =
    user.user_metadata?.full_name ||
    `${initialFirstName} ${initialLastName}`.trim() ||
    'User'

  const onSubmitProfile = async (data) => {
    setLoading(true)

    try {
      const fullName = `${data.firstName} ${data.lastName}`.trim()

      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          first_name: data.firstName,
          last_name: data.lastName,
          address: data.address || ''
        }
      })

      if (error) {
        throw error
      }

      reset(data)

      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error(
        error?.message || 'Failed to update profile'
      )
    } finally {
      setLoading(false)
    }
  }

  const onSubmitPassword = async (data) => {
    setPasswordLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword
      })

      if (error) {
        throw error
      }

      toast.success('Password updated successfully!')

      resetPassword()
    } catch (error) {
      toast.error(
        error?.message || 'Failed to update password'
      )
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleCancelProfile = () => {
    reset({
      firstName: initialFirstName,
      lastName: initialLastName,
      email: user.email || '',
      address: user.user_metadata?.address || ''
    })

    toast('Changes discarded')
  }

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-[1170px] mx-auto px-4 sm:px-6 lg:px-0">
        <div className="flex items-center gap-3 pt-10 pb-8 text-sm">
          <Link
            to="/"
            className="text-gray-500 hover:text-gray-900 transition-colors"
          >
            Home
          </Link>

          <span className="text-gray-400">/</span>

          <span className="text-gray-900">
            My Account
          </span>
        </div>
      </div>

      {/* Welcome */}
      <main className="max-w-[1170px] mx-auto px-4 sm:px-6 lg:px-0 pb-20">
        <div className="flex justify-end mb-10">
          <h1 className="text-[24px] sm:text-[28px] font-semibold text-gray-900">
            Welcome!{' '}
            <span className="text-red-500">
              {displayName}
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-12">

          {/* LEFT SIDEBAR */}
          <aside className="w-full">

            {/* Manage My Account */}
            <div className="mb-8">
              <h2 className="text-[16px] font-semibold text-gray-900 mb-4">
                Manage My Account
              </h2>

              <nav className="flex flex-col gap-3 pl-4">
                <Link
                  to="/profile"
                  className={`text-[14px] transition-colors ${location.pathname === '/profile'
                    ? 'text-red-500 font-medium'
                    : 'text-gray-500 hover:text-gray-900'
                    }`}
                >
                  My Profile
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    toast('Address Book will be available soon.')
                  }
                  className="text-left text-[14px] text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Address Book
                </button>

                <button
                  type="button"
                  onClick={() =>
                    toast('Payment options will be available soon.')
                  }
                  className="text-left text-[14px] text-gray-500 hover:text-gray-900 transition-colors"
                >
                  My Payment Options
                </button>
              </nav>
            </div>

            {/* My Orders */}
            <div className="mb-8">
              <h2 className="text-[16px] font-semibold text-gray-900 mb-4">
                My Orders
              </h2>

              <nav className="flex flex-col gap-3 pl-4">
                <Link
                  to="/orders"
                  className="text-[14px] text-gray-500 hover:text-gray-900 transition-colors"
                >
                  My Orders
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    navigate('/orders')
                  }
                  className="text-left text-[14px] text-gray-500 hover:text-gray-900 transition-colors"
                >
                  My Returns
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate('/orders')
                  }
                  className="text-left text-[14px] text-gray-500 hover:text-gray-900 transition-colors"
                >
                  My Cancellations
                </button>
              </nav>
            </div>

            {/* Wishlist */}
            <div>
              <Link
                to="/wishlist"
                className="flex items-center gap-2 text-[16px] font-semibold text-gray-900 hover:text-red-500 transition-colors"
              >
                My WishList
              </Link>
            </div>
          </aside>

          {/* RIGHT CONTENT */}
          <section className="min-w-0">

            {/* Edit Your Profile */}
            <div className="bg-white rounded-[4px] shadow-[0_1px_13px_rgba(0,0,0,0.08)] p-6 sm:p-8 lg:p-10">

              <h2 className="text-[20px] font-semibold text-red-500 mb-8">
                Edit Your Profile
              </h2>

              <form
                onSubmit={handleSubmit(onSubmitProfile)}
              >

                {/* First + Last Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">

                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-[14px] font-medium text-gray-900 mb-2"
                    >
                      First Name
                    </label>

                    <input
                      id="firstName"
                      type="text"
                      {...register('firstName')}
                      className={`
                        w-full h-[50px]
                        px-4
                        bg-gray-100
                        border
                        rounded-[4px]
                        text-[14px]
                        text-gray-900
                        placeholder:text-gray-400
                        outline-none
                        transition-colors
                        ${errors.firstName
                          ? 'border-red-500'
                          : 'border-transparent focus:border-gray-300'
                        }
                      `}
                      placeholder="First Name"
                    />

                    {errors.firstName && (
                      <p className="mt-1 text-[12px] text-red-500">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-[14px] font-medium text-gray-900 mb-2"
                    >
                      Last Name
                    </label>

                    <input
                      id="lastName"
                      type="text"
                      {...register('lastName')}
                      className={`
                        w-full h-[50px]
                        px-4
                        bg-gray-100
                        border
                        rounded-[4px]
                        text-[14px]
                        text-gray-900
                        placeholder:text-gray-400
                        outline-none
                        transition-colors
                        ${errors.lastName
                          ? 'border-red-500'
                          : 'border-transparent focus:border-gray-300'
                        }
                      `}
                      placeholder="Last Name"
                    />

                    {errors.lastName && (
                      <p className="mt-1 text-[12px] text-red-500">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>

                </div>

                {/* Email + Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-[14px] font-medium text-gray-900 mb-2"
                    >
                      Email
                    </label>

                    <input
                      id="email"
                      type="email"
                      {...register('email')}
                      readOnly
                      className="
                        w-full h-[50px]
                        px-4
                        bg-gray-100
                        border border-transparent
                        rounded-[4px]
                        text-[14px]
                        text-gray-500
                        outline-none
                        cursor-not-allowed
                      "
                    />

                    {errors.email && (
                      <p className="mt-1 text-[12px] text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="address"
                      className="block text-[14px] font-medium text-gray-900 mb-2"
                    >
                      Address
                    </label>

                    <input
                      id="address"
                      type="text"
                      {...register('address')}
                      className="
                        w-full h-[50px]
                        px-4
                        bg-gray-100
                        border border-transparent
                        rounded-[4px]
                        text-[14px]
                        text-gray-900
                        placeholder:text-gray-400
                        outline-none
                        focus:border-gray-300
                        transition-colors
                      "
                      placeholder="Address"
                    />
                  </div>

                </div>

                {/* Password Changes */}
                <div className="pt-2">

                  <h3 className="text-[16px] font-medium text-gray-900 mb-5">
                    Password Changes
                  </h3>

                  <div className="space-y-4">

                    {/* Current Password */}
                    <div className="relative">
                      <input
                        type="password"
                        {...registerPassword('currentPassword')}
                        placeholder="Current Password"
                        className={`
                          w-full h-[50px]
                          px-4
                          bg-gray-100
                          border
                          rounded-[4px]
                          text-[14px]
                          text-gray-900
                          placeholder:text-gray-400
                          outline-none
                          transition-colors
                          ${passwordErrors.currentPassword
                            ? 'border-red-500'
                            : 'border-transparent focus:border-gray-300'
                          }
                        `}
                      />

                      <Lock
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                      />

                      {passwordErrors.currentPassword && (
                        <p className="mt-1 text-[12px] text-red-500">
                          {passwordErrors.currentPassword.message}
                        </p>
                      )}
                    </div>

                    {/* New Password */}
                    <div className="relative">
                      <input
                        type="password"
                        {...registerPassword('newPassword')}
                        placeholder="New Password"
                        className={`
                          w-full h-[50px]
                          px-4
                          bg-gray-100
                          border
                          rounded-[4px]
                          text-[14px]
                          text-gray-900
                          placeholder:text-gray-400
                          outline-none
                          transition-colors
                          ${passwordErrors.newPassword
                            ? 'border-red-500'
                            : 'border-transparent focus:border-gray-300'
                          }
                        `}
                      />

                      <Lock
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                      />

                      {passwordErrors.newPassword && (
                        <p className="mt-1 text-[12px] text-red-500">
                          {passwordErrors.newPassword.message}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                      <input
                        type="password"
                        {...registerPassword('confirmPassword')}
                        placeholder="Confirm New Password"
                        className={`
                          w-full h-[50px]
                          px-4
                          bg-gray-100
                          border
                          rounded-[4px]
                          text-[14px]
                          text-gray-900
                          placeholder:text-gray-400
                          outline-none
                          transition-colors
                          ${passwordErrors.confirmPassword
                            ? 'border-red-500'
                            : 'border-transparent focus:border-gray-300'
                          }
                        `}
                      />

                      <Lock
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                      />

                      {passwordErrors.confirmPassword && (
                        <p className="mt-1 text-[12px] text-red-500">
                          {passwordErrors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col-reverse sm:flex-row justify-end items-stretch sm:items-center gap-4 mt-8">

                  <button
                    type="button"
                    onClick={handleCancelProfile}
                    className="
                      px-8
                      h-[48px]
                      rounded-[4px]
                      text-[14px]
                      font-medium
                      text-gray-700
                      hover:text-gray-900
                      transition-colors
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      px-8
                      h-[48px]
                      rounded-[4px]
                      bg-red-500
                      hover:bg-red-600
                      disabled:bg-red-300
                      text-white
                      text-[14px]
                      font-medium
                      transition-colors
                      shadow-sm
                    "
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>

                </div>
              </form>

              {/* Password update form */}
              <div className="mt-8 pt-8 border-t border-gray-100">

                <div className="flex items-center gap-2 mb-4">
                  <Lock className="w-4 h-4 text-gray-500" />

                  <span className="text-[13px] text-gray-500">
                    Password changes are saved separately from your profile information.
                  </span>
                </div>

                <form
                  onSubmit={handlePasswordSubmit(onSubmitPassword)}
                  className="flex justify-end"
                >
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="
                      px-6
                      h-[42px]
                      rounded-[4px]
                      bg-gray-900
                      hover:bg-gray-800
                      disabled:bg-gray-400
                      text-white
                      text-[13px]
                      font-medium
                      transition-colors
                    "
                  >
                    {passwordLoading
                      ? 'Updating Password...'
                      : 'Update Password'}
                  </button>
                </form>

              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default ProfilePage

