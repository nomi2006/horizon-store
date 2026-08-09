import React from 'react';
import ProductCard from './ProductCard';
import SectionHeader from './SectionHeader';
import CountdownTimer from './CountdownTimer';

interface FlashSalesProps {
  products?: any[];
  title?: string;
  subtitle?: string;
  viewAllLink?: string;
  targetDate?: Date;
}

const FlashSales: React.FC<FlashSalesProps> = ({
  products = [],
  title = 'Flash Sales',
  subtitle = "Today's",
  viewAllLink = '/shop',
  targetDate = new Date(Date.now() + 24 * 60 * 60 * 1000), // Default: 24 hours from now
}) => {
  // Show only first 4 products for flash sales
  const displayProducts = products.slice(0, 4);

  return (
    <section className="section-padding">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
          <div>
            <SectionHeader
              title={title}
              subtitle={subtitle}
              viewAllLink={viewAllLink}
            />
          </div>
          <div className="mt-4 md:mt-0">
            <CountdownTimer targetDate={targetDate} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showSaleBadge={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlashSales;