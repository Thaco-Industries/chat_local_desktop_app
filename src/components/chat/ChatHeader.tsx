import clsx from 'clsx';
import ArrowLeft from '../../assets/icons/arrow-left';
import CallIcon from '../../assets/icons/call';
import VideoCameraIcon from '../../assets/icons/VideoCamera';
import CollapsdMessageIcon from '../../assets/icons/collapse-message';
import MessageSearchIcon from '../../assets/icons/message-search';
import { IChatHeader } from '../../interfaces/ChatScreen';
import UserAvatar from '../common/UserAvatar';
import ChangeLogoIcon from '../../assets/icons/change-logo';
import { useRoomService } from '../../services/RoomService';
import { notify } from '../../helper/notify';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import { useEffect, useRef, useState } from 'react';
import Edit from '../../assets/icons/edit';
import CustomField from '../common/customField';
import { getAuthCookie } from '../../actions/auth.action';
import { useMessageContext } from '../../context/MessageContext';

const ChatHeader: React.FC<IChatHeader> = ({
  roomInfo,
  setRoomInfo,
  setRoomId,
  isCollapsed,
  setIsCollapsed,
  isDesktopCollapsed,
  setIsDesktopCollapsed,
  listMember,
}) => {
  const initialValues = {
    roomName: roomInfo.room_name,
    avatar: roomInfo.avatar_url,
  };
  const { uploadRoomImage, changeRoomInfor } = useRoomService();
  const { isSearchMessage, setIsSearchMessage } = useMessageContext();
  const [avatar, setAvatar] = useState(roomInfo.avatar_url);
  const [isActiveInput, setIsActiveInput] = useState<boolean>(false);
  const validationSchema = Yup.object().shape({
    roomName: Yup.string()
      .required('Tên nhóm không được để trống')
      .max(50, 'Tên nhóm không quá 50 ký tự'),
  });
  const userAuth = getAuthCookie();
  const [isLeader, setIsLeader] = useState(false);

  useEffect(() => {
    if (listMember && userAuth?.user?.id) {
      const isCurrentUserLeader = Object.keys(listMember).some((memberKey) => {
        const permissions = listMember[memberKey].userRoom[0].permission;
        return permissions === 'LEADER' && memberKey === userAuth?.user.id;
      });
      setIsLeader(isCurrentUserLeader);
    }
  }, [listMember, userAuth]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAvatar(roomInfo.avatar_url);
  }, [roomInfo]);

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

  const handleSubmit = async (values: { roomName: string; avatar: string }) => {
    try {
      const payload = { ...values, id: roomInfo.id };

      const response = await changeRoomInfor(roomInfo.id, payload);
      if (response.status === 200) {
        const updatedRoomInfo = {
          ...roomInfo,
          room_name: values.roomName,
          avatar_url: values.avatar,
        };

        setRoomInfo(updatedRoomInfo);
      }
    } catch (error) {
      console.error('Error while fetch api: ' + error);
    }
  };

  const renderStatusHeader = () => {
    const filteredMembers = Object.values(listMember ?? {}).filter(
      (member) => member.userRoom[0].deleted_at === null
    );

    // Số lượng thành viên
    const memberCount = filteredMembers.length;
    const isFriendOnline = filteredMembers.some(
      (member) => member.id !== userAuth?.user.id && member.isOnline === true
    );

    if (roomInfo.is_group) {
      return `${memberCount} thành viên`;
    } else {
      if (isFriendOnline) {
        return (
          <div className="flex items-center gap-xs text-textBody text-sm">
            <div className="w-xs h-xs rounded-full bg-green-300"></div>
            Đang hoạt động
          </div>
        );
      } else {
        return null;
      }
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
        <Form className="w-full h-16 px-md tablet:px-lg py-xs bg-white border-b-[#DCDCDC] border-b-[0.5px] flex justify-between items-center relative">
          <div className="flex gap-4 flex-1">
            <button
              type="button"
              className="text-blue-500 block tablet:hidden"
              title="trở về"
              onClick={() => setRoomId('')}
            >
              <ArrowLeft />
            </button>
            <div className="group relative">
              <UserAvatar
                fullName={roomInfo.room_name}
                senderId={
                  roomInfo.is_group ? roomInfo.id : roomInfo.userRoom[0].user_id
                }
                url={avatar}
              />
              {roomInfo.is_group && isLeader && (
                <div
                  className="group-hover:block hidden absolute -bottom-[2px] -right-2 z-10 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById('avatar')?.click();
                  }}
                >
                  <ChangeLogoIcon />
                </div>
              )}
              <input
                type="file"
                className="hidden"
                id="avatar"
                name="avatar"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const uploadedAvatar = await handleUploadImage(file);
                    if (uploadedAvatar) {
                      setFieldValue('avatar', uploadedAvatar);
                      setAvatar(uploadedAvatar);
                      setTimeout(() => submitForm(), 0);
                    }
                  }
                }}
                title="gửi ảnh"
              />
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <div className="group flex relative max-w-[140px] sm:max-w-[300px] tablet:max-w-[460px]">
                {isActiveInput ? (
                  <CustomField
                    type="text"
                    name="roomName"
                    ref={inputRef}
                    id="roomName"
                    maxLength={50}
                    className={clsx('h-[24px] focus:ring-0', {
                      shadow: isActiveInput,
                    })}
                    placeholder="Nhập tên phòng"
                    value={values.roomName || roomInfo.room_name} // Dùng giá trị từ Formik hoặc giá trị mặc định
                    onChange={handleChange}
                    onBlur={(e: any) => {
                      setIsActiveInput(false);
                      handleBlur(e);
                      submitForm(); // Gọi submitForm khi rời khỏi ô nhập
                    }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                      if (e.key === 'Enter') {
                        e.preventDefault(); // Ngăn form gửi mặc định
                        submitForm(); // Gửi form
                        setIsActiveInput(false); // Tắt chế độ chỉnh sửa
                      }
                    }}
                  />
                ) : (
                  <p>{values.roomName || roomInfo.room_name}</p>
                )}
                {/* Edit Icon */}
                {roomInfo.is_group && !isActiveInput && isLeader && (
                  <div
                    className="group-hover:flex justify-center items-center hidden cursor-pointer flex-shrink-0 w-6 h-6 bg-white rounded-full shadow"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsActiveInput(true);
                      setTimeout(() => {
                        inputRef.current?.focus(); // Focus vào ô input
                      }, 0);
                    }}
                  >
                    <Edit />
                  </div>
                )}
              </div>
              {renderStatusHeader()}
            </div>
          </div>
          <div className="flex bg-white items-center h-full absolute right-0 top-0 bottom-0 z-10 px-1">
            <button
              type="button"
              title="tìm kiếm tin nhắn"
              className={clsx(
                'w-10 h-10 p-xs hover:bg-[#CEE5FF80] flex justify-center items-center rounded-sm',
                { 'bg-[#CEE5FF80]': isSearchMessage }
              )}
              onClick={() => setIsSearchMessage((prev) => !prev)}
            >
              <MessageSearchIcon
                color={`${isSearchMessage ? '#076EB8' : ''}`}
              />
            </button>
            {/* <button
              type="button"
              title="cuộc gọi thoại"
              className="w-10 h-10 p-xs hover:bg-[#CEE5FF80] flex justify-center items-center rounded-sm"
            >
              <CallIcon />
            </button>
            <button
              type="button"
              title="cuộc gọi thoại"
              className="w-10 h-10 p-xs hover:bg-[#CEE5FF80] flex justify-center items-center rounded-sm"
            >
              <VideoCameraIcon />
            </button> */}
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
                <CollapsdMessageIcon
                  stroke={clsx({ '#076EB8': isCollapsed })}
                />
              </label>
            </div>
            <button
              type="button"
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
        </Form>
      )}
    </Formik>
  );
};

export default ChatHeader;
