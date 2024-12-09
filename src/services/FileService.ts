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

  const deleteFileMessage = async (roomId: string, fileIds: string[]) => {
    const payload = {
      roomId,
      fileIds,
    };
    const response = await apiRequest(
      'DELETE',
      `message/delete-message-by-file-id?roomId=${roomId}`,
      payload
    );
    return response;
  };

  return { getAllFilesInRoom, deleteFileMessage };
};
