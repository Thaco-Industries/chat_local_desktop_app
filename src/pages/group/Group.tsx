import React, { useLayoutEffect, useState } from 'react';
import SearchAndAddToolbar from '../../components/common/SearchAndAddToolbar';
import { IRoom } from '../../interfaces/Room';
import UserSquareIcon from '../../assets/icons/user-square';
import AddFriendIcon from '../../assets/icons/add-friend';
import PeopleIcon from '../../assets/icons/people';
import AddGroupIcon from '../../assets/icons/add-group';
import ListGroup from './ListGroup';
import ListAddGroup from './ListAddGroup';
import ListGroupMobile from './ListGroupMobile';
import ListAddGroupMobile from './ListAddGroupMobile';

const Group: React.FC = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [roomListSearch, setRoomListSearch] = useState<IRoom[]>([]);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [isShowMain, setIsShowMain] = useState(true);
  const [isShowListFriends, setIsShowListFriends] = useState(false);
  const [isShowListAddFriends, setIsShowListAddFriends] = useState(false);
  const [isListFriends, setIsListFriends] = useState(true);
  useLayoutEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <>
      {width < 800 ? (
        <div className="h-full flex-1">
          <div
            className="w-full tablet:w-1/5 min-w-[330px] h-full bg-white"
            style={{ display: !isShowMain ? 'none' : 'block' }}
          >
            <SearchAndAddToolbar
              keyword={keyword}
              setKeyword={setKeyword}
              setRoomListSearch={setRoomListSearch}
              setLoading={setLoading}
            />
            <div className="mt-[20px]">
              <div
                className="h-[64px] flex items-center pl-[20px] cursor-pointer"
                onClick={() => {
                  setIsShowMain(false);
                  setIsShowListFriends(true);
                }}
              >
                <PeopleIcon color="#485259" />
                <span className="ml-[10px] text-[16px] font-semibold">
                  Danh sách nhóm
                </span>
              </div>
              <div
                className="h-[64px] flex items-center pl-[20px] cursor-pointer"
                onClick={() => {
                  setIsShowMain(false);
                  setIsShowListAddFriends(true);
                }}
              >
                <AddFriendIcon color="#485259" />
                <span className="ml-[10px] text-[16px] font-semibold">
                  Lời mời vào nhóm
                </span>
              </div>
            </div>
          </div>
          {isShowListFriends && (
            <ListGroupMobile
              setIsShowListFriends={setIsShowListFriends}
              setIsShowMain={setIsShowMain}
            />
          )}
          {isShowListAddFriends && (
            <ListAddGroupMobile
              setIsShowListAddFriends={setIsShowListAddFriends}
              setIsShowMain={setIsShowMain}
            />
          )}
        </div>
      ) : (
        <div className="flex h-full w-full tablet:gap-[2px]">
          {/* left */}
          <div className="w-full tablet:w-1/5 min-w-[330px] h-full bg-white">
            <SearchAndAddToolbar
              keyword={keyword}
              setKeyword={setKeyword}
              setRoomListSearch={setRoomListSearch}
              setLoading={setLoading}
            />
            <div className="mt-[20px]">
              <div
                className="h-[64px] flex items-center pl-[20px] cursor-pointer"
                style={{
                  background: isListFriends
                    ? 'rgba(145, 207, 251, 0.20)'
                    : 'transparent',
                }}
                onClick={() => setIsListFriends(true)}
              >
                <PeopleIcon color="#485259" />
                <span className="ml-[10px] text-[14px] font-semibold">
                  Danh sách nhóm
                </span>
              </div>
              <div
                className="h-[64px] flex items-center pl-[20px] cursor-pointer"
                style={{
                  background:
                    isListFriends === false
                      ? 'rgba(145, 207, 251, 0.20)'
                      : 'transparent',
                }}
                onClick={() => setIsListFriends(false)}
              >
                <AddGroupIcon color="#485259" />
                <span className="ml-[10px] text-[14px] font-semibold">
                  Lời mời vào nhóm
                </span>
              </div>
            </div>
          </div>
          {/* end left */}
          {isListFriends ? <ListGroup /> : <ListAddGroup />}
        </div>
      )}
    </>
  );
};

export default Group;
