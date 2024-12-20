import React, { useEffect, useState } from 'react';
import { IChatInformationProps } from '../../../interfaces/ChatInformation';
import { FileHandle } from '../../../util/downloadFile';
import { useChatContext } from '../../../context/ChatContext';
import UserAvatar from '../../common/UserAvatar';
import { getAuthCookie } from '../../../actions/auth.action';
import MemberActionPopover from '../../common/MemberActionPopover';
import { useRoomService } from '../../../services/RoomService';
import AddIcon from '../../../assets/icons/add';
import ExitIcon from '../../../assets/icons/exit';
import AddNewMemberModal from './AddNewMemberModal';
import { useSocket } from '../../../context/SocketContext';
import ConfirmModal from '../../modal/ConfirmModal';
import ChangeLeaderModal from '../ChangeLeaderModal';
import { notify } from '../../../helper/notify';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { AvatarSection } from './Components/AvatarSection';
import { RoomNameInput } from './Components/RoomNameInput';
import { FileSection } from './Components/FileSection';
import { MediaSection } from './Components/MediaSection';
import DeleteIcon from '../../../assets/icons/delete-icon';
import { useFriendService } from '../../../services/FriendService';

const ChatInformation: React.FC<IChatInformationProps> = ({
  setActiveTab,
  photos,
  videos,
  files,
  setVisible,
  setImageView,
  setViewAllMemberInRoom,
  roomInfo,
  invitedList,
  setInvitedList,
  setRoomId,
  setFileSelected,
  setIsDelete,
  setIsCollapsed,
  setIsDesktopCollapsed,
  setRoomInfo,
  setIsVideo,
}) => {
  const initialValues = {
    roomName: roomInfo.room_name,
    avatars: roomInfo.avatar_url,
  };
  const validationSchema = Yup.object().shape({
    roomName: Yup.string()
      .required('Tên nhóm không được để trống')
      .max(50, 'Tên nhóm không quá 50 ký tự'),
  });
  const { handleFileDownload } = FileHandle();
  const { socket } = useSocket();
  const { listMember, setListMember } = useChatContext();
  const { invitedRoomList, leaveRoom, uploadRoomImage, changeRoomInfor } =
    useRoomService();
  const { deleteFriend } = useFriendService();
  const userAuth = getAuthCookie();
  const [openAddMemberModal, setOpenAddMemberModal] = useState<boolean>(false);
  const [openChangeLeaderModal, setOpenChangeLeaderModal] =
    useState<boolean>(false);
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
  const [openConfirmDeleteFriendModal, setOpenConfirmDeleteFriendModal] =
    useState<boolean>(false);
  const [avatars, setAvatars] = useState(roomInfo.avatar_url);
  const [isActiveInput, setIsActiveInput] = useState<boolean>(false);

  const filteredMembers = Object.values(listMember ?? {}).filter(
    (member) => member.userRoom[0].deleted_at === null
  );

  // Số lượng thành viên
  const memberCount = filteredMembers.length;

  useEffect(() => {
    handleGetInvitedList();
    setAvatars(roomInfo.avatar_url);
  }, [roomInfo]);

  const handleChangeRoomLeader = () => {
    handleGetInvitedList();
  };

  useEffect(() => {
    if (socket) {
      socket.on(`new-invitation/${roomInfo.id}`, handleGetInvitedList);
      socket.on(`change-room-leader/${roomInfo.id}`, handleChangeRoomLeader);

      return () => {
        socket.off(`new-invitation/${roomInfo.id}`);
        socket.off(`change-room-leader/${roomInfo.id}`);
      };
    }
  }, [socket, roomInfo, handleChangeRoomLeader]);

  const handleGetInvitedList = async () => {
    const response = await invitedRoomList(roomInfo.id);
    if (response.data) {
      setInvitedList(response.data);
    }
  };

  const isLeader = !!(
    userAuth?.user?.id &&
    listMember?.[userAuth.user.id]?.userRoom?.[0]?.permission === 'LEADER'
  );

  const handleViewAllClick = (section: 'image' | 'video' | 'file') => {
    setActiveTab(section);
  };
  const handleViewImageClick = (url: string, isVideo: boolean) => {
    setVisible(true);
    setImageView(url);
    setIsVideo(isVideo);
  };

  const handleLeaveRoom = () => {
    if (isLeader && memberCount > 1) {
      setOpenChangeLeaderModal(true);
    } else {
      setOpenConfirmModal(true);
    }
  };

  const handleDeleteFriend = () => {
    setOpenConfirmDeleteFriendModal(true);
  };

  const handleConfirmLeaveRoom = async () => {
    const response = await leaveRoom(roomInfo.id);
    if (response.statusText === 'OK') {
      setOpenConfirmModal(false);
      setRoomId('');
      setViewAllMemberInRoom(false);
      setActiveTab(null);
      setFileSelected([]);
      setIsDelete(false);
      setIsCollapsed?.(false);
      setIsDesktopCollapsed?.(false);
    }
  };

  const handleConfirmDeleteFriendRoom = async () => {
    const response = await deleteFriend(roomInfo.userRoom[0].user_id);
    if (response.status === 204) {
      setOpenConfirmDeleteFriendModal(false);
      roomInfo.userRoom[0].friendStatus = 'NOTFRIEND';
    }
  };

  const handleUploadImage = async (file: File) => {
    try {
      const response = await uploadRoomImage(file);
      if (response.status === 201) {
        const imageUrl = `${process.env.REACT_APP_API_URL}/media/view/${response.data.path}`;

        return imageUrl;
      }
    } catch (error: any) {
      // Lấy thông tin lỗi chi tiết
      const errorMessage = error?.response?.data?.message || error.message;
      notify(`Lỗi tải ảnh: ${errorMessage}`, 'error');
      console.error('Error:', errorMessage);
    }
  };

  const handleSubmit = async (values: {
    roomName: string;
    avatars: string;
  }) => {
    try {
      const payload = { ...values, id: roomInfo.id, avatar: values.avatars };

      const response = await changeRoomInfor(roomInfo.id, payload);
      if (response.status === 200) {
        const updatedRoomInfo = {
          ...roomInfo,
          room_name: values.roomName,
          avatar_url: values.avatars,
        };

        setRoomInfo(updatedRoomInfo);
      }
    } catch (error) {
      console.error('Error while fetch api: ' + error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({
        setFieldValue,
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        submitForm,
      }) => (
        <div className="menu flex flex-col gap-xxs bg-background-500 text-base-content min-h-full w-[310px] max-w-[310px] p-0">
          <Form className="bg-white px-5 text-center flex flex-col items-center gap-xs">
            <AvatarSection
              roomInfo={roomInfo}
              isLeader={isLeader}
              avatars={avatars}
              setAvatars={setAvatars}
              handleUploadImage={handleUploadImage}
              setFieldValue={setFieldValue}
              submitForm={submitForm}
            />
            <RoomNameInput
              roomName={values.roomName || roomInfo.room_name}
              isLeader={isLeader}
              isActiveInput={isActiveInput}
              setIsActiveInput={setIsActiveInput}
              setFieldValue={setFieldValue}
              handleBlur={handleBlur}
              submitForm={submitForm}
            />
          </Form>

          {roomInfo.is_group && (
            <div className="bg-white px-5 py-sm">
              <h1 className="text-title font-semibold mb-sm">
                Thành viên nhóm ({memberCount})
              </h1>
              {isLeader && invitedList.length > 0 && (
                <h1
                  className="text-primary mb-sm cursor-pointer"
                  onClick={() => setViewAllMemberInRoom(true)}
                >
                  Có ({invitedList.length}) yêu cầu tham gia nhóm
                </h1>
              )}
              <div className="grid gap-xs">
                {filteredMembers.slice(0, 3).map((user, idx) => {
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
                            <p className="text-title mb-xxs">
                              {user.infor.full_name}
                            </p>
                            {isLeader && (
                              <p className="text-lightText">Trưởng nhóm</p>
                            )}
                          </div>
                          {currentUserPermission === 'LEADER' &&
                            !isCurrentUser && (
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
              <p
                className="text-center text-primary cursor-pointer mt-sm"
                onClick={() => setViewAllMemberInRoom(true)}
              >
                Xem tất cả
              </p>
            </div>
          )}
          {['Ảnh', 'Video'].map((title, idx) => (
            <div key={idx} className="bg-white px-5 py-sm">
              <h1 className="text-title font-semibold">{title}</h1>
              {(idx === 0 && photos.length === 0) ||
              (idx === 1 && videos.length === 0) ? (
                <p>Chưa có {title} được chia sẻ trong cuộc hội thoại này</p>
              ) : (
                <>
                  <MediaSection
                    items={idx === 0 ? photos : videos}
                    isVideoSection={idx === 1}
                    handleViewImageClick={handleViewImageClick}
                  />
                  <p
                    className="text-center text-primary cursor-pointer mt-sm"
                    onClick={() =>
                      handleViewAllClick(idx === 0 ? 'image' : 'video')
                    }
                  >
                    Xem tất cả
                  </p>
                </>
              )}
            </div>
          ))}
          <div className="bg-white px-5 py-sm">
            <h1 className="text-title font-semibold mb-xs">File</h1>
            {files.length === 0 ? (
              <p>Chưa có File được chia sẻ trong cuộc hội thoại này</p>
            ) : (
              <>
                <div className="flex flex-col gap-xs">
                  <FileSection
                    files={files}
                    handleFileDownload={handleFileDownload}
                  />
                </div>
                <p
                  className="text-center text-primary cursor-pointer mt-sm"
                  onClick={() => handleViewAllClick('file')}
                >
                  Xem tất cả
                </p>
              </>
            )}
          </div>

          <div className="bg-white flex-1 p-5">
            <h1 className="text-title font-semibold mb-xs">Mở rộng</h1>
            {roomInfo.is_group ? (
              <div className="flex flex-col gap-xs">
                <div
                  className="flex gap-xs cursor-pointer items-center"
                  onClick={() => setOpenAddMemberModal(true)}
                >
                  <AddIcon />
                  <p className="text-primary leading-[20px]">
                    Thêm mới thành viên
                  </p>
                </div>
                <div
                  className="flex gap-xs cursor-pointer items-center"
                  onClick={handleLeaveRoom}
                >
                  <ExitIcon />
                  <p className="text-red-700 leading-[20px]">Rời khỏi nhóm</p>
                </div>
              </div>
            ) : (
              roomInfo.userRoom[0].friendStatus === 'FRIEND' && (
                <div
                  className="flex gap-xs cursor-pointer items-center"
                  onClick={handleDeleteFriend}
                >
                  <DeleteIcon />
                  <p className="text-red-700 leading-[20px]">Xóa bạn bè</p>
                </div>
              )
            )}
          </div>

          {openAddMemberModal && (
            <AddNewMemberModal
              openAddMemberModal={openAddMemberModal}
              setOpenAddMemberModal={setOpenAddMemberModal}
              roomId={roomInfo.id}
            />
          )}
          {openConfirmModal && (
            <ConfirmModal
              title="Rời khỏi cuộc trò chuyện"
              content="Bạn có chắc chắn muốn rời khỏi cuộc trò chuyện này không?"
              handleConfirm={handleConfirmLeaveRoom}
              openModal={openConfirmModal}
              setOpenModal={setOpenConfirmModal}
            />
          )}
          {openConfirmDeleteFriendModal && (
            <ConfirmModal
              title="Xóa bạn bè"
              content="Bạn có chắc chắn muốn xóa bạn bè này không?"
              handleConfirm={handleConfirmDeleteFriendRoom}
              openModal={openConfirmDeleteFriendModal}
              setOpenModal={setOpenConfirmDeleteFriendModal}
            />
          )}
          {openChangeLeaderModal && (
            <ChangeLeaderModal
              openChangeLeaderModal={openChangeLeaderModal}
              roomId={roomInfo.id}
              setOpenChangeLeaderModal={setOpenChangeLeaderModal}
              setOpenConfirmModal={setOpenConfirmModal}
            />
          )}
        </div>
      )}
    </Formik>
  );
};

export default ChatInformation;
