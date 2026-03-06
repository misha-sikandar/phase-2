import React from 'react';
import { Task } from '../../types/shared-types';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <li className="px-4 py-4 sm:px-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-indigo-600 truncate">
          {task.title}
        </p>
        <div className="ml-2 flex-shrink-0 flex">
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
        </div>
      </div>
      <div className="mt-2 sm:flex sm:justify-between">
        <div className="sm:flex">
          {task.description && (
            <div className="mr-6">
              <p className="flex items-center text-sm text-gray-500">
                {task.description}
              </p>
            </div>
          )}
          {task.due_date && (
            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
              Due: {formatDate(task.due_date)}
            </div>
          )}
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>
      </div>
      <div className="mt-4 flex justify-end space-x-3">
        <button
          onClick={() => onEdit(task)}
          className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete
        </button>
      </div>
    </li>
  );
};

export default TaskItem;