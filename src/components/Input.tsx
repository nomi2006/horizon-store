import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  fullWidth?: boolean;
  className?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  fullWidth = true,
  className = '',
  id,
  disabled,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses = 'px-4 py-3 text-sm md:text-base text-dark-DEFAULT bg-white border rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT focus:border-transparent';
  const widthClasses = fullWidth ? 'w-full' : '';
  const errorClasses = error ? 'border-error focus:ring-error' : 'border-gray-300';
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'hover:border-gray-400';

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm md:text-base font-medium text-dark-DEFAULT mb-1.5">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`
          ${baseClasses}
          ${widthClasses}
          ${errorClasses}
          ${disabledClasses}
        `}
        disabled={disabled}
        {...props}
      />
      {error && (
        <p className="text-xs md:text-sm text-error mt-1">{error}</p>
      )}
      {hint && !error && (
        <p className="text-xs md:text-sm text-gray-500 mt-1">{hint}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;