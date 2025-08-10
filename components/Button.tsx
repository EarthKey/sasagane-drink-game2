
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = "px-8 py-3 text-lg font-semibold rounded-md shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4";
  
  const variantClasses = {
    primary: "bg-red-800 hover:bg-red-700 text-white border border-red-900 focus:ring-red-500/50",
    secondary: "bg-gray-700 hover:bg-gray-600 text-white border border-gray-800 focus:ring-gray-500/50",
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
