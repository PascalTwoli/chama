import { useEffect, useState } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function DisbursementTimer() {
  const [disbursementDate, setDisbursementDate] = useState<string>('');
  const [disbursementTime, setDisbursementTime] = useState<string>('09:00');
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState<boolean>(false);

  const calculateTimeLeft = (): TimeLeft => {
    if (!disbursementDate) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const targetDateTime = new Date(
      `${disbursementDate}T${disbursementTime}:00`
    );

    const now = new Date();
    const difference = targetDateTime.getTime() - now.getTime();

    if (difference <= 0) {
      setIsExpired(true);
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    setIsExpired(false);
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  //handle date input change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisbursementDate(e.target.value);
  };

  //handle time input change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisbursementTime(e.target.value);
  };

  //countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  }, [disbursementDate, disbursementTime]);
}
