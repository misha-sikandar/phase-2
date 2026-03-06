import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'text' | 'avatar' | 'button';
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  type = 'card', 
  className = '' 
}) => {
  let baseClasses = 'animate-pulse bg-gray-200 rounded';

  switch (type) {
    case 'text':
      baseClasses += ' h-4';
      break;
    case 'avatar':
      baseClasses += ' h-10 w-10 rounded-full';
      break;
    case 'button':
      baseClasses += ' h-10 rounded-md';
      break;
    case 'card':
    default:
      baseClasses += ' rounded-xl';
      break;
  }

  return <div className={`${baseClasses} ${className}`} />;
};

export default LoadingSkeleton;