import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded transition-all duration-200 cursor-pointer border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT focus:ring-offset-2';

  // Variant classes
  const variantClasses = {
    primary: 'bg-primary-DEFAULT text-white hover:bg-primary-dark active:bg-primary-DEFAULT border-primary-DEFAULT hover:border-primary-dark',
    secondary: 'bg-gray-200 text-dark-DEFAULT hover:bg-gray-300 active:bg-gray-400 border-gray-200 hover:border-gray-300',
    outline: 'bg-transparent text-primary-DEFAULT hover:bg-primary-DEFAULT hover:text-white border-primary-DEFAULT hover:border-primary-DEFAULT',
    ghost: 'bg-transparent text-dark-DEFAULT hover:bg-gray-100 active:bg-gray-200 border-transparent',
    danger: 'bg-error text-white hover:bg-error/90 active:bg-error/80 border-error hover:border-error/90',
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs md:text-sm min-h-[36px]',
    md: 'px-6 py-3 text-sm md:text-base min-h-[44px]',
    lg: 'px-8 py-4 text-base md:text-lg min-h-[52px]',
  };

  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';

  // Disabled classes
  const disabledClasses = (disabled || loading) ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

  // Loading spinner
  const loadingSpinner = (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${widthClasses}
        ${disabledClasses}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && loadingSpinner}
      {children}
    </button>
  );
};

export default Button;