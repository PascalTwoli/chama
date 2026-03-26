import React, { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '../../utils/cn';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options?: Array<{ value: string; label: string }>;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      error,
      options = [],
      disabled,
      children,
      value,
      onChange,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const hiddenSelectRef = useRef<HTMLSelectElement>(null);

    // Extract options from children (option elements)
    const extractOptionsFromChildren = useMemo(() => {
      if (!children) return [];

      const childArray = React.Children.toArray(children);
      return childArray
        .filter((child): child is React.ReactElement => {
          return (
            React.isValidElement(child) &&
            child.type === 'option' &&
            (child.props as any).value !== undefined
          );
        })
        .map(child => {
          return {
            value: String((child.props as any).value),
            label: String(
              (child.props as any).children || (child.props as any).value
            ),
          };
        });
    }, [children]);

    // Use options prop if provided, otherwise extract from children
    const allOptions =
      options.length > 0 ? options : extractOptionsFromChildren;
    const selectedOption = allOptions.find(
      opt => opt.value === String(value || '')
    );
    const selectedLabel = selectedOption?.label || 'Select an option';

    // Ensure ref is set correctly
    useEffect(() => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(hiddenSelectRef.current);
        } else {
          ref.current = hiddenSelectRef.current;
        }
      }
    }, [ref]);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    const handleSelect = (optionValue: string) => {
      // Update hidden select
      if (hiddenSelectRef.current) {
        hiddenSelectRef.current.value = optionValue;
        // Trigger change event for React Hook Form
        const event = new Event('change', { bubbles: true });
        hiddenSelectRef.current.dispatchEvent(event);
      }

      // Call onChange prop if provided
      if (onChange) {
        const syntheticEvent = {
          target: { value: optionValue },
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange(syntheticEvent);
      }

      setIsOpen(false);
    };

    const handleBlur = () => {
      if (onBlur && hiddenSelectRef.current) {
        onBlur({
          target: hiddenSelectRef.current,
        } as React.FocusEvent<HTMLSelectElement>);
      }
    };

    return (
      <div className='relative w-full' ref={containerRef}>
        {/* Hidden select for form integration (required for React Hook Form) */}
        <select
          ref={hiddenSelectRef}
          value={value || ''}
          onChange={onChange}
          onBlur={handleBlur}
          disabled={disabled}
          className='hidden'
          {...props}
        >
          {children}
        </select>

        {/* Custom dropdown button */}
        <button
          type='button'
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onBlur={handleBlur}
          disabled={disabled}
          className={cn(
            'w-full px-4 py-2.5',
            'flex items-center justify-between gap-3',
            'rounded-md border',
            'text-sm font-medium',
            'transition-all duration-200',
            'outline-none',
            // Light mode
            'bg-white text-gray-900 border-gray-300',
            'hover:border-gray-400',
            // Dark mode
            'dark:bg-slate-900 dark:text-gray-100 dark:border-slate-600',
            'dark:hover:border-slate-500',
            // Disabled state
            'disabled:opacity-50 disabled:cursor-not-allowed',
            // Error state
            error && 'border-red-500 dark:border-red-500',
            className
          )}
        >
          <span className='truncate'>{selectedLabel}</span>
          <ChevronDown
            className={cn(
              'h-4 w-4 flex-shrink-0 transition-transform duration-200',
              'text-gray-500 dark:text-gray-400',
              isOpen && 'rotate-180'
            )}
          />
        </button>

        {/* Dropdown menu */}
        {isOpen && allOptions.length > 0 && (
          <div
            className={cn(
              'absolute top-full left-0 right-0 mt-2 z-50',
              'bg-white dark:bg-slate-800',
              'border border-gray-300 dark:border-slate-700',
              'rounded-md shadow-lg overflow-hidden'
            )}
          >
            <div className='max-h-screen overflow-y-auto'>
              {allOptions.map(option => (
                <button
                  key={option.value}
                  type='button'
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'w-full px-4 py-2.5',
                    'flex items-center justify-between gap-3',
                    'text-sm text-left',
                    'transition-colors duration-150',
                    // Selected state - use accent color
                    String(value || '') === option.value
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700',
                    // Disabled state
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  <span className='truncate'>{option.label}</span>
                  {String(value || '') === option.value && (
                    <Check className='h-4 w-4 flex-shrink-0' />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No options message */}
        {isOpen && allOptions.length === 0 && (
          <div
            className={cn(
              'absolute top-full left-0 right-0 mt-2 z-50',
              'bg-white dark:bg-slate-800',
              'border border-gray-300 dark:border-slate-700',
              'rounded-md shadow-lg',
              'px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center'
            )}
          >
            No options available
          </div>
        )}

        {/* Error message */}
        {error && (
          <p className='mt-1.5 text-sm text-red-500 dark:text-red-400'>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
