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
          transports: ['websocket'],
        }
      );

      setSocket(socketRef.current);

      // Handle connection errors
      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
        setTimeout(() => {
          const userAuth = getAuthCookie();
          if (userAuth?.token?.accessToken) {
            reconnectSocket(userAuth.token.accessToken);
          }
        }, 3000);
      });

      // Handle disconnection
      socketRef.current.on('disconnect', (reason) => {
        console.warn('Socket disconnected:', reason);
        const userAuth = getAuthCookie();
        if (userAuth?.token?.accessToken) {
          reconnectSocket(userAuth.token.accessToken);
        }
      });

      // Reconnection attempt
      socketRef.current.on('reconnect_attempt', () => {
        console.log('Attempting to reconnect...');
      });

      // Successful reconnection
      socketRef.current.on('reconnect', () => {
        console.log('Socket reconnected successfully.');
      });
    }
  };

  useEffect(() => {
    const userAuth = getAuthCookie();

    if (userAuth?.token?.accessToken) {
      reconnectSocket(userAuth.token.accessToken);

      const handleSocketEvents = () => {
        if (socketRef.current) {
          const testData = { key: 'test', value: Math.random() };

          // Emit test data to 'greeting'
          socketRef.current.emit('greeting', testData);

          // Clean up existing listeners before adding new ones
          socketRef.current.off('welcome');
          socketRef.current.on('welcome', (receivedData) => {
            console.log('Data received from welcome:', receivedData);
            if (JSON.stringify(receivedData) !== JSON.stringify(testData)) {
              console.warn('Data mismatch, reconnecting socket...');
              disconnectSocket();
              reconnectSocket(userAuth.token.accessToken);
            }
          });
        }
      };

      if (socketRef.current) {
        socketRef.current.off('connect');
        socketRef.current.on('connect', () => {
          console.log('Socket connected.');
          handleSocketEvents();
        });

        socketRef.current.off('disconnect');
        socketRef.current.on('disconnect', (reason) => {
          console.warn('Socket disconnected:', reason);
          const userAuth = getAuthCookie();
          if (userAuth?.token?.accessToken) {
            reconnectSocket(userAuth.token.accessToken);
          }
        });
      }
    }

    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{ socket, disconnectSocket, reconnectSocket }}
    >
      {children}
    </SocketContext.Provider>
  );
};
