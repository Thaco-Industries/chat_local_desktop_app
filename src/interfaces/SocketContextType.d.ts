import { Socket } from 'socket.io-client';

export interface SocketContextType {
  socket: Socket | null;
}

export interface SocketProviderProps {
  children: ReactNode;
}
