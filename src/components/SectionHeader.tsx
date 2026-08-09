import React from 'react';
import { Link } from 'react-router-dom';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  viewAllText?: string;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  viewAllLink,
  viewAllText = 'See All →',
  className = '',
}) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-8 ${className}`}>
      <div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-dark-DEFAULT">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm md:text-base text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
      {viewAllLink && (
        <Link
          to={viewAllLink}
          className="text-sm font-medium text-primary-DEFAULT hover:text-primary-dark transition-colors mt-2 md:mt-0 inline-flex items-center gap-1"
        >
          {viewAllText}
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;