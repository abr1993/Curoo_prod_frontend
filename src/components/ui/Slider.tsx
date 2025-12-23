import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  leftLabel?: string;
  rightLabel?: string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 10,
  leftLabel = '0 none',
  rightLabel = '10 worst',
}) => {
  // 🎨 Dynamically choose color based on value
  const getColor = (val: number) => {
    if (val <= 3) return "#22c55e"; // green-500
    if (val <= 6) return "#eab308"; // yellow-500
    return "#ef4444"; // red-500
  };
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-lg font-semibold text-blue-600">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        style={{accentColor: getColor(value)}}
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
};
