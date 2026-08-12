import React, { useEffect, useState } from 'react';

const SALE_END_DATE = '2026-08-15T23:59:59+05:00';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

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

const FlashSalesTimer: React.FC = () => {
  const [timeLeft, setTimeLeft] =
    useState<TimeLeft>(calculateTimeLeft);

  useEffect(() => {
    const updateTimer = () => {
      setTimeLeft(calculateTimeLeft());
    };

    // Update immediately
    updateTimer();

    // Update every second
    const timer = window.setInterval(
      updateTimer,
      1000
    );

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const formatNumber = (number: number): string => {
    return String(number).padStart(2, '0');
  };

  return (
    <div className="flex items-end gap-[14px] pb-[2px]">

      {/* DAYS */}
      <div className="flex flex-col">
        <span className="text-[11px] text-black mb-[4px]">
          Days
        </span>

        <span className="text-[30px] leading-none font-semibold text-black">
          {formatNumber(timeLeft.days)}
        </span>
      </div>

      <span className="text-[28px] leading-none text-[#DB4444] pb-[2px]">
        :
      </span>

      {/* HOURS */}
      <div className="flex flex-col">
        <span className="text-[11px] text-black mb-[4px]">
          Hours
        </span>

        <span className="text-[30px] leading-none font-semibold text-black">
          {formatNumber(timeLeft.hours)}
        </span>
      </div>

      <span className="text-[28px] leading-none text-[#DB4444] pb-[2px]">
        :
      </span>

      {/* MINUTES */}
      <div className="flex flex-col">
        <span className="text-[11px] text-black mb-[4px]">
          Minutes
        </span>

        <span className="text-[30px] leading-none font-semibold text-black">
          {formatNumber(timeLeft.minutes)}
        </span>
      </div>

      <span className="text-[28px] leading-none text-[#DB4444] pb-[2px]">
        :
      </span>

      {/* SECONDS */}
      <div className="flex flex-col">
        <span className="text-[11px] text-black mb-[4px]">
          Seconds
        </span>

        <span className="text-[30px] leading-none font-semibold text-black">
          {formatNumber(timeLeft.seconds)}
        </span>
      </div>

    </div>
  );
};

export default FlashSalesTimer;