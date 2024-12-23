// SocketContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { getAuthCookie } from '../actions/auth.action';

// Define the type for the SocketContext value
type SocketContextType = {
  socket: Socket | null;
  disconnectSocket: () => void;
  reconnectSocket: (token: string) => void;
};

// Initialize the Context with a null default value
const SocketContext = createContext<SocketContextType>({
  socket: null,
  disconnectSocket: () => {},
  reconnectSocket: () => {},
});

// Custom hook to access the SocketContext
export const useSocket = (): SocketContextType => {
  return useContext(SocketContext);
};

// Define props for the SocketProvider
interface SocketProviderProps {
  children: ReactNode;
}

const socketUrl = process.env.REACT_APP_SOCKET_URL;

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setSocket(null);
    }
  };

  const reconnectSocket = (token: string) => {
    if (!socketRef.current) {
      console.log('Initializing socket connection...');
      console.log('Socket URL:', socketUrl);
      console.log('Socket Channel:', process.env.REACT_APP_SOCKET_CHANNEL);
      console.log('Authorization Token:', token);

      socketRef.current = io(
        `${socketUrl}/${process.env.REACT_APP_SOCKET_CHANNEL}`,
        {
          auth: { Authorization: `Bearer ${token}` },
          transports: ['websocket'],
        }
      );

      setSocket(socketRef.current);

      // Log sự kiện connect_error
      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
        console.log('Socket error details:', error);

        // Thử kết nối lại sau 3 giây
        setTimeout(() => {
          if (socketRef.current && !socketRef.current.connected) {
            console.log('Retrying socket connection...');
            const userAuth = getAuthCookie();
            if (userAuth?.token?.accessToken) {
              reconnectSocket(userAuth.token.accessToken);
            }
          }
        }, 3000);
      });

      // Log sự kiện disconnect
      socketRef.current.on('disconnect', (reason) => {
        console.warn('Socket disconnected:', reason);

        if (reason === 'io server disconnect') {
          console.log('Server disconnected socket. Attempting to reconnect...');
          const userAuth = getAuthCookie();
          if (userAuth?.token?.accessToken) {
            reconnectSocket(userAuth.token.accessToken);
          }
        }
      });

      // Log sự kiện reconnect_attempt
      socketRef.current.on('reconnect_attempt', () => {
        console.log('Attempting to reconnect...');
      });

      // Log sự kiện reconnect
      socketRef.current.on('reconnect', () => {
        console.log('Socket reconnected successfully.');
      });

      // Log sự kiện connect
      socketRef.current.on('connect', () => {
        console.log('Socket connected successfully.');
        console.log('Socket ID:', socketRef.current?.id);
      });

      // Log tất cả các sự kiện từ server để kiểm tra namespace
      socketRef.current.onAny((event, ...args) => {
        console.log('Received event:', event, 'with args:', args);
      });
    }
  };

  useEffect(() => {
    // Kiểm tra và tạo kết nối nếu chưa tồn tại
    const userAuth = getAuthCookie();
    if (userAuth?.token?.accessToken) {
      reconnectSocket(userAuth.token.accessToken);
    }

    return () => {
      disconnectSocket();
    };
  }, []);
  // Re-run effect when the user changes

  return (
    <SocketContext.Provider
      value={{ socket, disconnectSocket, reconnectSocket }}
    >
      {children}
    </SocketContext.Provider>
  );
};
