// src/services/useMarkAsReadService.ts
import { useFetchApi } from '../context/ApiContext';

export const useRoomService = () => {
  const { apiRequest } = useFetchApi();

  const getRoomById = async (roomId: string) => {
    const response = await apiRequest('GET', `room/${roomId}`);
    return response;
  };

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

  const changeRoomInfor = async (
    roomId: string,
    payload: {
      id: string;
      roomName: string;
      avatar: string;
    }
  ) => {
    const response = await apiRequest(
      'PUT',
      `room/change-room-infor/${roomId}`,
      payload
    );

    return response;
  };

  const removeMember = async (roomId: string, memberId: string) => {
    const response = await apiRequest(
      'DELETE',
      `room/leader-remove-member/${roomId}/${memberId}`
    );
    return response;
  };
  const changeRoomLeader = async (payload: {
    roomId: string;
    memberId: string;
  }) => {
    const response = await apiRequest(
      'PUT',
      `room/give-room-leader-authority`,
      payload
    );
    return response;
  };

  const invitedRoomList = async (roomId: string) => {
    const response = await apiRequest('GET', `invited-rooms/list/${roomId}`);
    return response;
  };

  const leaderActionInvited = async (
    id: string,
    status: 'ACCEPTED' | 'REJECTED'
  ) => {
    const payload = {
      id,
      status,
    };
    const response = await apiRequest(
      'PUT',
      `invited-rooms/leader-action-invited/${id}`,
      payload
    );
    return response;
  };

  const addMemberToRoom = async (payload: {
    roomId: string;
    memberIds: string[];
  }) => {
    const response = await apiRequest(
      'POST',
      'room/add-member-to-room',
      payload
    );
    return response;
  };

  const leaveRoom = async (roomId: string) => {
    const response = await apiRequest(
      'DELETE',
      `room/out-room?roomId=${roomId}`
    );
    return response;
  };

  const listCanGiveLeader = async (roomId: string, query: string) => {
    const response = await apiRequest(
      'GET',
      `room/list-can-give-leader/${roomId}?search=${query}`
    );
    return response;
  };

  return {
    getMemberInRoom,
    uploadRoomImage,
    createNewRoom,
    changeRoomInfor,
    removeMember,
    changeRoomLeader,
    invitedRoomList,
    leaderActionInvited,
    addMemberToRoom,
    leaveRoom,
    listCanGiveLeader,
    getRoomById,
  };
};
