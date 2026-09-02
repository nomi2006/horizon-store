import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const TopBar: React.FC = () => {
  const [language, setLanguage] = useState('English');

  return (
    <div className="w-full bg-[#1A1A1A] text-white min-h-[36px]">
      <div
        className="
          max-w-[1170px]
          min-h-[36px]
          mx-auto
          px-4 sm:px-6 lg:px-0
          flex
          items-center
          justify-center
          relative
        "
      >
        <div
          className="
            w-full
            text-center
            text-[9px]
            xs:text-[10px]
            sm:text-[12px]
            leading-tight
            py-2
            pr-16
            sm:pr-20
          "
        >
          <span>
            Summer Sale For All Swim Suits And Free Express Delivery
            <span className="hidden sm:inline"> - </span>
            <span className="sm:hidden"> </span>
          </span>

          <a
            href="/shop"
            className="
              ml-1
              font-semibold
              underline
              whitespace-nowrap
              hover:text-gray-300
              transition-colors
            "
          >
            ShopNow
          </a>
        </div>

        <div
          className="
            absolute
            right-3
            sm:right-4
            lg:right-0
            top-1/2
            -translate-y-1/2
            flex
            items-center
            gap-1
          "
        >
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="
              appearance-none
              bg-transparent
              border-none
              outline-none
              cursor-pointer
              text-[10px]
              sm:text-[12px]
              text-white
              pr-1
            "
            aria-label="Language"
          >
            <option value="English" className="text-black">
              English
            </option>

            <option value="Spanish" className="text-black">
              Spanish
            </option>

            <option value="French" className="text-black">
              French
            </option>
          </select>

          <ChevronDown
            size={13}
            strokeWidth={1.8}
            className="pointer-events-none shrink-0"
          />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
