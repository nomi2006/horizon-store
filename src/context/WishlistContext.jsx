import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import toast from 'react-hot-toast'
import { useAuth } from './AuthContext'

const WishlistContext = createContext()

const GUEST_WISHLIST_KEY = 'horizon-wishlist-guest'
const LEGACY_WISHLIST_KEY = 'horizon-wishlist'

const getUserWishlistKey = (userId) =>
  `horizon-wishlist-user-${userId}`

const readWishlist = (key) => {
  try {
    const saved = localStorage.getItem(key)

    if (!saved) {
      return []
    }

    const parsed = JSON.parse(saved)

    if (Array.isArray(parsed)) {
      return parsed
    }

    localStorage.removeItem(key)
    return []
  } catch (error) {
    console.warn(
      'Failed to parse wishlist from localStorage'
    )

    localStorage.removeItem(key)
    return []
  }
}

const readInitialGuestWishlist = () => {
  const guestWishlist = localStorage.getItem(
    GUEST_WISHLIST_KEY
  )

  if (guestWishlist) {
    return readWishlist(GUEST_WISHLIST_KEY)
  }

  // Migrate the old wishlist storage into the new
  // guest wishlist storage so existing wishlist items
  // are not lost.
  const legacyWishlist = localStorage.getItem(
    LEGACY_WISHLIST_KEY
  )

  if (legacyWishlist) {
    const migratedWishlist =
      readWishlist(LEGACY_WISHLIST_KEY)

    if (migratedWishlist.length > 0) {
      localStorage.setItem(
        GUEST_WISHLIST_KEY,
        JSON.stringify(migratedWishlist)
      )
    }

    localStorage.removeItem(LEGACY_WISHLIST_KEY)

    return migratedWishlist
  }

  return []
}

export function WishlistProvider({ children }) {
  const {
    user,
    loading: authLoading,
  } = useAuth()

  const storageKey = user?.id
    ? getUserWishlistKey(user.id)
    : GUEST_WISHLIST_KEY

  const [items, setItems] = useState([])
  const [loadedKey, setLoadedKey] = useState(null)

  // Load the correct wishlist whenever the authentication
  // state changes.
  useEffect(() => {
    if (authLoading) {
      return
    }

    let wishlistItems = []

    if (!user?.id && storageKey === GUEST_WISHLIST_KEY) {
      wishlistItems = readInitialGuestWishlist()
    } else {
      wishlistItems = readWishlist(storageKey)
    }

    setItems(wishlistItems)
    setLoadedKey(storageKey)
  }, [
    user?.id,
    authLoading,
    storageKey,
  ])

  // Save only after the correct storage key has been loaded.
  // This prevents the previous user's wishlist from being
  // accidentally written into the new user's storage.
  useEffect(() => {
    if (authLoading) {
      return
    }

    if (loadedKey !== storageKey) {
      return
    }

    localStorage.setItem(
      storageKey,
      JSON.stringify(items)
    )
  }, [
    items,
    storageKey,
    loadedKey,
    authLoading,
  ])

  const addItem = (product) => {
    setItems((currentItems) => {
      const alreadyExists = currentItems.some(
        (item) => item.id === product.id
      )

      if (alreadyExists) {
        return currentItems
      }

      toast.success(
        `${product.name} added to wishlist`
      )

      return [
        ...currentItems,
        product,
      ]
    })
  }

  const removeItem = (id) => {
    setItems((currentItems) => {
      const item = currentItems.find(
        (wishlistItem) => wishlistItem.id === id
      )

      if (item) {
        toast.success(
          `${item.name} removed from wishlist`
        )
      }

      return currentItems.filter(
        (wishlistItem) => wishlistItem.id !== id
      )
    })
  }

  const isInWishlist = (id) =>
    items.some(
      (item) => item.id === id
    )

  const clearWishlist = () => {
    setItems([])
    toast.success('Wishlist cleared')
  }

  const value = {
    items,
    count: items.length,
    addItem,
    removeItem,
    isInWishlist,
    clearWishlist,
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)

  if (!context) {
    throw new Error(
      'useWishlist must be used within WishlistProvider'
    )
  }

  return context
}