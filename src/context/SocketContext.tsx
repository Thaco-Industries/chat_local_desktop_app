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
      socketRef.current = io(
        `${socketUrl}/${process.env.REACT_APP_SOCKET_CHANNEL}`,
        {
          auth: { Authorization: `Bearer ${token}` },
          transports: ['websocket', 'polling'],
        }
      );
      setSocket(socketRef.current); // Lắng nghe sự kiện lỗi và tự động kết nối lại
      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
        // Thử kết nối lại sau 3 giây
        setTimeout(() => {
          if (socketRef.current && !socketRef.current.connected) {
            const userAuth = getAuthCookie();
            if (userAuth?.token?.accessToken) {
              reconnectSocket(userAuth.token.accessToken);
            }
          }
        }, 3000);
      });

      socketRef.current.on('disconnect', (reason) => {
        console.warn('Socket disconnected:', reason);
        // Xử lý ngắt kết nối, ví dụ: hiển thị thông báo lỗi
        if (reason === 'io server disconnect') {
          // Nếu server ngắt kết nối, thực hiện kết nối lại
          const userAuth = getAuthCookie();
          if (userAuth?.token?.accessToken) {
            reconnectSocket(userAuth.token.accessToken);
          }
        }
      });

      socketRef.current.on('reconnect_attempt', () => {
        console.log('Attempting to reconnect...');
      });

      socketRef.current.on('reconnect', () => {
        console.log('Socket reconnected successfully.');
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
