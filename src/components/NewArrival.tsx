import React from "react";
import { Link } from "react-router-dom";
import PS5 from "../assets/PS5.png"
import WomenPic from "../assets/women.jpg"
import SpeakerPic from "../assets/speakers.png"
import PerfumePic from "../assets/perfume.png"

const NewArrival: React.FC = () => {
  return (
    <section className="w-full bg-white">
      <div className="max-w-[1170px] mx-auto px-4 pt-[70px] pb-[70px]">

        {/* SECTION HEADING */}
        <div className="flex items-center gap-[18px] mb-[60px]">
          <span
            className="
              block
              w-[20px]
              h-[40px]
              bg-[#DB4444]
              rounded-[3px]
              flex-shrink-0
            "
          />

          <h2
            className="
              m-0
              text-[#DB4444]
              text-[16px]
              leading-[20px]
              font-semibold
            "
            style={{
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Featured
          </h2>
        </div>

        {/* NEW ARRIVAL GRID */}
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-[570px_570px]
            gap-[30px]
          "
        >
          {/* PS5-CARD */}
          <Link
            to="/shop"
            className="
              group
              relative
              block
              w-full
              h-[600px]
              overflow-hidden
              rounded-[4px]
              bg-[#0D0D0D]
              no-underline
            "
          >
            <img
              src={PS5}
              alt="PlayStation 5"
              className="
                absolute
                inset-0
                w-full
                h-full
                object-cover
                transition-transform
                duration-500
                group-hover:scale-[1.03]
              "
            />

            {/* DARK OVERLAY */}
            <div
              className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black
                via-black/20
                to-transparent
              "
            />

            {/* TEXT */}
            <div
              className="
                absolute
                left-[40px]
                bottom-[40px]
                z-10
                text-white
                max-w-[390px]
              "
            >
              <h3
                className="
                  m-0
                  text-[24px]
                  leading-[32px]
                  font-semibold
                "
                style={{
                  fontFamily: "Inter, sans-serif",
                }}
              >
                PlayStation 5
              </h3>

              <p
                className="
                  mt-[16px]
                  mb-0
                  text-[14px]
                  leading-[21px]
                  text-white
                "
                style={{
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                Black and White version of the PS5
                <br />
                coming out on sale.
              </p>

              <span
                className="
                  inline-block
                  mt-[16px]
                  pb-[4px]
                  border-b
                  border-white
                  text-[16px]
                  leading-[24px]
                  font-medium
                  text-white
                "
                style={{
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                Shop Now
              </span>
            </div>
          </Link>

          <div
            className="
              grid
              grid-cols-1
              gap-[30px]
            "
          >

            {/* women's collection card */}
            <Link
              to="/shop"
              className="
                group
                relative
                block
                w-full
                h-[285px]
                overflow-hidden
                rounded-[4px]
                bg-[#0D0D0D]
                no-underline
              "
            >
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={WomenPic}
                  alt="Women's Collections"
                  className="absolute max-w-none"
                  style={{
                    width: "432px",
                    height: "286px",
                    left: "250px",
                    top: "0px",
                    objectFit: "cover",
                    transform: "rotate(360deg)",
                  }}
                />
              </div>

              {/* OVERLAY */}
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-black/80
                  via-black/30
                  to-transparent
                "
              />

              {/* TEXT */}
              <div
                className="
                  absolute
                  left-[30px]
                  bottom-[30px]
                  z-10
                  text-white
                  max-w-[330px]
                "
              >
                <h3
                  className="
                    m-0
                    text-[24px]
                    leading-[32px]
                    font-semibold
                  "
                  style={{
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Women’s Collections
                </h3>

                <p
                  className="
                    mt-[12px]
                    mb-0
                    text-[14px]
                    leading-[21px]
                    text-white
                  "
                  style={{
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Featured woman collections that
                  <br />
                  give you another vibe.
                </p>

                <span
                  className="
                    inline-block
                    mt-[14px]
                    pb-[4px]
                    border-b
                    border-white
                    text-[16px]
                    leading-[24px]
                    font-medium
                    text-white
                  "
                  style={{
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Shop Now
                </span>
              </div>
            </Link>

            {/* BOTTOM TWO CARDS */}
            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-[30px]
              "
            >

              {/* SPEAKERS */}
              <Link
                to="/shop"
                className="
                  group
                  relative
                  block
                  w-full
                  h-[285px]
                  overflow-hidden
                  rounded-[4px]
                  bg-[#1A1A1A]
                  no-underline
                "
              >
                <img
                  src={SpeakerPic}
                  alt="Speakers"
                  className="
                    absolute
                    top-[40px]
                    left-[30px]
                    w-[280px]                
                    h-[200px]
                    max-w-none
                    object-contain
                    transition-transform
                    duration-500
                    group-hover:scale-[1.03]
                  "
                />

                {/* OVERLAY */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black
                    via-black/30
                    to-transparent
                  "
                />

                {/* TEXT */}
                <div
                  className="
                    absolute
                    left-[30px]
                    bottom-[30px]
                    z-10
                    text-white
                  "
                >
                  <h3
                    className="
                      m-0
                      text-[24px]
                      leading-[32px]
                      font-semibold
                    "
                    style={{
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Speakers
                  </h3>

                  <p
                    className="
                      mt-[10px]
                      mb-0
                      text-[14px]
                      leading-[21px]
                      text-white
                    "
                    style={{
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Amazon wireless speakers
                  </p>

                  <span
                    className="
                      inline-block
                      mt-[12px]
                      pb-[4px]
                      border-b
                      border-white
                      text-[16px]
                      leading-[24px]
                      font-medium
                      text-white
                    "
                    style={{
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Shop Now
                  </span>
                </div>
              </Link>

              {/* PERFUME */}
              <Link
                to="/shop"
                className="
                  group
                  relative
                  block
                  w-full
                  h-[285px]
                  overflow-hidden
                  rounded-[4px]
                  bg-[#1A1A1A]
                  no-underline
                "
              >
                <img
                  src={PerfumePic}
                  alt="Perfume"
                  className="
                    absolute
                    inset-0
                    w-full
                    h-full
                    object-cover
                    transition-transform
                    duration-500
                    group-hover:scale-[1.03]
                  "
                />

                {/* OVERLAY */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black
                    via-black/20
                    to-transparent
                  "
                />

                {/* TEXT */}
                <div
                  className="
                    absolute
                    left-[30px]
                    bottom-[30px]
                    z-10
                    text-white
                  "
                >
                  <h3
                    className="
                      m-0
                      text-[24px]
                      leading-[32px]
                      font-semibold
                    "
                    style={{
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    Perfume
                  </h3>

                  <p
                    className="
                      mt-[10px]
                      mb-0
                      text-[14px]
                      leading-[21px]
                      text-white
                    "
                    style={{
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    GUCCI INTENSE OUD EDP
                  </p>

                  <span
                    className="
                      inline-block
                      mt-[12px]
                      pb-[4px]
                      border-b
                      border-white
                      text-[16px]
                      leading-[24px]
                      font-medium
                      text-white
                    "
                    style={{
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Shop Now
                  </span>
                </div>
              </Link>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewArrival;