import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import ProductCard from './ProductCard';
import FlashSalesTimer from './FlashSalesTimer';

interface FlashSalesProps {
  products?: any[];
  title?: string;
  subtitle?: string;
  viewAllLink?: string;
}

const FlashSales: React.FC<FlashSalesProps> = ({
  products = [],
  title = 'Flash Sales',
  subtitle = "Today's",
  viewAllLink = '/shop',
}) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  /*
   * Scroll one product-card width at a time.
   * Card = 270px
   * Gap = 30px
   */
  const scrollLeft = () => {
    sliderRef.current?.scrollBy({
      left: -300,
      behavior: 'smooth',
    });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({
      left: 300,
      behavior: 'smooth',
    });
  };

  return (
    <section className="w-full bg-white pt-[10px] pb-[52px]">
      <div className="max-w-[1170px] mx-auto px-4">

        {/* ================= HEADER ================= */}
        <div className="flex items-end justify-between mb-[28px]">

          {/* LEFT SIDE */}
          <div className="flex items-end gap-[70px]">

            {/* TITLE */}
            <div>
              <div className="flex items-center gap-[10px] mb-[10px]">
                <span
                  className="
                    block
                    w-[20px]
                    h-[40px]
                    bg-[#DB4444]
                    rounded-[3px]
                  "
                />

                <span
                  className="
                    text-[14px]
                    leading-[20px]
                    font-semibold
                    text-[#DB4444]
                  "
                >
                  {subtitle}
                </span>
              </div>

              <h2
                className="
                  !m-0
                  !p-0
                  !text-[32px]
                  !leading-[38px]
                  !font-semibold
                  !text-black
                "
              >
                {title}
              </h2>
            </div>

            {/* FIXED DEADLINE COUNTDOWN */}
            <FlashSalesTimer />

          </div>

          {/* ================= ARROWS ================= */}
          <div className="flex items-center gap-[10px] pb-[2px]">

            <button
              type="button"
              onClick={scrollLeft}
              aria-label="Previous products"
              className="
                w-[42px]
                h-[42px]
                rounded-full
                bg-[#F5F5F5]
                flex
                items-center
                justify-center
                text-black
                hover:bg-[#DB4444]
                hover:text-white
                transition-colors
                duration-200
              "
            >
              <ChevronLeft
                size={20}
                strokeWidth={1.8}
              />
            </button>

            <button
              type="button"
              onClick={scrollRight}
              aria-label="Next products"
              className="
                w-[42px]
                h-[42px]
                rounded-full
                bg-[#F5F5F5]
                flex
                items-center
                justify-center
                text-black
                hover:bg-[#DB4444]
                hover:text-white
                transition-colors
                duration-200
              "
            >
              <ChevronRight
                size={20}
                strokeWidth={1.8}
              />
            </button>

          </div>
        </div>

        {/* ================= PRODUCTS ================= */}
        <div
          ref={sliderRef}
          className="
            flex
            gap-[30px]
            overflow-x-auto
            scrollbar-hide
            snap-x
            snap-mandatory
            pb-[8px]
          "
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="
                flex-none
                w-[270px]
                snap-start
              "
            >
              <ProductCard
                product={product}
                showSaleBadge
              />
            </div>
          ))}
        </div>

        {/* ================= VIEW ALL ================= */}
        <div className="flex justify-center mt-[38px]">
          <Link
            to={viewAllLink}
            className="
              inline-flex
              items-center
              justify-center
              min-w-[160px]
              h-[46px]
              px-[24px]
              bg-[#DB4444]
              text-white
              text-[14px]
              leading-[20px]
              font-medium
              rounded-[4px]
              hover:bg-[#c73636]
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

export default FlashSales;