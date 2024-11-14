const { contextBridge, ipcRenderer } = require('electron');
// contextBridge.exposeInMainWorld('electron', {
//   homeDir: () => os.homedir(),
//   osVersion: () => os.arch(),
// });

// contextBridge.exposeInMainWorld('ipcRenderer', {
//   send: (channel, data) => ipcRenderer.send(channel, data),
//   on: (channel, func) =>
//     ipcRenderer.on(channel, (event, ...args) => func(event, ...args)),
// });

contextBridge.exposeInMainWorld('electronAPI', {
  showNotification: (title, message) => {
    ipcRenderer.send('show-notification', { title, message });
  },
});

process.once('loaded', () => {
  contextBridge.exposeInMainWorld('versions', process.versions);
});
