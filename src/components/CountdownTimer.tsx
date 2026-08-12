import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  className = '',
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference =
        targetDate.getTime() - new Date().getTime();

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
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
      }
    };

    calculateTimeLeft();

    const timer = setInterval(
      calculateTimeLeft,
      1000
    );

    return () => clearInterval(timer);
  }, [targetDate]);

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