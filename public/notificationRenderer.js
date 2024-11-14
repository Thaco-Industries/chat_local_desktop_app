const { ipcRenderer } = require('electron');

ipcRenderer.on('notification:data', (event, { title, message }) => {
  document.getElementById('title').innerText = title;
  document.getElementById('message').innerText = message;
});
