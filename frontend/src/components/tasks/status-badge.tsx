import React from 'react';

interface StatusBadgeProps {
  status: 'pending' | 'in-progress' | 'completed' | 'archived';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let bgColor = '';
  let textColor = '';
  let label = '';

  switch (status) {
    case 'pending':
      bgColor = 'bg-blue-100';
      textColor = 'text-blue-800';
      label = 'Pending';
      break;
    case 'in-progress':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      label = 'In Progress';
      break;
    case 'completed':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      label = 'Completed';
      break;
    case 'archived':
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      label = 'Archived';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      label = status;
  }

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}>
      {label}
    </span>
  );
};

export default StatusBadge;