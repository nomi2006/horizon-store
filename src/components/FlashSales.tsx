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
    <section className="w-full bg-white">
      <div
        className="
          w-full
          max-w-[1170px]
          mx-auto
          px-4 sm:px-6 md:px-8 lg:px-0
          pt-10 sm:pt-[44px]
          pb-10 sm:pb-[52px]
        "
      >
        {/* HEADER */}
        <div
          className="
            flash-header
            flex
            flex-col
            sm:flex-row
            sm:items-end
            justify-between
            gap-5 sm:gap-6
            mb-6 sm:mb-[28px]
          "
        >
          <div
            className="
              flash-header-left
              flex
              flex-col
              md:flex-row
              md:items-end
              gap-5
              md:gap-[70px]
            "
          >
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
                  !text-2xl
                  sm:!text-3xl
                  md:!text-4xl
                  !font-semibold
                  !text-black
                "
              >
                {title}
              </h2>
            </div>

            <FlashSalesTimer />
          </div>

          {/* ARROWS */}
          <div className="flex items-center gap-[10px] pb-[2px]">
            <button
              type="button"
              onClick={scrollLeft}
              aria-label="Previous products"
              className="
                w-9 h-9
                sm:w-10 sm:h-10
                md:w-[42px] md:h-[42px]
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
                size={18}
                className="md:w-[20px] md:h-[20px]"
                strokeWidth={1.8}
              />
            </button>

            <button
              type="button"
              onClick={scrollRight}
              aria-label="Next products"
              className="
                w-9 h-9
                sm:w-10 sm:h-10
                md:w-[42px] md:h-[42px]
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
                size={18}
                className="md:w-[20px] md:h-[20px]"
                strokeWidth={1.8}
              />
            </button>
          </div>
        </div>

        {/* PRODUCTS SLIDER */}
        <div
          ref={sliderRef}
          className="
            flex
            gap-5
            sm:gap-6
            md:gap-[30px]
            overflow-x-auto
            scrollbar-hide
            snap-x
            snap-mandatory
            pb-[8px]
            w-full
            overscroll-x-contain
          "
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="
                flex-none
                w-[270px]
                h-[350px]
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

        {/* VIEW ALL */}
        <div className="flex justify-center mt-8 sm:mt-[38px]">
          <Link
            to={viewAllLink}
            className="
              inline-flex
              items-center
              justify-center
              w-full
              sm:w-auto
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