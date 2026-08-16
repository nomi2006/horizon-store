import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import Navbar from '../components/Navbar';
import CategorySidebar from '../components/CategorySidebar';
import MusicBanner from '../components/MusicBanner';
import NewArrival from '../components/NewArrival';
import TopBar from '../components/TopBar';
import FeaturesBar from '../components/FeaturesBar';
import FlashSales from '../components/FlashSales';
import BestSelling from '../components/BestSelling';

import heroImage from '../assets/iphone.jpg';
import appleLogo from '../assets/apple.png';

import {
  Smartphone,
  Monitor,
  Watch,
  Camera,
  Headphones,
  Gamepad2,
} from 'lucide-react';

export function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, bestRes] = await Promise.all([
          productService.getFeatured(),
          productService.getBestSellers(),
        ]);

        // console.log('FLASH SALES PRODUCTS:', featuredRes.data);
        // console.log(
        //   'FLASH SALES COUNT:',
        //   featuredRes.data?.length
        // );

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
    {
      name: 'Phones',
      icon: Smartphone,
    },
    {
      name: 'Computers',
      icon: Monitor,
    },
    {
      name: 'SmartWatch',
      icon: Watch,
    },
    {
      name: 'Camera',
      icon: Camera,
    },
    {
      name: 'HeadPhones',
      icon: Headphones,
    },
    {
      name: 'Gaming',
      icon: Gamepad2,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Navbar />

      <main>
        {/* HERO */}
        <section className="bg-white">
          <div className="max-w-[1170px] mx-auto px-4">
            <div className="flex">
              <div className="hidden lg:block w-[255px] flex-shrink-0 pt-[32px] pr-[20px]">
                <CategorySidebar />
              </div>

              <div className="hidden lg:block w-px bg-[#E5E5E5]" />

              <div className="pl-[30px] pt-[27px]">
                <div
                  className="relative bg-black overflow-hidden"
                  style={{
                    width: '892px',
                    height: '344px',
                  }}
                >
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
                      Up to 10%
                      <br />
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

        {/* ================= FLASH SALES ================= */}
        <FlashSales
          products={featured}
          title="Flash Sales"
          subtitle="Today's"
          viewAllLink="/shop"
        />

        {/* ================= BROWSE BY CATEGORY ================= */}
        <section className="w-full bg-white border-t border-[#E5E5E5]">
          <div className="max-w-[1170px] mx-auto px-4 pt-[70px] pb-[70px]">

            {/* ================= SECTION HEADER ================= */}
            <div className="flex items-end justify-between mb-[30px]">

              <div>
                {/* RED LABEL */}
                <div className="flex items-center gap-[10px] mb-[14px]">
                  <span
                    className="
              block
              w-[20px]
              h-[40px]
              bg-[#DB4444]
              rounded-[3px]
            "
                  />

                  <span
                    className="
              text-[14px]
              leading-[20px]
              font-semibold
              text-[#DB4444]
            "
                  >
                    Categories
                  </span>
                </div>

                {/* HEADING */}
                <h2
                  className="
            !m-0
            !p-0
            !text-[32px]
            !leading-[38px]
            !font-semibold
            !text-black
          "
                >
                  Browse By Category
                </h2>
              </div>

              {/* VIEW ALL */}
              <Link
                to="/shop"
                className="
          text-[14px]
          leading-[20px]
          text-[#DB4444]
          hover:text-[#c73636]
          transition-colors
          mb-[5px]
        "
              >
                View All →
              </Link>
            </div>

            {/* ================= CATEGORY CARDS ================= */}
            <div
              className="
        grid
        grid-cols-2
        sm:grid-cols-3
        lg:grid-cols-6
        gap-[30px]
      "
            >
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.name;

                return (
                  <Link
                    key={cat.name}
                    to={`/shop?category=${cat.name.toLowerCase()}`}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`
              group
              h-[145px]
              flex
              flex-col
              items-center
              justify-center
              border
              rounded-[4px]
              transition-all
              duration-200

              ${isSelected
                        ? `
                    bg-[#DB4444]
                    border-[#DB4444]
                    text-white
                  `
                        : `
                    bg-white
                    border-[#E5E5E5]
                    text-black
                    hover:border-[#DB4444]
                    hover:text-[#DB4444]
                  `
                      }
            `}
                  >
                    {/* CATEGORY ICON */}
                    <Icon
                      size={40}
                      strokeWidth={1.5}
                      className={`
                mb-[18px]
                transition-colors
                duration-200
                ${isSelected
                          ? 'text-white'
                          : 'text-black group-hover:text-[#DB4444]'
                        }
              `}
                    />

                    {/* CATEGORY NAME */}
                    <span
                      className={`
                text-[14px]
                leading-[20px]
                transition-colors
                duration-200
                ${isSelected
                          ? 'text-white'
                          : 'text-black'
                        }
              `}
                    >
                      {cat.name}
                    </span>
                  </Link>
                );
              })}
            </div>

          </div>
        </section>
        {/* ================= BEST SELLING PRODUCTS ================= */}
        <BestSelling
          products={bestSellers}
          title="Best Selling Products"
          subtitle="This Month"
          viewAllLink="/shop"
        />

        <MusicBanner />
        <NewArrival />
        <FeaturesBar />
      </main>
    </div>
  );
}
