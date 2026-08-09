import React from 'react';
import { Link } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategorySidebarProps {
  categories?: Category[];
  onCategoryClick?: (category: string) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({ 
  categories = [
    { id: '1', name: "Woman's Fashion", slug: 'womens-fashion' },
    { id: '2', name: "Men's Fashion", slug: 'mens-fashion' },
    { id: '3', name: 'Electronics', slug: 'electronics' },
    { id: '4', name: 'Home & Lifestyle', slug: 'home-lifestyle' },
    { id: '5', name: 'Medicine', slug: 'medicine' },
    { id: '6', name: 'Sports & Outdoor', slug: 'sports-outdoor' },
    { id: '7', name: "Baby's & Toys", slug: 'babies-toys' },
    { id: '8', name: 'Groceries & Pets', slug: 'groceries-pets' },
    { id: '9', name: 'Health & Beauty', slug: 'health-beauty' },
  ],
  onCategoryClick,
}) => {
  return (
    <div className="hidden lg:block w-56 flex-shrink-0">
      <ul className="space-y-4">
        {categories.map((category) => (
          <li key={category.id}>
            {onCategoryClick ? (
              <button
                onClick={() => onCategoryClick(category.slug)}
                className="w-full text-left text-sm text-gray-700 hover:text-primary-DEFAULT transition-colors font-medium"
              >
                {category.name}
              </button>
            ) : (
              <Link
                to={`/shop?category=${category.slug}`}
                className="text-sm text-gray-700 hover:text-primary-DEFAULT transition-colors font-medium"
              >
                {category.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySidebar;