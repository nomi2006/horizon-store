import React, { useState } from 'react';

const TopBar: React.FC = () => {
  const [language, setLanguage] = useState('English');

  return (
    <div className="bg-[#1A1A1A] text-white text-xs md:text-sm py-2 px-4 w-full border-b border-gray-700">
      <div className="max-w-[1170px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="text-center sm:text-left">
          <span>
            Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!
          </span>
          <a href="/shop" className="font-bold underline ml-1 hover:text-red-400 transition-colors">
            ShopNow
          </a>
        </div>
        <div className="flex items-center gap-1">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-white text-xs md:text-sm focus:outline-none cursor-pointer hover:text-red-400 transition-colors"
          >
            <option value="English" className="text-black">English</option>
            <option value="Spanish" className="text-black">Spanish</option>
            <option value="French" className="text-black">French</option>
          </select>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TopBar;