import React from 'react';
import getColorBackround from '../../util/getColorBackground';
import clsx from 'clsx';
import getUserShortName from '../../util/getUserShortName';

type Props = {
  url: string | undefined;
  senderId: string;
  showSenderInfo?: boolean;
  fullName: string | undefined;
};

function UserAvatar({ url, senderId, showSenderInfo = true, fullName }: Props) {
  const backgroundColor = getColorBackround(senderId);
  const shortName = getUserShortName(fullName ?? '');

  return (
    <div>
      {url ? (
        <img src={url} className="rounded-full w-11 h-11" alt="user-avatar" />
      ) : (
        <div
          style={{ background: backgroundColor }}
          className={clsx(
            'rounded-full w-11 h-11 flex justify-center items-center text-white font-semibold border border-white relative',
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
