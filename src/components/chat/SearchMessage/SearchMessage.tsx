import React, { useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { notify } from '../../../helper/notify'; // Hàm thông báo lỗi của bạn
import SearchIcon from '../../../assets/icons/search';
import EmptySearch from '../../../assets/icons/empty-search';
import _ from 'lodash';
import { useMessageService } from '../../../services/MessageService';
import { useChatContext } from '../../../context/ChatContext';
import { IMessage } from '../../../interfaces';
import UserAvatar from '../../common/UserAvatar';
import moment from 'moment';
import { useMessageContext } from '../../../context/MessageContext';
import unidecode from 'unidecode';
import clsx from 'clsx';

type Props = {
  roomId: string;
};

const SearchForm: React.FC<Props> = ({ roomId }) => {
  const {
    listMember,
    setMessages,
    setLastMessageId,
    setNewerMessageId,
    messageListRef,
    setHasMoreMessages,
    setIsSearching,
  } = useChatContext();
  const { setIsSearchMessage } = useMessageContext();
  const { getMessageSearch, getRedirectMessage } = useMessageService();
  const inputRef = useRef<HTMLInputElement>(null);
  const [messageList, setMessageList] = useState<IMessage[]>([]);
  const [numberOfResult, setNumberOfResult] = useState<number>(0);
  const [selectedMessageId, setSelectedMessageId] = useState<string>('');

  const formik = useFormik({
    initialValues: {
      keyword: '',
    },
    validationSchema: Yup.object({
      keyword: Yup.string().max(50, 'Vui lòng nhập ít hơn 50 ký tự!'),
    }),
    onSubmit: async (values) => {
      const response = await getMessageSearch(roomId, values.keyword);
      if (response.data) {
        setNumberOfResult(response.data.count);
        let updatedMessageList = response.data.data;
        updatedMessageList = updatedMessageList.map((msg: IMessage) => {
          const senderInfo = listMember?.[msg.sender_id];

          return {
            ...msg,
            sender: senderInfo,
          };
        });
        setMessageList(updatedMessageList);
      }
    },
    validateOnBlur: true,
    validateOnChange: true, // Kiểm tra khi người dùng nhập
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Cập nhật giá trị formik
    formik.setFieldValue('keyword', value);

    // Hiển thị thông báo nếu đạt giới hạn ký tự
    if (value.length === 50) {
      notify('Vui lòng nhập ít hơn 50 ký tự!', 'error');
    }

    // Submit form sau khi thay đổi giá trị
    formik.handleSubmit();
  };

  const getDateLabel = (created_at: string) => {
    const messageDate = moment(created_at, 'YYYY-MM-DD HH:mm');
    const today = moment();

    return messageDate.isSame(today, 'day')
      ? moment(created_at).format('HH:mm')
      : messageDate.format('DD/MM/YYYY');
  };

  const handleRedirect = async (messageId: string) => {
    // debugger;
    setSelectedMessageId(messageId);
    const response = await getRedirectMessage(roomId, 15, true, messageId);
    if (response.data) {
      const newMessages = response.data.map((msg: IMessage) => ({
        ...msg,
        sender: listMember?.[msg.sender_id],
      }));

      setMessages(newMessages);
      setHasMoreMessages(true);
      setLastMessageId(response.data[response.data.length - 1].id);
      setNewerMessageId(response.data[0].id);
      setIsSearching(true);
      if (messageListRef.current) {
        const messageListElement = messageListRef.current;
        const previousScrollHeight = messageListElement.scrollHeight;
        setTimeout(() => {
          messageListElement.scrollTop = -(previousScrollHeight / 2);
        }, 0); // Đợi DOM cập nhật xong trước khi thay đổi cuộn
      }
    }
  };

  const highlightKeyword = (text: string, keyword: string) => {
    if (!keyword.trim()) return text; // Không làm gì nếu từ khóa rỗng

    // Bình thường hóa từ khóa và văn bản
    const normalizedKeyword = unidecode(
      keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape ký tự đặc biệt
    );
    const normalizedText = unidecode(text);

    // Tìm vị trí khớp đầu tiên
    const regex = new RegExp(`(${normalizedKeyword})`, 'i'); // Chỉ tìm lần đầu (không phân biệt hoa thường)
    const match = normalizedText.match(regex);

    if (!match) return text; // Không tìm thấy từ khóa

    const startIndex = match.index!; // Vị trí bắt đầu từ khóa
    const endIndex = startIndex + match[0].length;

    // Chia văn bản thành 3 phần: trước, từ khóa, và sau
    const beforeMatch = text.slice(0, startIndex);
    const matchText = text.slice(startIndex, endIndex);
    const afterMatch = text.slice(endIndex);

    // Tạo văn bản với highlight
    return `${beforeMatch}<span style="color: #076EB8; font-weight: bold;">${matchText}</span>${afterMatch}`;
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        formik.handleSubmit();
      }}
      className="w-full flex flex-col items-center"
    >
      <div className="relative w-full p-5">
        {/* Search Icon */}
        <div className="absolute inset-y-0 start-0 flex items-center ps-8 pointer-events-none">
          <SearchIcon />
        </div>

        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          name="keyword"
          autoFocus
          maxLength={50}
          className="bg-lightGrey border border-gray-300 text-navyGrey text-sm rounded-[22px] block w-full ps-10 p-2.5 pe-lg focus:ring-0 focus:border-gray-300"
          placeholder="Tìm kiếm trong cuộc hội thoại"
          value={formik.values.keyword}
          onChange={handleInputChange}
        />

        {/* Clear Button */}
        {formik.values.keyword && (
          <div className="absolute end-[26px] bottom-[26px] text-sm pe-1 py-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="cursor-pointer"
              onClick={() => {
                formik.setFieldValue('keyword', '');
                inputRef.current?.focus();
              }}
              width="12"
              height="12"
              fill="none"
            >
              <path
                d="M6.58586 5.82143L11.2734 0.233929C11.3519 0.141072 11.2859 0 11.1644 0H9.73943C9.6555 0 9.57514 0.0374999 9.51979 0.101786L5.65372 4.71071L1.78764 0.101786C1.73407 0.0374999 1.65371 0 1.568 0H0.143C0.0215717 0 -0.0444998 0.141072 0.0340716 0.233929L4.72157 5.82143L0.0340716 11.4089C0.0164709 11.4296 0.00517935 11.4549 0.00153715 11.4819C-0.00210506 11.5088 0.00205506 11.5362 0.013524 11.5608C0.024993 11.5855 0.043289 11.6063 0.0662396 11.6208C0.0891901 11.6354 0.115831 11.643 0.143 11.6429H1.568C1.65193 11.6429 1.73229 11.6054 1.78764 11.5411L5.65372 6.93214L9.51979 11.5411C9.57336 11.6054 9.65372 11.6429 9.73943 11.6429H11.1644C11.2859 11.6429 11.3519 11.5018 11.2734 11.4089L6.58586 5.82143Z"
                fill="#485259"
              />
            </svg>
          </div>
        )}
      </div>
      {!_.isEmpty(formik.values.keyword) && (
        <div className="w-full px-md py-xs bg-[#A1A1A133] flex justify-between items-center">
          <p className="text-textBody">{numberOfResult} kết quả</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="cursor-pointer"
            onClick={() => {
              setIsSearchMessage(false);
            }}
            width="12"
            height="12"
            fill="none"
          >
            <path
              d="M6.58586 5.82143L11.2734 0.233929C11.3519 0.141072 11.2859 0 11.1644 0H9.73943C9.6555 0 9.57514 0.0374999 9.51979 0.101786L5.65372 4.71071L1.78764 0.101786C1.73407 0.0374999 1.65371 0 1.568 0H0.143C0.0215717 0 -0.0444998 0.141072 0.0340716 0.233929L4.72157 5.82143L0.0340716 11.4089C0.0164709 11.4296 0.00517935 11.4549 0.00153715 11.4819C-0.00210506 11.5088 0.00205506 11.5362 0.013524 11.5608C0.024993 11.5855 0.043289 11.6063 0.0662396 11.6208C0.0891901 11.6354 0.115831 11.643 0.143 11.6429H1.568C1.65193 11.6429 1.73229 11.6054 1.78764 11.5411L5.65372 6.93214L9.51979 11.5411C9.57336 11.6054 9.65372 11.6429 9.73943 11.6429H11.1644C11.2859 11.6429 11.3519 11.5018 11.2734 11.4089L6.58586 5.82143Z"
              fill="#485259"
            />
          </svg>
        </div>
      )}
      <div className="w-full h-[calc(100vh-120px)] overflow-y-auto scrollbar">
        {_.isEmpty(formik.values.keyword) ? (
          <div className="w-full mt-[50px] flex justify-center">
            <EmptySearch size="150" />
          </div>
        ) : (
          messageList.map((message: IMessage) => (
            <div
              className={clsx('flex gap-4 px-5 py-3 cursor-pointer', {
                'bg-[#91CFFB33]': message.id === selectedMessageId,
              })}
              key={message.id}
              onClick={() => handleRedirect(message.id)}
            >
              <UserAvatar
                fullName={message.sender?.infor.full_name}
                senderId={message.sender_id}
                url={message.sender?.infor.avt_url}
              />
              <div className="min-w-0 flex-1 max-w-full">
                <div className="flex justify-between mb-1 gap-3">
                  <div className="text-base text-title truncate w-full">
                    {message.sender?.infor.full_name}
                  </div>
                  <div className="text-sm text-lightText">
                    {getDateLabel(message.created_at)}
                  </div>
                </div>
                <div className="flex gap-3 flex-shrink-0 flex-grow-0">
                  <span
                    className="truncate w-full text-sm text-lightText"
                    dangerouslySetInnerHTML={{
                      __html: highlightKeyword(
                        message.message_display,
                        formik.values.keyword
                      ),
                    }}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </form>
  );
};

export default SearchForm;
