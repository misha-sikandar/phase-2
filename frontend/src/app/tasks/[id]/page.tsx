'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/auth-context';
import { apiClient } from '../../../services/api-client';
import { Task } from '../../../types/shared-types';
import ProtectedRoute from '../../../components/layout/protected-route';
import StatusBadge from '../../../components/tasks/status-badge';
import PriorityIndicator from '../../../components/tasks/priority-indicator';
import LoadingSkeleton from '../../../components/ui/loading-skeleton';
import TaskFormModal from '../../../components/tasks/task-form-modal';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const taskId = params.id as string;

  const [task, setTask] = useState<Task | null>(null);
  const [loadingTask, setLoadingTask] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!loading && user && taskId) {
      fetchTask();
    }
  }, [user, loading, taskId]);

  const fetchTask = async () => {
    try {
      setLoadingTask(true);
      const data = await apiClient.get(`/todos/${taskId}`);
      setTask(data);
    } catch (err) {
      setError('Failed to load task details');
      console.error('Error fetching task:', err);
    } finally {
      setLoadingTask(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      setIsDeleting(true);
      await apiClient.delete(`/todos/${taskId}`);
      
      // Notify dashboard to refresh stats
      window.dispatchEvent(new CustomEvent('taskChanged'));
      
      router.push('/tasks');
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
      setIsDeleting(false);
    }
  };

  const handleUpdateSuccess = (updatedTask: Task) => {
    setTask(updatedTask);
    setIsEditModalOpen(false);
    
    // Notify dashboard to refresh stats
    window.dispatchEvent(new CustomEvent('taskChanged'));
  };

  if (loading || loadingTask) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <LoadingSkeleton type="card" className="h-96 w-full" />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !task) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-md bg-red-50 p-6 border border-red-200">
              <h3 className="text-lg font-medium text-red-800">Error</h3>
              <p className="mt-2 text-sm text-red-700">{error || 'Task not found'}</p>
              <button
                onClick={() => router.push('/tasks')}
                className="mt-4 btn-primary px-4 py-2 text-sm"
              >
                Back to Tasks
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/tasks')}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center mb-4"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Tasks
            </button>
            
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
                <div className="mt-2 flex items-center gap-3">
                  <StatusBadge status={task.status} />
                  <PriorityIndicator priority={task.priority} />
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="btn-secondary px-4 py-2 text-sm"
                >
                  Edit Task
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="btn-danger px-4 py-2 text-sm"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>

          {/* Task Details Card */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
            {task.description ? (
              <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
            ) : (
              <p className="text-gray-400 italic">No description provided</p>
            )}
          </div>

          {/* Task Metadata */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Details</h2>
            
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{task.status}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Priority</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{task.priority}</dd>
              </div>
              
              {task.due_date && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Due Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(task.due_date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </dd>
                </div>
              )}
              
              {task.completed_at && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Completed At</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(task.completed_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </dd>
                </div>
              )}
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(task.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(task.updated_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Edit Task Modal */}
        {isEditModalOpen && (
          <TaskFormModal
            task={task}
            onClose={() => setIsEditModalOpen(false)}
            onSuccess={handleUpdateSuccess}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
