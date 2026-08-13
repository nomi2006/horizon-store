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
  subtitle = 'Customer favorites you\'ll love',
  viewAllLink = '/shop',
}) => {
  // Figma shows exactly 4 products in this section
  const displayProducts = products.slice(0, 4);

  return (
    <section className="w-full bg-[#F7F7F7] py-[70px]">
      <div className="max-w-[1170px] mx-auto px-4">

        {/* ================= HEADER ================= */}
        <div className="flex items-end justify-between mb-[30px]">

          {/* LEFT */}
          <div>
            {/* Red section label */}
            <div className="flex items-center gap-[10px] mb-[14px]">
              <span className="block w-[20px] h-[40px] bg-[#DB4444] rounded-[3px]" />

              <span className="text-[14px] font-semibold text-[#DB4444]">
                This Month
              </span>
            </div>

            {/* Title */}
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

            {/* Keep subtitle functionality, but hide it visually
                because it is not part of the Figma layout */}
            <span className="sr-only">
              {subtitle}
            </span>
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
              font-medium
              rounded-[4px]
              hover:bg-[#C73636]
              transition-colors
            "
          >
            View All
          </Link>
        </div>
{/* products */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-[30px]
          "
        >
          {displayProducts.map((product) => (
            <div
              key={product.id}
              className="min-w-0"
            >
              <ProductCard
                product={product}
                showSaleBadge={product.discountPercentage > 0}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default BestSelling;