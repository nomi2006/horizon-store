import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  id: string;
  name: string;
  slug: string;
  icon: React.ReactNode;
  className?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  name,
  slug,
  icon,
  className = '',
}) => {
  return (
    <Link
      to={`/shop?category=${slug}`}
      className={`group flex flex-col items-center justify-center p-6 border border-gray-200 rounded-lg hover:border-primary-DEFAULT hover:bg-primary-DEFAULT/5 transition-all duration-200 ${className}`}
    >
      <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-3xl md:text-4xl text-gray-600 group-hover:text-primary-DEFAULT transition-colors">
        {icon}
      </div>
      <span className="text-sm md:text-base font-medium text-dark-DEFAULT mt-3 group-hover:text-primary-DEFAULT transition-colors">
        {name}
      </span>
    </Link>
  );
};

export default CategoryCard;