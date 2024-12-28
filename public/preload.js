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
    notificationClicked: () => ipcRenderer.invoke('notification-clicked'),

    notifyRequest: (message) => {
      ipcRenderer.send('display-request-notification', message);
    },
    receiveRequestNotification: (callback) =>
      ipcRenderer.on('request-notification', callback),
    requestNotificationClicked: () =>
      ipcRenderer.invoke('request-notification-clicked'),
    onRequestNotificationClicked: (callback) => {
      ipcRenderer.on('request-notification-clicked', (_, data) => {
        callback(data);
      });
    },

    // Các phương thức khác
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
