import React, { createContext, useContext, useReducer, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext()

const initialState = { items: [], total: 0, count: 0, isOpen: false }

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(item => item.id === action.payload.id)
      let updatedItems
      if (existing) {
        updatedItems = state.items.map(item =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
        )
        toast.success(`Quantity updated for ${action.payload.name}`)
      } else {
        updatedItems = [...state.items, { ...action.payload, quantity: 1 }]
        toast.success(`${action.payload.name} added to cart`)
      }
      return {
        ...state,
        items: updatedItems,
        count: updatedItems.reduce((s, i) => s + i.quantity, 0),
        total: updatedItems.reduce((s, i) => s + i.price * i.quantity, 0)
      }
    }
    case 'REMOVE_ITEM': {
      const item = state.items.find(i => i.id === action.payload)
      const updatedItems = state.items.filter(i => i.id !== action.payload)
      toast.success(`${item?.name || 'Item'} removed`)
      return {
        ...state,
        items: updatedItems,
        count: updatedItems.reduce((s, i) => s + i.quantity, 0),
        total: updatedItems.reduce((s, i) => s + i.price * i.quantity, 0)
      }
    }
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item
      )
      return {
        ...state,
        items: updatedItems,
        count: updatedItems.reduce((s, i) => s + i.quantity, 0),
        total: updatedItems.reduce((s, i) => s + i.price * i.quantity, 0)
      }
    }
    case 'CLEAR_CART':
      toast.success('Cart cleared')
      return initialState
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }
    case 'LOAD_CART':
      return { ...action.payload, isOpen: false }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  useEffect(() => {
    const saved = localStorage.getItem('horizon-cart')
    if (saved) {
      try {
        dispatch({ type: 'LOAD_CART', payload: JSON.parse(saved) })
      } catch {
        localStorage.removeItem('horizon-cart')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('horizon-cart', JSON.stringify({
      items: state.items,
      total: state.total,
      count: state.count
    }))
  }, [state.items, state.total, state.count])

  const addItem = (product) => dispatch({ type: 'ADD_ITEM', payload: product })
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id })
  const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })
  const toggleCart = () => dispatch({ type: 'TOGGLE_CART' })

  const value = { ...state, addItem, removeItem, updateQuantity, clearCart, toggleCart }
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}

export default CartContext;