// src/services/useMarkAsReadService.ts
import { useFetchApi } from '../context/ApiContext';

export const useRoomService = () => {
  const { apiRequest } = useFetchApi();

  const getMemberInRoom = async (roomId: string) => {
    const response = await apiRequest(
      'GET',
      `room/list-member-in-room/${roomId}`
    );

    return response;
  };

  const uploadRoomImage = async (file: File) => {
    const formData = new FormData();

    formData.append('file', file);

    const response = await apiRequest('POST', `upload`, formData, {
      'Content-Type': 'multipart/form-data',
    });

    return response;
  };

  const createNewRoom = async (body: {
    roomName: string;
    members: string[];
    avatarUrl: string;
  }) => {
    const response = await apiRequest('POST', `room`, body);

    return response;
  };

  return { getMemberInRoom, uploadRoomImage, createNewRoom };
};
