let autoCloseTimeout; // Biến lưu trữ bộ đếm tự động tắt
let resetTimer; // Biến lưu trữ trạng thái thao tác

window.electronAPI.receiveNotification((event, data) => {
  document.getElementById('sender').textContent = data.sender.infor.full_name;
  const contentElement = document.getElementById('message_display');

  const notificationContainer = document.querySelector(
    '.notification-container'
  );
  const replyInput = document.querySelector('.notification-reply input');
  const replyButton = document.querySelector('.reply-btn');
  const closeButton = document.querySelector('.close-btn');

  // Đặt nội dung thông báo
  if (data.message_display === 'Hình ảnh') {
    contentElement.innerHTML = `
      <div style="display: flex; gap: 4px; align-items:center">
        <img src="images/gallery.svg" alt="Gallery Icon" />
        <span>Hình ảnh</span>
      </div>
    `;
  } else if (data.message_display.startsWith('File đính kèm:')) {
    const fileName = data.message_display.replace('File đính kèm: ', '');
    contentElement.innerHTML = `
      <div style="display: flex; gap: 4px; align-items:center">
        <img src="images/paperclip.svg" alt="File Icon" />
        <span>${fileName}</span>
      </div>
    `;
  } else {
    contentElement.innerText = data.message_display;
  }

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
    // autoCloseTimeout = setTimeout(() => {
    //   closeNotification();
    // }, 6000);
  };

  // Xử lý khi click vào thông báo
  notificationContainer.addEventListener('click', () => {
    window.electronAPI.notificationClicked();
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

  // Dừng bộ đếm khi focus vào input
  replyInput.addEventListener('focus', () => {
    clearTimeout(autoCloseTimeout); // Dừng đếm
    clearTimeout(resetTimer); // Xóa reset thao tác
  });

  // Khởi động lại bộ đếm khi blur khỏi input
  replyInput.addEventListener('blur', () => {
    startAutoCloseTimer();
  });

  // Gửi phản hồi khi click nút gửi
  replyButton.addEventListener('click', (e) => {
    e.stopPropagation();
    const message = replyInput.value.trim();
    if (message) {
      // Gửi tin nhắn tới Main Process
      window.electronAPI.sendReplyMessage(message);
      replyInput.value = ''; // Xóa nội dung input
    }
    closeNotification();
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
