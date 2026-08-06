import React from 'react'
import { Link } from 'react-router-dom'
import { 
  ClockIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon
} from '@heroicons/react/24/outline'
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Shop', href: '/shop' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Returns Policy', href: '/returns' }
  ]

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'Youtube' }
  ]

  return (
    <footer className="bg-white dark:bg-dark-900 border-t border-gray-200 dark:border-dark-700">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <ClockIcon className="h-7 w-7 text-primary-600" />
              <span className="text-xl font-bold text-primary-900 dark:text-white">Horizon</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Elevate your style with our premium collection of watches, accessories, and more.
            </p>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <EnvelopeIcon className="h-4 w-4" />
                <span>hello@horizon.com</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4" />
                <span>+1 (555) 000-0000</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4" />
                <span>123 Commerce St, New York, NY 10001</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Returns & Exchanges
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Newsletter</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Subscribe to get special offers, new arrivals, and exclusive discounts.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full rounded-lg border border-gray-300 dark:border-dark-600 px-4 py-2.5 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-700 outline-none transition-all"
              />
              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all"
              >
                Subscribe
              </button>
            </form>
            <div className="flex gap-3 mt-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-dark-800 hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-dark-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            &copy; {currentYear} Horizon. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-600 dark:text-gray-400">Payment Methods:</span>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-gray-100 dark:bg-dark-800 rounded text-xs font-medium text-gray-600 dark:text-gray-400">
                Visa
              </span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-dark-800 rounded text-xs font-medium text-gray-600 dark:text-gray-400">
                Mastercard
              </span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-dark-800 rounded text-xs font-medium text-gray-600 dark:text-gray-400">
                PayPal
              </span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-dark-800 rounded text-xs font-medium text-gray-600 dark:text-gray-400">
                Stripe
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}