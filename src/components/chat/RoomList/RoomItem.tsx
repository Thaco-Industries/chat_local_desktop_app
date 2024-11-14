import moment from 'moment';
import React, { useState } from 'react';
import { IRoomItem } from '../../../interfaces';

const RoomItem: React.FC<IRoomItem> = ({ room }) => {
  return (
    <div>
      <div className="flex gap-4 px-5 py-3">
        <img
          src={room.avatar_url}
          alt="user-avatar"
          className="rounded-full w-11 h-11 flex-shrink-0"
        />
        <div className="min-w-0 flex-shrink flex-grow max-w-full">
          <div className="flex justify-between mb-1 gap-3">
            <div className="text-base text-title truncate w-full">
              {room.room_name}
            </div>
            <div className="text-sm text-lightText">
              {moment(room.last_message.created_at).format('DD/MM/YYYY')}
            </div>
          </div>
          <div className="flex gap-3 flex-shrink-0 flex-grow-0">
            <p className="truncate w-full text-sm text-lightText">
              {room.last_message.message_display}
            </p>
            {room.number_message_not_read !== 0 && (
              <div className="rounded-full w-4 h-4 bg-red-600 text-white text-[12px] flex items-center justify-center">
                {room.number_message_not_read}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomItem;
