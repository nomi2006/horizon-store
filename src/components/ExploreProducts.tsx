import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

interface ExploreProductsProps {
  products?: any[];
}

const ExploreProducts: React.FC<ExploreProductsProps> = ({
  products = [],
}) => {
  const [startIndex, setStartIndex] = useState(0);

  // Keep all products available for pagination.
  const displayProducts = useMemo(() => {
    return products;
  }, [products]);

  const visibleProducts = displayProducts.slice(
    startIndex,
    startIndex + 8
  );

  const canGoPrevious = startIndex > 0;
  const canGoNext =
    startIndex + 8 < displayProducts.length;

  const handlePrevious = () => {
    setStartIndex((current) =>
      Math.max(0, current - 4)
    );
  };

  const productRatings: Record<string, number> = {
    "D-Smart Watch": 5,
    "Leather Strap Collection": 4,
    "Luxury Chronograph Watch": 5,
    "Smart Watch Pro": 4,
    "Canvas Messenger Bag": 3,
    "Minimalist Classic Watch": 5,
    "Sport Chronograph Watch": 4,
    "Smart Watch": 5,
  };
  const handleNext = () => {
    setStartIndex((current) =>
      Math.min(
        Math.max(0, displayProducts.length - 8),
        current + 4
      )
    );
  };

  return (
    <section className="w-full bg-white text-black">
      <div className="max-w-[1170px] mx-auto px-4 pt-[70px] pb-[70px]">

        {/*  HEADER  */}
        <div className="flex items-start justify-between mb-[44px]">

          {/* LEFT HEADER */}
          <div>
            {/* OUR PRODUCTS LABEL */}
            <div className="flex items-center gap-[18px]">
              <span
                className="
                  block
                  w-[20px]
                  h-[40px]
                  bg-[#DB4444]
                  rounded-[3px]
                  flex-shrink-0
                "
              />

              <span
                className="
                  text-[#DB4444]
                  text-[16px]
                  leading-[20px]
                  font-semibold
                "
              >
                Our Products
              </span>
            </div>

            {/* MAIN HEADING */}
            <h2
              className="
                mt-[24.5px]
                text-[#000000]
                text-[36px]
                leading-[48px]
                font-semibold
              "
              style={{
                fontFamily: "Inter, sans-serif",
              }}
            >
              Explore Our Products
            </h2>
          </div>

          {/*  ARROWS  */}
          <div className="flex items-center gap-[12px]">

            {/* PREVIOUS */}
            <button
              type="button"
              onClick={handlePrevious}
              disabled={!canGoPrevious}
              aria-label="Previous products"
              className={`
                w-[52px]
                h-[52px]
                rounded-full
                bg-[#F5F5F5]
                text-black
                flex
                items-center
                justify-center
                transition-all
                duration-200
                ${canGoPrevious
                  ? "hover:bg-[#E5E5E5] cursor-pointer"
                  : "opacity-100 cursor-default"
                }
              `}
            >
              <ChevronLeft
                size={30}
                strokeWidth={1.8}
              />
            </button>

            {/* NEXT */}
            <button
              type="button"
              onClick={handleNext}
              disabled={!canGoNext}
              aria-label="Next products"
              className={`
                w-[52px]
                h-[52px]
                rounded-full
                bg-[#F5F5F5]
                text-black
                flex
                items-center
                justify-center
                transition-all
                duration-200
                ${canGoNext
                  ? "hover:bg-[#E5E5E5] cursor-pointer"
                  : "opacity-100 cursor-default"
                }
              `}
            >
              <ChevronRight
                size={30}
                strokeWidth={1.8}
              />
            </button>
          </div>
        </div>

        {/*  PRODUCTS GRID */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-x-[30px]
            gap-y-[70px]
          "
        >
          {visibleProducts.map((product, index) => {

            const showNew =
              product?.isNew === true ||
              product?.is_new === true ||
              index === 4 ||
              index === 6;

            return (
              <div
                key={product.id}
                className="
                  w-full
                  min-w-0
                "
              >
                {/* PRODUCT CARD */}
                <div className="relative">

                  {/* NEW BADGE */}
                  {showNew && (
                    <span
                      className="
                        absolute
                        top-[14px]
                        left-[14px]
                        z-30
                        inline-flex
                        items-center
                        justify-center
                        min-w-[58px]
                        h-[30px]
                        px-[12px]
                        rounded-[4px]
                        bg-[#00FF66]
                        text-black
                        text-[13px]
                        leading-[18px]
                        font-medium
                      "
                    >
                      NEW
                    </span>
                  )}

                  <ProductCard
                    product={{
                      ...product,
                      rating:
                        Number(product.rating) > 0
                          ? Number(product.rating)
                          : productRatings[product.name] ?? 4,
                    }}
                    showNewBadge={false}
                    className="w-full"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/*  EMPTY STATE  */}
        {visibleProducts.length === 0 && (
          <div
            className="
              w-full
              py-[80px]
              flex
              items-center
              justify-center
              text-[#999999]
              text-[16px]
            "
          >
            No products available.
          </div>
        )}

        {/*  VIEW ALL BUTTON  */}
        <div className="flex justify-center mt-[70px]">
          <Link
            to="/shop"
            className="
              inline-flex
              items-center
              justify-center
              w-[265px]
              h-[56px]
              rounded-[4px]
              bg-[#DB4444]
              text-white
              text-[16px]
              leading-[24px]
              font-medium
              no-underline
              hover:bg-[#C73636]
              transition-colors
              duration-200
            "
          >
            View All Products
          </Link>
        </div>

      </div>
    </section>
  );
};

export default ExploreProducts;