// src/services/useMarkAsReadService.ts
import { useFetchApi } from '../context/ApiContext';

export const useMessageService = () => {
  const { apiRequest } = useFetchApi();

  const getMessageByRoom = async (
    roomId: string,
    pageSize: number,
    lastMessageId: string
  ) => {
    const response = await apiRequest(
      'GET',
      `message/by-room-id?roomId=${roomId}&pageSize=${pageSize}&lastMessageId=${lastMessageId}`
    );

    return response;
  };

  const getMessageSearch = async (roomId: string, search: string) => {
    const response = await apiRequest(
      'GET',
      `message/search?roomId=${roomId}&search=${search}`
    );
    return response;
  };

  const getRedirectMessage = async (
    roomId: string,
    pageSize: number,
    selectThisMessageId: boolean,
    fromMessageIdToNewer: string
  ) => {
    const response = await apiRequest(
      'GET',
      `message/by-room-id?roomId=${roomId}&pageSize=${pageSize}&fromMessageIdToNewer=${fromMessageIdToNewer}&selectThisMessageId=${selectThisMessageId}`
    );
    return response;
  };

  const getNumberConversationNotRead = async () => {
    const response = await apiRequest(
      'GET',
      'message/number-conversation-not-read'
    );
    return response;
  };

  const sendMessage = async (payload: Object) => {
    const response = await apiRequest('POST', 'message', payload);
    return response;
  };

  const recallMessage = async (roomId: string) => {
    try {
      const response = await apiRequest(
        'PUT',
        `message/recall-message?messageId=${roomId}`
      );
      return response;
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  };

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

  return {
    recallMessage,
    markAsReadMessage,
    getMessageByRoom,
    sendMessage,
    getMessageSearch,
    getRedirectMessage,
    getNumberConversationNotRead,
  };
};
