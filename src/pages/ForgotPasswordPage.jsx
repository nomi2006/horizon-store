import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

import TopBar from '../components/TopBar';
import { supabase } from '../services/supabase';

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Please enter a valid email address'),
});

export function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async ({ email }) => {
    setLoading(true);

    try {
      const redirectTo = `${window.location.origin}/update-password`;

      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo,
        }
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      setSent(true);
      toast.success('Password reset email sent!');
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error(
        'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <TopBar />

      <main className="min-h-[calc(100vh-36px)] flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-[470px]">

          {/* Heading */}
          <div className="text-center mb-10">
            <h1
              className="text-[34px] sm:text-[38px] font-medium leading-tight"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Forgot Password?
            </h1>

            <p
              className="mt-4 text-[15px] leading-6 text-[#7D7D7D]"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Enter your email address and we'll send you
              a link to reset your password.
            </p>
          </div>

          {!sent ? (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full"
            >
              {/* Email */}
              <div className="mb-8">
                <input
                  id="forgot-email"
                  type="email"
                  {...register('email')}
                  placeholder="Email Address"
                  autoComplete="email"
                  className="w-full border-0 border-b border-[#7D7D7D] bg-transparent px-0 pb-3 text-[16px] leading-6 text-black outline-none placeholder:text-[#7D7D7D] focus:border-black focus:ring-0"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
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
                className="h-[52px] w-full rounded-[4px] bg-[#DB4444] text-[15px] font-medium text-white transition-colors hover:bg-[#C73636] disabled:cursor-not-allowed disabled:opacity-70"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {loading
                  ? 'Sending...'
                  : 'Send Reset Link'}
              </button>

              <div className="mt-7 text-center">
                <Link
                  to="/login"
                  className="text-[14px] text-[#DB4444] hover:text-[#C73636]"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  ← Back to Login
                </Link>
              </div>
            </form>
          ) : (
            <div className="text-center">

              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#FDECEC]">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#DB4444"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect
                    width="20"
                    height="16"
                    x="2"
                    y="4"
                    rx="2"
                  />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>

              <h2
                className="text-[22px] font-medium"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Check your email
              </h2>

              <p
                className="mt-3 text-[14px] leading-6 text-[#7D7D7D]"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                If an account exists for that email,
                you'll receive a password reset link.
              </p>

              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-7 text-[14px] text-[#DB4444] hover:text-[#C73636]"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                Try another email
              </button>

              <div className="mt-4">
                <Link
                  to="/login"
                  className="text-[14px] text-black underline underline-offset-4"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}