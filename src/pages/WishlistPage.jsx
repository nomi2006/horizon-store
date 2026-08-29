import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShoppingCart,
  Trash2,
  Eye,
  Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'

import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { productService } from '../services/productService'

import TopBar from '../components/TopBar'
import Navbar from '../components/Navbar'

const getProductImage = (product) => {
  if (typeof product?.image === 'string' && product.image.trim()) {
    return product.image.trim()
  }

  if (
    typeof product?.image_url === 'string' &&
    product.image_url.trim()
  ) {
    return product.image_url.trim()
  }

  if (
    typeof product?.imageUrl === 'string' &&
    product.imageUrl.trim()
  ) {
    return product.imageUrl.trim()
  }

  if (Array.isArray(product?.images) && product.images.length > 0) {
    const firstImage = product.images[0]

    if (typeof firstImage === 'string') {
      return firstImage
    }

    if (firstImage?.url) {
      return firstImage.url
    }
  }

  return '/placeholder.jpg'
}

const getProductPrice = (product) => {
  const price =
    product?.price ??
    product?.price_dzd ??
    0

  return Number(price) || 0
}

const getOriginalPrice = (product) => {
  const originalPrice =
    product?.originalPrice ??
    product?.compare_at_price_dzd ??
    product?.compare_at_price ??
    null

  return originalPrice ? Number(originalPrice) : null
}

const getDiscount = (product) => {
  const originalPrice = getOriginalPrice(product)
  const price = getProductPrice(product)

  if (!originalPrice || originalPrice <= price) {
    return 0
  }

  return Math.round(
    ((originalPrice - price) / originalPrice) * 100
  )
}

const getRating = (product) => {
  const rating = Number(product?.rating)

  if (rating > 0) {
    return Math.min(5, rating)
  }

  return 4
}

const getReviewCount = (product) => {
  const count =
    product?.reviewCount ??
    product?.review_count

  return Number(count) > 0 ? Number(count) : 65
}

/* WISHLIST PRODUCT CARD */

