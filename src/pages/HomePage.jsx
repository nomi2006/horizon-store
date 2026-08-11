import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import Navbar from '../components/Navbar';
import CategorySidebar from '../components/CategorySidebar';
import CountdownTimer from '../components/CountdownTimer';
import MusicBanner from '../components/MusicBanner';
import NewArrival from '../components/NewArrival';
import TopBar from '../components/TopBar';
import FeaturesBar from '../components/FeaturesBar';

import heroImage from '../assets/iphone.jpg';
import appleLogo from '../assets/apple.png';

export function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, bestRes] = await Promise.all([
          productService.getFeatured(),
          productService.getBestSellers(),
        ]);
        setFeatured(featuredRes.data || []);
        setBestSellers(bestRes.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = [
    { name: 'Phones', emoji: '📱' },
    { name: 'Computers', emoji: '💻' },
    { name: 'SmartWatch', emoji: '⌚' },
    { name: 'Camera', emoji: '📷' },
    { name: 'HeadPhones', emoji: '🎧' },
    { name: 'Gaming', emoji: '🎮' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Navbar />

      <main>
        <section className="bg-white">
          <div className="max-w-[1170px] mx-auto px-4">
            <div className="flex">
              <div className="hidden lg:block w-[255px] flex-shrink-0 pt-[32px] pr-[20px]">
                <CategorySidebar />
              </div>
              <div className="hidden lg:block w-px bg-[#E5E5E5]" />
              {/* HERO */}
              <div className="pl-[30px] pt-[27px]">
                <div
                  className="relative bg-black overflow-hidden"
                  style={{
                    width: '892px',
                    height: '344px',
                  }}
                >
                  {/* LEFT CONTENT */}
                  <div className="absolute left-[46px] top-0 h-full z-10 flex flex-col justify-center">
                    <div className="flex items-center mb-[18px]">
                      <img
                        src={appleLogo}
                        alt="Apple"
                        className="object-contain flex-shrink-0"
                        style={{
                          width: '40px',
                          height: '49px',
                        }}
                      />
                      <span className="text-white text-[13px] font-normal ml-[16px]">
                        iPhone 14 Series
                      </span>
                    </div>
                                  <h1
                      className="
                      !text-white
                      !font-semibold
                      !m-0
                      text-[48px]
                      leading-[60px]
                      tracking-[0.04em]
                    "
                    >
                      Up to 10%<br />
                      off Voucher
                    </h1>
                    <Link
                      to="/shop"
                      className="
                        group
                        inline-flex
                        items-center
                        gap-[8px]
                        w-fit
                        mt-[20px]
                        text-white
                        text-[14px]
                        font-medium
                        border-b
                        border-white
                        pb-[5px]
                      "
                    >
                      <span>Shop Now</span>
                      <span className="text-[20px] leading-none transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </div>

                  <img
                    src={heroImage}
                    alt="iPhone 14 Series"
                    className="absolute object-contain"
                    style={{
                      width: '496px',
                      height: '352px',
                      left: '396px',
                      top: '16px',
                    }}
                  />
                  <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2 flex items-center gap-[8px] z-20">
                    <span className="w-[8px] h-[8px] rounded-full bg-[#777]" />
                    <span className="w-[8px] h-[8px] rounded-full bg-[#777]" />
                    <span className="w-[9px] h-[9px] rounded-full bg-[#DB4444] ring-1 ring-white" />
                    <span className="w-[8px] h-[8px] rounded-full bg-[#777]" />
                    <span className="w-[8px] h-[8px] rounded-full bg-[#777]" />
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="max-w-[1170px] mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Flash Sales
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Today's
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <CountdownTimer
                  targetDate={
                    new Date(Date.now() + 24 * 60 * 60 * 1000)
                  }
                />
              </div>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[30px]">
                {featured.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showSaleBadge
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-12 md:py-16 border-t border-gray-200">
          <div className="max-w-[1170px] mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Browse By Category
              </h2>
              <Link
                to="/shop"
                className="text-sm text-[#DB4444] hover:text-red-700"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[60px]">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  to={`/shop?category=${cat.name.toLowerCase()}`}
                  className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-md hover:border-[#DB4444] hover:bg-red-50 transition-all"
                >
                  <span className="text-4xl mb-2">
                    {cat.emoji}
                  </span>
                  <span className="text-sm text-gray-900">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-gray-50">
          <div className="max-w-[1170px] mx-auto px-4">

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Best Selling Products
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Customer favorites you'll love
                </p>
              </div>
              <Link
                to="/shop"
                className="text-sm text-[#DB4444] hover:text-red-700"
              >
                View All →
              </Link>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[30px]">
                {bestSellers.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showSaleBadge
                  />
                ))}
              </div>
            )}
          </div>
        </section>
        <MusicBanner />
        <NewArrival />
        <FeaturesBar />
      </main>
    </div>
  );
}