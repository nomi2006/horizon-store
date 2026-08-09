import React from 'react';
import { Link } from 'react-router-dom';

interface MusicBannerProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
}

const MusicBanner: React.FC<MusicBannerProps> = ({
  title = 'Enhance Your Music Experience',
  subtitle = 'Premium sound quality for the ultimate listening experience',
  ctaText = 'Buy Now!',
  ctaLink = '/shop',
  imageSrc = 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=600&fit=crop&crop=center',
  imageAlt = 'Music Experience',
  className = '',
}) => {
  return (
    <section className={`py-12 md:py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="bg-dark-DEFAULT rounded-lg overflow-hidden relative">
          <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12 lg:p-16">
            {/* Left Content */}
            <div className="flex-1 text-center md:text-left z-10">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                {title}
              </h2>
              <p className="text-base md:text-lg text-gray-300 mb-6 max-w-md mx-auto md:mx-0">
                {subtitle}
              </p>
              <Link
                to={ctaLink}
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary-DEFAULT text-white font-medium rounded hover:bg-primary-dark transition-colors"
              >
                {ctaText}
              </Link>
            </div>

            {/* Right Image */}
            <div className="flex-1 mt-6 md:mt-0 md:ml-8">
              <div className="relative max-w-xs mx-auto md:mx-0">
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="w-full h-auto object-contain"
                  loading="lazy"
                />
                {/* Decorative gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-DEFAULT/20 to-transparent pointer-events-none rounded-lg"></div>
              </div>
            </div>
          </div>

          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-DEFAULT/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-DEFAULT/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </div>
      </div>
    </section>
  );
};

export default MusicBanner;