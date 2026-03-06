'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/auth-context';
import { apiClient } from '../../services/api-client';
import { Task } from '../../types/shared-types';
import ProtectedRoute from '../../components/layout/protected-route';
import TaskFilters from '../../components/tasks/task-filters';
import StatusBadge from '../../components/tasks/status-badge';
import PriorityIndicator from '../../components/tasks/priority-indicator';
import LoadingSkeleton from '../../components/ui/loading-skeleton';

export default function TasksPage() {
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{ status?: string; priority?: string }>({});

  useEffect(() => {
    if (!loading && user) {
      fetchTasks();
    }
  }, [user, loading]);

  useEffect(() => {
    // Apply filters when tasks or filters change
    let result = [...tasks];
    
    if (filters.status && filters.status !== 'all') {
      result = result.filter(task => task.status === filters.status);
    }
    
    if (filters.priority && filters.priority !== 'all') {
      result = result.filter(task => task.priority === filters.priority);
    }
    
    setFilteredTasks(result);
  }, [tasks, filters]);

  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);
      const response = await apiClient.get('/todos');
      // The response might be an array or an object with items property
      // Handle the response format from the backend
      const data = response && typeof response === 'object' && 'items' in response
        ? response.items || []
        : Array.isArray(response) ? response : [];
      setTasks(data);
      
      // Notify dashboard to refresh stats
      window.dispatchEvent(new CustomEvent('taskChanged'));
    } catch (err) {
      setError('Failed to load tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoadingTasks(false);
    }
  };

  const handleFilterChange = (newFilters: { status?: string; priority?: string }) => {
    setFilters(newFilters);
  };

  if (loading || loadingTasks) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="flex justify-between items-center">
                <LoadingSkeleton type="text" className="h-8 w-48" />
                <LoadingSkeleton type="button" className="h-10 w-32" />
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
              <LoadingSkeleton type="card" className="h-20 w-full mb-6" />
              
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {[...Array(5)].map((_, i) => (
                    <li key={i}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <LoadingSkeleton type="text" className="h-5 w-3/4" />
                          <div className="ml-2 flex-shrink-0 flex">
                            <LoadingSkeleton type="text" className="h-6 w-16" />
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <div className="mr-6">
                              <LoadingSkeleton type="text" className="h-4 w-full mb-2" />
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <LoadingSkeleton type="text" className="h-4 w-24" />
                            </div>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <LoadingSkeleton type="text" className="h-6 w-16" />
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
              <a 
                href="/tasks/new" 
                className="btn-primary px-4 py-2 text-sm"
              >
                Create Task
              </a>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
            {error && (
              <div className="rounded-md bg-red-50 p-4 mb-6">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            <TaskFilters onFilterChange={handleFilterChange} />

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {filteredTasks.length === 0 ? (
                  <li className="px-6 py-12 text-center">
                    <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <p className="text-gray-500">
                      {tasks.length === 0 
                        ? 'No tasks found. Create your first task!' 
                        : 'No tasks match your current filters.'}
                    </p>
                    {tasks.length === 0 && (
                      <a 
                        href="/tasks/new" 
                        className="mt-4 inline-block btn-primary px-4 py-2 text-sm"
                      >
                        Create Your First Task
                      </a>
                    )}
                  </li>
                ) : (
                  filteredTasks.map((task) => (
                    <li key={task.id}>
                      <a href={`/tasks/${task.id}`} className="block hover:bg-gray-50">
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-indigo-600 truncate">
                              {task.title}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              <StatusBadge status={task.status} />
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
                                  Due: {new Date(task.due_date).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <PriorityIndicator priority={task.priority} />
                            </div>
                          </div>
                        </div>
                      </a>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}