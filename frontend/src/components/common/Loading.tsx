import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const Loading: React.FC<LoadingProps> = ({ size = 'md', text }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 rounded-full border-2 border-slate-200"></div>
        <div className="absolute inset-0 rounded-full border-2 border-primary-600 border-t-transparent animate-spin"></div>
      </div>
      {text && <p className="text-sm text-slate-500 animate-pulse">{text}</p>}
    </div>
  );
};

export const PageLoading: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
          <div className="absolute inset-0 rounded-full border-4 border-primary-600 border-t-transparent animate-spin"></div>
        </div>
        <h2 className="text-lg font-medium text-slate-700">Loading...</h2>
        <p className="text-sm text-slate-500 mt-1">Please wait a moment</p>
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="card p-6 animate-pulse">
      <div className="h-6 bg-slate-200 rounded-lg w-3/4 mb-4"></div>
      <div className="h-4 bg-slate-200 rounded w-1/2 mb-6"></div>
      <div className="space-y-3">
        <div className="h-3 bg-slate-200 rounded w-full"></div>
        <div className="h-3 bg-slate-200 rounded w-5/6"></div>
      </div>
      <div className="mt-6 flex justify-between items-center">
        <div className="h-4 bg-slate-200 rounded w-24"></div>
        <div className="h-8 bg-slate-200 rounded w-20"></div>
      </div>
    </div>
  );
};
