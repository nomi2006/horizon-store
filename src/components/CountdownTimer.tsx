import React, { useState, useEffect } from 'react';

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
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatNumber = (num: number): string => {
    return String(num).padStart(2, '0');
  };

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className={`flex items-center gap-2 md:gap-4 ${className}`}>
      {timeUnits.map((unit, index) => (
        <div key={unit.label} className="flex items-center">
          <div className="text-center">
            <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-dark-DEFAULT">
              {formatNumber(unit.value)}
            </div>
            <div className="text-xs md:text-sm text-gray-500 font-medium">
              {unit.label}
            </div>
          </div>
          {index < timeUnits.length - 1 && (
            <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-DEFAULT mx-1 md:mx-2">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;