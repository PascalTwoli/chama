import React from 'react';

interface CustomCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export default function CustomCheckbox({
  id,
  checked,
  onChange,
  disabled,
}: CustomCheckboxProps) {
  return (
    <button
      type='button'
      id={id}
      aria-checked={checked}
      role='checkbox'
      disabled={disabled}
      tabIndex={0}
      onClick={() => !disabled && onChange(!checked)}
      onKeyDown={e => {
        if ((e.key === ' ' || e.key === 'Enter') && !disabled) {
          e.preventDefault();
          onChange(!checked);
        }
      }}
      className={`w-4 h-4 mt-1.5 flex items-center justify-center rounded border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${checked ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {checked && (
        <svg
          className='w-10 h-10 text-white -m-1'
          viewBox='0 0 20 20'
          fill='none'
          stroke='currentColor'
          strokeWidth='2.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <polyline points='3 11 9 16 16 5' />
        </svg>
      )}
    </button>
  );
}
