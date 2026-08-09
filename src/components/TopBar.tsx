import React, { useState } from 'react';

const TopBar: React.FC = () => {
  const [language, setLanguage] = useState('English');

  return (
    <div className="bg-dark-DEFAULT text-white text-xs md:text-sm py-2 px-4">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        {/* Left side - Promotional text */}
        <div className="text-center sm:text-left">
          <span>
            Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!
          </span>
          <a href="/shop" className="font-semibold underline ml-1 hover:text-primary-DEFAULT transition-colors">
            ShopNow
          </a>
        </div>

        {/* Right side - Language selector */}
        <div className="flex items-center gap-1">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-white text-xs md:text-sm focus:outline-none cursor-pointer hover:text-primary-DEFAULT transition-colors"
          >
            <option value="English" className="text-dark-DEFAULT">English</option>
            <option value="Spanish" className="text-dark-DEFAULT">Spanish</option>
            <option value="French" className="text-dark-DEFAULT">French</option>
            <option value="German" className="text-dark-DEFAULT">German</option>
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