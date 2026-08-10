import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Truck, RefreshCw, Headphones } from 'lucide-react'
import { productService } from '../services/productService'
import ProductCard from '../components/ProductCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import Navbar from '../components/Navbar'
// import { Footer } from '../components/Footer'
import CategorySidebar from '../components/CategorySidebar'
import CountdownTimer from '../components/CountdownTimer'
import MusicBanner from '../components/MusicBanner'
import NewArrival from '../components/NewArrival'
import TopBar from '../components/TopBar'
import FeaturesBar from '../components/FeaturesBar'

export function HomePage() {
  const [featured, setFeatured] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('HomePage mounted')
    const fetchData = async () => {
      try {
        const [featuredRes, bestRes] = await Promise.all([
          productService.getFeatured(),
          productService.getBestSellers()
        ])
        setFeatured(featuredRes.data || [])
        setBestSellers(bestRes.data || [])
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const features = [
    { icon: Truck, title: 'FREE AND FAST DELIVERY', description: 'Free delivery for all orders over $140' },
    { icon: Headphones, title: '24/7 CUSTOMER SERVICE', description: 'Friendly 24/7 customer support' },
    { icon: RefreshCw, title: 'MONEY BACK GUARANTEE', description: 'We return money within 30 days' }
  ]
  const categories = [
    { name: 'Phones', emoji: '📱' },
    { name: 'Computers', emoji: '💻' },
    { name: 'SmartWatch', emoji: '⌚' },
    { name: 'Camera', emoji: '📷' },
    { name: 'HeadPhones', emoji: '🎧' },
    { name: 'Gaming', emoji: '🎮' }
  ]

  console.log('Rendering HomePage with TopBar, MusicBanner, FeaturesBar')
  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Navbar />
      <main>
        {/* Hero Section with Sidebar */}
        <section className="bg-dark-DEFAULT text-white">
          <div className="container mx-auto px-4 py-8 md:py-12">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Category Sidebar */}
              <div className="hidden lg:block">
                <div className="border-r border-gray-700 pr-8">
                  <CategorySidebar />
                </div>
              </div>

              {/* Hero Content */}
              <div className="flex-1 bg-dark-light rounded-lg overflow-hidden relative">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col md:flex-row items-center justify-between p-6 md:p-12 lg:p-16"
                >
                  {/* Left Content */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="inline-block px-4 py-1 bg-primary-DEFAULT text-white text-xs font-semibold rounded mb-4">
                      New Arrival
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                      iPhone 14 Series
                    </h1>
                    <p className="text-base md:text-lg text-gray-300 mb-6">
                      Up to 10% off Voucher
                    </p>
                    <Link
                      to="/shop"
                      className="inline-flex items-center gap-2 text-white font-medium hover:text-primary-DEFAULT transition-colors border-b-2 border-primary-DEFAULT pb-1"
                    >
                      Shop Now →
                    </Link>
                  </div>
                 <div className="flex-1 mt-6 md:mt-0 md:ml-8">
                    <div className="relative max-w-sm mx-auto md:mx-0">
                      <img
                        src="https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600&h=600&fit=crop&crop=center"
                        alt="iPhone 14 Series"
                        className="w-full h-auto object-contain"
                        loading="eager"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/20 to-transparent pointer-events-none rounded-lg"></div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Flash Sales */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-dark-DEFAULT">
                  Flash Sales
                </h2>
                <p className="text-sm md:text-base text-gray-500 mt-1">Today's</p>
              </div>
              <div className="mt-4 md:mt-0">
                <CountdownTimer targetDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} />
              </div>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {featured.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Browse By Category */}
        <section className="py-12 md:py-16 border-t border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-dark-DEFAULT">
                  Browse By Category
                </h2>
              </div>
              <Link
                to="/shop"
                className="text-sm font-medium text-primary-DEFAULT hover:text-primary-dark transition-colors mt-2 md:mt-0 inline-flex items-center gap-1"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to={`/shop?category=${category.name.toLowerCase()}`}
                  className="group flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:border-primary-DEFAULT hover:bg-primary-DEFAULT/5 transition-all duration-200"
                >
                  <div className="text-3xl md:text-4xl text-gray-600 group-hover:text-primary-DEFAULT transition-colors">
                    {category.emoji}
                  </div>
                  <span className="text-sm md:text-base font-medium text-dark-DEFAULT mt-3 group-hover:text-primary-DEFAULT transition-colors">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Best Sellers */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-dark-DEFAULT">
                  Best Selling Products
                </h2>
                <p className="text-sm md:text-base text-gray-500 mt-1">Customer favorites you'll love</p>
              </div>
              <Link
                to="/shop"
                className="text-sm font-medium text-primary-DEFAULT hover:text-primary-dark transition-colors mt-2 md:mt-0 inline-flex items-center gap-1"
              >
                View All →
              </Link>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {bestSellers.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
        {/* Music Banner */}
        <MusicBanner />
        {/* New Arrival */}
        <NewArrival />
        {/* Features Bar */}
        <section className="py-12 md:py-16 border-t border-gray-200">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-dark-DEFAULT text-white rounded-full mb-4">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-dark-DEFAULT mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* <Footer /> */}
    </div>
  )
}