import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'

import TopBar from '../components/TopBar'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../services/supabase'

const schema = z
  .object({
    password: z
      .string()
      .min(
        6,
        'Password must be at least 6 characters'
      ),

    confirmPassword: z.string(),
  })
  .refine(
    (data) =>
      data.password === data.confirmPassword,
    {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }
  )

export function UpdatePasswordPage() {
  const navigate = useNavigate()

  const { updatePassword } = useAuth()

  const [checkingSession, setCheckingSession] =
    useState(true)

  const [loading, setLoading] =
    useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    const checkResetSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        toast.error(
          'Your password reset link is invalid or expired.'
        )

        navigate('/forgot-password', {
          replace: true,
        })

        return
      }

      setCheckingSession(false)
    }

    checkResetSession()
  }, [navigate])

  const onSubmit = async ({ password }) => {
    setLoading(true)

    try {
      const { error } =
        await updatePassword(password)

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success(
        'Password updated successfully!'
      )

      await supabase.auth.signOut()

      navigate('/login', {
        replace: true,
      })
    } catch (error) {
      console.error(
        'Update password error:',
        error
      )

      toast.error(
        'Unable to update your password.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-white">
        <TopBar />

        <div className="flex min-h-[70vh] items-center justify-center">
          <p className="text-sm text-gray-500">
            Verifying reset link...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <TopBar />

      <main className="flex min-h-[calc(100vh-36px)] items-center justify-center px-5 py-16">
        <div className="w-full max-w-[470px]">

          <div className="mb-10 text-center">
            <h1
              className="text-[34px] font-medium sm:text-[38px]"
              style={{
                fontFamily:
                  'Inter, sans-serif',
              }}
            >
              Set New Password
            </h1>

            <p
              className="mt-4 text-[15px] text-[#7D7D7D]"
              style={{
                fontFamily:
                  'Poppins, sans-serif',
              }}
            >
              Enter your new password below.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-7"
          >
            <div>
              <input
                {...register('password')}
                type="password"
                placeholder="New Password"
                autoComplete="new-password"
                className="w-full border-0 border-b border-[#7D7D7D] bg-transparent px-0 pb-3 text-[16px] outline-none placeholder:text-[#7D7D7D] focus:border-black"
              />

              {errors.password && (
                <p className="mt-2 text-[12px] text-[#DB4444]">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register(
                  'confirmPassword'
                )}
                type="password"
                placeholder="Confirm New Password"
                autoComplete="new-password"
                className="w-full border-0 border-b border-[#7D7D7D] bg-transparent px-0 pb-3 text-[16px] outline-none placeholder:text-[#7D7D7D] focus:border-black"
              />

              {errors.confirmPassword && (
                <p className="mt-2 text-[12px] text-[#DB4444]">
                  {
                    errors.confirmPassword
                      .message
                  }
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-[56px] w-full rounded-[4px] bg-[#DB4444] text-[16px] font-medium text-white hover:bg-[#C73636] disabled:opacity-70"
            >
              {loading
                ? 'Updating...'
                : 'Update Password'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}