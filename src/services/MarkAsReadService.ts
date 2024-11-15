// src/services/useMarkAsReadService.ts
import { useFetchApi } from '../context/ApiContext';

export const useMarkAsReadService = () => {
  const { apiRequest } = useFetchApi();

  const markAsReadMessage = async (roomId: string) => {
    try {
      const response = await apiRequest(
        'PUT',
        `message/mark-as-read?roomId=${roomId}`
      );
      return response;
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  };

  return { markAsReadMessage };
};
