// API client for connecting to the actual backend
class ApiClient {
  private baseUrl = 'http://localhost:8000/v1'; // Update this to your actual backend URL

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    // Add authorization header if token exists
    const token = localStorage.getItem('token');
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    } else {
      // For public endpoints, ensure content-type is set
      if (!options.headers) {
        options.headers = {};
      }
      if (!options.headers['Content-Type']) {
        options.headers['Content-Type'] = 'application/json';
      }
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // Handle error response format from the backend
      // The backend returns error responses in the format: { success: false, error: { type, message, details } }
      if (errorData && typeof errorData === 'object' && 'error' in errorData) {
        const errorMessage = errorData.error && typeof errorData.error === 'object' && 'message' in errorData.error
          ? errorData.error.message
          : errorData.detail || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }
      // For responses with 'success' field that is false
      if (errorData && typeof errorData === 'object' && 'success' in errorData && errorData.success === false) {
        const errorMessage = errorData.error && typeof errorData.error === 'object' && 'message' in errorData.error
          ? errorData.error.message
          : errorData.detail || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    // For successful responses that have content
    if (response.status !== 204) {
      const responseData = await response.json();

      // FastAPI returns data directly (no wrapper)
      // Return response as-is for all successful responses
      return responseData;
    }

    // For 204 No Content responses
    return {};
  }

  get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  put(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();