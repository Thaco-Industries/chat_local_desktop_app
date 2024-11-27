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
type SocketContextType = Socket | null;

// Initialize the Context with a null default value
const SocketContext = createContext<SocketContextType>(null);

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
  const [socket, setSocket] = useState<SocketContextType>(null);
  const userAuth = getAuthCookie(); // Get authentication information from AuthContext
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Kiểm tra và tạo kết nối nếu chưa tồn tại
    if (!socketRef.current) {
      socketRef.current = io(
        `${socketUrl}/${process.env.REACT_APP_SOCKET_CHANNEL}`,
        {
          extraHeaders: {
            authorization: `Bearer ${userAuth?.token.accessToken}`,
          },
        }
      );
      setSocket(socketRef.current);
    }

    // Cleanup kết nối khi component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
        setSocket(null);
      }
    };
  }, [userAuth?.token.accessToken]);
  // Re-run effect when the user changes

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
