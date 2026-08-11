import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

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
    <aside className="hidden lg:block w-[220px] flex-shrink-0">
      <ul className="space-y-[18px]">
        {categories.map((category) => (
          <li key={category.id}>
            {onCategoryClick ? (
              <button
                onClick={() => onCategoryClick(category.slug)}
                className="group w-full flex items-center justify-between text-left text-[14px] leading-5 text-[#111827] hover:text-[#DB4444] transition-colors"
              >
                <span>{category.name}</span>

                {(category.slug === 'womens-fashion' ||
                  category.slug === 'mens-fashion') && (
                  <ChevronRight
                    size={16}
                    strokeWidth={1.8}
                    className="text-black"
                  />
                )}
              </button>
            ) : (
              <Link
                to={`/shop?category=${category.slug}`}
                className="group flex items-center justify-between text-[14px] leading-5 text-[#111827] hover:text-[#DB4444] transition-colors"
              >
                <span>{category.name}</span>

                {(category.slug === 'womens-fashion' ||
                  category.slug === 'mens-fashion') && (
                  <ChevronRight
                    size={16}
                    strokeWidth={1.8}
                    className="text-black"
                  />
                )}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default CategorySidebar;