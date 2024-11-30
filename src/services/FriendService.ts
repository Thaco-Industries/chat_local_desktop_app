// src/services/useMarkAsReadService.ts
import { useFetchApi } from '../context/ApiContext';

export const useFriendService = () => {
  const { apiRequest } = useFetchApi();

  const searchUser = async (search: string) => {
    const response = await apiRequest(
      'GET',
      `friend/search-user?search=${search}`
    );

    return response;
  };

  return { searchUser };
};
