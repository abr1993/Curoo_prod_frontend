import React from 'react';

interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'info' | 'warning' | 'success';
  disabled?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onClick,
  variant = 'default',
  disabled = false
}) => {
  const variants = {
    default: selected
      ? 'bg-blue-600 text-white border-blue-600'
      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    success: 'bg-green-100 text-green-800 border-green-200',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled = {disabled}
      className={`px-4 py-2 rounded-full border-2 whitespace-nowrap text-sm font-medium transition-all ${
        variants[variant]
      } ${disabled 
          ? 'opacity-40 cursor-not-allowed grayscale-[0.5]'
        : onClick ? 'cursor-pointer' : 'cursor-default'}`}
    >
      {label}
    </button>
  );
};
