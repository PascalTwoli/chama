import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

/**
 * LoadingSpinner - Full page loading indicator
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
}) => {
  return (
    <div className='fixed inset-0 bg-background flex items-center justify-center z-50'>
      <div className='flex flex-col items-center gap-4'>
        <div className='w-10 h-10 border-3 border-muted border-t-primary rounded-full animate-spin' />
        <p className='text-muted-foreground text-sm'>{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
