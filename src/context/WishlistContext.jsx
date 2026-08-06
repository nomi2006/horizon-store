import React, { createContext, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('horizon-wishlist')
    if (saved) {
      try { setItems(JSON.parse(saved)) } catch { localStorage.removeItem('horizon-wishlist') }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('horizon-wishlist', JSON.stringify(items))
  }, [items])

  const addItem = (product) => {
    if (!items.find(i => i.id === product.id)) {
      setItems([...items, product])
      toast.success(`${product.name} added to wishlist`)
    }
  }

  const removeItem = (id) => {
    const item = items.find(i => i.id === id)
    setItems(items.filter(i => i.id !== id))
    toast.success(`${item?.name || 'Item'} removed from wishlist`)
  }

  const isInWishlist = (id) => items.some(i => i.id === id)
  const clearWishlist = () => { setItems([]); toast.success('Wishlist cleared') }

  const value = { items, count: items.length, addItem, removeItem, isInWishlist, clearWishlist }
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used within WishlistProvider')
  return context
}