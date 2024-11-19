import moment from 'moment';
import React, { useState } from 'react';
import { IRoomItem } from '../../../interfaces';
import getColorBackround from '../../../util/getColorBackground';
import getUserShortName from '../../../util/getUserShortName';

const RoomItem: React.FC<IRoomItem> = ({ room }) => {
  const backgroundColor = getColorBackround(
    room.is_group ? room.id : room.userRoom[0].user_id
  );
  const shortName = getUserShortName(room.room_name);

  return (
    <div>
      <div className="flex gap-4 px-5 py-3">
        {room.avatar_url ? (
          <img
            src={room.avatar_url}
            className="rounded-full basis-11 w-11 h-11"
            alt="user-avatar"
          />
        ) : (
          <div
            style={{ background: backgroundColor }}
            className={`rounded-full basis-11 w-11 h-11 flex justify-center items-center text-white font-semibold border border-white`}
          >
            {shortName}
          </div>
        )}
        <div className="min-w-0 flex-1 max-w-full">
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
              <span className=" badge rounded-full bg-red-600 text-white text-[12px] flex items-center justify-center">
                {room.number_message_not_read}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomItem;
