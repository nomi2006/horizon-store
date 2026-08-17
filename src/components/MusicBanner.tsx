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
  /*
   * Fixed deadline.
   * Change this date whenever you want to configure a new sale.
   */
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
    <section
      className="
        w-full
        bg-white
        py-0
      "
    >

      <div
        className="
          relative
          w-full
          max-w-[1170px]
          h-[570px]
          mx-auto
        "
      >

        <div
          className="
            absolute
            top-0
            left-0
            w-[1170px]
            h-[500px]
            max-w-full
            bg-[#050505]
            overflow-hidden
          "
        >

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
          {/* CATEGORIES */}

          <span
            className="
              absolute
              top-[69px]
              left-[56px]
              w-[90px]
              h-[20px]
              text-[#00F568]
              whitespace-nowrap
            "
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "15px",
              fontWeight: 600,
              lineHeight: "20px",
              letterSpacing: "0%",
            }}
          >
            Categories
          </span>

          <h2
            className="
              absolute
              top-[121px]
              left-[56px]
              w-[443px]
              h-[120px]
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
                w-max
                whitespace-nowrap
              "
            >
              Enhance Your
            </span>

            <span
              className="
                block
                w-max
                whitespace-nowrap
              "
            >
              Music Experience
            </span>
          </h2>

          <div
            className="
              absolute
              top-[273px]
              left-[56px]
              w-[320px]
              h-[62px]
              flex
              items-center
              gap-[24px]
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
                "
              >
                {/* VALUE */}

                <span
                  className="
                    absolute
                    top-[14px]
                    left-1/2
                    -translate-x-1/2
                    w-[28px]
                    h-[20px]
                    flex
                    items-center
                    justify-center
                    whitespace-nowrap
                  "
                  style={{
                    fontFamily:
                      "Poppins, sans-serif",
                    fontSize: "16px",
                    fontWeight: 600,
                    lineHeight: "20px",
                    letterSpacing: "0%",
                  }}
                >
                  {item.value}
                </span>

                {/* LABEL */}

                <span
                  className="
                    absolute
                    top-[34px]
                    left-1/2
                    -translate-x-1/2
                    h-[18px]
                    flex
                    items-center
                    justify-center
                    whitespace-nowrap
                  "
                  style={{
                    fontFamily:
                      "Poppins, sans-serif",
                    fontSize: "11px",
                    fontWeight: 400,
                    lineHeight: "18px",
                    letterSpacing: "0%",
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>

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
            "
            style={{
              fontFamily:
                "Poppins, sans-serif",
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "24px",
              padding: "16px 48px",
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