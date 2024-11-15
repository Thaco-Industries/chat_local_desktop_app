import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

// Định nghĩa kiểu dữ liệu cho giá trị xác thực người dùng
interface UserAuth {
  token: {
    accessToken: string;
    refreshToken: string;
  };
  user: {
    id: string;
    userName: string;
    role: string;
    is_VIP: boolean;
    infor: {
      ban: string;
      msnv: string;
      nhom: string;
      email: string;
      avt_url: string;
      bo_phan: string;
      cap_bac: string;
      full_name: string;
      phong_phu: string;
      dien_thoai: string;
      phong_chinh: string;
    };
  };
  expiredTime: string;
}

// Hàm tạo cookie
export const createAuthCookie = (value: UserAuth): void => {
  const cookieValue = JSON.stringify(value);
  Cookies.set('userAuth', cookieValue, { secure: true });
};

// Hàm lấy cookie
export const getAuthCookie = (): UserAuth | null => {
  const token = Cookies.get('userAuth');

  if (!token) return null;

  try {
    return JSON.parse(token) as UserAuth;
  } catch (error) {
    console.error('Cookie không hợp lệ:', error);
    return null; // Hoặc có thể thực hiện thêm các hành động như xóa cookie không hợp lệ
  }
};

// Hàm xóa cookie
export const deleteAuthCookie = (): void => {
  Cookies.remove('userAuth');
};

export const getClientId = () => {
  let clientId = Cookies.get('x-client-id');
  if (!clientId) {
    clientId = uuidv4();
    Cookies.set('x-client-id', clientId);
  }
  return clientId;
};
