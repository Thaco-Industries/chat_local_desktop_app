import React, { useEffect, useState } from 'react';
import ArrowLeft from '../../../assets/icons/arrow-left';
import ChatInformation from '../ChatInformation';
import TabList from '../Tab/TabList';
import clsx from 'clsx';
import DeleteIcon from '../../../assets/icons/delete-icon';
import moment from 'moment';
import { IChatDrawerDetail } from '../../../interfaces';
import { useFileService } from '../../../services/FileService';

const photos = [
  {
    id: 'video1',
    src: 'https://videos.pexels.com/video-files/7565438/7565438-hd_1080_1920_25fps.mp4',
    date: moment().format('DD/MM/YYYY'),
    isVideo: true,
  },
  {
    id: 'video2',
    src: 'https://videos.pexels.com/video-files/6548176/6548176-hd_1920_1080_24fps.mp4',
    date: moment().format('DD/MM/YYYY'),
    isVideo: true,
  },
  ...Array.from({ length: 30 }, (_, i) => ({
    id: `${i}`,
    src: `https://i.pravatar.cc/150?img=${i + 1}`,
    date: moment().subtract(i, 'days').format('DD/MM/YYYY'),
    isVideo: false,
  })),
];

// const files = Array.from({ length: 30 }, (_, i) => ({
//   id: `${i}`,
//   name: `Báo cáo phương án vận hành ${i}.pptx`,
//   size: `${i}00 MB`,
//   date: moment().subtract(i, 'days').format('DD/MM/YYYY'),
// }));

const ChatDrawerDetail: React.FC<IChatDrawerDetail> = ({
  setVisible,
  setImageView,
  roomId,
}) => {
  const { getAllFilesInRoom } = useFileService();

  const [activeTab, setActiveTab] = useState<'photos' | 'files' | null>(null);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [fileSelected, setFileSelected] = useState<string[]>([]);
  const [mediaFileList, setMediaFileList] = useState<IFileInfor[]>([]);
  const [otherFileList, setOtherFileList] = useState<IFileInfor[]>([]);

  const activeTabStyle = 'border-b-2 border-[#1890FF] text-[#1890FF]';

  useEffect(() => {
    getOtherFileInRoom();
  }, [roomId]);

  const getMediaFileInRoom = async () => {
    try {
      // const video = await getAllFilesInRoom(roomId, 'video');
      // const video = await getAllFilesInRoom(roomId, 'video');
    } catch (error) {}
  };
  const getOtherFileInRoom = async () => {
    try {
      const response = await getAllFilesInRoom(roomId, 'other');
      setOtherFileList(response.data.data);

      // const video = await getAllFilesInRoom(roomId, 'video');
    } catch (error) {}
  };

  const handleBackClick = () => {
    setActiveTab(null);
    setFileSelected([]);
    setIsDelete(false);
  };

  const handleDelete = () => {
    setIsDelete((prev) => !prev);
    setFileSelected([]);
  };

  const handleTabChange = (tab: 'photos' | 'files' | null) => {
    setIsDelete(false);
    setFileSelected([]);
    setActiveTab(tab);
  };

  return (
    <div className="flex h-full flex-col bg-white shadow-xl relative">
      {!activeTab ? (
        <h1 className="text-title text-[16px] font-semibold p-5">Thông tin</h1>
      ) : (
        <div className="w-full flex flex-col items-start justify-between bg-white gap-xs p-5 pb-0 border border-[#0000000F]">
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
              onClick={() => handleTabChange('photos')}
              className={`${activeTab === 'photos' ? activeTabStyle : ''}`}
            >
              Ảnh, Video
            </button>
            <button
              onClick={() => handleTabChange('files')}
              className={`${activeTab === 'files' ? activeTabStyle : ''}`}
            >
              File
            </button>
          </div>
        </div>
      )}

      <div className="relative flex-1 overflow-y-auto scrollbar overflow-x-hidden">
        {activeTab ? (
          <TabList
            photos={mediaFileList}
            files={otherFileList}
            activeTab={activeTab}
            isDelete={isDelete}
            fileSelected={fileSelected}
            setFileSelected={setFileSelected}
            setImageView={setImageView}
            setVisible={setVisible}
          />
        ) : (
          <ChatInformation
            setActiveTab={setActiveTab}
            files={otherFileList}
            photos={photos}
            setImageView={setImageView}
            setVisible={setVisible}
          />
        )}
      </div>
      <div
        className={clsx(
          'absolute h-14 w-full bottom-0 z-10 bg-white border-t border-border p-xs items-center justify-end gap-5',
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
        <button className="border border-red-700 text-red-700 text-base rounded-3xl px-5 py-2 flex items-center justify-center gap-xxs">
          <DeleteIcon />
          Xóa
        </button>
      </div>
    </div>
  );
};

export default ChatDrawerDetail;
