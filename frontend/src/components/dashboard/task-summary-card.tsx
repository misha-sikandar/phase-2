import React from 'react';
import Link from 'next/link';

interface TaskSummaryCardProps {
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
}

const TaskSummaryCard: React.FC<TaskSummaryCardProps> = ({ 
  pendingTasks, 
  inProgressTasks, 
  completedTasks 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Task Summary</h3>
        <Link href="/tasks" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
          View All
        </Link>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
            <span className="text-gray-700">Pending</span>
          </div>
          <span className="font-semibold text-gray-900">{pendingTasks}</span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
            <span className="text-gray-700">In Progress</span>
          </div>
          <span className="font-semibold text-gray-900">{inProgressTasks}</span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <span className="text-gray-700">Completed</span>
          </div>
          <span className="font-semibold text-gray-900">{completedTasks}</span>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <Link href="/tasks/new" className="w-full btn-primary py-3 text-center block">
          Create New Task
        </Link>
      </div>
    </div>
  );
};

export default TaskSummaryCard;