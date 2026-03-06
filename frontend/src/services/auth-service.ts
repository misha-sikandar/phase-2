import { apiClient } from './api-client';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

interface RegisterData {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

class AuthService {
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/auth/signup', userData);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      
      // Store token and user ID from backend response
      if (response.access_token) {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('userId', response.user?.id || '');
      }
      
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  }

  async logout(): Promise<void> {
    try {
      // Logout endpoint may not exist, that's okay
      // Just clear local storage
    } catch (error: any) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  getCurrentUserId(): string | null {
    return localStorage.getItem('userId');
  }
}

export const authService = new AuthService();