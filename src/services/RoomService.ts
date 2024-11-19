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

  return { getMemberInRoom };
};
