let autoCloseTimeout; // Biến lưu trữ bộ đếm tự động tắt
let resetTimer; // Biến lưu trữ trạng thái thao tác

window.electronAPI.receiveRequestNotification((event, data) => {
  const contentElement = document.getElementById('request-message_display');
  document.getElementById('request-sender').textContent = data.title;
  contentElement.textContent = data.description;
  const notificationContainer = document.querySelector('#request-notification');
  const closeButton = document.querySelector('.close-btn');

  // Hàm đóng thông báo
  const closeNotification = () => {
    notificationContainer.style.transition = 'opacity 0.5s';
    notificationContainer.style.opacity = '0';
    setTimeout(() => {
      notificationContainer.remove();
      window.electronAPI.closeNotificationWindow();
    }, 500);
  };

  // Tự động đóng thông báo sau 6 giây nếu không thao tác
  const startAutoCloseTimer = () => {
    clearTimeout(autoCloseTimeout); // Xóa bộ đếm trước đó
    autoCloseTimeout = setTimeout(() => {
      closeNotification();
    }, 6000);
  };

  // Xử lý khi click vào thông báo
  notificationContainer.addEventListener('click', () => {
    window.electronAPI.requestNotificationClicked();
    closeNotification();
  });

  // Ngăn sự kiện lan ra ngoài khi click vào input hoặc button
  const preventCloseElements = document.querySelectorAll(
    '.notification-container input, .notification-container button'
  );
  preventCloseElements.forEach((element) => {
    element.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  });

  // Xử lý nút đóng thông báo
  if (closeButton) {
    closeButton.addEventListener('click', (event) => {
      event.stopPropagation();
      closeNotification();
    });
  }

  // Bắt đầu bộ đếm khi hiển thị thông báo
  startAutoCloseTimer();
});
