import React, { useEffect, useState } from 'react';
import getColorBackround from '../../util/getColorBackground';
import clsx from 'clsx';
import getUserShortName from '../../util/getUserShortName';

type Props = {
  url: string | undefined;
  senderId: string;
  showSenderInfo?: boolean;
  fullName: string | undefined;
  fontSize?: number;
  size?: number;
};

function UserAvatar({
  url,
  senderId,
  showSenderInfo = true,
  fullName,
  fontSize,
  size,
}: Props) {
  const [validImageUrl, setValidImageUrl] = useState<string | null>(null);
  const backgroundColor = getColorBackround(senderId);
  const shortName = getUserShortName(fullName ?? '');
  const logoSize = {
    width: size || 45,
    height: size || 45,
  };

  const formatUrl = (inputUrl: string | undefined): string => {
    if (!inputUrl) return '';
    // Thêm `http` nếu URL không bắt đầu bằng `http`
    if (!inputUrl.startsWith('http')) {
      return `${process.env.REACT_APP_API_URL}/media/view/${inputUrl}`;
    }
    return inputUrl;
  };

  const checkImageUrl = (url: string): Promise<string | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(url); // Trả về URL nếu ảnh hợp lệ
      img.onerror = () => resolve(null); // Trả về null nếu ảnh không hợp lệ
    });
  };

  useEffect(() => {
    const processedUrl = formatUrl(url);
    if (processedUrl) {
      checkImageUrl(processedUrl).then(setValidImageUrl); // Cập nhật URL ảnh hợp lệ
    }
  }, [url]);

  return (
    <div>
      {validImageUrl ? (
        <img
          style={logoSize}
          src={validImageUrl}
          className={clsx('rounded-full object-cover', {
            'opacity-0': !showSenderInfo,
          })}
          alt="user-avatar"
        />
      ) : (
        <div
          style={{
            background: backgroundColor,
            ...logoSize,
          }}
          className={clsx(
            'rounded-full flex justify-center items-center text-white font-semibold border border-white relative',
            { 'opacity-0': !showSenderInfo }
          )}
        >
          <div className="absolute inset-0 bg-black bg-opacity-15 rounded-full"></div>
          <p className="z-10 uppercase" style={{ fontSize: `${fontSize}px` }}>
            {shortName}
          </p>
        </div>
      )}
    </div>
  );
}

export default UserAvatar;
