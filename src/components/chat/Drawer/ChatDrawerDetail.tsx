import React, { useEffect, useState } from 'react';
import ArrowLeft from '../../../assets/icons/arrow-left';
import ChatInformation from './ChatInformation';
import TabList from '../Tab/TabList';
import clsx from 'clsx';
import DeleteIcon from '../../../assets/icons/delete-icon';
import moment from 'moment';
import { IChatDrawerDetail, IInvitedInfor } from '../../../interfaces';
import { useFileService } from '../../../services/FileService';
import ViewAllMemberInRoom from '../ViewAllMemberInRoom';
import ConfirmModal from '../../modal/ConfirmModal';
import { notify } from '../../../helper/notify';
import { useSocket } from '../../../context/SocketContext';

const ChatDrawerDetail: React.FC<IChatDrawerDetail> = ({
  setVisible,
  setImageView,
  roomId,
  roomInfo,
  setRoomId,
  setIsCollapsed,
  setIsDesktopCollapsed,
  setRoomInfo,
  friendStatus,
  setIsVideo,
}) => {
  const { socket } = useSocket();
  const { getAllFilesInRoom, deleteFileMessage } = useFileService();
  const [activeTab, setActiveTab] = useState<'image' | 'other' | 'video' | ''>(
    ''
  );
  const [viewAllMemberInRoom, setViewAllMemberInRoom] =
    useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [fileSelected, setFileSelected] = useState<string[]>([]);
  const [photoList, setPhotoList] = useState<IFileInfor[]>([]);
  const [videoList, setVideoList] = useState<IFileInfor[]>([]);
  const [otherFileList, setOtherFileList] = useState<IFileInfor[]>([]);
  const [invitedList, setInvitedList] = useState<IInvitedInfor[]>([]);
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] =
    useState<boolean>(false);

  const activeTabStyle = 'border-b-2 border-[#1890FF] text-[#1890FF]';

  useEffect(() => {
    handleReset();
    getMediaFiles('image');
    getMediaFiles('other');
    getMediaFiles('video');
  }, [roomId]);

  const handleReset = () => {
    setViewAllMemberInRoom(false);
    setActiveTab('');
    setFileSelected([]);
    setIsDelete(false);
    setPhotoList([]);
    setVideoList([]);
    setOtherFileList([]);
  };

  const handleListFileChanged = () => {
    getMediaFiles('video');
    getMediaFiles('image');
    getMediaFiles('other');
  };

  useEffect(() => {
    if (socket) {
      socket.on(
        `list-files-in-room-changed/${roomInfo.id}`,
        handleListFileChanged
      );

      return () => {
        socket.off(`list-files-in-room-changed/${roomInfo.id}`);
      };
    }
  }, [socket, roomId, handleListFileChanged]);

  const getMediaFiles = async (type: 'image' | 'video' | 'other') => {
    try {
      const response = await getAllFilesInRoom(roomId, type);
      if (response.data) {
        switch (type) {
          case 'video':
            setVideoList(response.data.data);
            break;
          case 'image':
            console.log('render');

            setPhotoList(response.data.data);
            break;
          case 'other':
            setOtherFileList(response.data.data);
            break;
          default:
            break;
        }
      }

      // const video = await getAllFilesInRoom(roomId, 'video');
    } catch (error) {
      console.error('Get data failed: ' + error);
    }
  };

  const handleBackClick = () => {
    setViewAllMemberInRoom(false);
    setActiveTab('');
    setFileSelected([]);
    setIsDelete(false);
  };

  const handleDelete = () => {
    setIsDelete((prev) => !prev);
    setFileSelected([]);
  };

  const handleTabChange = (tab: 'image' | 'video' | 'other') => {
    setIsDelete(false);
    setFileSelected([]);
    setActiveTab(tab);
  };

  const handleDeleteFile = async () => {
    try {
      const response = await deleteFileMessage(roomId, fileSelected);
      if (response.statusText === 'OK' && activeTab) {
        setFileSelected([]);
        setIsDelete(false);
        getMediaFiles(activeTab);
        setOpenConfirmDeleteModal(false);
        notify('File đã được xóa thành công', 'success');
      }
    } catch (error: any) {
      // Lấy thông tin lỗi chi tiết
      const errorMessage = error?.response?.data?.message || error.message;
      notify(errorMessage, 'error');
      console.error('Error:', errorMessage);
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-white shadow-xl relative">
      {!activeTab && !viewAllMemberInRoom ? (
        <h1 className="text-title text-[16px] font-semibold p-md">Thông tin</h1>
      ) : viewAllMemberInRoom ? (
        <div className="flex gap-xs items-center p-md">
          <button
            onClick={handleBackClick}
            className="text-primary"
            title="trở về"
          >
            <ArrowLeft />
          </button>
          <h1 className="text-title text-[16px] font-semibold">Thành viên</h1>
        </div>
      ) : (
        <div className="w-full flex flex-col items-start justify-between bg-white gap-xs p-md pb-0 border border-[#0000000F]">
          <div className="flex justify-between w-full">
            <div className="flex gap-xs items-center">
              <button
                onClick={handleBackClick}
                className="text-primary"
                title="trở về"
              >
                <ArrowLeft />
              </button>
              <p className="text-title text-[16px] font-semibold">
                Kho lưu trữ
              </p>
            </div>

            <button className="text-title" onClick={handleDelete}>
              {isDelete ? 'Hủy' : 'Xóa'}
            </button>
          </div>

          <div className="flex bg-white gap-4 ">
            <button
              onClick={() => handleTabChange('image')}
              className={`${activeTab === 'image' ? activeTabStyle : ''}`}
            >
              Ảnh
            </button>
            <button
              onClick={() => handleTabChange('video')}
              className={`${activeTab === 'video' ? activeTabStyle : ''}`}
            >
              Video
            </button>
            <button
              onClick={() => handleTabChange('other')}
              className={`${activeTab === 'other' ? activeTabStyle : ''}`}
            >
              File
            </button>
          </div>
        </div>
      )}

      <div className="relative flex-1 overflow-y-auto scrollbar overflow-x-hidden">
        {activeTab ? (
          <TabList
            photos={photoList}
            videos={videoList}
            files={otherFileList}
            activeTab={activeTab}
            isDelete={isDelete}
            fileSelected={fileSelected}
            setFileSelected={setFileSelected}
            setImageView={setImageView}
            setVisible={setVisible}
            setIsVideo={setIsVideo}
          />
        ) : viewAllMemberInRoom ? (
          <ViewAllMemberInRoom
            roomInfo={roomInfo}
            invitedList={invitedList}
            setInvitedList={setInvitedList}
          />
        ) : (
          <ChatInformation
            setActiveTab={setActiveTab}
            files={otherFileList}
            photos={photoList}
            videos={videoList}
            setImageView={setImageView}
            setVisible={setVisible}
            roomInfo={roomInfo}
            setViewAllMemberInRoom={setViewAllMemberInRoom}
            invitedList={invitedList}
            setInvitedList={setInvitedList}
            setRoomId={setRoomId}
            setFileSelected={setFileSelected}
            setIsDelete={setIsDelete}
            setIsCollapsed={setIsCollapsed}
            setIsDesktopCollapsed={setIsDesktopCollapsed}
            setRoomInfo={setRoomInfo}
            setIsVideo={setIsVideo}
          />
        )}
      </div>
      <div
        className={clsx(
          'absolute h-14 w-full bottom-0 z-10 bg-white border-t border-border p-xs items-center justify-end gap-md',
          { flex: fileSelected.length > 0 },
          { hidden: fileSelected.length === 0 }
        )}
      >
        <button
          className="border border-border text-base rounded-3xl px-5 py-2"
          onClick={handleDelete}
        >
          Bỏ chọn tất cả
        </button>
        <button
          className="border border-red-700 text-red-700 text-base rounded-3xl px-5 py-2 flex items-center justify-center gap-xxs"
          onClick={() => setOpenConfirmDeleteModal(true)}
        >
          <DeleteIcon />
          Xóa
        </button>
      </div>
      {openConfirmDeleteModal && (
        <ConfirmModal
          title="Thông báo"
          content="Bạn có chắc chắn xóa file?"
          handleConfirm={handleDeleteFile}
          openModal={openConfirmDeleteModal}
          setOpenModal={setOpenConfirmDeleteModal}
        />
      )}
    </div>
  );
};

export default ChatDrawerDetail;