function WishlistProductCard({
  product,
  onRemove,
  onAddToCart
}) {
  const image = getProductImage(product)
  const price = getProductPrice(product)
  const originalPrice = getOriginalPrice(product)
  const discount = getDiscount(product)

  return (
    <div className="w-full min-w-0">

      {/* Image */}
      <div className="relative w-full aspect-[270/250] bg-[#F5F5F5] rounded-[4px] overflow-hidden">

        {/* Sale Badge */}
        {discount > 0 && (
          <span
            className="
              absolute
              top-[10px]
              left-[10px]
              z-10
              inline-flex
              items-center
              justify-center
              h-[28px]
              px-[10px]
              rounded-[4px]
              bg-[#DB4444]
              text-white
              text-[12px]
              font-medium
            "
          >
            -{discount}%
          </span>
        )}

        {/* Remove */}
        <button
          type="button"
          onClick={() => onRemove(product.id)}
          className="
            absolute
            top-[10px]
            right-[10px]
            z-10
            w-[34px]
            h-[34px]
            rounded-full
            bg-white
            flex
            items-center
            justify-center
            text-black
            shadow-sm
            hover:bg-gray-100
            transition-colors
          "
          aria-label={`Remove ${product.name} from wishlist`}
        >
          <Trash2
            size={18}
            strokeWidth={1.7}
          />
        </button>

        {/* Product Image */}
        <Link
          to={`/product/${product.slug || product.id}`}
          className="absolute inset-0 flex items-center justify-center"
        >
          <img
            src={image}
            alt={product.name}
            className="
              w-[78%]
              h-[78%]
              object-contain
              mix-blend-multiply
              transition-transform
              duration-300
              hover:scale-105
            "
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src = '/placeholder.jpg'
            }}
          />
        </Link>

        {/* Add To Cart */}
        <button
          type="button"
          onClick={() => onAddToCart(product)}
          className="
            absolute
            bottom-0
            left-0
            right-0
            h-[40px]
            bg-black
            text-white
            text-[13px]
            font-medium
            flex
            items-center
            justify-center
            gap-[7px]
            hover:bg-[#222]
            transition-colors
          "
        >
          <ShoppingCart size={16} />
          Add To Cart
        </button>
      </div>

      {/* Product Information */}
      <div className="pt-[13px]">

        <Link
          to={`/product/${product.slug || product.id}`}
          className="
            block
            text-[14px]
            leading-[20px]
            font-medium
            text-black
            truncate
            hover:text-[#DB4444]
            transition-colors
          "
        >
          {product.name}
        </Link>

        <div className="flex items-center gap-[8px] mt-[5px]">

          <span className="text-[14px] leading-[20px] font-medium text-[#DB4444]">
            ${price.toFixed(0)}
          </span>

          {originalPrice && originalPrice > price && (
            <span className="text-[13px] leading-[20px] text-[#7D7D7D] line-through">
              ${originalPrice.toFixed(0)}
            </span>
          )}

        </div>
      </div>
    </div>
  )
}

function RecommendationCard({ product, onAddToCart }) {
  const image = getProductImage(product)
  const price = getProductPrice(product)
  const originalPrice = getOriginalPrice(product)
  const discount = getDiscount(product)
  const rating = getRating(product)
  const reviewCount = getReviewCount(product)

  const isNew =
    product?.isNew === true ||
    product?.is_new === true

  return (
    <Link
      to={`/product/${product.slug || product.id}`}
      className="
        block
        group
        w-full
        max-w-[270px]
        mx-auto
      "
    >

      {/* Image */}
      <div
        className="
          relative
          w-full
          h-[250px]
          rounded-[4px]
          bg-[#F5F5F5]
          overflow-hidden
        "
      >

        {/* Sale / New */}
        {(discount > 0 || isNew) && (
          <div className="absolute top-[10px] left-[10px] z-10">

            {isNew ? (
              <span
                className="
                  inline-flex
                  items-center
                  justify-center
                  h-[28px]
                  px-[10px]
                  rounded-[4px]
                  bg-[#00A53C]
                  text-white
                  text-[12px]
                  font-medium
                "
              >
                NEW
              </span>
            ) : (
              <span
                className="
                  inline-flex
                  items-center
                  justify-center
                  h-[28px]
                  px-[10px]
                  rounded-[4px]
                  bg-[#DB4444]
                  text-white
                  text-[12px]
                  font-medium
                "
              >
                -{discount}%
              </span>
            )}

          </div>
        )}

        {/* View Button */}
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
          }}
          className="
            absolute
            top-[10px]
            right-[10px]
            z-10
            w-[34px]
            h-[34px]
            rounded-full
            bg-white
            flex
            items-center
            justify-center
            text-black
            shadow-sm
            hover:bg-gray-100
            transition-colors
          "
          aria-label="View product"
        >
          <Eye
            size={18}
            strokeWidth={1.7}
          />
        </button>

        {/* Product Image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={image}
            alt={product.name}
            className="
              w-[72%]
              h-[72%]
              object-contain
              mix-blend-multiply
              transition-transform
              duration-300
              group-hover:scale-105
            "
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src = '/placeholder.jpg'
            }}
          />
        </div>

        {/* Add To Cart */}
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            onAddToCart(product)
          }}
          className="
            absolute
            bottom-0
            left-0
            right-0
            h-[40px]
            bg-black
            text-white
            text-[13px]
            font-medium
            flex
            items-center
            justify-center
            gap-[7px]
            opacity-0
            group-hover:opacity-100
            transition-opacity
            duration-200
          "
        >
          <ShoppingCart size={16} />
          Add To Cart
        </button>

      </div>

      {/* Details */}
      <div className="pt-[13px]">

        <h3
          className="
            text-[14px]
            leading-[20px]
            font-medium
            text-black
            truncate
          "
        >
          {product.name}
        </h3>

        <div className="flex items-center gap-[8px] mt-[5px]">

          <span className="text-[14px] leading-[20px] font-medium text-[#DB4444]">
            ${price.toFixed(0)}
          </span>

          {originalPrice && originalPrice > price && (
            <span className="text-[13px] leading-[20px] text-[#7D7D7D] line-through">
              ${originalPrice.toFixed(0)}
            </span>
          )}

        </div>

        {/* Rating */}
        <div className="flex items-center gap-[7px] mt-[3px]">

          <div
            className="flex items-center gap-[2px]"
            aria-label={`Rating ${rating} out of 5`}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`
                  text-[15px]
                  leading-[18px]
                  ${
                    rating >= star
                      ? 'text-[#FFAD33]'
                      : 'text-[#D9D9D9]'
                  }
                `}
              >
                ★
              </span>
            ))}
          </div>

          <span className="text-[12px] leading-[16px] text-[#7D7D7D]">
            ({reviewCount})
          </span>

        </div>

      </div>
    </Link>
  )
}

export function WishlistPage() {
  const {
    items,
    removeItem,
    clearWishlist
  } = useWishlist()

  const { addToCart } = useCart()

  const [recommendedProducts, setRecommendedProducts] = useState([])
  const [loadingRecommendations, setLoadingRecommendations] = useState(true)

  useEffect(() => {
    let mounted = true

    const loadRecommendations = async () => {
      setLoadingRecommendations(true)

      try {
        const { data, error } =
          await productService.getAll({
            sort: 'rating'
          })

        if (error) {
          throw error
        }

        if (!mounted) return

        const wishlistIds = new Set(
          items.map((item) => String(item.id))
        )

        const availableProducts = (data || []).filter(
          (product) =>
            !wishlistIds.has(String(product.id))
        )

        setRecommendedProducts(
          availableProducts.slice(0, 4)
        )
      } catch (error) {
        console.error(
          'Failed to load recommendations:',
          error
        )

        if (mounted) {
          setRecommendedProducts([])
        }
      } finally {
        if (mounted) {
          setLoadingRecommendations(false)
        }
      }
    }

    loadRecommendations()

    return () => {
      mounted = false
    }
  }, [items])

  const handleAddToCart = (product) => {
    try {
      addToCart(product, 1)

      toast.success(
        `${product.name} added to cart`
      )
    } catch (error) {
      console.error(
        'Failed to add product to cart:',
        error
      )

      toast.error(
        'Unable to add this product to cart'
      )
    }
  }

  const handleMoveAllToBag = () => {
    if (items.length === 0) {
      toast('Your wishlist is empty')
      return
    }

    items.forEach((item) => {
      addToCart(item, 1)
    })

    toast.success(
      `${items.length} ${items.length === 1 ? 'item' : 'items'} moved to bag`
    )

    clearWishlist()
  }

  const wishlistCount = items.length

  const recommendationCards = useMemo(() => {
    return recommendedProducts.slice(0, 4)
  }, [recommendedProducts])

  return (
    <div className="min-h-screen bg-white">

      <TopBar />
      <Navbar />

      <main className="max-w-[1170px] mx-auto px-4 sm:px-6 lg:px-0">
        <section className="pt-[68px]">
          <div className="flex items-center justify-between">
            <h1 className="text-[20px] sm:text-[22px] leading-[28px] font-medium text-black">
              Wishlist ({wishlistCount})
            </h1>

            <button
              type="button"
              onClick={handleMoveAllToBag}
              disabled={wishlistCount === 0}
              className="
                h-[48px]
                px-[28px]
                sm:px-[34px]
                border
                border-[#7D7D7D]
                rounded-[4px]
                bg-white
                text-black
                text-[14px]
                font-medium
                hover:bg-black
                hover:text-white
                hover:border-black
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition-colors
              "
            >
              Move All To Bag
            </button>
          </div>
        </section>

        <section className="pt-[58px]">

          {wishlistCount > 0 ? (
            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-4
                gap-x-[24px]
                gap-y-[40px]
              "
            >
              {items.map((item) => (
                <WishlistProductCard
                  key={item.id}
                  product={item}
                  onRemove={removeItem}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="py-[55px] text-center">
              <h2 className="text-[20px] font-medium text-black">
                Your wishlist is empty
              </h2>

              <p className="mt-2 text-[14px] text-[#7D7D7D]">
                Save products you love and find them here later.
              </p>

              <Link
                to="/shop"
                className="
                  inline-flex
                  items-center
                  justify-center
                  mt-6
                  h-[46px]
                  px-7
                  rounded-[4px]
                  bg-black
                  text-white
                  text-[14px]
                  font-medium
                  hover:bg-[#222]
                  transition-colors
                "
              >
                Browse Products
              </Link>
            </div>
          )}

        </section>

        <section className="pt-[72px] pb-[110px]">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-[48px]">
            <div className="flex items-center gap-[14px]">
              <span className="w-[12px] h-[32px] rounded-[4px] bg-[#DB4444]" />
              <h2 className="text-[20px] sm:text-[22px] leading-[28px] font-medium text-black">
                Just For You
              </h2>
            </div>

            <Link
              to="/shop"
              className="
                h-[44px]
                min-w-[116px]
                px-5
                border
                border-[#7D7D7D]
                rounded-[4px]
                flex
                items-center
                justify-center
                text-[14px]
                font-medium
                text-black
                hover:bg-black
                hover:text-white
                hover:border-black
                transition-colors
              "
            >
              See All
            </Link>
          </div>

          {/* Recommendations */}
          {loadingRecommendations ? (
            <div className="min-h-[350px] flex items-center justify-center">
              <Loader2
                className="w-7 h-7 animate-spin text-gray-400"
              />
            </div>
          ) : recommendationCards.length > 0 ? (
            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-4
                gap-x-[24px]
                gap-y-[40px]
              "
            >
              {recommendationCards.map((product) => (
                <RecommendationCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-[14px] text-gray-500">
              No recommendations available right now.
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default WishlistPage