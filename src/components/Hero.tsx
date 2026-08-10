import React from 'react';
import { Link } from 'react-router-dom';
import CategorySidebar from './CategorySidebar';

interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  imageSrc?: string;
  imageAlt?: string;
  showSidebar?: boolean;
}

const Hero: React.FC<HeroProps> = ({
  title = 'iPhone 14 Series',
  subtitle = 'Up to 10% off Voucher',
  ctaText = 'Shop Now →',
  ctaLink = '/shop',
  imageSrc = 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=600&h=600&fit=crop&crop=center',
  imageAlt = 'iPhone 14 Series',
  showSidebar = true,
}) => {
  return (
    <section className="bg-[#1A1A1A] text-white">
      <div className="max-w-[1170px] mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {showSidebar && (
            <div className="hidden lg:block">
              <div className="border-r border-gray-700 pr-8">
                <CategorySidebar />
              </div>
            </div>
          )}
          <div className="flex-1 bg-[#2D2D2D] rounded-lg overflow-hidden relative">
            <div className="flex flex-col md:flex-row items-center justify-between p-6 md:p-12 lg:p-16">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-block px-4 py-1 bg-red-600 text-white text-xs font-semibold rounded mb-4">
                  New Arrival
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                  {title}
                </h1>
                <p className="text-base md:text-lg text-gray-300 mb-6">
                  {subtitle}
                </p>
                <Link
                  to={ctaLink}
                  className="inline-flex items-center gap-2 text-white font-medium hover:text-red-600 transition-colors border-b-2 border-red-600 pb-1"
                >
                  {ctaText}
                </Link>
              </div>
              <div className="flex-1 mt-6 md:mt-0 md:ml-8">
                <div className="relative max-w-sm mx-auto md:mx-0">
                  <img
                    src={imageSrc}
                    alt={imageAlt}
                    className="w-full h-auto object-contain"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/20 to-transparent pointer-events-none rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;