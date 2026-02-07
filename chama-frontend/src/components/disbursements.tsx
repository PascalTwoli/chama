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

  // Function to calculate time difference
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

  // Handle date input change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisbursementDate(e.target.value);
  };

  // Handle time input change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisbursementTime(e.target.value);
  };

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [disbursementDate, disbursementTime]);

  // Initialize with current calculation
  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
  }, [disbursementDate, disbursementTime]);

  // Format the disbursement date for display
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
    <div className='min-h-screen bg-[#19222C] text-white p-6 pt-2'>
      {/* Header */}
      <div className='flex justify-between items-start mb-8'>
        <div>
          <h1 className='text-base font-bold m-0'>Disbursement Details</h1>
          <p className='text-gray-400 m-0 text-sm'>
            Twoli Contributions Group - Round 2 Disbursement
          </p>
        </div>
        <div className='flex gap-3'>
          <div className='flex items-center gap-2 bg-yellowbg text-yellow px-4 py-2 rounded-lg'>
            <i className='bi bi-clock'></i>
            <span className='text-sm font-medium'>Pending</span>
          </div>
          <button className='flex items-center gap-2 bg-transparent text-primary border border-primary border-[1px] border-solid px-4 py-2 rounded-lg hover:bg-blue-600/30 transition-colors cursor-pointer'>
            <i className='bi bi-gear'></i>
            <span className='text-sm font-medium'>Settings</span>
          </button>
        </div>
      </div>
      {/* Disbursement Date Input Section */}
      <div className='bg-gray-800/30 rounded-xl p-6 mb-8'>
        <h3 className='text-base font-semibold mb-4 text-gray-300'>
          Set Disbursement Date & Time
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-400 mb-2'>
              Disbursement Date
            </label>
            <input
              type='date'
              value={disbursementDate}
              onChange={handleDateChange}
              className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-400 mb-2'>
              Disbursement Time
            </label>
            <input
              type='time'
              value={disbursementTime}
              onChange={handleTimeChange}
              className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
          </div>
        </div>
      </div>

      {/* Countdown Timer Section */}
      <div
        className={`rounded-xl p-6 mb-8 text-center ${
          isExpired
            ? 'bg-red-900/20 border border-red-600/30'
            : 'bg-[#4AA0B526]'
        }`}
      >
        <h2 className='text-base font-semibold m-0 mb-3 text-default'>
          {isExpired
            ? 'Disbursement Available Now!'
            : 'Disbursement Available In'}
        </h2>

        {!isExpired ? (
          <div className='flex justify-center items-center gap-8 mb-3 text-secondary'>
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
          <div className='text-green-400 mb-3'>
            <i className='bi bi-check-circle text-4xl'></i>
            <div className='text-lg font-semibold mt-2'>Time&apos;s Up!</div>
          </div>
        )}

        <p className='text-gray-400 m-0 mb-1'>
          Disbursement Date: {formatDisbursementDate()}
        </p>
      </div>

      {/* Main Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        {/* Left Column - Disbursement Overview & Breakdown */}
        <div className='lg:col-span-2 space-y-8'>
          <div className='bg-primarybg rounded-lg'>
            {/* Disbursement Overview */}
            <div className=''>
              <h3 className='text-sm font-semibol text-default m-0 p-4 pb-0 '>
                Disbursement Overview
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6 border2 p-4'>
                <div className='text-center bg-[#242E3B] p-2 rounded-md '>
                  <div className='text-sm font-bold text-success m-0'>
                    Kes 95,000
                  </div>
                  <div className='text-sm font-light text-default m-0'>
                    Total pool
                  </div>
                </div>
                <div className='text-center bg-[#242E3B] p-2 rounded-md '>
                  <div className='text-sm font-bold text-secondary m-0'>15</div>
                  <div className='text-sm font-light  text-default m-0'>
                    Eligible members{' '}
                  </div>
                </div>
                <div className='text-center bg-[#242E3B] p-2 rounded-md '>
                  <div className='text-sm font-bold text-yellow m-0'>
                    Equally
                  </div>
                  <div className='text-sm font-light text-default m-0'>
                    Based on contribution
                  </div>
                </div>
              </div>
            </div>

            {/* Disbursement Breakdown */}
            <div>
              <h3 className='text-sm text-default font-semibold p-4 m-0'>
                Disbursement Breakdown
              </h3>
              <div className='rounded-lg '>
                <div className='space-y-4 text-sm'>
                  <div className='flex justify-between items-center font-light px-4'>
                    <span className='text-default'>Total Contributions</span>
                    <span className='text-default '>Ksh 95000</span>
                  </div>
                  <div className='flex justify-between items-center font-light px-4'>
                    <span className='text-default'>
                      Administrative Fee (5%)
                    </span>
                    <span className='text-red-400 '>-Ksh 4,750</span>
                  </div>
                  <div className='flex justify-between items-center font-light border2 px-4 pb-4'>
                    <span className='text-default'>Emergency Funds (1%)</span>
                    <span className='text-red-400 '>-Ksh 950</span>
                  </div>
                  <div className='border-t border-gray-700 pb-4 px-4'>
                    <div className='flex justify-between items-center'>
                      <span className='font-semibold text-default'>
                        Net Disbursement
                      </span>
                      <span className='text-success font-bold '>
                        Kes 89,300
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className='bg-primarybg p-4 rounded-lg'>
            <h3 className='text-sm font-semibold mb-4 m-0 text-gray-400 '>
              Terms & Conditions
            </h3>
            <div className='space-y-4'>
              <div className='flex items-start gap-3'>
                <div className='w-10 h-10 bg-success/30 rounded-full flex items-center justify-center  flex-shrink-0'>
                  <i className='bi bi-check text-4xl text-success'></i>
                </div>

                <div>
                  <h4 className='font-semibold text-gray-400 text-sm m-0'>
                    Eligibility Requirements
                  </h4>
                  <p className='text-default font-light text-sm m-0'>
                    A member must have completed their monthly contributions for
                    the entire cycle period (6 months).
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <div className='w-10 h-10 bg-success/30 rounded-full flex items-center justify-center flex-shrink-0'>
                  <i className='bi bi-check text-4xl text-success'></i>
                </div>
                <div>
                  <h4 className='font-semibold text-gray-400 text-sm m-0'>
                    Disbursement Method
                  </h4>
                  <p className='text-default font-light text-sm m-0'>
                    Funds will be disbursed equally to all eligible members
                    within 24 hours of scheduled disbursement.
                  </p>
                </div>
              </div>
              <div className='flex items-start gap-3'>
                <div className='w-10 h-10 bg-success/30 rounded-full flex items-center justify-center flex-shrink-0'>
                  <i className='bi bi-check text-4xl text-success'></i>
                </div>
                <div>
                  <h4 className='font-semibold text-gray-400 text-sm m-0'>
                    Dispute resolution
                  </h4>
                  <p className='text-default font-light text-sm m-0'>
                    Any disputes regarding disbursement amounts must be raised
                    within 7 days of released
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Disbursement Action & Cycle Summary */}
        <div className='space-y-8'>
          {/* Disbursement Action */}
          <div className='bg-primarybg rounded-lg p-6'>
            <h3 className='text-sm font-semibold m-0 mb-6 text-gray-400'>
              Disbursement Action
            </h3>
            <div>
              <button
                className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg mb-4 transition-colors ${
                  isExpired
                    ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer border-none '
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
                disabled={!isExpired}
              >
                <i className={isExpired ? 'bi bi-unlock' : 'bi bi-lock'}></i>
                <span className='font-medium'>Release Disbursement</span>
              </button>
              <div className='text-center mb-4'>
                <p className='text-sm text-default mb-1'>Available on</p>
                <p className='font-semibold text-default'>
                  {formatDisbursementDate()}
                </p>
              </div>
              <div
                className={`rounded-lg p-3 ${
                  isExpired
                    ? 'bg-green-900/20 border border-green-600/30'
                    : 'border border-2  border-green-500 bg-[#FEFCEA]'
                }`}
              >
                <div className='flex items-start gap-3'>
                  <i
                    className={` ${
                      isExpired
                        ? 'bi bi-check-circle text-success'
                        : 'bi bi-info-circle text-[#996523]'
                    }`}
                  ></i>
                  <p
                    className={`text-sm m-0 ${
                      isExpired ? 'text-success' : 'text-[#996523]'
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
          <div className='bg-primarybg p-4 rounded-lg'>
            <h3 className='text-sm font-semibold mb-6 m-0  text-gray-400'>
              Cycle Summary
            </h3>
            <div className=' '>
              <div className='space-y-4 text-sm'>
                <div className='flex justify-between items-center text-default'>
                  <span className=''>Cycle duration</span>
                  <span className='font-medium'>12 Months</span>
                </div>
                <div className='flex justify-between items-center text-default'>
                  <span className=''>Start Date</span>
                  <span className='font-medium'>January 15, 2025</span>
                </div>
                <div className='flex justify-between items-center text-default'>
                  <span className=''>End Date</span>
                  <span className='font-medium'>December 15, 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Disbursements;
