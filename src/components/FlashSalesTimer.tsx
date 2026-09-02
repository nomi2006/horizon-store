import React, { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const STORAGE_KEY = 'horizon-flash-sale-end-time';

// Dummy flash sale duration: 3 hours
const SALE_DURATION = 3 * 60 * 60 * 1000;

const getSaleEndTime = (): number => {
  const storedEndTime = localStorage.getItem(STORAGE_KEY);

  if (storedEndTime) {
    const endTime = Number(storedEndTime);

    // Use the existing sale if it has not expired
    if (
      Number.isFinite(endTime) &&
      endTime > Date.now()
    ) {
      return endTime;
    }
  }

  // Create a new 3-hour flash sale
  const newEndTime = Date.now() + SALE_DURATION;

  localStorage.setItem(
    STORAGE_KEY,
    String(newEndTime)
  );

  return newEndTime;
};

const calculateTimeLeft = (
  endTime: number
): TimeLeft => {
  const difference = endTime - Date.now();

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
  const [saleEndTime, setSaleEndTime] =
    useState<number | null>(null);

  const [timeLeft, setTimeLeft] =
    useState<TimeLeft>({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });

  useEffect(() => {
    // Get the existing sale or create a new one
    const endTime = getSaleEndTime();

    setSaleEndTime(endTime);
    setTimeLeft(calculateTimeLeft(endTime));
  }, []);

  useEffect(() => {
    if (saleEndTime === null) {
      return;
    }

    const updateTimer = () => {
      const difference =
        saleEndTime - Date.now();

      if (difference > 0) {
        setTimeLeft(
          calculateTimeLeft(saleEndTime)
        );

        return;
      }

      // Current sale has ended.
      // Automatically start a new 3-hour sale.
      const newEndTime =
        Date.now() + SALE_DURATION;

      localStorage.setItem(
        STORAGE_KEY,
        String(newEndTime)
      );

      setSaleEndTime(newEndTime);
      setTimeLeft(
        calculateTimeLeft(newEndTime)
      );
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
  }, [saleEndTime]);

  const formatNumber = (
    number: number
  ): string => {
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