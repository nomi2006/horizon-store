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
    image: string;
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

  const handleAddToCart = async (
    e: React.MouseEvent
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

  const discountPercentage =
    product.discountPercentage ||
    (product.originalPrice
      ? Math.round(
          ((product.originalPrice - product.price) /
            product.originalPrice) *
            100
        )
      : 0);

  const imageUrl =
    product.image ||
    'https://via.placeholder.com/300x300?text=No+Image';

  const rating = Math.round(product.rating || 0);

  return (
    <Link
      to={`/product/${product.slug || product.id}`}
      className={`block group ${className}`}
    >
      {/* IMAGE */}
      <div className="relative w-full aspect-square bg-[#F5F5F5] overflow-hidden">

        {/* Discount */}
        {(showSaleBadge && discountPercentage > 0) ||
        showNewBadge ? (
          <div className="absolute top-[12px] left-[12px] z-10">
            {showNewBadge ? (
              <span className="
                inline-flex
                items-center
                justify-center
                px-[10px]
                h-[28px]
                rounded-[4px]
                bg-[#00A53C]
                text-white
                text-[12px]
                font-medium
              ">
                NEW
              </span>
            ) : (
              <span className="
                inline-flex
                items-center
                justify-center
                px-[10px]
                h-[28px]
                rounded-[4px]
                bg-[#DB4444]
                text-white
                text-[12px]
                font-medium
              ">
                -{discountPercentage}%
              </span>
            )}
          </div>
        ) : null}

        {/* ACTIONS */}
        <div className="
          absolute
          top-[12px]
          right-[12px]
          z-10
          flex
          flex-col
          gap-[8px]
        ">

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
            "
            aria-label="Add to wishlist"
          >
            <Heart size={18} strokeWidth={1.7} />
          </button>

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
            "
            aria-label="View product"
          >
            <Eye size={18} strokeWidth={1.7} />
          </button>

        </div>

        {/* PRODUCT IMAGE */}
        <img
          src={imageUrl}
          alt={product.name}
          className="
            w-full
            h-full
            object-contain
            p-[12px]
            transition-transform
            duration-300
            group-hover:scale-105
          "
          loading="lazy"
        />

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

      {/* INFO */}
      <div className="pt-[14px]">

        <h3 className="
          !m-0
          !text-[14px]
          !leading-[20px]
          !font-medium
          !text-black
          truncate
        ">
          {product.name}
        </h3>

        {/* PRICE */}
        <div className="flex items-center gap-[9px] mt-[5px]">

          <span className="
            text-[14px]
            leading-[20px]
            font-medium
            text-[#DB4444]
          ">
            ${product.price.toFixed(0)}
          </span>

          {product.originalPrice &&
            product.originalPrice > product.price && (
              <span className="
                text-[13px]
                leading-[20px]
                text-[#7D7D7D]
                line-through
              ">
                ${product.originalPrice.toFixed(0)}
              </span>
            )}

        </div>

        {/* RATING */}
        {product.rating !== undefined && (
          <div className="flex items-center gap-[7px] mt-[3px]">

            <div className="flex items-center gap-[2px]">

              {[0, 1, 2, 3, 4].map((index) => (
                <span
                  key={index}
                  className={`
                    text-[14px]
                    leading-none
                    ${
                      index < rating
                        ? 'text-[#FFAD33]'
                        : 'text-[#D9D9D9]'
                    }
                  `}
                >
                  ★
                </span>
              ))}

            </div>

            {product.reviewCount !== undefined && (
              <span className="
                text-[12px]
                text-[#7D7D7D]
              ">
                ({product.reviewCount})
              </span>
            )}

          </div>
        )}

      </div>
    </Link>
  );
};

export default ProductCard;