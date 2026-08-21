import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const TopBar: React.FC = () => {
  const [language, setLanguage] = useState('English');

  return (
    <div className="w-full bg-[#1A1A1A] text-white h-[36px]">
      <div className="max-w-[1170px] h-full mx-auto px-4 lg:px-0 flex items-center justify-center relative">
        <div className="topbar-message flex-1 text-center text-[10px] sm:text-[12px] leading-none whitespace-nowrap overflow-hidden text-ellipsis">
          <span>
            Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!
          </span>

          <a
            href="/shop"
            className="ml-1 font-semibold underline hover:text-gray-300 transition-colors"
          >
            ShopNow
          </a>
        </div>

        <div className="absolute right-4 lg:right-0 flex items-center gap-1">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="appearance-none bg-transparent border-none outline-none cursor-pointer text-[12px] text-white pr-1"
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
            size={14}
            strokeWidth={1.8}
            className="pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
};

export default TopBar;