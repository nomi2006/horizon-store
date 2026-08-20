import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import speakerImage from "../assets/speaker.png";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const MusicBanner: React.FC = () => {
  const SALE_END_DATE = "2026-08-22T23:59:59+05:00";

  const calculateTimeLeft = (): TimeLeft => {
    const difference =
      new Date(SALE_END_DATE).getTime() - Date.now();

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      days: Math.floor(
        difference / (1000 * 60 * 60 * 24)
      ),
      hours: Math.floor(
        (difference / (1000 * 60 * 60)) % 24
      ),
      minutes: Math.floor(
        (difference / (1000 * 60)) % 60
      ),
      seconds: Math.floor(
        (difference / 1000) % 60
      ),
    };
  };

  const [timeLeft, setTimeLeft] =
    useState<TimeLeft>(calculateTimeLeft);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const timerItems = [
    {
      value: String(timeLeft.hours).padStart(2, "0"),
      label: "Hours",
    },
    {
      value: String(timeLeft.days).padStart(2, "0"),
      label: "Days",
    },
    {
      value: String(timeLeft.minutes).padStart(2, "0"),
      label: "Minutes",
    },
    {
      value: String(timeLeft.seconds).padStart(2, "0"),
      label: "Seconds",
    },
  ];

  return (
    <section className="w-full bg-white">
      <div className="relative w-full max-w-[1170px] h-[430px] sm:h-[500px] lg:h-[570px] mx-auto px-4 lg:px-0">

        <div className="relative w-full h-full lg:h-[500px] bg-[#050505] overflow-hidden">

          {/* Speaker visual */}

          <div
            className="
              absolute
              top-[37px]
              left-[526px]
              w-[600px]
              h-[420px]
              overflow-hidden
              rounded-full
              bg-[#181818]

              max-lg:left-[48%]
              max-lg:scale-90
              max-lg:origin-left

              max-md:left-[42%]
              max-md:top-[50px]
              max-md:scale-[0.56]
              max-md:origin-top-left
              max-md:opacity-70
            "
          >
            <div
              className="
                absolute
                top-[45px]
                left-[16px]
                w-[568px]
                h-[330px]
                overflow-hidden
              "
            >
              <img
                src={speakerImage}
                alt="Premium speaker"
                draggable={false}
                className="
                  absolute
                  select-none
                  pointer-events-none
                  object-contain
                "
                style={{
                  width: "900px",
                  height: "520px",
                  maxWidth: "none",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>
          </div>

          {/* Category */}

          <span
            className="
              absolute
              top-[69px]
              left-[56px]

              max-md:top-[36px]
              max-md:left-[24px]

              text-[#00F568]
              whitespace-nowrap
            "
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "15px",
              fontWeight: 600,
              lineHeight: "20px",
            }}
          >
            Categories
          </span>

          {/* Heading */}

          <h2
            className="
              absolute
              top-[121px]
              left-[56px]
              w-[443px]
              h-[120px]

              max-md:top-[72px]
              max-md:left-[24px]
              max-md:w-[calc(100%-48px)]
              max-md:h-auto

              !m-0
              !p-0
              text-[#FAFAFA]
            "
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: "48px",
              fontWeight: 600,
              lineHeight: "60px",
              letterSpacing: "0.04em",
            }}
          >
            <span
              className="
                block
                whitespace-nowrap
                max-md:whitespace-normal
                max-md:text-[32px]
                max-md:leading-[40px]
              "
            >
              Enhance Your
            </span>

            <span
              className="
                block
                whitespace-nowrap
                max-md:whitespace-normal
                max-md:text-[32px]
                max-md:leading-[40px]
              "
            >
              Music Experience
            </span>
          </h2>

          {/* Countdown */}

          <div
            className="
              absolute
              top-[273px]
              left-[56px]
              flex
              items-center
              gap-[24px]

              max-md:top-[205px]
              max-md:left-[24px]
              max-md:gap-[10px]
            "
          >
            {timerItems.map((item) => (
              <div
                key={item.label}
                className="
                  relative
                  w-[62px]
                  h-[62px]
                  shrink-0
                  rounded-full
                  bg-white
                  text-black

                  max-md:w-[52px]
                  max-md:h-[52px]
                "
              >
                <span
                  className="
                    absolute
                    top-[14px]
                    left-1/2
                    -translate-x-1/2
                    flex
                    items-center
                    justify-center
                    whitespace-nowrap

                    max-md:top-[9px]
                  "
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "20px",
                  }}
                >
                  {item.value}
                </span>

                <span
                  className="
                    absolute
                    top-[34px]
                    left-1/2
                    -translate-x-1/2
                    flex
                    items-center
                    justify-center
                    whitespace-nowrap

                    max-md:top-[27px]
                    max-md:text-[9px]
                  "
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "11px",
                    fontWeight: 400,
                    lineHeight: "18px",
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Button */}

          <Link
            to="/shop"
            className="
              absolute
              top-[375px]
              left-[56px]
              w-[171px]
              h-[56px]
              flex
              items-center
              justify-center
              rounded-[4px]
              bg-[#00F568]
              text-black
              no-underline
              whitespace-nowrap
              transition-colors
              duration-200
              hover:bg-white

              max-md:top-[310px]
              max-md:left-[24px]
              max-md:w-[150px]
              max-md:h-[50px]
            "
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "24px",
            }}
          >
            Buy Now!
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MusicBanner;