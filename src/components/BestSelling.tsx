import React from 'react';
import ProductCard from './ProductCard';
import SectionHeader from './SectionHeader';

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
  // Show only first 4 products
  const displayProducts = products.slice(0, 4);

  return (
    <section className="section-padding">
      <div className="container mx-auto px-4">
        <SectionHeader
          title={title}
          subtitle={subtitle}
          viewAllLink={viewAllLink}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showSaleBadge={product.discountPercentage > 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSelling;