import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, Heart, ShoppingCart } from 'lucide-react';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;

    originalPrice?: number;

    image?: string;
    image_url?: string;
    imageUrl?: string;
    images?: string[];
    rating?: number;
    reviewCount?: number;
    review_count?: number;

    discountPercentage?: number;
    isNew?: boolean;
    slug?: string;
  };

  showSaleBadge?: boolean;
  showNewBadge?: boolean;
  className?: string;
}

const productRatings: Record<
  string,
  {
    rating: number;
    reviewCount: number;
  }
> = {
  'D-Smart Watch': {
    rating: 5,
    reviewCount: 124,
  },

  'Leather Strap Collection': {
    rating: 4,
    reviewCount: 86,
  },

  'Luxury Chronograph Watch': {
    rating: 5,
    reviewCount: 156,
  },

  'Smart Watch Pro': {
    rating: 4,
    reviewCount: 98,
  },

  'Canvas Messenger Bag': {
    rating: 3,
    reviewCount: 72,
  },

  'Minimalist Classic Watch': {
    rating: 5,
    reviewCount: 143,
  },

  'Sport Chronograph Watch': {
    rating: 4,
    reviewCount: 67,
  },

  'Smart Watch': {
    rating: 5,
    reviewCount: 189,
  },
};

const defaultRating = {
  rating: 4,
  reviewCount: 50,
};

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showSaleBadge = false,
  showNewBadge = false,
  className = '',
}) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const [isAddingToCart, setIsAddingToCart] =
    useState(false);

  const [isWishlistLoading, setIsWishlistLoading] =
    useState(false);

  // PRODUCT IMAGE LOGIC
  const getProductImage = (): string | null => {
    if (
      typeof product.image === 'string' &&
      product.image.trim()
    ) {
      return product.image.trim();
    }

    if (
      typeof product.image_url === 'string' &&
      product.image_url.trim()
    ) {
      return product.image_url.trim();
    }

    if (
      typeof product.imageUrl === 'string' &&
      product.imageUrl.trim()
    ) {
      return product.imageUrl.trim();
    }

    if (
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      const firstImage = product.images[0];

      if (
        typeof firstImage === 'string' &&
        firstImage.trim()
      ) {
        return firstImage.trim();
      }
    }

    return null;
  };

  const imageUrl = getProductImage();

  // WISHLIST LOGIC
  const isWishlisted = isInWishlist(product.id);

  const handleWishlistToggle = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    if (isWishlistLoading) {
      return;
    }

    setIsWishlistLoading(true);

    try {
      if (isWishlisted) {
        removeItem(product.id);
      } else {
        addItem(product);
      }
    } catch (error) {
      console.error(
        'Error updating wishlist:',
        error
      );
    } finally {
      setIsWishlistLoading(false);
    }
  };

  // ADD TO CART LOGIC
  const handleAddToCart = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAddingToCart(true);

    try {
      await addToCart(product, 1);
    } catch (error) {
      console.error(
        'Error adding to cart:',
        error
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  // DISCOUNT LOGIC
  const discountPercentage =
    product.discountPercentage ||
    (product.originalPrice
      ? Math.round(
          ((product.originalPrice - product.price) /
            product.originalPrice) *
            100
        )
      : 0);

  const fallbackRating =
    productRatings[product.name] ||
    defaultRating;

  const rating =
    typeof product.rating === 'number' &&
    product.rating > 0
      ? Math.min(5, product.rating)
      : fallbackRating.rating;

  const reviewCount =
    typeof product.reviewCount === 'number' &&
    product.reviewCount > 0
      ? product.reviewCount
      : typeof product.review_count === 'number' &&
        product.review_count > 0
        ? product.review_count
        : fallbackRating.reviewCount;

  return (
    <Link
      to={`/product/${product.slug || product.id}`}
      className={`
        block
        group
        w-full
        max-w-[270px]
        h-[350px]
        mx-auto
        ${className}
      `}
    >
      {/* IMAGE AREA */}
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
        {/* SALE / NEW BADGE */}
        {(showSaleBadge && discountPercentage > 0) ||
        showNewBadge ? (
          <div
            className="
              absolute
              top-[12px]
              left-[12px]
              z-20
            "
          >
            {showNewBadge ? (
              <span
                className="
                  inline-flex
                  items-center
                  justify-center
                  px-[10px]
                  h-[28px]
                  rounded-[4px]
                  bg-[#00A53C]
                  text-white
                  text-[12px]
                  leading-[16px]
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
                  px-[10px]
                  h-[28px]
                  rounded-[4px]
                  bg-[#DB4444]
                  text-white
                  text-[12px]
                  leading-[16px]
                  font-medium
                "
              >
                -{discountPercentage}%
              </span>
            )}
          </div>
        ) : null}

        {/* WISHLIST / VIEW BUTTONS */}
        <div
          className="
            absolute
            top-[12px]
            right-[12px]
            z-20
            flex
            flex-col
            gap-[8px]
          "
        >
          {/* Wishlist */}
          <button
            type="button"
            onClick={handleWishlistToggle}
            disabled={isWishlistLoading}
            className="
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
              duration-200
              disabled:opacity-50
            "
            aria-label={
              isWishlisted
                ? 'Remove from wishlist'
                : 'Add to wishlist'
            }
          >
            <Heart
              size={18}
              strokeWidth={1.7}
              fill={
                isWishlisted
                  ? '#DB4444'
                  : 'none'
              }
              className={
                isWishlisted
                  ? 'text-[#DB4444]'
                  : 'text-black'
              }
            />
          </button>

          {/* View */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              navigate(
                `/product/${product.slug || product.id}`
              );
            }}
            className="
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
              duration-200
            "
            aria-label="View product"
          >
            <Eye
              size={18}
              strokeWidth={1.7}
            />
          </button>
        </div>

        {/* PRODUCT IMAGE */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="
              absolute
              left-[40px]
              top-[35px]
              w-[190px]
              h-[180px]
              object-contain
              object-center
              mix-blend-multiply
              transition-transform
              duration-300
              group-hover:scale-105
            "
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display =
                'none';
            }}
          />
        ) : (
          <div
            className="
              absolute
              left-[40px]
              top-[35px]
              w-[190px]
              h-[180px]
              flex
              items-center
              justify-center
              text-[13px]
              text-gray-400
            "
          >
            No Image
          </div>
        )}

        {/* ADD TO CART */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="
            absolute
            bottom-0
            left-0
            right-0
            h-[40px]
            bg-black
            text-white
            text-[13px]
            leading-[18px]
            font-medium
            flex
            items-center
            justify-center
            gap-[7px]
            opacity-0
            group-hover:opacity-100
            transition-opacity
            duration-200
            disabled:opacity-50
          "
        >
          <ShoppingCart size={16} />

          {isAddingToCart
            ? 'Adding...'
            : 'Add To Cart'}
        </button>
      </div>

      {/* PRODUCT DETAILS AREA */}
      <div
        className="
          w-full
          h-[100px]
          pt-[14px]
        "
      >
        <h3
          className="
            !m-0
            !p-0
            !text-[14px]
            !leading-[20px]
            !font-medium
            !text-black
            truncate
          "
        >
          {product.name}
        </h3>

        <div
          className="
            flex
            items-center
            gap-[9px]
            mt-[5px]
          "
        >
          <span
            className="
              text-[14px]
              leading-[20px]
              font-medium
              text-[#DB4444]
            "
          >
            ${product.price.toFixed(0)}
          </span>

          {product.originalPrice &&
          product.originalPrice > product.price ? (
            <span
              className="
                text-[13px]
                leading-[20px]
                text-[#7D7D7D]
                line-through
              "
            >
              ${product.originalPrice.toFixed(0)}
            </span>
          ) : null}
        </div>

        <div
          className="
            flex
            items-center
            gap-[7px]
            mt-[3px]
          "
        >
          {/* STARS */}
          <div
            className="
              flex
              items-center
              gap-[2px]
              h-[18px]
            "
            aria-label={`Rating ${rating} out of 5`}
          >
            {[1, 2, 3, 4, 5].map(
              (star) => {
                const isFilled =
                  rating >= star;

                return (
                  <span
                    key={star}
                    className="
                      text-[15px]
                      leading-[18px]
                      inline-block
                    "
                  >
                    <span
                      className={
                        isFilled
                          ? 'text-[#FFAD33]'
                          : 'text-[#D9D9D9]'
                      }
                    >
                      ★
                    </span>
                  </span>
                );
              }
            )}
          </div>

          {/* REVIEW COUNT */}
          <span
            className="
              text-[12px]
              leading-[16px]
              text-[#7D7D7D]
            "
          >
            ({reviewCount})
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
