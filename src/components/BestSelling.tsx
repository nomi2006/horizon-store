import React from 'react';
import { Link } from 'react-router-dom';

import ProductCard from './ProductCard';

interface BestSellingProps {
  products?: any[];
  title?: string;
  subtitle?: string;
  viewAllLink?: string;
}

const BestSelling: React.FC<BestSellingProps> = ({
  products = [],
  title = 'Best Selling Products',
  subtitle = 'This Month',
  viewAllLink = '/shop',
}) => {
  // Figma shows 4 products in this section
  const displayProducts = products.slice(0, 4);

  return (
    <section className="w-full bg-white border-t border-[#E5E5E5]">
      <div className="max-w-[1170px] mx-auto px-4 lg:px-0 pt-10 md:pt-[70px] pb-10 md:pb-[70px]">

        {/*  HEADER  */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-[30px]">

          {/* LEFT SIDE */}
          <div>
            {/* RED LABEL */}
            <div className="flex items-center gap-[10px] mb-[14px]">
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

            {/* HEADING */}
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

          {/* VIEW ALL BUTTON */}
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
              hover:bg-[#C73636]
              transition-colors
              duration-200
            "
          >
            View All Products
          </Link>
        </div>

        {/*  PRODUCTS  */}
        <div
          className="
            grid
            grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-4 md:gap-[30px]
          "
        >
          {displayProducts.map((product) => (
            <div
              key={product.id}
              className="
                w-full
                min-w-0
                h-[350px]
              "
            >
              <ProductCard
                product={product}
                showSaleBadge
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default BestSelling;