import React, { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function Disbursements() {
  const [disbursementDate, setDisbursementDate] = useState<string>('');
  const [disbursementTime, setDisbursementTime] = useState<string>('09:00');
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisbursementDate(e.target.value);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisbursementTime(e.target.value);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [disbursementDate, disbursementTime]);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
  }, [disbursementDate, disbursementTime]);

  const formatDisbursementDate = (): string => {
    if (!disbursementDate || !disbursementTime) {
      return 'Please set disbursement date and time';
    }
    const date = new Date(`${disbursementDate}T${disbursementTime}:00`);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className='min-h-screen bg-background text-foreground p-6 pt-2'>
      {/* Header */}
      <div className='flex justify-between items-start mb-8'>
        <div>
          <h1 className='text-base font-bold m-0'>Disbursement Details</h1>
          <p className='text-muted-foreground m-0 text-sm'>
            Twoli Contributions Group - Round 2 Disbursement
          </p>
        </div>
        <div className='flex gap-3'>
          <div className='flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-lg'>
            <i className='bi bi-clock'></i>
            <span className='text-sm font-medium'>Pending</span>
          </div>
          <button className='flex items-center gap-2 bg-transparent text-primary border border-primary px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer'>
            <i className='bi bi-gear'></i>
            <span className='text-sm font-medium'>Settings</span>
          </button>
        </div>
      </div>

      {/* Disbursement Date Input Section */}
      <div className='bg-card border border-border rounded-xl p-6 mb-8'>
        <h3 className='text-base font-semibold mb-4 text-foreground'>
          Set Disbursement Date & Time
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-muted-foreground mb-2'>
              Disbursement Date
            </label>
            <input
              type='date'
              value={disbursementDate}
              onChange={handleDateChange}
              className='w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-muted-foreground mb-2'>
              Disbursement Time
            </label>
            <input
              type='time'
              value={disbursementTime}
              onChange={handleTimeChange}
              className='w-full px-3 py-2 bg-muted border border-border rounded-lg text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors'
            />
          </div>
        </div>
      </div>

      {/* Countdown Timer Section */}
      <div
        className={`rounded-xl p-6 mb-8 text-center ${
          isExpired
            ? 'bg-destructive/10 border border-destructive/30'
            : 'bg-primary/10'
        }`}
      >
        <h2 className='text-base font-semibold m-0 mb-3 text-foreground'>
          {isExpired
            ? 'Disbursement Available Now!'
            : 'Disbursement Available In'}
        </h2>

        {!isExpired ? (
          <div className='flex justify-center items-center gap-8 mb-3 text-primary'>
            <div className='text-center'>
              <div className='text-2xl font-bold m-0'>{timeLeft.days}</div>
              <div className='text-sm m-0'>Days</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold m-0'>{timeLeft.hours}</div>
              <div className='text-sm m-0'>Hours</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold m-0'>{timeLeft.minutes}</div>
              <div className='text-sm m-0'>Minutes</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold m-0'>{timeLeft.seconds}</div>
              <div className='text-sm m-0'>Seconds</div>
            </div>
          </div>
        ) : (
          <div className='text-success mb-3'>
            <i className='bi bi-check-circle text-4xl'></i>
            <div className='text-lg font-semibold mt-2'>Time&apos;s Up!</div>
          </div>
        )}

        <p className='text-muted-foreground m-0 mb-1'>
          Disbursement Date: {formatDisbursementDate()}
        </p>
      </div>

      {/* Main Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left Column */}
        <div className='lg:col-span-2 space-y-8'>
          <div className='bg-card border border-border rounded-lg'>
            {/* Disbursement Overview */}
            <div>
              <h3 className='text-sm font-semibold text-foreground m-0 p-4 pb-0'>
                Disbursement Overview
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6 p-4'>
                <div className='text-center bg-muted p-2 rounded-md'>
                  <div className='text-sm font-bold text-success m-0'>
                    Kes 95,000
                  </div>
                  <div className='text-sm font-light text-muted-foreground m-0'>
                    Total pool
                  </div>
                </div>
                <div className='text-center bg-muted p-2 rounded-md'>
                  <div className='text-sm font-bold text-primary m-0'>15</div>
                  <div className='text-sm font-light text-muted-foreground m-0'>
                    Eligible members
                  </div>
                </div>
                <div className='text-center bg-muted p-2 rounded-md'>
                  <div className='text-sm font-bold text-accent m-0'>
                    Equally
                  </div>
                  <div className='text-sm font-light text-muted-foreground m-0'>
                    Based on contribution
                  </div>
                </div>
              </div>
            </div>

            {/* Disbursement Breakdown */}
            <div>
              <h3 className='text-sm text-foreground font-semibold p-4 m-0'>
                Disbursement Breakdown
              </h3>
              <div className='space-y-4 text-sm'>
                <div className='flex justify-between items-center font-light px-4'>
                  <span className='text-foreground'>Total Contributions</span>
                  <span className='text-foreground'>Ksh 95000</span>
                </div>
                <div className='flex justify-between items-center font-light px-4'>
                  <span className='text-foreground'>
                    Administrative Fee (5%)
                  </span>
                  <span className='text-destructive'>-Ksh 4,750</span>
                </div>
                <div className='flex justify-between items-center font-light px-4 pb-4'>
                  <span className='text-foreground'>Emergency Funds (1%)</span>
                  <span className='text-destructive'>-Ksh 950</span>
                </div>
                <div className='border-t border-border pb-4 px-4'>
                  <div className='flex justify-between items-center pt-4'>
                    <span className='font-semibold text-foreground'>
                      Net Disbursement
                    </span>
                    <span className='text-success font-bold'>Kes 89,300</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className='bg-card border border-border p-4 rounded-lg'>
            <h3 className='text-sm font-semibold mb-4 m-0 text-muted-foreground'>
              Terms & Conditions
            </h3>
            <div className='space-y-4'>
              {[
                {
                  title: 'Eligibility Requirements',
                  desc: 'A member must have completed their monthly contributions for the entire cycle period (6 months).',
                },
                {
                  title: 'Disbursement Method',
                  desc: 'Funds will be disbursed equally to all eligible members within 24 hours of scheduled disbursement.',
                },
                {
                  title: 'Dispute resolution',
                  desc: 'Any disputes regarding disbursement amounts must be raised within 7 days of released',
                },
              ].map((item, idx) => (
                <div key={idx} className='flex items-start gap-3'>
                  <div className='w-10 h-10 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0'>
                    <i className='bi bi-check text-4xl text-success'></i>
                  </div>
                  <div>
                    <h4 className='font-semibold text-muted-foreground text-sm m-0'>
                      {item.title}
                    </h4>
                    <p className='text-foreground font-light text-sm m-0'>
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className='space-y-8'>
          {/* Disbursement Action */}
          <div className='bg-card border border-border rounded-lg p-6'>
            <h3 className='text-sm font-semibold m-0 mb-6 text-muted-foreground'>
              Disbursement Action
            </h3>
            <div>
              <button
                className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg mb-4 transition-colors ${
                  isExpired
                    ? 'bg-success hover:bg-success/90 text-success-foreground cursor-pointer border-none'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
                disabled={!isExpired}
              >
                <i className={isExpired ? 'bi bi-unlock' : 'bi bi-lock'}></i>
                <span className='font-medium'>Release Disbursement</span>
              </button>
              <div className='text-center mb-4'>
                <p className='text-sm text-foreground mb-1'>Available on</p>
                <p className='font-semibold text-foreground'>
                  {formatDisbursementDate()}
                </p>
              </div>
              <div
                className={`rounded-lg p-3 ${
                  isExpired
                    ? 'bg-success/10 border border-success/30'
                    : 'bg-accent/10 border border-accent/30'
                }`}
              >
                <div className='flex items-start gap-3'>
                  <i
                    className={`${
                      isExpired
                        ? 'bi bi-check-circle text-success'
                        : 'bi bi-info-circle text-accent'
                    }`}
                  ></i>
                  <p
                    className={`text-sm m-0 ${
                      isExpired ? 'text-success' : 'text-accent'
                    }`}
                  >
                    {isExpired
                      ? 'The disbursement is now available and can be released.'
                      : 'The disbursement button will be enabled automatically on the scheduled date and time.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cycle Summary */}
          <div className='bg-card border border-border p-4 rounded-lg'>
            <h3 className='text-sm font-semibold mb-6 m-0 text-muted-foreground'>
              Cycle Summary
            </h3>
            <div className='space-y-4 text-sm'>
              <div className='flex justify-between items-center text-foreground'>
                <span>Cycle duration</span>
                <span className='font-medium'>12 Months</span>
              </div>
              <div className='flex justify-between items-center text-foreground'>
                <span>Start Date</span>
                <span className='font-medium'>January 15, 2025</span>
              </div>
              <div className='flex justify-between items-center text-foreground'>
                <span>End Date</span>
                <span className='font-medium'>December 15, 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Disbursements;
