import { useFetchApi } from '../context/ApiContext';

export const FileHandle = () => {
  const { apiRequest } = useFetchApi();

  const handleFileDownload = async (url: string, file_name?: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      // Tự động lấy phần mở rộng từ URL nếu không có trong file_name
      const fileExtension = url.split('.').pop() || 'txt'; // Mặc định là txt nếu không tìm thấy
      const finalFileName = file_name?.includes('.')
        ? file_name
        : `${file_name || 'file'}.${fileExtension}`;

      const anchor = document.createElement('a');
      anchor.href = downloadUrl;
      anchor.download = finalFileName; // Đặt tên tệp
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      // Giải phóng URL Blob sau khi tải xuống
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Tải file thất bại:', error);
    }
  };

  const createThumbnail = async (file: File, seekTo = 0.0) => {
    console.log('getting video cover for file:', file);
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('video/')) {
        reject('File không phải là video.');
        return;
      }

      const videoPlayer = document.createElement('video');
      const fileURL = URL.createObjectURL(file); // Tạo URL đối tượng
      videoPlayer.src = fileURL;

      videoPlayer.addEventListener('error', (ex) => {
        reject(`Lỗi khi tải file video: ${ex.message}`);
      });

      videoPlayer.addEventListener('loadedmetadata', () => {
        if (videoPlayer.duration < seekTo) {
          reject('Thời gian video ngắn hơn vị trí seek.');
          URL.revokeObjectURL(fileURL); // Giải phóng tài nguyên
          return;
        }

        // Đợi video load đủ để thay đổi currentTime
        videoPlayer.currentTime = seekTo;

        videoPlayer.addEventListener('seeked', () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = videoPlayer.videoWidth || 640;
            canvas.height = videoPlayer.videoHeight || 360;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject('Không thể tạo context 2D trên canvas');
              return;
            }

            ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);

            const base64Image = canvas.toDataURL('image/jpeg', 0.75);
            URL.revokeObjectURL(fileURL); // Giải phóng tài nguyên

            resolve(base64Image);
          } catch (error) {
            reject(`Lỗi khi tạo thumbnail: ${error}`);
          }
        });
      });
    });
  };

  const compressThumbnail = (thumbnailBase64: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = thumbnailBase64;

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            reject(new Error('Không thể tạo context 2D trên canvas.'));
            return;
          }

          const maxWidth = 800;
          const maxHeight = 600;

          let { width, height } = img;

          // Điều chỉnh kích thước dựa trên tỉ lệ
          if (width > height && width > maxWidth) {
            height = (height * maxHeight) / width;
            width = maxWidth;
          } else if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }

          // Thiết lập canvas
          canvas.width = width;
          canvas.height = height;

          // Vẽ ảnh lên canvas
          ctx.drawImage(img, 0, 0, width, height);

          //Nén và chuyển sang base64

          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.5); // 0.5 là chất lượng ảnh
          resolve(compressedBase64);
        } catch (error) {
          reject(new Error('Lỗi khi xử lý ảnh: ' + error));
        }
      };

      img.onerror = (err) => {
        reject(new Error('Lỗi khi tải ảnh: ' + err));
      };
    });
  };

  const maxKbThumnail = 1024; // 100 kb max thumnail image
  const seekToSecond = 1.5; // 100 kb max thumnail image

  async function uploadFileInChunks(
    file: File,
    options: {
      fileId: string;
      replyId: string;
      roomId: string;
      onProgress?: (progress: number) => void;
    }
  ) {
    const { fileId, replyId, roomId, onProgress } = options;

    const chunkSize = 10 * 1024 * 1024; // Kích thước mỗi chunk
    const totalChunks = Math.ceil(file.size / chunkSize);

    let thumbnailBase64 = '';

    // Tạo thumbnail nếu file là video
    if (file.type.startsWith('video/')) {
      try {
        thumbnailBase64 = (await createThumbnail(file, seekToSecond)) as string;
        const maxThumbnailSize = maxKbThumnail * 1024;

        if (thumbnailBase64.length > maxThumbnailSize) {
          thumbnailBase64 = await compressThumbnail(thumbnailBase64);
        }
      } catch (error) {
        console.error('Lỗi khi tạo thumbnail:', error);
      }
    }

    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, file.size);
      const chunk = file.slice(start, end);

      const formData = new FormData();
      formData.append('file', chunk, file.name);
      formData.append('fileName', file.name);
      formData.append('chunkNumber', (i + 1).toString());
      formData.append('totalChunks', totalChunks.toString());
      formData.append('fileId', fileId);
      formData.append('reply_id', replyId);
      formData.append('roomId', roomId);

      // Thêm thumbnail vào chunk đầu tiên
      if (i === 0 && file.type.startsWith('video/')) {
        formData.append('thumbnailVideo', thumbnailBase64);
      } else {
        formData.append('thumbnailVideo', '');
      }

      try {
        const response = await apiRequest('POST', 'upload/chunk', formData, {
          'Content-Type': 'multipart/form-data; charset=utf-8',
        });

        if (response.status !== 201) {
          throw new Error(
            `Chunk ${i + 1} upload failed with status ${response.status}`
          );
        }
      } catch (error) {
        console.error('Error uploading chunk:', error);
        break;
      }

      // Cập nhật tiến trình
      const progress = Math.round(((i + 1) / totalChunks) * 100);
      if (onProgress) {
        onProgress(progress); // Gọi callback để cập nhật tiến trình
      }
    }
  }

  return { handleFileDownload, uploadFileInChunks };
};
