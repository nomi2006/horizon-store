import React from 'react';
import { Link } from 'react-router-dom';

const NewArrival: React.FC = () => {
  const items = [
    {
      id: 1,
      title: "Women's Collections",
      desc: 'Featured woman collections that give you another vibe.',
      img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=500&fit=crop',
      link: '/shop',
      badge: 'New',
    },
    {
      id: 2,
      title: 'PlayStation 5',
      desc: 'Black and White version of the PS5 coming Out on sale.',
      img: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400&h=500&fit=crop',
      link: '/shop',
      badge: 'Featured',
    },
    {
      id: 3,
      title: 'GUCCI INTENSE OUD',
      desc: 'Premium perfume for the discerning individual.',
      img: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=500&fit=crop',
      link: '/shop',
      badge: 'Premium',
    },
    {
      id: 4,
      title: 'Amazon Wireless Speed',
      desc: 'Next generation wireless technology.',
      img: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=500&fit=crop',
      link: '/shop',
      badge: 'New',
    },
  ];

  const first = items[0];
  const rest = items.slice(1);

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-[1170px] mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">New Arrival</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Large item */}
          <div className="md:row-span-2 relative group overflow-hidden rounded-md bg-[#1A1A1A]">
            <Link to={first.link} className="block h-full">
              <div className="relative h-64 md:h-full min-h-[300px]">
                <img src={first.img} alt={first.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <span className="bg-red-600 text-xs font-bold px-2 py-1 rounded">{first.badge}</span>
                  <h3 className="text-xl font-bold mt-2">{first.title}</h3>
                  <p className="text-gray-300 text-sm">{first.desc}</p>
                  <Link to={first.link} className="inline-block mt-2 border-b border-red-600 pb-1 hover:text-red-400">Shop Now →</Link>
                </div>
              </div>
            </Link>
          </div>
          {/* 3 small items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rest.map((item) => (
              <div key={item.id} className="relative group overflow-hidden rounded-md bg-[#1A1A1A]">
                <Link to={item.link} className="block h-full">
                  <div className="relative h-48">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4 text-white">
                      <span className="bg-red-600 text-xs font-bold px-2 py-0.5 rounded">{item.badge}</span>
                      <h4 className="text-sm font-bold mt-1">{item.title}</h4>
                      <Link to={item.link} className="text-xs border-b border-red-600 pb-0.5 hover:text-red-400">Shop Now →</Link>
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