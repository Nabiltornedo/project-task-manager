import React from 'react';
import { getProgressColor } from '../../utils/helpers';

interface ProgressBarProps {
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  size = 'md',
  showLabel = true,
  animated = true,
}) => {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium text-slate-600">Progress</span>
          <span className="text-xs font-semibold text-slate-700">
            {clampedPercentage.toFixed(0)}%
          </span>
        </div>
      )}
      <div className={`progress-bar ${sizeClasses[size]}`}>
        <div
          className={`progress-fill ${getProgressColor(clampedPercentage)} ${
            animated ? 'transition-all duration-700 ease-out' : ''
          }`}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
    </div>
  );
};
