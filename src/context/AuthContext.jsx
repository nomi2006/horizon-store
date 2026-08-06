import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../services/supabase'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  const checkAdmin = async (userId) => {
    if (!userId) return;
    const cleanUserId = userId.trim();

    // console.log("🟡 Checking admin for user:", cleanUserId);

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', cleanUserId)
        .maybeSingle()

      if (error) {
        console.error("Supabase Error:", error);
        setIsAdmin(false);
        return;
      }

      if (data) {
        // console.log("🟢 Admin Data Found:", data);
        setIsAdmin(true);
      } else {
        // console.log("🔴 Not an admin (No record found)");
        setIsAdmin(false);
      }
    } catch (err) {
      console.error("Catch Block Error:", err);
      setIsAdmin(false);
    }
  }

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user)
        await checkAdmin(session.user.id)
      } else {
        setUser(null)
        setIsAdmin(false)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const value = { user, loading, isAdmin, signIn, signUp, signOut }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}