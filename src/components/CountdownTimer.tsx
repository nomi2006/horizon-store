import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetDate?: Date;
  className?: string;
}

const STORAGE_KEY = 'horizon-flash-sale-end-time';
const SALE_DURATION = 3 * 60 * 60 * 1000; // 3 hours

const getSaleEndTime = (): number => {
  const storedEndTime = localStorage.getItem(STORAGE_KEY);

  if (storedEndTime) {
    const endTime = Number(storedEndTime);

    if (
      Number.isFinite(endTime) &&
      endTime > Date.now()
    ) {
      return endTime;
    }
  }

  const newEndTime = Date.now() + SALE_DURATION;

  localStorage.setItem(
    STORAGE_KEY,
    String(newEndTime)
  );

  return newEndTime;
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  className = '',
}) => {
  const [endTime, setEndTime] = useState<number | null>(null);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // If a targetDate is explicitly provided by the parent,
    // use it. Otherwise create a persistent dummy sale.
    if (targetDate instanceof Date && !isNaN(targetDate.getTime())) {
      setEndTime(targetDate.getTime());
    } else {
      setEndTime(getSaleEndTime());
    }
  }, [targetDate]);

  useEffect(() => {
    if (endTime === null) {
      return;
    }

    const calculateTimeLeft = () => {
      const difference = endTime - Date.now();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(
            difference / (1000 * 60 * 60 * 24)
          ),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) /
              (1000 * 60 * 60)
          ),
          minutes: Math.floor(
            (difference % (1000 * 60 * 60)) /
              (1000 * 60)
          ),
          seconds: Math.floor(
            (difference % (1000 * 60)) / 1000
          ),
        });

        return;
      }

      // Sale has ended.
      // Automatically start a new 3-hour sale.
      const newEndTime = Date.now() + SALE_DURATION;

      localStorage.setItem(
        STORAGE_KEY,
        String(newEndTime)
      );

      setEndTime(newEndTime);

      setTimeLeft({
        days: 0,
        hours: 3,
        minutes: 0,
        seconds: 0,
      });
    };

    calculateTimeLeft();

    const timer = setInterval(
      calculateTimeLeft,
      1000
    );

    return () => clearInterval(timer);
  }, [endTime]);

  const formatNumber = (num: number) =>
    String(num).padStart(2, '0');

  const items = [
    {
      label: 'Days',
      value: timeLeft.days,
    },
    {
      label: 'Hours',
      value: timeLeft.hours,
    },
    {
      label: 'Minutes',
      value: timeLeft.minutes,
    },
    {
      label: 'Seconds',
      value: timeLeft.seconds,
    },
  ];

  return (
    <div
      className={`
        flex
        items-start
        gap-[22px]
        ${className}
      `}
    >
      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          <div className="text-center">
            <div
              className="
                text-[34px]
                leading-[38px]
                font-bold
                text-white
              "
            >
              {formatNumber(item.value)}
            </div>

            <div
              className="
                mt-[7px]
                text-[12px]
                leading-[16px]
                font-medium
                text-[#999]
              "
            >
              {item.label}
            </div>
          </div>

          {index < items.length - 1 && (
            <span
              className="
                text-[#DB4444]
                text-[30px]
                leading-[35px]
                font-bold
              "
            >
              :
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CountdownTimer;