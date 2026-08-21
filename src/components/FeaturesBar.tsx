import React from "react";
import { Truck, Headphones, ShieldCheck } from "lucide-react";

const FeaturesBar: React.FC = () => {
  const features = [
    { icon: Truck, title: "FREE AND FAST DELIVERY", desc: "Free delivery for all orders over $140" },
    { icon: Headphones, title: "24/7 CUSTOMER SERVICE", desc: "Friendly 24/7 customer support" },
    { icon: ShieldCheck, title: "MONEY BACK GUARANTEE", desc: "We return money within 30 days" },
  ];

  return (
    <section className="w-full bg-white py-10 md:py-[70px]">
      <div className="max-w-[1170px] mx-auto px-4 lg:px-0">
        <div className="flex flex-wrap justify-center items-start gap-4 md:gap-8 lg:gap-[88px]">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="flex flex-col items-center gap-4 md:gap-6 w-full sm:w-auto flex-1 min-w-[180px] max-w-[280px]"
              >
                {/* Icon wrapper */}
                <div className="w-16 h-16 md:w-[80px] md:h-[80px] rounded-full bg-[#DCDCDC] flex items-center justify-center shrink-0">
                  <div className="w-12 h-12 md:w-[64px] md:h-[64px] rounded-full bg-black flex items-center justify-center">
                    <Icon size={28} className="md:w-[40px] md:h-[40px] text-white" strokeWidth={2} />
                  </div>
                </div>
                {/* Text */}
                <div className="text-center">
                  <h3 className="m-0 text-black text-base md:text-[20px] leading-tight font-semibold">
                    {feature.title}
                  </h3>
                  <p className="m-0 text-[#666666] text-sm md:text-[14px] leading-relaxed font-normal">
                    {feature.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesBar;