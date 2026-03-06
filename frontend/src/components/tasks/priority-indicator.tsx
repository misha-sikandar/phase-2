import React from 'react';

interface PriorityIndicatorProps {
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

const PriorityIndicator: React.FC<PriorityIndicatorProps> = ({ priority }) => {
  let bgColor = '';
  let textColor = '';
  let label = '';

  switch (priority) {
    case 'low':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      label = 'Low';
      break;
    case 'medium':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      label = 'Medium';
      break;
    case 'high':
      bgColor = 'bg-orange-100';
      textColor = 'text-orange-800';
      label = 'High';
      break;
    case 'urgent':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      label = 'Urgent';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      label = priority;
  }

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}>
      {label}
    </span>
  );
};

export default PriorityIndicator;