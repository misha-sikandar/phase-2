'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/auth-context';
import { apiClient } from '../../services/api-client';
import ProtectedRoute from '../../components/layout/protected-route';
import ProfileDisplay from '../../components/profile/profile-display';
import AccountSettingsForm from '../../components/profile/account-settings-form';
import LoadingSkeleton from '../../components/ui/loading-skeleton';

interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
  updated_at: string;
}

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      fetchProfile();
    }
  }, [user, loading]);

  const fetchProfile = async () => {
    try {
      setLoadingProfile(true);
      const response = await apiClient.get('/auth/me');
      setProfile(response);
    } catch (err) {
      setError('Failed to load profile');
      console.error('Error fetching profile:', err);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleSave = async (updatedData: Partial<UserProfile>) => {
    try {
      setSaving(true);
      const response = await apiClient.put('/auth/me', updatedData);
      setProfile(response);
      setEditing(false);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
  };

  if (loading || loadingProfile) {
    return (
      <ProtectedRoute>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <LoadingSkeleton type="text" className="h-8 w-48 mb-6" />
          </div>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <LoadingSkeleton type="text" className="h-6 w-64 mb-4" />
                <LoadingSkeleton type="text" className="h-4 w-96" />
              </div>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <LoadingSkeleton type="text" className="h-4 w-24 mb-2" />
                    <LoadingSkeleton type="text" className="h-4 w-48" />
                  </div>

                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <LoadingSkeleton type="text" className="h-4 w-24 mb-2" />
                    <LoadingSkeleton type="text" className="h-4 w-48" />
                  </div>

                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <LoadingSkeleton type="text" className="h-4 w-24 mb-2" />
                    <LoadingSkeleton type="text" className="h-4 w-48" />
                  </div>

                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <LoadingSkeleton type="text" className="h-4 w-24 mb-2" />
                    <LoadingSkeleton type="text" className="h-4 w-48" />
                  </div>
                </dl>

                <div className="px-4 py-5 sm:px-6 flex justify-end space-x-3">
                  <LoadingSkeleton type="button" className="h-10 w-24" />
                  <LoadingSkeleton type="button" className="h-10 w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!profile) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <p className="text-gray-600">Profile not found</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 mt-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {message && (
            <div className="rounded-md bg-green-50 p-4 mb-6">
              <div className="text-sm text-green-700">{message}</div>
            </div>
          )}

          {!editing ? (
            <div>
              <ProfileDisplay user={profile} />
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Logout
                </button>
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Edit Profile</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Update your account information and preferences.
                </p>
              </div>
              <AccountSettingsForm
                user={profile}
                onSave={handleSave}
                onCancel={handleCancel}
                saving={saving}
              />
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}