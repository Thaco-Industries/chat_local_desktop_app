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
  // Cookies.set('userAuth', cookieValue, {
  //   path: '/',
  //   secure: false,
  //   sameSite: 'Lax',
  //   expires: 3,
  // });
  localStorage.setItem('userAuth', cookieValue);
};

// Hàm lấy cookie
export const getAuthCookie = (): UserAuth | null => {
  const userAuth = localStorage.getItem('userAuth');

  if (!userAuth) return null;

  try {
    return JSON.parse(userAuth) as UserAuth;
  } catch (error) {
    console.error('Cookie không hợp lệ:', error);
    return null; // Hoặc có thể thực hiện thêm các hành động như xóa cookie không hợp lệ
  }
};

// Hàm xóa cookie
export const deleteAuthCookie = (): void => {
  localStorage.removeItem('userAuth');
};

export const getClientId = () => {
  let clientId = localStorage.getItem('x-client-id');
  if (!clientId) {
    clientId = uuidv4();
    localStorage.setItem('x-client-id', clientId);
  }
  return clientId;
};
