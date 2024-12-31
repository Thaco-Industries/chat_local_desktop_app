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
    saveFile: (url, file_name) => {
      return new Promise((resolve, reject) => {
        ipcRenderer
          .invoke('save-file', { url, file_name })
          .then((result) => resolve(result))
          .catch((error) => reject(error));
      });
    },
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
    // saveFile: async (url, defaultFileName) => {
    //   return ipcRenderer.invoke('save-file', { url, defaultFileName });
    // },
  });
});

// preload.js
