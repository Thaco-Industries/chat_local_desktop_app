import { toast } from 'react-toastify';

/**
 * Hiển thị thông báo
 * @param content Nội dung thông báo
 * @param type Loại thông báo: 'success' | 'error' | 'info' | 'warning'
 */
export const notify = (
  content: string,
  type: 'success' | 'error' | 'info' | 'warning' | '' = ''
) => {
  switch (type) {
    case 'success':
      toast.success(content);
      break;
    case 'error':
      toast.error(content);
      break;
    case 'warning':
      toast.warning(content);
      break;
    case 'info':
      toast.info(content);
      break;
    default:
      toast(content);
  }
};
