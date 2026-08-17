import React from "react";
import { Truck, Headphones, ShieldCheck } from "lucide-react";

const FeaturesBar: React.FC = () => {
  const features = [
    {
      icon: Truck,
      title: "FREE AND FAST DELIVERY",
      desc: "Free delivery for all orders over $140",
      width: 249,
    },
    {
      icon: Headphones,
      title: "24/7 CUSTOMER SERVICE",
      desc: "Friendly 24/7 customer support",
      width: 262,
    },
    {
      icon: ShieldCheck,
      title: "MONEY BACK GUARANTEE",
      desc: "We return money within 30 days",
      width: 256,
    },
  ];

  return (
    <section className="w-full bg-white">
      {/* 
        This creates the white area between the previous section
        and the footer. The feature group is vertically centered
        inside this area.
      */}
      <div
        className="
          w-full
          h-[301px]
          flex
          justify-center
          pt-[20px]
        "
      >
        {/* ================= FEATURES GROUP ================= */}
        <div
          className="
            w-[943px]
            h-[161px]
            flex
            items-start
            gap-[88px]
          "
        >
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="
                  h-[161px]
                  flex
                  flex-col
                  items-center
                  justify-start
                  gap-[24px]
                  shrink-0
                "
                style={{
                  width: `${feature.width}px`,
                }}
              >
                {/* ================= ICON ================= */}
                <div
                  className="
                    w-[80px]
                    h-[80px]
                    rounded-full
                    bg-[#DCDCDC]
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >
                  <div
                    className="
                      w-[64px]
                      h-[64px]
                      rounded-full
                      bg-[#000000]
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Icon
                      size={40}
                      strokeWidth={2}
                      className="text-white"
                    />
                  </div>
                </div>

                {/* ================= TEXT ================= */}
                <div
                  className="
                    flex
                    flex-col
                    items-center
                    justify-start
                    text-center
                  "
                >
                  <h3
                    className="
                      m-0
                      p-0
                      text-black
                      text-[20px]
                      leading-[28px]
                      font-semibold
                      whitespace-nowrap
                    "
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    {feature.title}
                  </h3>

                  <p
                    className="
                      m-0
                      p-0
                      text-[#666666]
                      text-[14px]
                      leading-[21px]
                      font-normal
                      whitespace-nowrap
                    "
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 400,
                    }}
                  >
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