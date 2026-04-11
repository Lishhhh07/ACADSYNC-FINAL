import { useEffect, useState } from 'react';
import { meetingAPI } from '../utils/api';

/**
 * Hook to listen for real-time meeting updates using polling
 */
export const useRealtimeMeetings = (enabled: boolean = true, role: 'student' | 'teacher' = 'student') => {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled) return;

    const fetchMeetings = async () => {
      try {
        if (role === 'student') {
          const response = await meetingAPI.getStudentMeetings();
          setMeetings(response.meetings);
        } else {
          const response = await meetingAPI.getPendingRequests();
          setMeetings(response.requests);
        }
      } catch (error) {
        console.error('Error fetching meetings:', error);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchMeetings();

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchMeetings, 5000);

    return () => clearInterval(interval);
  }, [enabled, role]);

  return { meetings, loading };
};
