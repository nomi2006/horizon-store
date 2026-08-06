import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, Phone, MapPin, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../services/supabase'
import toast from 'react-hot-toast'

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional()
})

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
})

export function ProfilePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.user_metadata?.full_name || '',
      phone: user?.user_metadata?.phone || '',
      address: user?.user_metadata?.address || '',
      city: user?.user_metadata?.city || '',
      state: user?.user_metadata?.state || '',
      zipCode: user?.user_metadata?.zipCode || '',
      country: user?.user_metadata?.country || ''
    }
  })

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword
  } = useForm({
    resolver: zodResolver(passwordSchema)
  })

  const onSubmitProfile = async (data) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: data.fullName,
          phone: data.phone,
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country
        }
      })
      if (error) throw error
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error(error.message || 'Failed to update profile')
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
      if (error) throw error
      toast.success('Password updated successfully!')
      resetPassword()
      setShowPasswordForm(false)
    } catch (error) {
      toast.error(error.message || 'Failed to update password')
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <div className="container-custom py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Profile Settings
        </h1>

        <div className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700 p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {user?.user_metadata?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {user?.user_metadata?.full_name || 'User'}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmitProfile)} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input {...register('fullName')} className="input-field pl-10" />
              </div>
              {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="label">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input {...register('phone')} className="input-field pl-10" />
              </div>
            </div>

            <div>
              <label className="label">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input {...register('address')} className="input-field pl-10" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">City</label>
                <input {...register('city')} className="input-field" />
              </div>
              <div>
                <label className="label">State</label>
                <input {...register('state')} className="input-field" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">ZIP Code</label>
                <input {...register('zipCode')} className="input-field" />
              </div>
              <div>
                <label className="label">Country</label>
                <input {...register('country')} className="input-field" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>

        {/* Password Change */}
        <div className="bg-white dark:bg-dark-900 rounded-xl border border-gray-200 dark:border-dark-700 p-6">
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="flex items-center gap-2 text-left w-full"
          >
            <Lock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="font-semibold text-gray-900 dark:text-white">
              Change Password
            </span>
          </button>

          {showPasswordForm && (
            <form onSubmit={handlePasswordSubmit(onSubmitPassword)} className="mt-4 space-y-4">
              <div>
                <label className="label">Current Password</label>
                <input
                  type="password"
                  {...registerPassword('currentPassword')}
                  className="input-field"
                />
                {passwordErrors.currentPassword && (
                  <p className="text-red-600 text-sm mt-1">{passwordErrors.currentPassword.message}</p>
                )}
              </div>
              <div>
                <label className="label">New Password</label>
                <input
                  type="password"
                  {...registerPassword('newPassword')}
                  className="input-field"
                />
                {passwordErrors.newPassword && (
                  <p className="text-red-600 text-sm mt-1">{passwordErrors.newPassword.message}</p>
                )}
              </div>
              <div>
                <label className="label">Confirm Password</label>
                <input
                  type="password"
                  {...registerPassword('confirmPassword')}
                  className="input-field"
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1">{passwordErrors.confirmPassword.message}</p>
                )}
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex-1 btn-primary"
                >
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}