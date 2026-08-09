import React from 'react';
import ProductCard from './ProductCard';
import SectionHeader from './SectionHeader';

interface ExploreProductsProps {
  products?: any[];
  title?: string;
  subtitle?: string;
  viewAllLink?: string;
}

const ExploreProducts: React.FC<ExploreProductsProps> = ({
  products = [],
  title = 'Explore Our Products',
  subtitle = 'Discover our curated collection',
  viewAllLink = '/shop',
}) => {
  // Show only first 8 products
  const displayProducts = products.slice(0, 8);

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
              showNewBadge={product.isNew || false}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreProducts;