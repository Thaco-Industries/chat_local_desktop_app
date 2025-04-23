import { Form, Formik, Field } from 'formik';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import FriendList from '../RoomList/FriendList';
import { IFriendInfo } from '../../../interfaces/Friend';
import { Spinner, Modal } from 'flowbite-react';
import clsx from 'clsx';
import { useRoomService } from '../../../services/RoomService';
import { useFriendService } from '../../../services/FriendService';
import UserAvatar from '../../common/UserAvatar';

type Props = {
  roomId: string;
  openAddMemberModal: boolean;
  setOpenAddMemberModal: Dispatch<SetStateAction<boolean>>;
};

function AddNewMemberModal({
  roomId,
  openAddMemberModal,
  setOpenAddMemberModal,
}: Props) {
  const { addMemberToRoom } = useRoomService();
  const { getListFriendCanAddToRoom } = useFriendService();
  const [searchQuery, setSearchQuery] = useState('');
  const [friendList, setFriendList] = useState<IFriendInfo[]>([]);
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<IFriendInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingFriendList, setIsFetchingFriendList] =
    useState<boolean>(false);

  const fetchFriendList = useCallback(async () => {
    setIsFetchingFriendList(true);
    try {
      const { data } = await getListFriendCanAddToRoom(roomId, searchQuery);
      setFriendList(data || []);
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setIsFetchingFriendList(false);
    }
  }, [roomId, searchQuery]);

  useEffect(() => {
    fetchFriendList();
  }, [fetchFriendList]);

  const toggleFriendSelection = (id: string) => {
    setSelectedFriendIds((prev) =>
      prev.includes(id)
        ? prev.filter((friendId) => friendId !== id)
        : [...prev, id]
    );
    setSelectedFriends((prevSelected) => {
      const isSelected = prevSelected.some((friend) => friend.id === id);
      if (isSelected) {
        return prevSelected.filter((friend) => friend.id !== id);
      } else {
        const friendToAdd = friendList.find((friend) => friend.id === id);
        return friendToAdd ? [...prevSelected, friendToAdd] : prevSelected;
      }
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const payload = { roomId, memberIds: selectedFriendIds };
      const response = await addMemberToRoom(payload);
      if (response.status === 201) setOpenAddMemberModal(false);
    } catch (error) {
      console.error('Failed to add members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      show={openAddMemberModal}
      onClose={() => setOpenAddMemberModal(false)}
      theme={{
        root: {
          base: 'z-[100] min-h-[80vh]',
        },
        content: {
          base: 'w-[450px] min-h-[80vh]',
          inner:
            'relative flex flex-col rounded-lg bg-white shadow dark:bg-gray-700 h-[80vh]',
        },
      }}
      position="center"
      dismissible
    >
      <Modal.Header className="!border-b-0">Thêm thành viên</Modal.Header>
      <Modal.Body className="p-0">
        <Formik initialValues={{ search: '' }} onSubmit={handleSubmit}>
          {({}) => (
            <Form className="flex flex-col gap-4">
              {/* Tìm kiếm bạn bè */}
              <div className="relative border-b border-b-border">
                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3">
                  <svg
                    className="w-5 h-5 text-gray-500"
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
                <Field
                  type="text"
                  name="search"
                  autoFocus
                  placeholder="Nhập MSNV hoặc tên nhân viên"
                  className="w-full pl-10 pr-4 py-2 border-none focus:ring-0 focus:outline-none"
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(e.target.value)
                  }
                />
              </div>
              <div className="px-lg">
                <p>Đã chọn: {selectedFriendIds.length}</p>
                <div className="flex overflow-x-auto gap-sm">
                  {selectedFriends.length > 0 &&
                    selectedFriends.map((friend) => (
                      <div className="relative">
                        <UserAvatar
                          key={friend.id}
                          fullName={friend.full_name}
                          senderId={friend.id}
                          url={friend.avt_url}
                        />
                        <div
                          className="absolute top-[1px] right-[1px] cursor-pointer"
                          onClick={() => toggleFriendSelection(friend.id)}
                        >
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="6"
                              cy="6"
                              r="5.7"
                              fill="#EFEFEF"
                              stroke="#ADADAD"
                              stroke-width="0.6"
                            />
                            <path
                              d="M4.5304 7.62159L4.53028 7.62147L4.52322 7.62903C4.51263 7.64037 4.48809 7.65385 4.45309 7.65385C4.42458 7.65385 4.39846 7.64426 4.37578 7.62159C4.33464 7.58046 4.33464 7.50846 4.37578 7.46732L7.46642 4.37777C7.50762 4.33658 7.57983 4.33658 7.62104 4.37777C7.66219 4.4189 7.66219 4.49091 7.62104 4.53204L4.5304 7.62159Z"
                              fill="#C6C6C6"
                              stroke="#ADADAD"
                              stroke-width="0.6"
                            />
                            <path
                              d="M7.54373 7.65385C7.51522 7.65385 7.48909 7.64426 7.46642 7.62159L4.37578 4.53204C4.33464 4.49091 4.33464 4.4189 4.37578 4.37777C4.41699 4.33658 4.4892 4.33658 4.5304 4.37777L7.62104 7.46732C7.66219 7.50846 7.66219 7.58046 7.62104 7.62159C7.59836 7.64426 7.57224 7.65385 7.54373 7.65385Z"
                              fill="#C6C6C6"
                              stroke="#ADADAD"
                              stroke-width="0.6"
                            />
                          </svg>
                        </div>
                      </div>
                    ))}
                </div>
                <h2 className="text-lg font-semibold">Danh sách bạn bè</h2>
                <FriendList
                  friendList={friendList}
                  selectedFriends={selectedFriendIds}
                  toggleFriendSelection={toggleFriendSelection}
                  isLoading={isFetchingFriendList}
                />
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
      <Modal.Footer className="justify-end !border-t-0">
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setOpenAddMemberModal(false)}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            className={clsx('px-4 py-2 bg-primary text-white rounded-lg', {
              'opacity-100': selectedFriendIds.length >= 1,
              'opacity-50 cursor-not-allowed': selectedFriendIds.length < 1,
            })}
            disabled={selectedFriendIds.length < 1 || isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? <Spinner /> : 'Xác nhận'}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default AddNewMemberModal;
