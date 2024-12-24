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
const fs = require('fs');
const path = require('path');
const Badge = require('electron-windows-badge');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const isDev = !app.isPackaged;
const gotTheLock = app.requestSingleInstanceLock();

log.transports.file.resolvePath = () =>
  path.join(app.getPath('userData'), 'logs', 'main.log');
log.info('Đường dẫn log tùy chỉnh:', log.transports.file.getFile().path);
log.log('Application version = ' + app.getVersion());

let notificationWindow = null;
let mainWindow;
let tray;
let lastNotificationMessage = null;
let badge;

const baseDir = path.resolve(__dirname, '..');
const dotenvPath = isDev
  ? path.join(baseDir, '.env')
  : path.join(process.resourcesPath, '.env');
dotenv.config({ path: dotenvPath });

const productUrl = process.env.REACT_APP_PRODUCT_URL;
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

  const appURL = !isDev ? productUrl : 'http://localhost:3000/';
  // `file://${path.join(__dirname, '../build/index.html')}#/`;
  mainWindow.setMenuBarVisibility(false);
  mainWindow.loadURL(appURL);

  badge = new Badge(mainWindow, {
    font: '8px', // Thêm đơn vị px
  });

  mainWindow.on('focus', () => {
    // Tắt nhấp nháy khi người dùng focus vào cửa sổ chính
    mainWindow.flashFrame(false);
  });

  mainWindow.on('show', () => {
    // Tắt nhấp nháy khi cửa sổ được hiển thị
    mainWindow.flashFrame(false);
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
  } else {
    mainWindow.webContents.setDevToolsWebContents(null);
  }
}

function setupLocalFilesNormalizerProxy() {
  protocol.registerHttpProtocol(
    'file',
    (request, callback) => {
      const url = request.url.substr(8);
      callback({ path: path.normalize(`${__dirname}/${url}`) });
    },
    (error) => {
      if (error) console.error('Failed to register protocol');
    }
  );
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
    autoUpdater.checkForUpdatesAndNotify();
    setupLocalFilesNormalizerProxy();
    // Tạo Tray Icon
    try {
      const iconPath = isDev
        ? path.join(__dirname, 'icon.ico') // Dùng .ico trên Windows
        : path.join(process.resourcesPath, 'icon.ico');

      tray = new Tray(iconPath);

      const trayMenu = Menu.buildFromTemplate([
        { label: 'Open App', click: () => mainWindow.show() },
        { label: 'Exit', click: () => app.quit() },
      ]);

      tray.setContextMenu(trayMenu);
      tray.setToolTip('Chat Local R&D');
      tray.on('click', () => {
        mainWindow.show();
        mainWindow.focus();
      });
    } catch (error) {
      console.error('Error initializing Tray:', error.message);
    }

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
    skipTaskbar: true,
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

  notificationWindow.on('closed', () => {
    notificationWindow = null;
  });

  notificationWindow.webContents.once('did-finish-load', () => {
    if (notificationWindow && !notificationWindow.isDestroyed()) {
      notificationWindow.webContents.send('notification-message', message);
    }
  });
}

ipcMain.on('display-custom-notification', (event, message) => {
  //Kiểm tra trạng thái của mainWindow
  if (mainWindow && (!mainWindow.isFocused() || !mainWindow.isAlwaysOnTop())) {
    createNotificationWindow(message);

    //Bật nhấp nháy trên thanh taskbar
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
  const badgeIcon = isDev
    ? path.join(__dirname, 'badge-icon.png')
    : path.join(process.resourcesPath, 'badge-icon.png');
  const defaultIcon = isDev
    ? path.join(__dirname, 'icon.png')
    : path.join(process.resourcesPath, 'icon.png');

  // Check if tray is initialized
  if (badgeCount > 0) {
    badge.update(badgeCount); // Update the badge
    tray.setImage(badgeIcon); // Set the badge icon
  } else {
    badge.update(0); // Clear the badge by setting it to 0
    tray.setImage(defaultIcon); // Set the default icon
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

autoUpdater.on('checking-for-update', () => {
  log.info('Đang kiểm tra bản cập nhật...');
});

autoUpdater.on('update-available', (info) => {
  log.info('Có bản cập nhật mới:', info);
  mainWindow.webContents.send('update-available', info); // Gửi thông báo đến giao diện người dùng
});

autoUpdater.on('update-not-available', (info) => {
  log.info('Không có bản cập nhật mới:', info);
  mainWindow.webContents.send('update-not-available', info); // Gửi thông báo đến giao diện người dùng
});

autoUpdater.on('error', (err) => {
  log.error('Lỗi khi kiểm tra cập nhật:', err);
  mainWindow.webContents.send('update-error', err.message);
});

autoUpdater.on('download-progress', (progress) => {
  log.info(`Tải xuống: ${Math.round(progress.percent)}%`);
  mainWindow.webContents.send('update-progress', progress);
});

autoUpdater.on('update-downloaded', (info) => {
  log.info('Bản cập nhật đã được tải xuống:', info);
  mainWindow.webContents.send('update-downloaded', info);

  // Hiển thị thông báo nhắc người dùng khởi động lại để cập nhật
  const response = dialog.showMessageBoxSync(mainWindow, {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Cập nhật đã sẵn sàng',
    message:
      'Một bản cập nhật mới đã sẵn sàng. Bạn có muốn khởi động lại ứng dụng để cập nhật không?',
  });

  if (response === 0) {
    autoUpdater.quitAndInstall(); // Khởi động lại ứng dụng và áp dụng bản cập nhật
  }
});
