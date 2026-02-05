import React from 'react';

const Skeleton = ({ className = '', ...props }) => {
  return (
    <div
      className={`animate-pulse bg-[var(--color-surface-hover)] rounded-xl ${className}`}
      {...props}
    />
  );
};

export const SkeletonText = ({ lines = 1, className = '', height = 'h-4', width = 'w-full' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={`${height} ${width}`} />
      ))}
    </div>
  );
};

export const SkeletonCard = ({ className = '' }) => {
  return (
    <div className={`glass-card p-6 h-full border border-[var(--glass-border)] ${className}`}>
      <div className="flex items-center gap-4 mb-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <SkeletonText lines={2} />
        </div>
      </div>
      <Skeleton className="h-32 w-full mb-4 rounded-lg" />
      <SkeletonText lines={3} />
    </div>
  );
};

export const SkeletonAvatar = ({ size = 'w-10 h-10', className = '' }) => {
    return <Skeleton className={`rounded-full ${size} ${className}`} />;
};

export default Skeleton;
