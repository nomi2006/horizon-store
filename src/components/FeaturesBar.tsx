import React from 'react';
import { Truck, Headphones, RefreshCw } from 'lucide-react';

const FeaturesBar: React.FC = () => {
  const features = [
    { icon: Truck, title: 'FREE AND FAST DELIVERY', desc: 'Free delivery for all orders over $140' },
    { icon: Headphones, title: '24/7 CUSTOMER SERVICE', desc: 'Friendly 24/7 customer support' },
    { icon: RefreshCw, title: 'MONEY BACK GUARANTEE', desc: 'We return money within 30 days' },
  ];

  return (
    <section className="py-12 md:py-16 border-t border-gray-200">
      <div className="max-w-[1170px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {features.map((f, i) => (
            <div key={i} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1A1A1A] text-white rounded-full mb-4">
                <f.icon className="w-7 h-7" />
              </div>
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesBar;