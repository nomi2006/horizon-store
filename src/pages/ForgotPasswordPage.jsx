import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'

import TopBar from '../components/TopBar'
import { useAuth } from '../context/AuthContext'

const schema = z.object({
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address'),
})

export function ForgotPasswordPage() {
  const { resetPassword } = useAuth()

  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async ({ email }) => {
    setLoading(true)

    try {
      const { error } =
        await resetPassword(email)

      if (error) {
        console.error(
          'Password reset error:',
          error
        )

        toast.error(error.message)
        return
      }

      setSent(true)

      toast.success(
        'Password reset email sent.'
      )
    } catch (error) {
      console.error(
        'Password reset error:',
        error
      )

      toast.error(
        'Unable to send reset email.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <TopBar />

      <main className="flex min-h-[calc(100vh-36px)] items-center justify-center px-5 py-16">
        <div className="w-full max-w-[470px]">

          <div className="mb-10 text-center">
            <h1
              className="text-[34px] font-medium leading-tight sm:text-[38px]"
              style={{
                fontFamily:
                  'Inter, sans-serif',
              }}
            >
              Forgot Password?
            </h1>

            <p
              className="mt-4 text-[15px] leading-6 text-[#7D7D7D]"
              style={{
                fontFamily:
                  'Poppins, sans-serif',
              }}
            >
              Enter your email address and
              we'll send you a link to reset
              your password.
            </p>
          </div>

          {!sent ? (
            <form
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="mb-8">
                <input
                  {...register('email')}
                  type="email"
                  placeholder="Email Address"
                  autoComplete="email"
                  className="w-full border-0 border-b border-[#7D7D7D] bg-transparent px-0 pb-3 text-[16px] text-black outline-none placeholder:text-[#7D7D7D] focus:border-black"
                  style={{
                    fontFamily:
                      'Poppins, sans-serif',
                  }}
                />

                {errors.email && (
                  <p className="mt-2 text-[12px] text-[#DB4444]">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="h-[56px] w-full rounded-[4px] bg-[#DB4444] text-[16px] font-medium text-white transition-colors hover:bg-[#C73636] disabled:cursor-not-allowed disabled:opacity-70"
                style={{
                  fontFamily:
                    'Poppins, sans-serif',
                }}
              >
                {loading
                  ? 'Sending...'
                  : 'Send Reset Link'}
              </button>

              <div className="mt-7 text-center">
                <Link
                  to="/login"
                  className="text-[14px] text-[#DB4444] hover:text-[#C73636]"
                >
                  ← Back to Login
                </Link>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#FDECEC]">
                <span className="text-2xl">
                  ✉
                </span>
              </div>

              <h2
                className="text-[22px] font-medium"
                style={{
                  fontFamily:
                    'Inter, sans-serif',
                }}
              >
                Check your email
              </h2>

              <p
                className="mt-3 text-[14px] leading-6 text-[#7D7D7D]"
                style={{
                  fontFamily:
                    'Poppins, sans-serif',
                }}
              >
                If an account exists for
                that email, you'll receive
                a password reset link.
              </p>

              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-7 text-[14px] text-[#DB4444]"
              >
                Try another email
              </button>

              <div className="mt-4">
                <Link
                  to="/login"
                  className="text-[14px] text-black underline underline-offset-4"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}