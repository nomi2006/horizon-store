import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

  const handleAddToCart = async (e: React.MouseEvent) => {
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

  const discountPercentage = product.discountPercentage ||
    (product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0);
  const imageUrl = product.image || 'https://via.placeholder.com/300x300?text=No+Image';

  return (
    <Link to={`/product/${product.slug || product.id}`} className={`block ${className}`}>
      <div className="product-card group">
        <div className="product-image">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          <div className="product-badge flex flex-col gap-1">
            {showSaleBadge && discountPercentage > 0 && (
              <span className="badge-sale">-{discountPercentage}%</span>
            )}
            {showNewBadge && (
              <span className="badge-sale bg-green-600">NEW</span>
            )}
          </div>

          <div className="product-actions opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
              aria-label="Add to cart"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
            <button
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
              aria-label="Add to wishlist"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>

          <div className="product-price">
            <span className="price-current">${product.price.toFixed(2)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="price-original">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          {product.rating !== undefined && (
            <div className="product-rating">
              <div className="rating-stars">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    className={`w-4 h-4 ${index < Math.round(product.rating || 0) ? 'text-yellow-500' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              {product.reviewCount !== undefined && (
                <span className="text-xs text-gray-500">({product.reviewCount})</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;