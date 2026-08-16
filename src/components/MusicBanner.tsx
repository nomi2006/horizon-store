import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import speakerImage from "../assets/speaker.png";

const MusicBanner: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 23,
    minutes: 59,
    seconds: 35,
  });

  useEffect(() => {
    const saleEnd = new Date();

    saleEnd.setDate(saleEnd.getDate() + 5);
    saleEnd.setHours(23, 59, 59, 999);

    const updateTimer = () => {
      const difference = saleEnd.getTime() - Date.now();

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
      );

      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) /
          (1000 * 60 * 60)
      );

      const minutes = Math.floor(
        (difference % (1000 * 60 * 60)) /
          (1000 * 60)
      );

      const seconds = Math.floor(
        (difference % (1000 * 60)) / 1000
      );

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
      });
    };

    updateTimer();

    const interval = window.setInterval(updateTimer, 1000);

    return () => window.clearInterval(interval);
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
      {/*  MUSIC BANNER AREA  */}
      <div className="relative w-[1170px] h-[570px] mx-auto">
        {/*  BANNER  */}
        <div
          className="
            absolute
            top-0
            left-0
            w-[1170px]
            h-[500px]
            bg-black
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
                  max-w-none
                  object-contain
                  select-none
                "
                style={{
                  width: "2200px",
                  height: "auto",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>
          </div>

          <span
            className="
              absolute
              top-[69px]
              left-[56px]
              w-[90px]
              h-[20px]
              text-[#00FF66]
              whitespace-nowrap
            "
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "16px",
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
                    fontFamily: "Poppins, sans-serif",
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
                    fontFamily: "Poppins, sans-serif",
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
              bg-[#00FF66]
              text-black
              no-underline
              whitespace-nowrap
            "
            style={{
              fontFamily: "Poppins, sans-serif",
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