const { contextBridge, ipcRenderer } = require('electron');

process.once('loaded', () => {
  contextBridge.exposeInMainWorld('electronAPI', {
    notifyMessage: (message) =>
      ipcRenderer.send('display-custom-notification', message),
    receiveNotification: (callback) =>
      ipcRenderer.on('notification-message', callback),
    onNotificationClicked: (callback) => {
      ipcRenderer.on('notification-clicked', (_, data) => {
        callback(data);
      });
    },
    // Các phương thức khác
    notificationClicked: () => ipcRenderer.invoke('notification-clicked'),
    onReplyNotification: (callback) => {
      ipcRenderer.on('send-reply-message', (_, data) => {
        callback(data);
      });
    },
    sendReplyMessage: (message) => {
      ipcRenderer.invoke('send-reply-message', message);
    },
    removeListener: (channel, callback) => {
      ipcRenderer.removeListener(channel, callback);
    },
    updateBadge: (count) => ipcRenderer.send('update-badge', count),
    closeNotificationWindow: () =>
      ipcRenderer.invoke('close-notification-window'),
    openUrl: (url) => ipcRenderer.invoke('open-url', url),
  });
});

// preload.js
