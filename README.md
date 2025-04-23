# 🖥️ Chat Local Desktop App

Ứng dụng **Chat nội bộ** dành cho nhân viên công ty, xây dựng dưới dạng **Desktop App cho Windows**, giúp nhân viên trao đổi công việc hiệu quả và bảo mật hơn.

---

## 📌 Thông Tin Chung

| Hạng mục                | Chi tiết                                        |
| ----------------------- | ----------------------------------------------- |
| **Tên dự án**           | Chat Local Desktop App                          |
| **Phiên bản**           | 1.0.8                                           |
| **Được phát triển bởi** | THACO Industries                                |
| **Công nghệ chính**     | Electron v33.2.0 + React v18.3.1 + TypeScript   |
| **Hỗ trợ HĐH**          | Windows                                         |
| **Mục đích**            | Chat nội bộ trong doanh nghiệp, bảo mật dữ liệu |

---

## 🏗️ Kiến Trúc Ứng Dụng

- **Electron Main Process**: Quản lý cửa sổ ứng dụng, notification, auto-update, tray icon.
- **React Renderer**: Giao diện người dùng, quản lý chat, phòng, nhóm.
- **Socket.IO Client**: Giao tiếp realtime với server để nhận và gửi tin nhắn.

---

## 🚀 Tính Năng Chính

- Quản lý danh sách phòng chat & chat cá nhân.
- Gửi & nhận tin nhắn realtime (text, ảnh, file đính kèm).
- Notification popup ngay trên desktop.
- Badge icon trên taskbar hiển thị số tin nhắn chưa đọc.
- Tự động cập nhật phiên bản mới (Auto Update via GitHub Release).
- Đăng nhập bằng tài khoản nội bộ, bảo mật token.
- Đồng bộ dữ liệu nhanh chóng và ổn định.

---

## 🗂️ Cấu Trúc Thư Mục

```
📦 chat_local_desktop_app
├── 📁 src
│   ├── actions/
│   ├── assets/        # Icon, hình ảnh
│   ├── components/    # Giao diện React
│   ├── context/       # Socket, Chat, Message context
│   ├── pages/         # Các trang (login, room...)
│   ├── services/      # Xử lý gọi API
│   └── utils/         # Helper, formatter...
├── 📁 public
│   ├── electron.js    # Electron main process
│   ├── preload.js     # Giao tiếp main ↔ renderer
│   ├── notification.html  # UI notification
│   └── splash.html
├── 📁 build           # React app build output
├── 📁 dist            # Các file cài đặt build (.exe)
├── .env               # Biến môi trường (đính kèm)
├── package.json       # Danh sách dependencies & scripts
└── README.md          # Tài liệu dự án (file này)
```

---

## ⚙️ Yêu Cầu Môi Trường

- **Node.js** >= 16.x
- **npm** hoặc **yarn**
- **Windows 10 trở lên**
- Tài khoản GitHub để truy cập repository (nếu cần)

---

## 📦 Cài Đặt & Chạy Ứng Dụng

### 1. Clone dự án về local

```bash
git clone https://github.com/Thaco-Industries/chat_local_desktop_app.git
cd chat_local_desktop_app
```

### 2. Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
```

### 3. Tạo file `.env`

Sao chép nội dung `.env` mẫu:

```bash
cp .env.example .env
```

Điền các thông tin server:

```env
REACT_APP_API_URL=http://10.14.2.41:8386/api/v1
REACT_APP_SOCKET_URL=ws://10.14.2.41:8386
REACT_APP_FILE_URL=http://10.14.2.41:8385/file/api/v1
REACT_APP_PRODUCT_URL=http://10.14.2.41:8387/
REACT_APP_SOCKET_CHANNEL=person-chat
```

---

## ⚡ Chạy Ứng Dụng Phát Triển

### Chạy frontend React riêng:

```bash
npm start
```

### Chạy Electron:

```bash
npm run electron:start
```

👉 Electron sẽ tự động load giao diện React khi chạy `localhost:3000`.

---

## 📦 Build Production & Đóng Gói

### Build React trước:

```bash
npm run build
```

### Build Electron (Windows):

```bash
npm run electron:package:win
```

👉 Output nằm trong thư mục `/dist`:

```
Chat Local R&D Setup 1.0.8.exe
```

---

## 🔄 Auto Update (Cập Nhật Tự Động)

Ứng dụng kiểm tra phiên bản mới thông qua GitHub Release:

- Repository: https://github.com/Thaco-Industries/chat_local_desktop_app/tree/product
- CI/CD tự động build khi tạo **tag release** mới.
- File update:
  - latest.yml
  - \*.exe.blockmap
  - Chat Local R&D Setup x.x.x.exe

---

## 🔐 Thông Tin Bảo Mật & Môi Trường

| Biến Môi Trường          | Ý Nghĩa                      |
| ------------------------ | ---------------------------- |
| REACT_APP_API_URL        | Địa chỉ backend API chính    |
| REACT_APP_SOCKET_URL     | Địa chỉ socket realtime      |
| REACT_APP_FILE_URL       | Địa chỉ upload/download file |
| REACT_APP_PRODUCT_URL    | Đường dẫn public hệ thống    |
| REACT_APP_SOCKET_CHANNEL | Channel socket sử dụng       |

👉 File `.env` **KHÔNG** đẩy lên GitHub production. Cung cấp riêng cho bên nhận.

---

## 📑 Các Thư Viện Quan Trọng Đã Sử Dụng

| Thư viện                   | Công dụng                    |
| -------------------------- | ---------------------------- |
| **electron**               | Framework desktop app        |
| **react** + **typescript** | Frontend UI + quản lý state  |
| **socket.io-client**       | Realtime communication       |
| **electron-updater**       | Tự động update app           |
| **electron-windows-badge** | Badge số tin nhắn chưa đọc   |
| **formik** + **yup**       | Validate form                |
| **axios**                  | HTTP client call API backend |

---

## 🔨 Các Lệnh Scripts Nhanh (package.json)

| Lệnh                           | Mục đích                        |
| ------------------------------ | ------------------------------- |
| `npm start`                    | Chạy React app dev mode         |
| `npm run electron:start`       | Chạy Electron + React song song |
| `npm run electron:package:win` | Đóng gói app cho Windows (.exe) |

---

## 📋 Kiểm Thử & Debug

- **Log file Electron**:
  `userData/logs/main.log`

- **Mở DevTools (chỉ dev mode)**:
  `Ctrl+Shift+I` hoặc `F12`

- **Các lỗi thường gặp**:
  - Không kết nối socket: Kiểm tra `REACT_APP_SOCKET_URL`
  - Không gửi/nhận message: Kiểm tra API URL & token auth

---

## 📎 Các Tệp Đính Kèm Trong Bàn Giao

- `tree.txt`: Cây thư mục đầy đủ
- `.env`: Biến môi trường (mẫu)
- `package.json`: Scripts và dependencies
- `electron.js`: File cấu hình chính của Electron
- `/dist/*.exe`: Các bản build release ứng dụng
