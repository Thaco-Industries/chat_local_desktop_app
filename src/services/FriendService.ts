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

  const sendFriendRequest = async (id: string) => {
    const response = await apiRequest('POST', `friend/requests/${id}`);

    return response;
  };

  const cancelSendFriendRequest = async (id: string) => {
    const response = await apiRequest(
      'PATCH',
      `friend/cancel-send-request/${id}`
    );

    return response;
  };

  const getUserInfo = async (userId: string) => {
    const response = await apiRequest('GET', `users/information/${userId}`);

    return response;
  };

  const actionRequestFriend = async (
    userId: string,
    body: { id: string; status: string }
  ) => {
    const response = await apiRequest(
      'PATCH',
      `friend/action-request-friend/${userId}`,
      body
    );

    return response;
  };

  const getListFriend = async (query: string) => {
    const response = await apiRequest(
      'GET',
      `friend/list-friend?search=${query}`
    );

    return response;
  };
  const getListFriendCanAddToRoom = async (id: string, query: string) => {
    const response = await apiRequest(
      'GET',
      `room/list-friend-can-add-to-room/${id}?search=${query}`
    );

    return response;
  };

  return {
    searchUser,
    sendFriendRequest,
    cancelSendFriendRequest,
    getUserInfo,
    actionRequestFriend,
    getListFriend,
    getListFriendCanAddToRoom,
  };
};