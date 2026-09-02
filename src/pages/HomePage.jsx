import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { productService } from '../services/productService';
import ProductCard from '../components/ProductCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import TopBar from '../components/TopBar';
import Navbar from '../components/Navbar';
import CategorySidebar from '../components/CategorySidebar';
import FeaturesBar from '../components/FeaturesBar';
import BestSelling from '../components/BestSelling';
import FlashSales from '../components/FlashSales';
import MusicBanner from '../components/MusicBanner';
import ExploreProducts from '../components/ExploreProducts';
import NewArrival from '../components/NewArrival';

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
    { name: 'Phones', icon: Smartphone },
    { name: 'Computers', icon: Monitor },
    { name: 'SmartWatch', icon: Watch },
    { name: 'Camera', icon: Camera },
    { name: 'HeadPhones', icon: Headphones },
    { name: 'Gaming', icon: Gamepad2 },
  ];

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Navbar />

      <main>
        {/* HERO */}
        <section className="bg-white">
          <div className="max-w-[1170px] mx-auto px-4 sm:px-6 lg:px-0">
            <div className="home-hero flex flex-col lg:flex-row">

              {/* CATEGORY SIDEBAR - DESKTOP ONLY */}
              <div className="hidden lg:block w-[255px] flex-shrink-0 pt-[32px] pr-[20px]">
                <CategorySidebar />
              </div>

              <div className="hidden lg:block w-px bg-[#E5E5E5]" />

              {/* HERO CONTENT */}
              <div className="home-hero-content w-full min-w-0 pt-4 sm:pt-5 lg:pl-[30px] lg:pt-[27px]">
                <div
                  className="
            relative
            w-full
            bg-black
            overflow-hidden

            min-h-[430px]
            sm:min-h-[440px]
            md:min-h-[400px]
            lg:h-[344px]
            lg:min-h-0
          "
                >

                  {/* HERO TEXT */}
                  <div
                    className="
              relative
              z-10
              flex
              flex-col
              justify-center

              w-full
              h-full

              px-6
              sm:px-8
              md:px-10

              pt-8
              pb-[150px]

              sm:pt-8
              sm:pb-[165px]

              md:pt-8
              md:pb-[150px]

              lg:absolute
              lg:left-[46px]
              lg:top-0
              lg:w-auto
              lg:h-full
              lg:px-0
              lg:pt-0
              lg:pb-0
            "
                  >

                    {/* APPLE BRAND */}
                    <div className="flex items-center mb-4 sm:mb-[18px]">
                      <img
                        src={appleLogo}
                        alt="Apple"
                        className="
                  object-contain
                  flex-shrink-0
                  w-[32px]
                  h-[40px]
                  sm:w-[36px]
                  sm:h-[44px]
                  lg:w-[40px]
                  lg:h-[49px]
                "
                      />

                      <span
                        className="
                  text-white
                  text-[12px]
                  sm:text-[13px]
                  font-normal
                  ml-3
                  sm:ml-4
                "
                      >
                        iPhone 14 Series
                      </span>
                    </div>

                    {/* HERO HEADING */}
                    <h1
                      className="
                !text-white
                !font-semibold
                !m-0

                !text-[30px]
                sm:!text-[36px]
                md:!text-[42px]
                lg:!text-5xl

                !leading-[1.15]
                tracking-[0.02em]
                sm:tracking-[0.03em]
                lg:tracking-[0.04em]
              "
                    >
                      Up to 10%
                      <br />
                      off Voucher
                    </h1>

                    {/* SHOP NOW */}
                    <Link
                      to="/shop"
                      className="
                group
                inline-flex
                items-center
                gap-[8px]
                w-fit

                mt-5
                sm:mt-6

                text-white
                text-[13px]
                sm:text-[14px]
                font-medium

                border-b
                border-white
                pb-[5px]
              "
                    >
                      <span>Shop Now</span>

                      <span
                        className="
                  text-[18px]
                  sm:text-[20px]
                  leading-none
                  transition-transform
                  group-hover:translate-x-1
                "
                      >
                        →
                      </span>
                    </Link>
                  </div>

                  {/* HERO IMAGE */}
                  <img
                    src={heroImage}
                    alt="iPhone 14 Series"
                    className="
  absolute
  object-contain
  z-[1]

  /* MOBILE - CENTERED */
  w-[250px]
  h-auto
  left-1/2
  -translate-x-1/2
  right-auto
  bottom-[28px]

  /* LARGE PHONE */
  sm:w-[320px]
  sm:right-[-20px]
  sm:left-auto
  sm:translate-x-0
  sm:bottom-[20px]

  /* TABLET */
  md:w-[370px]
  md:right-[-15px]
  md:left-auto
  md:translate-x-0
  md:bottom-[12px]

  /* DESKTOP - ORIGINAL FIGMA POSITION */
  lg:w-[496px]
  lg:h-[352px]
  lg:left-[388px]
  lg:right-auto
  lg:translate-x-0
  lg:top-[16px]
  lg:bottom-auto
"
                  />

                  {/* SLIDER DOTS */}
                  <div
                    className="
              absolute
              bottom-[10px]
              left-1/2
              -translate-x-1/2
              flex
              items-center
              gap-[8px]
              z-20
            "
                  >
                    <span className="w-[7px] h-[7px] sm:w-[8px] sm:h-[8px] rounded-full bg-[#777]" />
                    <span className="w-[7px] h-[7px] sm:w-[8px] sm:h-[8px] rounded-full bg-[#777]" />
                    <span className="w-[8px] h-[8px] sm:w-[9px] sm:h-[9px] rounded-full bg-[#DB4444] ring-1 ring-white" />
                    <span className="w-[7px] h-[7px] sm:w-[8px] sm:h-[8px] rounded-full bg-[#777]" />
                    <span className="w-[7px] h-[7px] sm:w-[8px] sm:h-[8px] rounded-full bg-[#777]" />
                  </div>

                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FLASH SALES */}
        <FlashSales
          products={featured}
          title="Flash Sales"
          subtitle="Today's"
          viewAllLink="/shop"
        />

        {/* BROWSE BY CATEGORY */}
        <section className="w-full bg-white border-t border-[#E5E5E5]">
          <div className="max-w-[1170px] mx-auto px-4 lg:px-0 pt-10 md:pt-[70px] pb-10 md:pb-[70px]">

            {/* SECTION HEADER */}
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

                {/* ✅ CATEGORY HEADING – RESPONSIVE */}
                <h2
                  className="
                    !m-0
                    !p-0
                    !text-2xl sm:!text-3xl md:!text-4xl
                    !leading-tight
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

            {/* ✅ CATEGORY CARDS – RESPONSIVE GRID WITH ADAPTIVE GAPS */}
            <div
              className="
                category-grid
                grid
                grid-cols-2
                sm:grid-cols-3
                lg:grid-cols-6
                gap-4 md:gap-[30px]
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

        {/* BEST SELLING PRODUCTS */}
        <BestSelling
          products={bestSellers}
          title="Best Selling Products"
          subtitle="This Month"
          viewAllLink="/shop"
        />

        <MusicBanner />
        <ExploreProducts products={featured} />
        <NewArrival />

        <FeaturesBar />
      </main>
    </div>
  );
}