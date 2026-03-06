'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/auth-context';
import { apiClient } from '../../services/api-client';
import ProtectedRoute from '../../components/layout/protected-route';
import StatCard from '../../components/dashboard/stat-card';
import ProductivityMetrics from '../../components/dashboard/productivity-metrics';
import TaskSummaryCard from '../../components/dashboard/task-summary-card';
import LoadingSkeleton from '../../components/ui/loading-skeleton';

interface DashboardStats {
  total_tasks: number;
  pending_tasks: number;
  in_progress_tasks: number;
  completed_tasks: number;
  overdue_tasks: number;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0); // Trigger refresh

  useEffect(() => {
    if (!loading && user) {
      fetchDashboardStats();
    }
  }, [user, loading, refreshKey]);

  // Listen for task changes from other pages
  useEffect(() => {
    const handleTaskChange = () => {
      setRefreshKey(prev => prev + 1);
    };

    window.addEventListener('taskChanged', handleTaskChange);
    return () => window.removeEventListener('taskChanged', handleTaskChange);
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoadingStats(true);
      const todos = await apiClient.get('/todos');
      
      // Backend returns: { items: [...], total: number, limit: number, offset: number }
      const allTodos = todos?.items || todos || [];

      const total_tasks = allTodos.length || 0;
      const pending_tasks = allTodos.filter((t: any) => t.status === 'pending').length || 0;
      const in_progress_tasks = allTodos.filter((t: any) => t.status === 'in-progress').length || 0;
      const completed_tasks = allTodos.filter((t: any) => t.status === 'completed').length || 0;
      const overdue_tasks = allTodos.filter((t: any) =>
        t.due_date &&
        new Date(t.due_date) < new Date() &&
        t.status !== 'completed'
      ).length || 0;

      const statsData = {
        total_tasks,
        pending_tasks,
        in_progress_tasks,
        completed_tasks,
        overdue_tasks
      };
      setStats(statsData);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard statistics');
      console.error('Error fetching dashboard stats:', err);
      setStats({
        total_tasks: 0,
        pending_tasks: 0,
        in_progress_tasks: 0,
        completed_tasks: 0,
        overdue_tasks: 0
      });
    } finally {
      setLoadingStats(false);
    }
  };

  if (loading || loadingStats) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <LoadingSkeleton type="text" className="h-10 w-64 mb-4" />
                <LoadingSkeleton type="text" className="h-4 w-96" />
              </div>

              {/* Stats Grid Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="stat-card">
                    <LoadingSkeleton type="text" className="h-6 w-3/4 mb-4" />
                    <LoadingSkeleton type="text" className="h-8 w-1/2" />
                  </div>
                ))}
              </div>

              {/* Dashboard Widgets Skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <LoadingSkeleton type="card" className="h-64 w-full" />
                </div>
                
                <div>
                  <LoadingSkeleton type="card" className="h-64 w-full" />
                </div>
              </div>
              
              {/* Recent Activity Skeleton */}
              <div className="mt-8">
                <LoadingSkeleton type="card" className="h-64 w-full" />
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-2 text-gray-600">Welcome back! Here's what's happening with your tasks today.</p>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4 mb-6 border border-red-200">
                <div className="text-sm text-red-700">{error}</div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <StatCard 
                title="Total Tasks" 
                value={stats?.total_tasks || 0} 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                }
                gradient="from-blue-50 to-blue-100"
                borderColor="border-blue-500"
              />
              
              <StatCard 
                title="Pending" 
                value={stats?.pending_tasks || 0} 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                gradient="from-yellow-50 to-yellow-100"
                borderColor="border-yellow-500"
              />
              
              <StatCard 
                title="In Progress" 
                value={stats?.in_progress_tasks || 0} 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
                gradient="from-orange-50 to-orange-100"
                borderColor="border-orange-500"
              />
              
              <StatCard 
                title="Completed" 
                value={stats?.completed_tasks || 0} 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                gradient="from-green-50 to-green-100"
                borderColor="border-green-500"
              />
              
              <StatCard 
                title="Overdue" 
                value={stats?.overdue_tasks || 0} 
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                }
                gradient="from-red-50 to-red-100"
                borderColor="border-red-500"
              />
            </div>

            {/* Dashboard Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ProductivityMetrics 
                  completedTasks={stats?.completed_tasks || 0} 
                  totalTasks={stats?.total_tasks || 0} 
                  overdueTasks={stats?.overdue_tasks || 0} 
                />
              </div>
              
              <div>
                <TaskSummaryCard 
                  pendingTasks={stats?.pending_tasks || 0} 
                  inProgressTasks={stats?.in_progress_tasks || 0} 
                  completedTasks={stats?.completed_tasks || 0} 
                />
              </div>
            </div>
            
            {/* Recent Activity Section */}
            <div className="mt-8 bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="text-center py-8">
                <p className="text-gray-600">No recent activity to show. Your completed tasks will appear here.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}