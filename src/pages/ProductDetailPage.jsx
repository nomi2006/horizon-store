import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Heart, ShoppingCart, ChevronLeft, Minus, Plus, Truck, Shield, RefreshCw } from 'lucide-react'
import { productService } from '../services/productService'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { LoadingSpinner } from '../components/LoadingSpinner'
import ProductCard from '../components/ProductCard'
import toast from 'react-hot-toast'

export function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const { addItem } = useCart()
  const { addItem: addWishlist, removeItem: removeWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const { data } = await productService.getById(id)
      setProduct(data)
      if (data) {
        const { data: relatedData } = await productService.getRelated(data.id, data.category_id)
        setRelated(relatedData || [])
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (product.stock_quantity < quantity) {
      toast.error('Not enough stock available')
      return
    }
    addItem({ ...product, quantity })
    toast.success(`${product.name} added to cart`)
  }

  const handleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeWishlist(product.id)
    } else {
      addWishlist(product)
    }
  }

  if (loading) return <LoadingSpinner />

  if (!product) {
    return (
      <div className="container-custom py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Product not found</h2>
        <Link to="/shop" className="mt-4 inline-block text-primary-600 hover:text-primary-700">
          Return to shop
        </Link>
      </div>
    )
  }

  const images = product.images || ['/placeholder.jpg']
  const isWishlisted = isInWishlist(product.id)

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
        <Link to="/" className="hover:text-primary-600">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-primary-600">Shop</Link>
        <span>/</span>
        <span className="text-gray-900 dark:text-white truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-dark-800 mb-4">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-primary-600'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {product.name}
              </h1>
              {product.categories && (
                <Link
                  to={`/shop?category=${product.category_id}`}
                  className="text-sm text-primary-600 hover:text-primary-700 mt-1 inline-block"
                >
                  {product.categories.name}
                </Link>
              )}
            </div>
            <button
              onClick={handleWishlist}
              className="p-3 rounded-full bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
            >
              <Heart className={`h-6 w-6 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'}`} />
            </button>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating || 0)
                      ? 'fill-secondary-500 text-secondary-500'
                      : 'text-gray-300 dark:text-dark-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              ({product.reviews_count || 0} reviews)
            </span>
          </div>

          <div className="mt-6">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                ${product.price.toFixed(2)}
              </span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-lg text-gray-400 line-through">
                  ${product.compare_at_price.toFixed(2)}
                </span>
              )}
            </div>
            <div className="mt-2">
              <span className={`badge ${product.stock_quantity > 0 ? 'badge-success' : 'badge-danger'}`}>
                {product.stock_quantity > 0 ? `In Stock (${product.stock_quantity})` : 'Out of Stock'}
              </span>
            </div>
          </div>

          <p className="mt-6 text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
            {product.description}
          </p>

          {/* Quantity */}
          <div className="mt-8">
            <label className="label">Quantity</label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 dark:border-dark-600 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-l-lg transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
                <span className="w-12 text-center text-gray-900 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-dark-800 rounded-r-lg transition-colors"
                  disabled={product.stock_quantity && quantity >= product.stock_quantity}
                >
                  <Plus className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className="flex-1 btn-primary"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-200 dark:border-dark-700 pt-8">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Free Shipping</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Secure Payment</span>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 text-primary-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}