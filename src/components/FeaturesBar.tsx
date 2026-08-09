import React from 'react';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeaturesBar: React.FC = () => {
  const features: Feature[] = [
    {
      id: '1',
      title: 'FREE AND FAST DELIVERY',
      description: 'Free delivery for all orders over $140',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      ),
    },
    {
      id: '2',
      title: '24/7 CUSTOMER SERVICE',
      description: 'Friendly 24/7 customer support',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0a9 9 0 01-12.728 0m12.728 0a9 9 0 01-12.728 0m-5.636-5.636a9 9 0 010-12.728m0 0a9 9 0 0112.728 0" />
        </svg>
      ),
    },
    {
      id: '3',
      title: 'MONEY BACK GUARANTEE',
      description: 'We return money within 30 days',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="section-padding border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature) => (
            <div key={feature.id} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-dark-DEFAULT text-white rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="text-base md:text-lg font-bold text-dark-DEFAULT mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesBar;