import clsx from 'clsx';
import ArrowLeft from '../../assets/icons/arrow-left';
import CallIcon from '../../assets/icons/call';
import VideoCameraIcon from '../../assets/icons/VideoCamera';
import CollapsdMessageIcon from '../../assets/icons/collapse-message';
import MessageSearchIcon from '../../assets/icons/message-search';
import { IChatHeader } from '../../interfaces/ChatScreen';

const ChatHeader: React.FC<IChatHeader> = ({
  roomInfo,
  setRoomId,
  isCollapsed,
  setIsCollapsed,
  isDesktopCollapsed,
  setIsDesktopCollapsed,
}) => {
  return (
    <div className="w-full h-16 px-md md:px-lg py-xs bg-white border-b-[#DCDCDC] border-b-[0.5px] flex justify-between items-center relative">
      <div className="flex gap-4">
        <button
          className="text-blue-500 block md:hidden"
          title="trở về"
          onClick={() => setRoomId('')}
        >
          <ArrowLeft />
        </button>
        <img
          src={roomInfo.avatar_url}
          className="rounded-full w-11 h-11"
          alt="user-avatar"
        />
        <div className="">
          <p className="text-title ">{roomInfo.room_name}</p>
          <div className="flex items-center gap-xs text-textBody text-sm">
            <div className="w-xs h-xs rounded-full bg-green-300"></div>
            Online
          </div>
        </div>
      </div>
      <div className="flex bg-white items-center h-full absolute right-0 top-0 bottom-0 z-10 px-1">
        <button
          title="tìm kiếm tin nhắn"
          className="w-10 h-10 p-xs hover:bg-[#CEE5FF80] flex justify-center items-center rounded-sm"
        >
          <MessageSearchIcon />
        </button>
        <button
          title="cuộc gọi thoại"
          className="w-10 h-10 p-xs hover:bg-[#CEE5FF80] flex justify-center items-center rounded-sm"
        >
          <CallIcon />
        </button>
        <button
          title="cuộc gọi thoại"
          className="w-10 h-10 p-xs hover:bg-[#CEE5FF80] flex justify-center items-center rounded-sm"
        >
          <VideoCameraIcon />
        </button>
        <div className="drawer-content xl:hidden">
          <label
            htmlFor="collapsedMenu"
            title="thông tin hội thoại"
            className={clsx(
              'w-10 h-10 p-xs hover:bg-[#CEE5FF80] flex justify-center items-center rounded-sm hover:stroke-primary drawer-button',
              { 'bg-[#CEE5FF80]': isCollapsed }
            )}
            onClick={() => setIsCollapsed(true)}
          >
            <CollapsdMessageIcon stroke={clsx({ '#076EB8': isCollapsed })} />
          </label>
        </div>
        <button
          title="thông tin hội thoại"
          className={clsx(
            'hidden xl:flex w-10 h-10 p-[10px] hover:bg-[#CEE5FF80]  justify-center items-center rounded-sm hover:stroke-primary',
            { 'bg-[#CEE5FF80]': isDesktopCollapsed }
          )}
          onClick={() => setIsDesktopCollapsed((prev) => !prev)}
        >
          <CollapsdMessageIcon
            stroke={clsx({ '#076EB8': isDesktopCollapsed })}
          />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
