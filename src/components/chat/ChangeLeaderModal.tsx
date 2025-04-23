// Import các component và hook cần thiết từ các thư viện
import { Modal, Spinner } from 'flowbite-react';
import { Field, Form, Formik } from 'formik';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useRoomService } from '../../services/RoomService';
import FriendList from './RoomList/FriendList';
import { IFriendInfo } from '../../interfaces/Friend';
import clsx from 'clsx';

// Định nghĩa kiểu cho các props của component
type Props = {
  roomId: string;
  openChangeLeaderModal: boolean;
  setOpenChangeLeaderModal: Dispatch<SetStateAction<boolean>>;
  setOpenConfirmModal: Dispatch<SetStateAction<boolean>>;
};

// Định nghĩa component ChangeLeaderModal
function ChangeLeaderModal({
  roomId,
  openChangeLeaderModal,
  setOpenChangeLeaderModal,
  setOpenConfirmModal,
}: Props) {
  // Lấy các hàm từ dịch vụ phòng
  const { changeRoomLeader, listCanGiveLeader } = useRoomService();
  // Định nghĩa các biến trạng thái
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingFriendList, setIsFetchingFriendList] =
    useState<boolean>(false);
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [friendList, setFriendList] = useState<IFriendInfo[]>([]);

  // Hàm lấy danh sách bạn bè có thể được chọn làm trưởng nhóm
  const fetchFriendList = useCallback(async () => {
    setIsFetchingFriendList(true);
    try {
      const { data } = await listCanGiveLeader(roomId, searchQuery);
      setFriendList(data || []);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách bạn bè:', error);
    } finally {
      setIsFetchingFriendList(false);
    }
  }, [roomId, searchQuery]);

  // Lấy danh sách bạn bè khi component được mount hoặc khi searchQuery thay đổi
  useEffect(() => {
    fetchFriendList();
  }, [fetchFriendList]);

  /**
   * Xử lý việc gửi yêu cầu thay đổi trưởng nhóm.
   *
   * Hàm này thực hiện các bước sau:
   * 1. Đặt trạng thái loading thành true.
   * 2. Cố gắng thay đổi trưởng nhóm bằng cách sử dụng thành viên đã chọn.
   * 3. Đóng modal thay đổi trưởng nhóm nếu thành công.
   * 4. Xử lý bất kỳ lỗi nào xảy ra trong quá trình thực hiện.
   * 5. Đặt lại trạng thái loading và mở modal xác nhận.
   *
   * @async
   * @returns {Promise<void>} Một promise được giải quyết khi quá trình gửi hoàn tất.
   * @throws {Error} Nếu có lỗi khi thay đổi trưởng nhóm.
   */
  const handleSubmit = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Tạo payload với roomId và id của thành viên được chọn
      const payload = { roomId, memberId: selectedFriends[0] };
      // Gọi API để thay đổi trưởng nhóm
      const response = await changeRoomLeader(payload);
      // Nếu thành công, đóng modal thay đổi trưởng nhóm
      if (response.statusTEXT === 'OK') setOpenChangeLeaderModal(false);
    } catch (error) {
      // Ghi log lỗi nếu có
      console.error('Thay đổi trưởng nhóm thất bại:', error);
    } finally {
      // Đặt lại trạng thái loading
      setIsLoading(false);
      // Đóng modal thay đổi trưởng nhóm
      setOpenChangeLeaderModal(false);
      // Mở modal xác nhận
      setOpenConfirmModal(true);
    }
  };

  // Hàm để thay đổi lựa chọn bạn bè
  const toggleFriendSelection = (id: string) => {
    setSelectedFriends([id]); // Chỉ cho phép một lựa chọn
  };

  return (
    <Modal
      dismissible
      show={openChangeLeaderModal}
      onClose={() => setOpenChangeLeaderModal(false)}
      theme={{
        content: {
          base: 'w-[80vw] md:w-[50vw] lg:w-[30vw] h-[80vh] transition-[width] duration-100',
        },
      }}
      position="center"
    >
      <Modal.Header className="!border-b-0">
        Chọn trưởng nhóm mới trước khi rời
      </Modal.Header>
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
                  mode="single"
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
            onClick={() => setOpenChangeLeaderModal(false)}
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

export default ChangeLeaderModal;
