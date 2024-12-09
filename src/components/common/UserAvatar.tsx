import React from 'react';
import getColorBackround from '../../util/getColorBackground';
import clsx from 'clsx';
import getUserShortName from '../../util/getUserShortName';

type Props = {
  url: string | undefined;
  senderId: string;
  showSenderInfo?: boolean;
  fullName: string | undefined;
  size?: number;
};

function UserAvatar({
  url,
  senderId,
  showSenderInfo = true,
  fullName,
  size,
}: Props) {
  const urlFile =
    url && url.includes('http')
      ? url
      : `${process.env.REACT_APP_API_URL}/media/view/${url}`;
  const backgroundColor = getColorBackround(senderId);
  const shortName = getUserShortName(fullName ?? '');
  const logoSize = {
    width: size || 45,
    height: size || 45,
  };
  return (
    <div>
      {url ? (
        <img
          style={logoSize}
          src={urlFile}
          className="rounded-full object-cover"
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
          <p className="z-10">{shortName}</p>
        </div>
      )}
    </div>
  );
}

export default UserAvatar;