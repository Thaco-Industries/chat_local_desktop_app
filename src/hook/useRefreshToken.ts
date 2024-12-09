import { useCallback } from 'react';
import { useSocket } from '../context/SocketContext';
import { createAuthCookie, getAuthCookie } from '../actions/auth.action';
import axios from 'axios';

export const refreshToken = async (
  handleLogout: () => void,
  disconnectSocket: () => void,
  reconnectSocket: (newToken: string) => void
) => {
  try {
    const userAuth = getAuthCookie();
    if (!userAuth?.token?.refreshToken) throw new Error('No refresh token');

    disconnectSocket();

    const response = await axios.patch(
      'auth/refreshToken',
      {
        refreshToken: userAuth.token.refreshToken,
      },
      { headers: { Authorization: `Bearer ${userAuth.token.refreshToken}` } }
    );

    const newAuth = response.data;

    createAuthCookie(newAuth);

    // Kết nối lại socket với token mới
    reconnectSocket(newAuth.token.accessToken);

    return newAuth.token.accessToken;
  } catch (error) {
    handleLogout();
    throw error;
  }
};
