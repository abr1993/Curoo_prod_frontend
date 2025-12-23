import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          className={`mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer ${className}`}
          {...props}
        />
        <span className="text-sm text-gray-700 leading-tight">{label}</span>
      </label>
      {error && <p className="text-sm text-red-600 mt-1 ml-8">{error}</p>}
    </div>
  );
};
