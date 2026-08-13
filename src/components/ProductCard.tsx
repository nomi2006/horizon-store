import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Heart, ShoppingCart } from 'lucide-react';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

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
    discountPercentage?: number;
    isNew?: boolean;
    slug?: string;
  };

  showSaleBadge?: boolean;
  showNewBadge?: boolean;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showSaleBadge = false,
  showNewBadge = false,
  className = '',
}) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [isAddingToCart, setIsAddingToCart] = useState(false);

  /*
   * PRODUCT IMAGE
   * Supports all existing image field formats without changing
   * the current API/database structure.
   */
  const getProductImage = (): string | null => {
    // 1. Standard image field
    if (
      typeof product.image === 'string' &&
      product.image.trim()
    ) {
      return product.image.trim();
    }

    // 2. Supabase image_url field
    if (
      typeof product.image_url === 'string' &&
      product.image_url.trim()
    ) {
      return product.image_url.trim();
    }

    // 3. camelCase imageUrl field
    if (
      typeof product.imageUrl === 'string' &&
      product.imageUrl.trim()
    ) {
      return product.imageUrl.trim();
    }

    // 4. Images array
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

  // ADD TO CART
  const handleAddToCart = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      return;
    }

    setIsAddingToCart(true);

    try {
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };
  // DISCOUNT
  const discountPercentage =
    product.discountPercentage ||
    (product.originalPrice
      ? Math.round(
        ((product.originalPrice - product.price) /
          product.originalPrice) *
        100
      )
      : 0);

  const rating = Math.round(product.rating || 0);

  return (
    <Link
      to={`/product/${product.slug || product.id}`}
      className={`
        block
        group
        w-[270px]
        h-[350px]
        flex-shrink-0
        ${className}
      `}
    >
      {/* ================= IMAGE AREA ================= */}
      <div
        className="
          relative
          w-[270px]
          h-[250px]
          rounded-[4px]
          bg-[#F5F5F5]
          overflow-hidden
          "
      >      
        {/* SALE/NEW BADGE */}
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
        {/* WISHLIST/VIEW BUTTON */}
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
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
            aria-label="Add to wishlist"
          >
            <Heart
              size={18}
              strokeWidth={1.7}
            />
          </button>

          {/* View */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
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
       {/* ================= PRODUCT IMAGE ================= */}
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
      e.currentTarget.style.display = 'none';
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
      {/* PRODUCT INFORMATION */}
      <div
        className="
          w-[270px]
          h-[100px]
          pt-[14px]
        "
      >
        {/* Product name */}
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
        {/* PRICE */}
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
        {/* RAITING */}
        {product.rating !== undefined ? (
          <div
            className="
              flex
              items-center
              gap-[7px]
              mt-[3px]
            "
          >
            <div
              className="
                flex
                items-center
                gap-[2px]
              "
            >
              {[0, 1, 2, 3, 4].map((index) => (
                <span
                  key={index}
                  className={`
                    text-[14px]
                    leading-none
                    ${index < rating
                      ? 'text-[#FFAD33]'
                      : 'text-[#D9D9D9]'
                    }
                  `}
                >
                  ★
                </span>
              ))}
            </div>

            {product.reviewCount !== undefined ? (
              <span
                className="
                  text-[12px]
                  leading-[16px]
                  text-[#7D7D7D]
                "
              >
                ({product.reviewCount})
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </Link>
  );
};

export default ProductCard;