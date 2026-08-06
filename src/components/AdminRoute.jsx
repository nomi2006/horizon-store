import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LoadingSpinner } from './LoadingSpinner'

export function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth()
  // console.log("👀 AdminRoute check:", { loading, isAdmin, user });
  if (loading) return <LoadingSpinner />
  if (!user) {
    return <Navigate to="/login" replace />
  }
  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}