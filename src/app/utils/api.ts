const API_BASE_URL = import.meta.env.VITE_API_URL+"/api"|| 'http://localhost:5000/api';

// Helper function to get auth token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper function to set auth token
export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

// Helper function to remove auth token
export const removeToken = (): void => {
  localStorage.removeItem('token');
};

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  console.log("[API] Token retrieved:", token ? `${token.slice(0, 20)}...` : "null");
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Generic API request function
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  };

  console.log(`[API] ${options.method || 'GET'} ${url}`);
  console.log(`[API] Headers:`, config.headers);
  console.log(`[API] Body:`, options.body ? JSON.parse(options.body as string) : "");

  try {
    const response = await fetch(url, config);
    
    // Check if response is ok before trying to parse JSON
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('[API] Failed to parse JSON response:', jsonError);
        throw new Error(`Invalid JSON response: ${response.status} ${response.statusText}`);
      }
    } else {
      const text = await response.text();
      console.error('[API] Non-JSON response:', text);
      throw new Error(`Unexpected response format: ${response.status} ${response.statusText}`);
    }

    if (!response.ok) {
      const errorMessage = data?.error || `Request failed with status ${response.status}`;
      console.error(`[API] Request failed: ${response.status} - ${errorMessage}`);
      throw new Error(errorMessage);
    }

    console.log(`[API] Success: ${response.status}`);
    return data;
  } catch (error: any) {
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error('[API] Network error - Backend may be down or unreachable:', error.message);
      throw new Error(`Cannot connect to backend server. Please ensure the server is running on ${API_BASE_URL.replace('/api', '')}`);
    }
    
    // Re-throw if it's already our custom error
    if (error instanceof Error) {
      console.error('[API] Request error:', error.message);
      throw error;
    }
    
    // Handle unknown errors
    console.error('[API] Unknown error:', error);
    throw new Error(error?.message || 'An unexpected error occurred');
  }
};

// Auth API
export const authAPI = {
  // Student auth
  registerStudent: async (email: string, password: string) => {
    return apiRequest<{ token: string; user: any; message: string }>(
      '/auth/student/register',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
  },

  loginStudent: async (email: string, password: string) => {
    return apiRequest<{ token: string; user: any; message: string }>(
      '/auth/student/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
  },

  // Teacher auth
  registerTeacher: async (email: string, password: string) => {
    return apiRequest<{ token: string; user: any; message: string }>(
      '/auth/teacher/register',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
  },

  loginTeacher: async (email: string, password: string) => {
    return apiRequest<{ token: string; user: any; message: string }>(
      '/auth/teacher/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
  },
};

// Meeting API
export const meetingAPI = {
  // Create meeting request (Student)
  createRequest: async (teacherId: string, selectedTimeSlot: string, reason?: string) => {
    return apiRequest<{ message: string; meeting: any }>('/meetings/request', {
      method: 'POST',
      body: JSON.stringify({ teacherId, selectedTimeSlot, reason }),
    });
  },

  // Get student meetings
  getStudentMeetings: async () => {
    return apiRequest<{ meetings: any[] }>('/meetings/student/meetings');
  },

  // Get pending requests (Teacher)
  getPendingRequests: async () => {
    return apiRequest<{ requests: any[] }>('/meetings/pending');
  },

  // Confirm meeting (Teacher)
  confirmMeeting: async (meetingId: string) => {
    console.log('[API] 📡 confirmMeeting() CALLED');
    console.log('[API] 📡 Preparing to send meetingId:', meetingId);
    console.log('[API] 📡 Is meetingId defined?', meetingId !== undefined);
    console.log('[API] 📡 Is meetingId truthy?', !!meetingId);
    
    const payload = { meetingId };
    console.log('[API] 📡 JSON payload:', JSON.stringify(payload));
    console.log('[API] 📤 CONFIRM - Calling /meetings/confirm with meetingId:', meetingId);
    
    const response = await apiRequest<{ message: string; meeting: any }>('/meetings/confirm', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    console.log('[API] ✅ CONFIRM - Response:', response);
    return response;
  },

  // Reject meeting (Teacher)
  rejectMeeting: async (meetingId: string, reason?: string) => {
    console.log('[meetingAPI] 📤 REJECT - Calling /meetings/reject with meetingId:', meetingId, 'reason:', reason);
    const response = await apiRequest<{ message: string; meeting: any }>('/meetings/reject', {
      method: 'POST',
      body: JSON.stringify({ meetingId, reason }),
    });
    console.log('[meetingAPI] ✅ REJECT - Response:', response);
    return response;
  },
};

// Notification API
export const notificationAPI = {
  // Get notifications (Student)
  getNotifications: async () => {
    return apiRequest<{ notifications: any[] }>('/notifications');
  },

  // Mark notification as read
  markAsRead: async (notificationId: string) => {
    return apiRequest<{ message: string }>(`/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  },
};

// Teacher API
export const teacherAPI = {
  // Get list of teachers
  getTeachers: async () => {
    return apiRequest<{ teachers: any[] }>('/teachers/list');
  },
};
