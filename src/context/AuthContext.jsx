import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../services/supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const checkAdmin = async (userId) => {
    if (!userId) return

    const cleanUserId = userId.trim()

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', cleanUserId)
        .maybeSingle()

      if (error) {
        console.error('Supabase Error:', error)
        setIsAdmin(false)
        return
      }

      setIsAdmin(!!data)
    } catch (err) {
      console.error('Admin check error:', err)
      setIsAdmin(false)
    }
  }

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        setUser(session.user)
        await checkAdmin(session.user.id)
      } else {
        setUser(null)
        setIsAdmin(false)
      }

      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user)
          await checkAdmin(session.user.id)
        } else {
          setUser(null)
          setIsAdmin(false)
        }

        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

    return { data, error }
  }

  const signUp = async (
    email,
    password,
    fullName
  ) => {
    const { data, error } =
      await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

    return { data, error }
  }

  const resetPassword = async (email) => {
    const redirectTo =
      `${window.location.origin}/update-password`

    const { data, error } =
      await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo,
        }
      )

    return { data, error }
  }

  const updatePassword = async (password) => {
    const { data, error } =
      await supabase.auth.updateUser({
        password,
      })

    return { data, error }
  }

  const signOut = async () => {
    const { error } =
      await supabase.auth.signOut()

    return { error }
  }

  const value = {
    user,
    loading,
    isAdmin,
    signIn,
    signUp,
    resetPassword,
    updatePassword,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth must be used within AuthProvider'
    )
  }

  return context
}