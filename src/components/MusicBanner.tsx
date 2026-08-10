import React from 'react';
import { Link } from 'react-router-dom';

const MusicBanner: React.FC = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-[1170px] mx-auto px-4">
        <div className="bg-[#1A1A1A] rounded-lg overflow-hidden relative">
          <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12 lg:p-16">
            <div className="flex-1 text-center md:text-left z-10">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                Enhance Your Music Experience
              </h2>
              <p className="text-base md:text-lg text-gray-300 mb-6 max-w-md mx-auto md:mx-0">
                Premium sound quality for the ultimate listening experience
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-8 py-3 bg-red-600 text-white font-medium rounded hover:bg-red-700 transition-colors"
              >
                Buy Now!
              </Link>
            </div>
            <div className="flex-1 mt-6 md:mt-0 md:ml-8">
              <img
                src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&h=400&fit=crop"
                alt="Music"
                className="w-full max-w-xs mx-auto md:mx-0 object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MusicBanner;