import React, { Dispatch, SetStateAction } from 'react';
import UserAvatar from '../common/UserAvatar';
import MemberActionPopover from '../common/MemberActionPopover';
import { useChatContext } from '../../context/ChatContext';
import { getAuthCookie } from '../../actions/auth.action';
import { IInvitedInfor, IRoom } from '../../interfaces';
import { useRoomService } from '../../services/RoomService';

type Props = {
  roomInfo: IRoom;
  invitedList: IInvitedInfor[];
  setInvitedList: Dispatch<SetStateAction<IInvitedInfor[]>>;
};

function ViewAllMemberInRoom({ roomInfo, invitedList, setInvitedList }: Props) {
  const { listMember } = useChatContext();
  const { leaderActionInvited } = useRoomService();
  const userAuth = getAuthCookie();

  const filteredMembers = Object.values(listMember ?? {}).filter(
    (member) => member.userRoom[0].deleted_at === null
  );

  const isLeader = !!(
    userAuth?.user?.id &&
    listMember?.[userAuth.user.id]?.userRoom?.[0]?.permission === 'LEADER'
  );

  // Số lượng thành viên
  const memberCount = filteredMembers.length;

  const invitedAction = async (id: string, status: 'ACCEPTED' | 'REJECTED') => {
    const response = await leaderActionInvited(id, status);
    if (response.statusText === 'OK') {
      const data = response.data;
      setInvitedList((prevInvitedList) =>
        prevInvitedList.filter(
          (invited) => invited.invitedUserInfo.id !== data.invited_user_id
        )
      );
    }
  };

  return (
    <div className="w-full flex flex-col items-start justify-between bg-background-500 gap-xs pb-0">
      {isLeader && (
        <div className="w-full bg-white flex flex-col gap-sm p-md pt-0">
          <p className="text-title font-semibold">
            Yêu cầu tham gia nhóm ({invitedList.length})
          </p>
          {invitedList &&
            invitedList.map((item) => (
              <div key={item.id} className="flex gap-sm">
                <UserAvatar
                  fullName={item.invitedUserInfo.infor.full_name}
                  senderId={item.id}
                  url={item.invitedUserInfo.infor.avt_url}
                  size={40}
                />
                <div className="">
                  <div>
                    <p>{item.invitedUserInfo.infor.full_name}</p>
                    <p className="text-lightText">
                      được thêm bởi {item.invitedByInfo.infor.full_name}
                    </p>
                  </div>
                  <div className="flex gap-md justify-center mt-sm">
                    <button
                      className="px-md py-[7.5px] rounded-[24px] border border-[#949494] bg-white text-textBody"
                      onClick={() => invitedAction(item.id, 'REJECTED')}
                    >
                      Từ chối
                    </button>
                    <button
                      className="px-md py-[7.5px] rounded-[24px] bg-primary text-white"
                      onClick={() => invitedAction(item.id, 'ACCEPTED')}
                    >
                      Đồng ý
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
      <div className="w-full bg-white flex flex-col gap-sm p-md pt-0">
        <p className="text-title font-semibold">
          Danh sách thành viên ({memberCount})
        </p>
        {filteredMembers.map((user, idx) => {
          const currentUserId = userAuth?.user.id;
          const isLeader = user.userRoom?.[0]?.permission === 'LEADER';
          const isCurrentUser = currentUserId === user.id;
          const currentUserPermission =
            currentUserId &&
            (listMember?.[currentUserId]?.userRoom?.[0]?.permission ??
              'MEMBER');

          return (
            <React.Fragment key={idx}>
              {user.userRoom[0].deleted_at === null && (
                <div className="flex gap-sm">
                  <UserAvatar
                    fullName={user.infor.full_name}
                    senderId={user.id}
                    url={user.infor.avt_url}
                    size={40}
                  />
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="text-title mb-xxs">{user.infor.full_name}</p>
                    {isLeader && <p className="text-lightText">Trưởng nhóm</p>}
                  </div>
                  {currentUserPermission === 'LEADER' && !isCurrentUser && (
                    <MemberActionPopover
                      memberId={user.id}
                      roomId={roomInfo.id}
                      memberName={user.infor.full_name}
                    />
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default ViewAllMemberInRoom;
