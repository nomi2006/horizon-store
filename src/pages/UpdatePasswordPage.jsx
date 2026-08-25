import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

import TopBar from '../components/TopBar';
import { supabase } from '../services/supabase';

const schema = z
  .object({
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    }
  );

export function UpdatePasswordPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast.error(
          'This password reset link is invalid or has expired.'
        );

        navigate('/forgot-password', {
          replace: true,
        });

        return;
      }

      setReady(true);
    };

    checkSession();
  }, [navigate]);

  const onSubmit = async ({ password }) => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Password updated successfully!');

      await supabase.auth.signOut();

      navigate('/login', {
        replace: true,
      });
    } catch (error) {
      console.error('Update password error:', error);

      toast.error(
        'Unable to update your password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-white">
        <TopBar />

        <div className="flex min-h-[70vh] items-center justify-center">
          <p className="text-sm text-gray-500">
            Verifying reset link...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <TopBar />

      <main className="min-h-[calc(100vh-36px)] flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-[470px]">

          <div className="text-center mb-10">
            <h1
              className="text-[34px] sm:text-[38px] font-medium"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Set New Password
            </h1>

            <p
              className="mt-4 text-[15px] text-[#7D7D7D]"
              style={{ fontFamily: 'Poppins, sans-serif' }}
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
                type="password"
                {...register('password')}
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
                type="password"
                {...register('confirmPassword')}
                placeholder="Confirm New Password"
                autoComplete="new-password"
                className="w-full border-0 border-b border-[#7D7D7D] bg-transparent px-0 pb-3 text-[16px] outline-none placeholder:text-[#7D7D7D] focus:border-black"
              />

              {errors.confirmPassword && (
                <p className="mt-2 text-[12px] text-[#DB4444]">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="h-[52px] w-full rounded-[4px] bg-[#DB4444] text-white hover:bg-[#C73636] disabled:opacity-70"
            >
              {loading
                ? 'Updating...'
                : 'Update Password'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}