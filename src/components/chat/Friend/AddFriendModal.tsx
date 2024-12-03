import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import EmptySearch from '../../../assets/icons/empty-search';
import { Field, Form, Formik } from 'formik';
import _ from 'lodash';
import { useFriendService } from '../../../services/FriendService';
import { IFriendInfo } from '../../../interfaces/Friend';
import FriendList from './FriendList';

type Props = {
  openAddFriendModal: boolean;
  setOpenAddFriendModal: Dispatch<SetStateAction<boolean>>;
};

function AddFriendModal({ openAddFriendModal, setOpenAddFriendModal }: Props) {
  const { searchUser } = useFriendService();
  const [searchQuery, setSearchQuery] = useState('');
  const [friendList, setFriendList] = useState<IFriendInfo[] | []>([]);
  const [lastSubmittedQuery, setLastSubmittedQuery] = useState<string | null>(
    null
  );

  const closeModal = () => {
    setOpenAddFriendModal(false);
    setSearchQuery('');
    setFriendList([]);
  };

  const initialValues = {
    search: '',
  };

  const handleSearchSubmit = useCallback(
    async (query: string, setSubmitting: (isSubmitting: boolean) => void) => {
      if (query === lastSubmittedQuery) {
        console.warn('Query đã được submit trước đó, không cần submit lại!');
        return;
      }

      setSubmitting(true);
      try {
        const response = await searchUser(query);
        if (response.data) {
          setFriendList(response.data);
          setLastSubmittedQuery(query); // Cập nhật query đã submit
        }
      } catch (error) {
        console.error('Error during search:', error);
      } finally {
        setSubmitting(false);
      }
    },
    [lastSubmittedQuery, searchUser, setFriendList, setLastSubmittedQuery]
  );

  useEffect(() => {
    const delayDebounceFn = _.debounce(() => {
      if (searchQuery !== lastSubmittedQuery) {
        handleSearchSubmit(searchQuery, () => {});
      }
    }, 300);

    delayDebounceFn();
    return () => delayDebounceFn.cancel();
  }, [searchQuery, lastSubmittedQuery, handleSearchSubmit]);

  if (!openAddFriendModal) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center w-full h-full bg-black bg-opacity-50"
      aria-hidden="true"
      onClick={closeModal}
    >
      <div
        className="relative w-[400px] h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal content */}
        <div className="relative flex flex-col bg-white rounded-[10px] w-full h-full">
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 px-[20px] pt-[20px] rounded-t">
            <h3 className="text-[16px] font-semibold text-title">
              Thêm bạn bè
            </h3>
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
            onSubmit={(values, { setSubmitting }) => {
              handleSearchSubmit(values.search, setSubmitting);
            }}
          >
            {({ values, handleChange }) => {
              return (
                <Form className="h-[calc(100%-70px)] flex flex-col">
                  <div className="w-full px-5">
                    <div className="relative">
                      <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-500 dark:text-gray-400"
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
                      <Field
                        type="text"
                        name="search"
                        autoFocus={true}
                        className="block w-full h-[20px] ps-8 text-sm text-lightText border-none ring-0 rounded-lg focus:border-none focus:ring-0 bg-white"
                        placeholder="Nhập MSNV hoặc tên nhân viên"
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleChange(e);
                          setSearchQuery(e.target.value);
                        }}
                      />
                    </div>
                  </div>{' '}
                  <hr className="mt-3 text-border" />
                  {!_.isEmpty(searchQuery) && friendList.length !== 0 && (
                    <p className="px-md py-sm">{friendList.length} kết quả</p>
                  )}
                  <div className="w-full flex-1 overflow-y-auto px-md">
                    {_.isEmpty(searchQuery) ? (
                      <div className="w-full mt-[50px] flex justify-center">
                        <EmptySearch size="120" />
                      </div>
                    ) : (
                      <div className="">
                        {friendList && <FriendList friendList={friendList} />}
                      </div>
                    )}
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

export default AddFriendModal;
