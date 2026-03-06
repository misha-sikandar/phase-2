import React from 'react';

interface ProductivityMetricsProps {
  completedTasks: number;
  totalTasks: number;
  overdueTasks: number;
}

const ProductivityMetrics: React.FC<ProductivityMetricsProps> = ({ 
  completedTasks, 
  totalTasks, 
  overdueTasks 
}) => {
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Productivity Metrics</h3>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Task Completion Rate</span>
            <span className="text-sm font-medium text-gray-900">{completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Tasks</p>
            <p className="text-2xl font-bold text-blue-700">{totalTasks}</p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-700">{completedTasks}</p>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-700">{totalTasks - completedTasks - overdueTasks}</p>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Overdue</p>
            <p className="text-2xl font-bold text-red-700">{overdueTasks}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductivityMetrics;