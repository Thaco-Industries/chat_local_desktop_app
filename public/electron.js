// Module to control the application lifecycle and the native browser window.

const {
  app,
  BrowserWindow,
  protocol,
  ipcMain,
  screen,
  Tray,
  Menu,
  shell,
} = require('electron');
const dotenv = require('dotenv');
const path = require('path');
const Badge = require('electron-windows-badge');
const badgeIcon = path.join(__dirname, 'badge-icon.png');
const defaultIcon = path.join(__dirname, 'icon.png');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

const isDev = !app.isPackaged;
const gotTheLock = app.requestSingleInstanceLock();

log.transports.file.resolvePath = () =>
  path.join(app.getPath('userData'), 'logs', 'main.log');
log.info('Log file path: ', log.transports.file.getFile().path);
log.log('Application version: ', app.getVersion());

let notificationWindow = null;
let mainWindow;
let tray;
let lastNotificationMessage = null;
let requestNotificationMessage = null;
let badge;
let requestNotificationWindow;

const baseDir = path.resolve(__dirname, '..');
const dotenvPath = isDev
  ? path.join(baseDir, '.env')
  : path.join(process.resourcesPath, '.env');
dotenv.config({ path: dotenvPath });

// const productUrl = process.env.REACT_APP_PRODUCT_URL;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1500,
    height: 800,
    minWidth: 500,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
    icon: path.join(__dirname, 'icon.png'),
  });

  const appURL = !isDev
    ? `file://${path.join(__dirname, '../build/index.html')}#/`
    : 'http://localhost:3000/';
  // `file://${path.join(__dirname, '../build/index.html')}#/`;
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadURL(appURL);

  badge = new Badge(mainWindow, {
    font: '8px', // Thêm đơn vị px
  });

  mainWindow.webContents.on('before-input-event', (event, input) => {
    // Kiểm tra nếu tổ hợp phím bị cấm
    if (isDev) return;
    if (
      (input.control && input.key.toLowerCase() === 'r') || // Ctrl+R
      (input.control && input.shift && input.key.toLowerCase() === 'i') || // Ctrl+Shift+I
      input.key.toLowerCase() === 'f12' // F12
    ) {
      event.preventDefault(); // Ngăn chặn hành động mặc định
    }
  });

  mainWindow.on('close', (event) => {
    // Ngăn không cho ứng dụng thoát khi đóng cửa sổ
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide(); // Ẩn cửa sổ
    }
  });

  // Automatically open Chrome's DevTools in development mode.
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

async function setupLocalFilesNormalizerProxy() {
  protocol.registerHttpProtocol('file', (request) => {
    const url = request.url.substr(8);
    return { path: path.normalize(`${__dirname}/${url}`) };
  });
}

if (!gotTheLock) {
  app.quit(); // Thoát nếu không có quyền sở hữu instance
} else {
  app.on('second-instance', (event, argv, workingDirectory) => {
    // Khi có yêu cầu mở instance thứ hai
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore(); // Khôi phục nếu bị thu nhỏ
      }
      mainWindow.show(); // Hiển thị cửa sổ
      mainWindow.focus(); // Đưa cửa sổ lên foreground
    }
  });
  app.whenReady().then(() => {
    createWindow();
    autoUpdater.checkForUpdates();
    setupLocalFilesNormalizerProxy();
    // Tạo Tray Icon
    tray = new Tray(path.join(__dirname, 'icon.png')); // Thay bằng icon phù hợp

    const trayMenu = Menu.buildFromTemplate([
      {
        label: 'Mở ứng dụng',
        click: () => {
          mainWindow.show();
          mainWindow.focus();
        },
      },
      {
        label: 'Thoát',
        click: () => {
          app.isQuiting = true;
          app.quit();
        },
      },
    ]);

    tray.setContextMenu(trayMenu);
    tray.setToolTip('Chat Local R&D');

    tray.on('click', () => {
      mainWindow.show();
      mainWindow.focus();
    });

    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      } else {
        const mainWindow = BrowserWindow.getAllWindows()[0];
        if (mainWindow) {
          mainWindow.focus();
        }
      }
    });

    // autoUpdater.checkForUpdates();
  });
}

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const allowedNavigationDestinations = 'https://my-electron-app.com';
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    if (!allowedNavigationDestinations.includes(parsedUrl.origin)) {
      event.preventDefault();
    }
  });
});

function createNotificationWindow(message) {
  lastNotificationMessage = message;
  if (notificationWindow && !notificationWindow.isDestroyed()) {
    notificationWindow.close();
    notificationWindow.once('closed', () => {
      initializeNotificationWindow(message);
    });
  } else {
    initializeNotificationWindow(message);
  }
}

function initializeNotificationWindow(message) {
  const display = screen.getPrimaryDisplay();
  const { width, height } = display.workAreaSize;

  notificationWindow = new BrowserWindow({
    width: 400,
    height: 200,
    resizable: false,
    frame: false,
    // parent: mainWindow,
    // modal: true,
    alwaysOnTop: true,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, 'icon.png'),
    x: width - 400,
    y: height - 200,
  });

  const appURL = app.isPackaged
    ? `file://${path.join(__dirname, '../build/notification.html')}#/`
    : `file://${path.join(__dirname, 'notification.html')}`;

  notificationWindow.setMenuBarVisibility(false);
  notificationWindow.loadURL(appURL);

  notificationWindow.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'mouseDown') {
      event.preventDefault(); // Ngăn không cho sự kiện lan tới cửa sổ cha
    }
  });

  notificationWindow.on('closed', () => {
    notificationWindow = null;
  });

  notificationWindow.webContents.once('did-finish-load', () => {
    if (notificationWindow && !notificationWindow.isDestroyed()) {
      notificationWindow.webContents.send('notification-message', message);
    }
  });
}

function createRequestNotificationWindow(message) {
  requestNotificationMessage = message;
  if (requestNotificationWindow && !requestNotificationWindow.isDestroyed()) {
    requestNotificationWindow.close();
    requestNotificationWindow.once('closed', () => {
      initializeRequestNotificationWindow(message);
    });
  } else {
    initializeRequestNotificationWindow(message);
  }
}

function initializeRequestNotificationWindow(message) {
  const display = screen.getPrimaryDisplay();
  const { width, height } = display.workAreaSize;

  requestNotificationWindow = new BrowserWindow({
    width: 400,
    height: 140,
    resizable: false,
    parent: mainWindow,
    focusable: false,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, 'icon.png'),
    x: width - 400,
    y: height - 170,
  });

  const appURL = app.isPackaged
    ? `file://${path.join(__dirname, '../build/request-notification.html')}#/`
    : `file://${path.join(__dirname, 'request-notification.html')}`;

  requestNotificationWindow.setMenuBarVisibility(false);
  requestNotificationWindow.loadURL(appURL);

  requestNotificationWindow.on('closed', () => {
    requestNotificationWindow = null;
  });

  requestNotificationWindow.webContents.once('did-finish-load', () => {
    if (requestNotificationWindow && !requestNotificationWindow.isDestroyed()) {
      requestNotificationWindow.webContents.send(
        'request-notification',
        message
      );
    }
  });
}

ipcMain.on('display-custom-notification', (event, message) => {
  //Kiểm tra trạng thái của mainWindow
  const shouldCreateNotification = [
    mainWindow.isMinimized(),
    !mainWindow.isVisible(),
    !mainWindow.isFocused(),
  ].some(Boolean);

  if (shouldCreateNotification) {
    createNotificationWindow(message);
    mainWindow.flashFrame(true);
  }
});

ipcMain.on('display-request-notification', (event, message) => {
  const shouldCreateNotification = [
    mainWindow.isMinimized(),
    !mainWindow.isVisible(),
    !mainWindow.isFocused(),
  ].some(Boolean);

  if (shouldCreateNotification) {
    createRequestNotificationWindow(message);
    mainWindow.flashFrame(true);
  }
});

ipcMain.handle('notification-clicked', async () => {
  if (lastNotificationMessage) {
    const allWindows = BrowserWindow.getAllWindows();

    const mainWindow = allWindows.find((win) => win.title === 'Chat Local R&D');

    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore(); // Khôi phục nếu cửa sổ đang bị thu nhỏ
      }
      mainWindow.show(); // Hiển thị cửa sổ
      mainWindow.focus(); // Đưa cửa sổ lên foreground

      mainWindow.webContents.send(
        'notification-clicked',
        lastNotificationMessage
      );
    } else {
      // Nếu không tìm thấy cửa sổ chính, tạo cửa sổ mới
      createWindow();
    }
    if (notificationWindow && !notificationWindow.isDestroyed()) {
      notificationWindow.close();
      notificationWindow = null; // Đảm bảo cửa sổ được giải phóng bộ nhớ
    }
    return lastNotificationMessage;
  }
  return null;
});

ipcMain.handle('request-notification-clicked', async () => {
  if (requestNotificationMessage) {
    const allWindows = BrowserWindow.getAllWindows();

    const mainWindow = allWindows.find((win) => win.title === 'Chat Local R&D');

    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore(); // Khôi phục nếu cửa sổ đang bị thu nhỏ
      }
      mainWindow.show(); // Hiển thị cửa sổ
      mainWindow.focus(); // Đưa cửa sổ lên foreground

      mainWindow.webContents.send(
        'request-notification-clicked',
        requestNotificationMessage
      );
    } else {
      // Nếu không tìm thấy cửa sổ chính, tạo cửa sổ mới
      createWindow();
    }
    if (requestNotificationWindow && !requestNotificationWindow.isDestroyed()) {
      requestNotificationWindow.close();
      requestNotificationWindow = null; // Đảm bảo cửa sổ được giải phóng bộ nhớ
    }
  }
  return null;
});

ipcMain.handle('send-reply-message', async (event, message) => {
  // Gửi message tới React component (mainWindow)
  const allWindows = BrowserWindow.getAllWindows();

  const mainWindow = allWindows.find((win) => win.title === 'Chat Local R&D');

  if (mainWindow) {
    mainWindow.webContents.send('send-reply-message', message);
  }
  if (notificationWindow && !notificationWindow.isDestroyed()) {
    notificationWindow.close();
    notificationWindow = null; // Đảm bảo cửa sổ được giải phóng bộ nhớ
  }
});

ipcMain.on('update-badge', (event, badgeCount) => {
  if (badgeCount > 0) {
    badge.update(badgeCount); // Cập nhật badge
    tray.setImage(badgeIcon);
  } else {
    badge.update(0); // Xóa badge bằng cách cập nhật thành 0
    tray.setImage(defaultIcon);
  }
});

ipcMain.handle('close-notification-window', async () => {
  if (notificationWindow && !notificationWindow.isDestroyed()) {
    notificationWindow.close();
    notificationWindow = null; // Đảm bảo bộ nhớ được giải phóng
  }
});

ipcMain.handle('open-url', async (event, url) => {
  try {
    if (url) {
      await shell.openExternal(url); // Sử dụng shell để mở URL trong trình duyệt
      return { success: true };
    }
    return { success: false, error: 'Invalid URL' };
  } catch (error) {
    console.error('Error opening URL:', error);
    return { success: false, error: error.message };
  }
});

autoUpdater.on('checking-for-update', () =>
  log.info('Checking for updates...')
);
autoUpdater.on('update-available', () => log.info('Update available.'));
autoUpdater.on('update-not-available', () => log.info('No updates available.'));
autoUpdater.on('error', (err) =>
  log.error('Error checking for updates: ', err)
);
autoUpdater.on('download-progress', (progress) =>
  log.info('Download progress: ', progress)
);
autoUpdater.on('update-downloaded', (info) =>
  log.info('Update downloaded: ', info)
);
