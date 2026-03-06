import React, { useState } from 'react';

interface TaskFiltersProps {
  onFilterChange: (filters: { status?: string; priority?: string }) => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ onFilterChange }) => {
  const [status, setStatus] = useState<string>('all');
  const [priority, setPriority] = useState<string>('all');

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setStatus(value);
    onFilterChange({ 
      ...(!value || value === 'all' ? {} : { status: value }),
      ...(!priority || priority === 'all' ? {} : { priority })
    });
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setPriority(value);
    onFilterChange({ 
      ...(!status || status === 'all' ? {} : { status: status }),
      ...(!value || value === 'all' ? {} : { priority: value })
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Status
          </label>
          <select
            id="status-filter"
            value={status}
            onChange={handleStatusChange}
            className="input-field"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Priority
          </label>
          <select
            id="priority-filter"
            value={priority}
            onChange={handlePriorityChange}
            className="input-field"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;