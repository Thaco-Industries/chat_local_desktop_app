// src/services/useMarkAsReadService.ts
import { useFetchApi } from '../context/ApiContext';

export const useFileService = () => {
  const { apiRequest } = useFetchApi();

  const getAllFilesInRoom = async (
    roomId: string,
    type?: 'video' | 'image' | 'other'
  ) => {
    const response = await apiRequest(
      'GET',
      `files/all-files-in-room?roomId=${roomId}&type=${type}`
    );

    return response;
  };

  return { getAllFilesInRoom };
};
