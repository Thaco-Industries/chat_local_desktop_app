// src/index.tsx
import ReactDOM from 'react-dom/client';
import './index.css';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import Message from './pages/message/Message';
import Room from './pages/room/Room';
import Group from './pages/group/Group';
import Setting from './pages/setting/Setting';
import Profile from './pages/profile/Profile';

import ApiProvider from './context/ApiContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/login/Login';
import PublicRoute from './components/PublicRoute';
import { SocketProvider } from './context/SocketContext';
import ToastContent from './helper/notifyMessageHelper';
import { MessageProvider } from './context/MessageContext';
import { ChatProvider } from './context/ChatContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const isElectron = navigator.userAgent.toLowerCase().includes('electron');

root.render(
  <HashRouter>
    <ApiProvider>
      <SocketProvider>
        <MessageProvider>
          <ChatProvider>
            <ToastContent />
            <Routes>
              <Route
                path="/login"
                element={<PublicRoute element={<Login />} />}
              />
              <Route path="/" element={<ProtectedRoute element={<Layout />} />}>
                <Route index element={<Message />} />
                <Route path="room" element={<Room />} />
                <Route path="group" element={<Group />} />
                <Route path="setting" element={<Setting />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Routes>
          </ChatProvider>
        </MessageProvider>
      </SocketProvider>
    </ApiProvider>
  </HashRouter>
);
