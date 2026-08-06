import { loadStripe } from '@stripe/stripe-js'

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

if (!stripeKey) {
  throw new Error('Missing Stripe publishable key')
}

export const stripePromise = loadStripe(stripeKey)
