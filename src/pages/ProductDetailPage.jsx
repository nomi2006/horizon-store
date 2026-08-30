import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Heart,
  Minus,
  Plus,
  Star,
  Truck,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';

import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

const getImages = (product) => {
  if (!product) return [];

  if (Array.isArray(product.images)) {
    const validImages = product.images.filter(
      (image) => typeof image === 'string' && image.trim()
    );

    if (validImages.length > 0) {
      return validImages;
    }
  }

  const singleImage =
    product.image ||
    product.image_url ||
    product.imageUrl;

  return singleImage ? [singleImage] : [];
};

const formatPrice = (price) => {
  const value = Number(price || 0);

  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

function ProductStars({ rating = 5, reviews = 0 }) {
  const safeRating = Math.min(5, Math.max(0, Math.round(Number(rating) || 0)));

  return (
    <div className="flex items-center gap-[8px]">
      <div className="flex items-center gap-[2px]">
        {[0, 1, 2, 3, 4].map((index) => (
          <Star
            key={index}
            size={16}
            strokeWidth={1.5}
            className={
              index < safeRating
                ? 'fill-[#FFAD33] text-[#FFAD33]'
                : 'text-[#BDBDBD]'
            }
          />
        ))}
      </div>

      <span className="text-[13px] text-[#777]">
        ({reviews} Reviews)
      </span>
    </div>
  );
}

function RelatedProductCard({ product }) {
  const navigate = useNavigate();

  const image = getImages(product)[0];

  const price = Number(product.price || 0);

  const oldPrice = Number(
    product.compare_at_price ||
    product.original_price ||
    product.old_price ||
    0
  );

  const discount =
    oldPrice > price
      ? `-${Math.round(((oldPrice - price) / oldPrice) * 100)}%`
      : null;

  const reviews =
    product.reviews_count ||
    product.review_count ||
    product.reviewCount ||
    0;

  return (
    <article className="group min-w-0">
      {/* IMAGE */}
      <div
        className="
          relative
          w-full
          aspect-square
          bg-[#F5F5F5]
          rounded-[3px]
          overflow-hidden
          flex
          items-center
          justify-center
          cursor-pointer
        "
        onClick={() => navigate(`/product/${product.slug || product.id}`)}
      >
        {discount && (
          <span className="absolute top-[12px] left-[12px] z-10 bg-[#DB4444] text-white text-[12px] leading-[20px] px-[9px] rounded-[3px]">
            {discount}
          </span>
        )}

        <div className="absolute top-[12px] right-[12px] z-10 flex flex-col gap-[8px]">
          <button
            type="button"
            onClick={(event) => event.stopPropagation()}
            className="
              w-[34px]
              h-[34px]
              rounded-full
              bg-white
              flex
              items-center
              justify-center
              hover:text-[#DB4444]
              transition-colors
            "
            aria-label="Add to wishlist"
          >
            <Heart size={17} strokeWidth={1.7} />
          </button>
        </div>

        {image ? (
          <img
            src={image}
            alt={product.name}
            className="
              w-full
              h-full
              object-contain
              p-[20px]
              transition-transform
              duration-300
              group-hover:scale-105
            "
          />
        ) : (
          <div className="text-[13px] text-[#999]">
            No image
          </div>
        )}
      </div>

      {/* INFO */}
      <Link
        to={`/product/${product.slug || product.id}`}
        className="
          block
          mt-[14px]
          text-[14px]
          leading-[20px]
          font-medium
          hover:text-[#DB4444]
          transition-colors
        "
      >
        {product.name}
      </Link>

      <div className="flex items-center gap-[10px] mt-[6px]">
        <span className="text-[14px] font-medium text-[#DB4444]">
          {formatPrice(price)}
        </span>

        {oldPrice > price && (
          <span className="text-[14px] text-[#777] line-through">
            {formatPrice(oldPrice)}
          </span>
        )}
      </div>

      <div className="mt-[5px]">
        <ProductStars
          rating={product.rating || 5}
          reviews={reviews}
        />
      </div>
    </article>
  );
}

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');

  const [isImageZoomed, setIsImageZoomed] = useState(false);

  const { addToCart } = useCart();

  const {
    addItem: addWishlist,
    removeItem: removeWishlist,
    isInWishlist,
  } = useWishlist();

  useEffect(() => {
    let mounted = true;

    const loadProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await productService.getById(id);

        if (!mounted) return;

        if (response.error || !response.data) {
          console.error('Product fetch error:', response.error);
          setProduct(null);
          setError('not-found');
          return;
        }

        const currentProduct = response.data;

        setProduct(currentProduct);

        if (currentProduct.category_id) {
          const relatedResponse = await productService.getRelated(
            currentProduct.id,
            currentProduct.category_id
          );

          if (mounted) {
            setRelatedProducts(relatedResponse.data || []);
          }
        }
      } catch (err) {
        console.error('Product loading error:', err);

        if (mounted) {
          setError('server');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      mounted = false;
    };
  }, [id]);

  const images = useMemo(
    () => getImages(product),
    [product]
  );

  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <TopBar />
        <Navbar />

        <div className="max-w-[1170px] mx-auto px-4 lg:px-0 py-[100px]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!product || error) {
    return (
      <div className="min-h-screen bg-white">
        <TopBar />
        <Navbar />

        <main className="max-w-[1170px] mx-auto px-4 lg:px-0 py-[120px] text-center">
          <h1 className="text-[28px] md:text-[32px] font-semibold">
            {error === 'server'
              ? 'Something went wrong'
              : 'Product Not Found'}
          </h1>

          <p className="mt-[12px] text-[14px] text-[#777]">
            {error === 'server'
              ? "We couldn't load this product. Please try again."
              : "The product you're looking for is unavailable."}
          </p>

          <div className="flex items-center justify-center gap-[12px] mt-[28px]">
            {error === 'server' && (
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="
                  h-[44px]
                  px-[24px]
                  rounded-[4px]
                  bg-[#DB4444]
                  text-white
                  text-[14px]
                  font-medium
                "
              >
                Try Again
              </button>
            )}

            <Link
              to="/shop"
              className="
                h-[44px]
                px-[24px]
                rounded-[4px]
                border
                border-[#DB4444]
                text-[#DB4444]
                flex
                items-center
                justify-center
                text-[14px]
                font-medium
              "
            >
              Continue Shopping
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const productName = product.name || 'Product';

  const categoryName =
    product.categories?.name ||
    product.category?.name ||
    'Products';

  const price = Number(product.price || 0);

  const stock = Number(product.stock_quantity || 0);

  const rating = Number(product.rating || 5);

  const reviews =
    product.reviews_count ||
    product.review_count ||
    product.reviewCount ||
    0;

  const description =
    product.description?.trim() ||
    'No description available for this product.';

  const isWishlisted = isInWishlist(product.id);

  const hasStock = stock > 0;

  const handleQuantityDecrease = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const handleQuantityIncrease = () => {
    setQuantity((current) => {
      if (stock > 0) {
        return Math.min(current + 1, stock);
      }

      return current + 1;
    });
  };

  const handleAddToCart = () => {
    if (!hasStock) {
      toast.error('This product is currently out of stock.');
      return;
    }

    if (quantity > stock) {
      toast.error('Not enough stock available.');
      return;
    }

    addToCart({
      ...product,
      quantity,
    });

    toast.success(`${productName} added to cart`);
  };

  const handleBuyNow = () => {
  if (!hasStock) {
    toast.error('This product is currently out of stock.');
    return;
  }

  if (quantity > stock) {
    toast.error('Not enough stock available.');
    return;
  }

  addToCart(product, quantity);
  navigate('/checkout');
};

  const handleWishlist = () => {
    if (isWishlisted) {
      removeWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  const previousImage = () => {
    if (images.length === 0) return;

    setSelectedImage((current) =>
      current === 0 ? images.length - 1 : current - 1
    );
  };

  const nextImage = () => {
    if (images.length === 0) return;

    setSelectedImage((current) =>
      current === images.length - 1 ? 0 : current + 1
    );
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <TopBar />
      <Navbar />

      <main>
        {/* BREADCRUMB */}

        <section className="max-w-[1170px] mx-auto px-4 lg:px-0 pt-[38px] md:pt-[54px]">
          <nav className="flex items-center gap-[10px] text-[12px] md:text-[13px]">
            <Link
              to="/"
              className="text-[#777] hover:text-black"
            >
              Home
            </Link>

            <span className="text-[#999]">/</span>

            <Link
              to="/shop"
              className="text-[#777] hover:text-black"
            >
              {categoryName}
            </Link>

            <span className="text-[#999]">/</span>

            <span className="text-black truncate max-w-[180px] md:max-w-none">
              {productName}
            </span>
          </nav>
        </section>

        {/* PRODUCT DETAILS */}

        <section className="max-w-[1170px] mx-auto px-4 lg:px-0 mt-[38px] md:mt-[55px]">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-[45px] lg:gap-[70px]">
            {/* GALLERY */}

            <div>
              <div className="grid grid-cols-1 md:grid-cols-[110px_1fr] gap-[16px] md:gap-[20px]">
                {/* MAIN IMAGE */}
                <div
                  className="
                    order-1
                    md:order-2
                    relative
                    w-full
                    aspect-square
                    md:h-[500px]
                    md:aspect-auto
                    bg-[#F5F5F5]
                    rounded-[3px]
                    overflow-hidden
                    flex
                    items-center
                    justify-center
                    cursor-zoom-in
                  "
                  onClick={() => setIsImageZoomed(true)}
                >
                  {images.length > 0 ? (
                    <img
                      src={images[selectedImage]}
                      alt={productName}
                      className="
                        w-full
                        h-full
                        object-contain
                        p-[20px]
                        md:p-[35px]
                        transition-transform
                        duration-300
                        hover:scale-[1.03]
                      "
                    />
                  ) : (
                    <div className="text-[14px] text-[#999]">
                      No product image
                    </div>
                  )}

                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          previousImage();
                        }}
                        className="
                          absolute
                          left-[10px]
                          top-1/2
                          -translate-y-1/2
                          w-[34px]
                          h-[34px]
                          rounded-full
                          bg-white
                          shadow-sm
                          flex
                          items-center
                          justify-center
                          hover:bg-[#DB4444]
                          hover:text-white
                          transition-colors
                        "
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          nextImage();
                        }}
                        className="
                          absolute
                          right-[10px]
                          top-1/2
                          -translate-y-1/2
                          w-[34px]
                          h-[34px]
                          rounded-full
                          bg-white
                          shadow-sm
                          flex
                          items-center
                          justify-center
                          hover:bg-[#DB4444]
                          hover:text-white
                          transition-colors
                        "
                        aria-label="Next image"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </>
                  )}
                </div>

                {/* THUMBNAILS */}
                {images.length > 0 && (
                  <div
                    className="
                      order-2
                      md:order-1
                      flex
                      md:flex-col
                      gap-[10px]
                      overflow-x-auto
                      md:overflow-visible
                      scrollbar-hide
                    "
                  >
                    {images.map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => setSelectedImage(index)}
                        className={`
                          flex-shrink-0
                          w-[80px]
                          h-[70px]
                          md:w-[110px]
                          md:h-[90px]
                          rounded-[3px]
                          bg-[#F5F5F5]
                          overflow-hidden
                          flex
                          items-center
                          justify-center
                          border
                          transition-all
                          ${selectedImage === index
                            ? 'border-[#DB4444]'
                            : 'border-transparent'
                          }
                        `}
                        aria-label={`Product image ${index + 1}`}
                      >
                        <img
                          src={image}
                          alt=""
                          className="w-full h-full object-contain p-[8px]"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* PRODUCT INFORMATION */}

            <div className="pt-[0px]">
              <h1 className="text-[24px] md:text-[28px] leading-[34px] font-semibold">
                {productName}
              </h1>

              <div className="flex flex-wrap items-center gap-[12px] mt-[10px]">
                <ProductStars
                  rating={rating}
                  reviews={reviews}
                />

                <span className="text-[#B5B5B5]">|</span>

                <span
                  className={
                    hasStock
                      ? 'text-[#00A651] text-[13px]'
                      : 'text-[#DB4444] text-[13px]'
                  }
                >
                  {hasStock
                    ? 'In Stock'
                    : 'Out of Stock'}
                </span>

                {hasStock && stock <= 5 && (
                  <span className="text-[12px] text-[#DB4444]">
                    Only {stock} left
                  </span>
                )}
              </div>

              {/* PRICE */}
              <div className="mt-[12px] text-[22px] font-medium">
                {formatPrice(price)}
              </div>

              {/* DESCRIPTION */}
              <p className="mt-[16px] max-w-[520px] text-[13px] leading-[21px] text-[#333]">
                {description}
              </p>

              <div className="w-full h-[1px] bg-[#999] mt-[18px]" />

              {/* COLORS */}
              {(product.colors?.length > 0 ||
                product.color ||
                product.secondaryColor) && (
                  <div className="flex items-center gap-[15px] mt-[16px]">
                    <span className="text-[16px]">
                      Colours:
                    </span>

                    <div className="flex items-center gap-[8px]">
                      {product.color && (
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedColor(0)
                          }
                          className={`
                          w-[18px]
                          h-[18px]
                          rounded-full
                          border-[2px]
                          border-white
                          outline
                          ${selectedColor === 0
                              ? 'outline-black'
                              : 'outline-transparent'
                            }
                        `}
                          style={{
                            backgroundColor:
                              product.color,
                          }}
                          aria-label="Select color"
                        />
                      )}

                      {product.secondaryColor && (
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedColor(1)
                          }
                          className={`
                          w-[18px]
                          h-[18px]
                          rounded-full
                          border-[2px]
                          border-white
                          outline
                          ${selectedColor === 1
                              ? 'outline-black'
                              : 'outline-transparent'
                            }
                        `}
                          style={{
                            backgroundColor:
                              product.secondaryColor,
                          }}
                          aria-label="Select color"
                        />
                      )}

                      {Array.isArray(product.colors) &&
                        product.colors
                          .slice(0, 4)
                          .map((color, index) => (
                            <button
                              key={`${color}-${index}`}
                              type="button"
                              onClick={() =>
                                setSelectedColor(index)
                              }
                              className={`
                              w-[18px]
                              h-[18px]
                              rounded-full
                              border-[2px]
                              border-white
                              outline
                              ${selectedColor === index
                                  ? 'outline-black'
                                  : 'outline-transparent'
                                }
                            `}
                              style={{
                                backgroundColor: color,
                              }}
                              aria-label="Select color"
                            />
                          ))}
                    </div>
                  </div>
                )}

              {/* SIZE */}
              <div className="flex items-center gap-[15px] mt-[18px]">
                <span className="text-[16px]">
                  Size:
                </span>

                <div className="flex items-center gap-[8px]">
                  {['XS', 'S', 'M', 'L', 'XL'].map(
                    (size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() =>
                          setSelectedSize(size)
                        }
                        className={`
                          min-w-[32px]
                          h-[32px]
                          px-[7px]
                          rounded-[3px]
                          border
                          text-[12px]
                          flex
                          items-center
                          justify-center
                          transition-colors
                          ${selectedSize === size
                            ? 'bg-[#DB4444] border-[#DB4444] text-white'
                            : 'border-[#999] hover:border-black'
                          }
                        `}
                      >
                        {size}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-wrap items-center gap-[10px] mt-[20px]">
                {/* QUANTITY */}
                <div className="flex h-[44px] border border-[#999] rounded-[3px] overflow-hidden">
                  <button
                    type="button"
                    onClick={handleQuantityDecrease}
                    className="w-[38px] flex items-center justify-center hover:bg-[#F5F5F5]"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>

                  <div className="w-[48px] border-x border-[#999] flex items-center justify-center text-[14px]">
                    {quantity}
                  </div>

                  <button
                    type="button"
                    onClick={handleQuantityIncrease}
                    disabled={
                      stock > 0 && quantity >= stock
                    }
                    className="
                      w-[38px]
                      bg-[#DB4444]
                      text-white
                      flex
                      items-center
                      justify-center
                      hover:bg-[#C93636]
                      disabled:bg-[#BDBDBD]
                    "
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* ADD TO CART */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={!hasStock}
                  className="
                    h-[44px]
                    px-[25px]
                    rounded-[3px]
                    bg-[#DB4444]
                    text-white
                    text-[14px]
                    font-medium
                    hover:bg-[#C93636]
                    disabled:bg-[#BDBDBD]
                    disabled:cursor-not-allowed
                    transition-colors
                  "
                >
                  Add To Cart
                </button>

                {/* BUY NOW */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={!hasStock}
                  className="
                    h-[44px]
                    px-[25px]
                    rounded-[3px]
                    border
                    border-[#DB4444]
                    text-[#DB4444]
                    text-[14px]
                    font-medium
                    hover:bg-[#DB4444]
                    hover:text-white
                    disabled:border-[#BDBDBD]
                    disabled:text-[#BDBDBD]
                    transition-colors
                  "
                >
                  Buy Now
                </button>

                {/* WISHLIST */}
                <button
                  type="button"
                  onClick={handleWishlist}
                  className="
                    w-[44px]
                    h-[44px]
                    rounded-[3px]
                    border
                    border-[#999]
                    flex
                    items-center
                    justify-center
                    hover:border-[#DB4444]
                    hover:text-[#DB4444]
                    transition-colors
                  "
                  aria-label={
                    isWishlisted
                      ? 'Remove from wishlist'
                      : 'Add to wishlist'
                  }
                >
                  <Heart
                    size={20}
                    strokeWidth={1.7}
                    className={
                      isWishlisted
                        ? 'fill-[#DB4444] text-[#DB4444]'
                        : ''
                    }
                  />
                </button>
              </div>

              {/* DELIVERY */}
              <div className="mt-[30px] border border-[#999] rounded-[3px] overflow-hidden">
                <div className="min-h-[72px] flex items-center gap-[16px] px-[16px] py-[12px]">
                  <Truck
                    size={27}
                    strokeWidth={1.5}
                  />

                  <div>
                    <div className="text-[14px] font-medium">
                      Free Delivery
                    </div>

                    <div className="text-[11px] mt-[5px] underline">
                      Enter your postal code for Delivery Availability
                    </div>
                  </div>
                </div>

                <div className="h-[1px] bg-[#999]" />

                <div className="min-h-[72px] flex items-center gap-[16px] px-[16px] py-[12px]">
                  <RotateCcw
                    size={25}
                    strokeWidth={1.5}
                  />

                  <div>
                    <div className="text-[14px] font-medium">
                      Return Delivery
                    </div>

                    <div className="text-[11px] mt-[5px]">
                      Free 30 Days Delivery Returns.{' '}
                      <span className="underline cursor-pointer">
                        Details
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RELATED PRODUCTS */}

        {relatedProducts.length > 0 && (
          <section className="max-w-[1170px] mx-auto px-4 lg:px-0 mt-[85px] md:mt-[105px] pb-[90px]">
            <div className="flex items-center gap-[12px] mb-[30px]">
              <span className="block w-[20px] h-[40px] bg-[#DB4444] rounded-[3px]" />

              <h2 className="m-0 text-[20px] md:text-[24px] font-semibold">
                Related Items
              </h2>
            </div>

            <div className="
              grid
              grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              gap-x-[18px]
              md:gap-x-[25px]
              gap-y-[35px]
            ">
              {relatedProducts.slice(0, 4).map((item) => (
                <RelatedProductCard
                  key={item.id}
                  product={item}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* IMAGE LIGHTBOX */}

      {isImageZoomed && images.length > 0 && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            bg-black/80
            flex
            items-center
            justify-center
            p-[20px]
          "
          onClick={() => setIsImageZoomed(false)}
        >
          <img
            src={images[selectedImage]}
            alt={productName}
            className="
              max-w-full
              max-h-full
              object-contain
            "
          />
        </div>
      )}
    </div>
  );
}

export default ProductDetailPage;