import React from 'react';
import CategoryCard from './CategoryCard';
import SectionHeader from './SectionHeader';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: React.ReactNode;
}

interface CategoryGridProps {
  categories?: Category[];
  title?: string;
  viewAllLink?: string;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories = [
    { id: '1', name: 'Phones', slug: 'phones', icon: '📱' },
    { id: '2', name: 'Computers', slug: 'computers', icon: '💻' },
    { id: '3', name: 'SmartWatch', slug: 'smartwatch', icon: '⌚' },
    { id: '4', name: 'Camera', slug: 'camera', icon: '📷' },
    { id: '5', name: 'HeadPhones', slug: 'headphones', icon: '🎧' },
    { id: '6', name: 'Gaming', slug: 'gaming', icon: '🎮' },
  ],
  title = 'Browse By Category',
  viewAllLink = '/shop',
}) => {
  return (
    <section className="section-padding">
      <div className="container mx-auto px-4">
        <SectionHeader
          title={title}
          viewAllLink={viewAllLink}
          viewAllText="View All →"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              name={category.name}
              slug={category.slug}
              icon={category.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;