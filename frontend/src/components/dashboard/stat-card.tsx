import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
  borderColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, gradient, borderColor }) => {
  return (
    <div className={`stat-card bg-gradient-to-br ${gradient} border-l-4 ${borderColor}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="p-3 rounded-full bg-white bg-opacity-30">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;