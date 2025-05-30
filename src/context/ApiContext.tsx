import {
  createAuthCookie,
  deleteAuthCookie,
  getAuthCookie,
  getClientId,
} from '../actions/auth.action';
import axios from 'axios';
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSocket } from './SocketContext';
import { refreshToken } from '../hook/useRefreshToken';

const API_CALL_BEGIN = 'API_CALL_BEGIN';
const API_CALL_SUCCESS = 'API_CALL_SUCCESS';
const API_CALL_FAILURE = 'API_CALL_FAILURE';

axios.defaults.baseURL = `${process.env.REACT_APP_API_URL}`;
axios.defaults.headers.common['accept'] = 'application/json';
axios.defaults.headers.common['x-client-id'] = getClientId();
axios.defaults.headers.common['x-type-device'] = 'desktop';

interface ApiState {
  data: any;
  loading: boolean;
  error: any;
}

interface ApiAction {
  type: string;
  payload?: any;
}

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

interface ApiContextProps extends ApiState {
  apiRequest: (
    method: HttpMethod,
    url: string,
    data?: any,
    customHeaders?: Record<string, string>
  ) => Promise<any>;
  setToken: (userAuth: any) => void;
}

const ApiContext = createContext<ApiContextProps | undefined>(undefined);

const apiReducer = (state: ApiState, action: ApiAction): ApiState => {
  switch (action.type) {
    case API_CALL_BEGIN:
      return { ...state, loading: true, error: null };
    case API_CALL_SUCCESS:
      return { ...state, loading: false, data: action.payload, error: null };
    case API_CALL_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const initialState: ApiState = {
  data: null,
  loading: false,
  error: null,
};

interface ApiProviderProps {
  children: ReactNode;
}

export default function ApiProvider({ children }: ApiProviderProps) {
  const [state, dispatch] = useReducer(apiReducer, initialState);
  const navigate = useNavigate();
  const location = useLocation();
  const { disconnectSocket, reconnectSocket } = useSocket();

  const isTokenExpired = (): boolean => {
    const userAuth = getAuthCookie();
    if (!userAuth) return true;
    return false;
  };

  const handleLogout = () => {
    deleteAuthCookie();

    navigate('/login');
  };

  useEffect(() => {
    const tokenExpired = isTokenExpired();

    if (tokenExpired) {
      handleLogout();
    }
  }, [location.pathname]);

  // const refreshToken = async () => {
  //   const { disconnectSocket, reconnectSocket } = useSocket();
  //   try {
  //     const userAuth = getAuthCookie();
  //     if (!userAuth?.token?.refreshToken) throw new Error('No refresh token');

  //     disconnectSocket();

  //     const response = await axios.patch(
  //       'auth/refreshToken',
  //       {
  //         refreshToken: userAuth.token.refreshToken,
  //       },
  //       { headers: { Authorization: `Bearer ${userAuth.token.refreshToken}` } }
  //     );

  //     const newAuth = response.data;

  //     createAuthCookie(newAuth);

  //     // Kết nối lại socket với token mới
  //     reconnectSocket(newAuth.token.accessToken);

  //     return newAuth.token.accessToken;
  //   } catch (error) {
  //     handleLogout();
  //     throw error;
  //   }
  // };

  const apiRequest = async (
    method: HttpMethod,
    url: string,
    data: any = null,
    customHeaders: Record<string, string> = {}
  ): Promise<any> => {
    dispatch({ type: API_CALL_BEGIN });

    const userAuth = getAuthCookie();

    const headers = {
      ...customHeaders,
      Authorization:
        url !== 'auth/login' && userAuth
          ? `Bearer ${userAuth.token.accessToken}`
          : undefined,
    };

    try {
      const response = await axios({
        method,
        url,
        data,
        headers,
      });

      dispatch({ type: API_CALL_SUCCESS, payload: response.data });
      return response;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // handleLogout();
        try {
          const newAccessToken = await refreshToken(
            handleLogout,
            disconnectSocket,
            reconnectSocket
          );

          const retryResponse = await axios({
            method,
            url,
            data,
            headers: {
              ...customHeaders,
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
          dispatch({ type: API_CALL_SUCCESS, payload: retryResponse.data });
          return retryResponse;
        } catch (refreshError) {
          dispatch({ type: API_CALL_FAILURE, payload: refreshError });
          throw refreshError;
        }
      } else if (error.response?.status === 403) {
        handleLogout();
      }
      dispatch({
        type: API_CALL_FAILURE,
        payload: error.response?.data || error.message,
      });

      throw error;
    }
  };

  const setToken = (userAuth: any) => {
    createAuthCookie(userAuth);
    axios.defaults.headers.common['Authorization'] = userAuth.token;
  };

  return (
    <ApiContext.Provider value={{ ...state, apiRequest, setToken }}>
      {children}
    </ApiContext.Provider>
  );
}

export const useFetchApi = (): ApiContextProps => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useFetchApi must be used within an ApiProvider');
  }
  return context;
};
