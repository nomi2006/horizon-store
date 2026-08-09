import React from 'react';
import { Link } from 'react-router-dom';

interface NewArrivalItem {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  badge?: string;
  badgeColor?: string;
}

interface NewArrivalProps {
  items?: NewArrivalItem[];
  title?: string;
  className?: string;
}

const NewArrival: React.FC<NewArrivalProps> = ({
  items = [
    {
      id: '1',
      title: "Women's Collections",
      description: 'Featured woman collections that give you another vibe.',
      image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=500&fit=crop&crop=center',
      link: '/shop?category=womens-fashion',
      badge: 'New',
      badgeColor: 'bg-primary-DEFAULT',
    },
    {
      id: '2',
      title: 'PlayStation 5',
      description: 'Black and White version of the PS5 coming Out on sale.',
      image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400&h=500&fit=crop&crop=center',
      link: '/shop?category=gaming',
      badge: 'Featured',
      badgeColor: 'bg-primary-DEFAULT',
    },
    {
      id: '3',
      title: 'GUCCI INTENSE OUD',
      description: 'Premium perfume for the discerning individual.',
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=500&fit=crop&crop=center',
      link: '/shop?category=beauty',
      badge: 'Premium',
      badgeColor: 'bg-gold-DEFAULT',
    },
    {
      id: '4',
      title: 'Amazon Wireless Speed',
      description: 'Next generation wireless technology for seamless connectivity.',
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=500&fit=crop&crop=center',
      link: '/shop?category=electronics',
      badge: 'New',
      badgeColor: 'bg-primary-DEFAULT',
    },
  ],
  title = 'New Arrival',
  className = '',
}) => {
  // Layout: First item takes 2 columns, remaining 3 items take 1 column each
  const firstItem = items[0];
  const remainingItems = items.slice(1, 4);

  return (
    <section className={`py-12 md:py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-dark-DEFAULT mb-6">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* First Item - Large (2 columns on desktop, 1 on mobile) */}
          <div className="md:row-span-2 relative group overflow-hidden rounded-lg bg-dark-DEFAULT">
            <Link to={firstItem.link} className="block h-full">
              <div className="relative h-64 md:h-full min-h-[300px] md:min-h-[400px]">
                <img
                  src={firstItem.image}
                  alt={firstItem.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-DEFAULT/70 via-dark-DEFAULT/20 to-transparent"></div>
                
                {/* Badge */}
                {firstItem.badge && (
                  <span className={`absolute top-4 left-4 px-3 py-1 text-xs font-bold text-white rounded ${firstItem.badgeColor || 'bg-primary-DEFAULT'}`}>
                    {firstItem.badge}
                  </span>
                )}

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl md:text-2xl font-bold mb-2">
                    {firstItem.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-300 mb-3 max-w-md">
                    {firstItem.description}
                  </p>
                  <Link
                    to={firstItem.link}
                    className="inline-flex items-center gap-2 text-white font-medium hover:text-primary-DEFAULT transition-colors border-b-2 border-primary-DEFAULT pb-1"
                  >
                    Shop Now →
                  </Link>
                </div>
              </div>
            </Link>
          </div>

          {/* Remaining Items - Grid (2 columns) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 md:gap-6">
            {remainingItems.map((item) => (
              <div key={item.id} className="relative group overflow-hidden rounded-lg bg-dark-DEFAULT">
                <Link to={item.link} className="block h-full">
                  <div className="relative h-48 md:h-[190px]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-DEFAULT/70 via-dark-DEFAULT/20 to-transparent"></div>
                    
                    {/* Badge */}
                    {item.badge && (
                      <span className={`absolute top-3 left-3 px-2 py-0.5 text-xs font-bold text-white rounded ${item.badgeColor || 'bg-primary-DEFAULT'}`}>
                        {item.badge}
                      </span>
                    )}

                    {/* Content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h4 className="text-sm md:text-base font-bold mb-1">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-300 mb-2 line-clamp-1">
                        {item.description}
                      </p>
                      <Link
                        to={item.link}
                        className="inline-flex items-center gap-1 text-xs text-white font-medium hover:text-primary-DEFAULT transition-colors border-b border-primary-DEFAULT pb-0.5"
                      >
                        Shop Now →
                      </Link>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewArrival;