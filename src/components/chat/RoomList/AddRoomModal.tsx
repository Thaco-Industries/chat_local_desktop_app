import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useFriendService } from '../../../services/FriendService';
import { IFriendInfo } from '../../../interfaces/Friend';
import * as Yup from 'yup';
import FriendList from './FriendList';
import { notify } from '../../../helper/notify';
import { Spinner } from 'flowbite-react';
import clsx from 'clsx';
import { CameraIcon } from '../../../assets/icons/camera';
import { useRoomService } from '../../../services/RoomService';

type Props = {
  openAddRoomModal: boolean;
  setOpenAddRoomModal: Dispatch<SetStateAction<boolean>>;
};

function AddRoomModal({ openAddRoomModal, setOpenAddRoomModal }: Props) {
  const { getListFriend } = useFriendService();
  const { uploadRoomImage, createNewRoom } = useRoomService();
  const [friendList, setFriendList] = useState<IFriendInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [imagePath, setImagePath] = useState<string>('');
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [isFetchingFriendList, setIsFetchingFriendList] =
    useState<boolean>(false);

  useEffect(() => {
    getFriendList(searchQuery);
  }, [searchQuery]);

  const getFriendList = async (query: string) => {
    setIsFetchingFriendList(true);
    try {
      const response = await getListFriend(query);

      if (response.data) {
        setFriendList(response.data);
      }
    } catch (error) {
      console.error('Error during search:', error);
    } finally {
      setIsFetchingFriendList(false);
    }
  };

  const closeModal = () => {
    setOpenAddRoomModal(false);
  };

  const initialValues = {
    groupName: '',
  };

  const validationSchema = Yup.object({
    groupName: Yup.string()
      .required('Tên nhóm không được để trống')
      .max(50, 'Tên nhóm không quá 50 ký tự'),
  });

  const handleSubmit = async (values: { groupName: string }, actions: any) => {
    if (selectedFriends.length < 2) {
      notify(
        'Vui lòng chọn ít nhất 2 thành viên để tham gia vào nhóm',
        'warning'
      );
      actions.setSubmitting(false);
      return;
    }
    const payload = {
      roomName: values.groupName,
      members: selectedFriends,
      avatarUrl: imagePath,
    };

    try {
      const response = await createNewRoom(payload);
      if (response.status === 201) {
        setOpenAddRoomModal(false);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error.message;
      notify(`Lỗi khi tạo phòng: ${errorMessage}`, 'error');
      console.error('Error:', errorMessage);
    } finally {
      actions.setSubmitting(false); // Reset isSubmitting
    }
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Chỉ lấy tệp đầu tiên

    if (!file) {
      notify('Vui lòng chọn một ảnh để tải lên!');
      return;
    }

    try {
      const response = await uploadRoomImage(file);
      if (response.status === 201) {
        const imageUrl = `${process.env.REACT_APP_API_URL}/media/view/${response.data.path}`;
        setImagePath(imageUrl);
      }
    } catch (error: any) {
      // Lấy thông tin lỗi chi tiết
      const errorMessage = error?.response?.data?.message || error.message;
      notify(`Lỗi tải ảnh: ${errorMessage}`, 'error');
      console.error('Error:', errorMessage);
    }
  };

  const toggleFriendSelection = (id: string) => {
    setSelectedFriends((prev) =>
      prev.includes(id)
        ? prev.filter((friendId) => friendId !== id)
        : [...prev, id]
    );
  };

  if (!openAddRoomModal) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center w-full h-full bg-black bg-opacity-50"
      aria-hidden="true"
      onClick={closeModal}
    >
      <div
        className="relative w-[450px] h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal content */}
        <div className="relative flex flex-col bg-white rounded-[10px] shadow w-full h-full p-md">
          {/* Modal header */}
          <div className="flex items-center justify-between rounded-t">
            <h3 className="text-[16px] font-semibold text-title">Tạo nhóm</h3>
            <button
              type="button"
              onClick={closeModal}
              className="text-[#7B7B7BD9] bg-transparent rounded-lg text-sm w-8 h-8 ms-autoborder-border inline-flex justify-center items-center"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* Modal body */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => {
              handleSubmit(values, actions);
            }}
            validateOnChange={true}
            validateOnBlur={true}
          >
            {({ isSubmitting, errors, touched }) => {
              return (
                <Form className="h-[calc(100%-28px)] flex flex-col px-xs gap-sm">
                  <div
                    className="w-[150px] h-[150px] bg-[linear-gradient(0deg,_#A6D8F4_0%,_#DFF3FD_100%)] rounded-full self-center relative cursor-pointer"
                    onClick={() =>
                      document.getElementById('imageUpload')?.click()
                    }
                  >
                    {imagePath === '' ? (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <CameraIcon />
                      </div>
                    ) : (
                      <img
                        src={imagePath}
                        alt="group avatar"
                        className="w-full h-full object-cover rounded-full"
                      />
                    )}
                  </div>
                  <input
                    type="file"
                    id="imageUpload"
                    className="hidden"
                    accept=".jpg, .jpeg, .png, .gif, .webp, .jxl"
                    onChange={handleUploadImage}
                    title="gửi ảnh"
                  />
                  <div className="border-b-primary border-b">
                    <Field
                      type="text"
                      name="groupName"
                      autoFocus={true}
                      maxLength={51}
                      className="block w-full h-md ps-1 text-sm text-lightText border-none ring-0 rounded-lg focus:border-none focus:ring-0 bg-white p-0"
                      placeholder="Nhập tên nhóm..."
                    />
                  </div>
                  {touched.groupName && errors.groupName && (
                    <div className="text-red-500 text-sm mt">
                      {errors.groupName}
                    </div>
                  )}
                  <div className="relative bg-[#f5f5f5] h-[40px] rounded-3xl">
                    <div className="absolute inset-y-0 start-md flex items-center pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      className="block w-full h-[40px] ps-12 text-sm text-lightText border-none ring-0 rounded-lg focus:border-none focus:ring-0 bg-[#f5f5f5]"
                      placeholder="Nhập mã nhân viên, họ và tên"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <h1>Danh sách bạn bè</h1>
                  <FriendList
                    friendList={friendList}
                    selectedFriends={selectedFriends}
                    toggleFriendSelection={toggleFriendSelection}
                    isLoading={isFetchingFriendList}
                  />
                  <div className="flex gap-sm self-end">
                    <button
                      type="button"
                      className="px-md py-[6.5px] border border-[##A1A1A1] rounded-3xl text-textBody"
                      onClick={closeModal}
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="submit"
                      className={clsx(
                        'px-md py-[6.5px] bg-[#076eb8] rounded-3xl shadow border border-[#076eb8] text-white',
                        {
                          'opacity-100': selectedFriends.length >= 2,
                        },
                        {
                          'opacity-50': selectedFriends.length < 2,
                        }
                      )}
                      disabled={selectedFriends.length < 2 || isSubmitting}
                    >
                      {isSubmitting ? <Spinner /> : 'Tạo nhóm'}
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default AddRoomModal;
