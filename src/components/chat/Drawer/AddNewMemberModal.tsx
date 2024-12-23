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
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
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
    setSelectedFriends((prev) =>
      prev.includes(id)
        ? prev.filter((friendId) => friendId !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const payload = { roomId, memberIds: selectedFriends };
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
                <h2 className="text-lg font-semibold">Danh sách bạn bè</h2>
                <FriendList
                  friendList={friendList}
                  selectedFriends={selectedFriends}
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
              'opacity-100': selectedFriends.length >= 1,
              'opacity-50 cursor-not-allowed': selectedFriends.length < 1,
            })}
            disabled={selectedFriends.length < 1 || isLoading}
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
