import React, { useEffect, useRef, useState } from 'react';
import { Formik, Form } from 'formik';
import GalleryIcon from '../../assets/icons/gallery';
import PaperClipIcon from '../../assets/icons/paper-clip';
import SendIcon from '../../assets/icons/send';
import SmileIcon from '../../assets/icons/smile';
import clsx from 'clsx';
import { ReplyMessageIcon } from '../../assets/icons/reply-icon';
import CloseIcon from '../../assets/icons/close-icon';
import { useChatContext } from '../../context/ChatContext';
import moment from 'moment';
import { FileHandle } from '../../util/downloadFile';
import EmojiPickerPopover from './EmojiPickerPopover';
import PlayButton from '../chat/Message/components/PlayButton';
import { notify } from '../../helper/notify';
import { v4 as uuidv4 } from 'uuid';
import { IMessage, IRoom } from '../../interfaces';
import { useFriendService } from '../../services/FriendService';
import { getAuthCookie } from '../../actions/auth.action';
import { useMessageContext } from '../../context/MessageContext';

interface ChatInputProps {
  onSendMessage: (
    message: string,
    reply_message_id?: string,
    files?: File[]
  ) => void;
  roomId: string;
  roomInfo: IRoom;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  roomId,
  roomInfo,
}) => {
  const { configSystemValue } = useMessageContext();
  const { searchUserById } = useFriendService();
  const [text, setText] = useState<string>('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [disabled, setDisabled] = useState(false);
  const userAuth = getAuthCookie();
  // useEffect(() => {
  //   if (roomInfo.is_group || !roomInfo) return;
  //   async function handleGetUserInfor() {
  //     const response = await searchUserById(roomInfo.userRoom[0].user_id);
  //     if (response.data) {
  //       // setFriendStatus(response.data.status);
  //       roomInfo.userRoom[0] = {
  //         ...roomInfo.userRoom[0],
  //         friendStatus: response.data.status,
  //       };
  //     }
  //   }

  //   handleGetUserInfor();
  // }, [roomId]);

  const [formHeight, setFormHeight] = useState<number>(40);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const {
    messageReply,
    setMessageReply,
    isReplyMessage,
    setIsReplyMessage,
    textareaRef,
    setMessages,
  } = useChatContext();

  const {
    uploadFileInChunks,
    checkFileBeforeUpload,
    compressThumbnail,
    createThumbnail,
  } = FileHandle();

  useEffect(() => {
    if (roomInfo.userRoom[0]?.friendStatus || roomInfo.is_group) {
      // Mặc định là disable
      setDisabled(false);

      // Xử lý trạng thái disable
      if (
        roomInfo.is_group === false &&
        roomInfo.userRoom[0]?.friendStatus !== 'FRIEND'
      ) {
        setDisabled(true);
      }
    }
  }, [roomId, roomInfo.is_group, roomInfo.userRoom[0]?.friendStatus]);

  useEffect(() => {
    setText('');
    let timer: NodeJS.Timeout;
    if (!disabled) {
      timer = setTimeout(() => {
        textareaRef.current?.focus();
      }, 200); // Thêm một độ trễ nhỏ
    }

    return () => clearTimeout(timer);
  }, [disabled, roomId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    adjustTextareaHeight(e.target.value);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files || files.length === 0) return;

    const validExtensions = configSystemValue.value?.end_file || [];
    const validFiles: File[] = [];
    const invalidFiles: File[] = [];
    for (const file of files) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (!fileExtension || !validExtensions.includes(fileExtension)) {
        // Hiển thị thông báo lỗi
        notify('Loại tệp không được hỗ trợ. Vui lòng chọn lại tệp', 'error');
        invalidFiles.push(file);
        continue;
      }

      let fileSize = file.size / 1024 / 1024;
      try {
        const response = await checkFileBeforeUpload(fileSize);
        if (response.status === 201) {
          validFiles.push(file);
        }
      } catch (error: any) {
        // Lấy thông tin lỗi chi tiết
        const errorMessage = error?.response?.data?.message || error.message;
        // console.error('Error message:', errorMessage);
        notify(errorMessage, 'error');
      }
    }
    e.target.value = ''; // Reset input sau khi tải lên
    if (validFiles.length > 0) {
      try {
        // Upload tất cả các file cùng một lúc
        await Promise.all(validFiles.map((file) => handleUploadFile(file)));
      } catch (error) {
        console.error('Failed to upload files', error);
        notify('Đã xảy ra lỗi khi upload file.', 'error');
      }
    }
  };

  const handlePaste = async (event: React.ClipboardEvent) => {
    // Lấy dữ liệu từ clipboard
    const items = event.clipboardData.items;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // Kiểm tra nếu dữ liệu là hình ảnh
      if (item.type.startsWith('image')) {
        const file = item.getAsFile();

        if (file) {
          //gọi hàm gửi hình ảnh
          await handleUploadFile(file);
        }
      }
    }
  };

  const handleUploadFile = async (file: File) => {
    const tempMessageId = uuidv4();

    try {
      const tempMessage: IMessage = {
        id: tempMessageId,
        room_id: roomId,
        created_at: new Date().toISOString(),
        sender_id: userAuth?.user.id || '',
        message_type: 'FILE',
        reply_id: null,
        file_id: {
          id_file: tempMessageId,
          file_name: file.name,
          file_size: `${file.size}`,
          uploaded_by: userAuth?.user.id || '',
          thumbnail_url_display: '', // Chưa có thumbnail
          system_deleted: false,
          file_type: getFileType(file),
          created_at: new Date().toISOString(),
          room_id: roomId,
          url_display: '',
          id: tempMessageId,
        },
        seen_by: [],
        deleted_by: [],
        status: 'DELIVERED',
        reactions: [],
        message_display: 'Đang xử lý...',
        progress: 0,
      };

      setMessages((prevMessages) => [tempMessage, ...prevMessages]);

      if (file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === tempMessageId
              ? {
                  ...msg,
                  file_id: {
                    ...msg.file_id!,
                    thumbnail_url_display: imageUrl,
                  },
                }
              : msg
          )
        );
      }

      if (file.type.startsWith('video/')) {
        const thumbnailBase64 = await createThumbnail(file, 1.0); // Seek tại giây 1
        const compressedThumbnail = await compressThumbnail(thumbnailBase64);

        // Cập nhật thumbnail vào tin nhắn
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === tempMessageId
              ? {
                  ...msg,
                  file_id: {
                    ...msg.file_id!,
                    thumbnail_url_display: compressedThumbnail,
                  },
                }
              : msg
          )
        );
      }

      const onProgress = (progress: number) => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === tempMessageId
              ? {
                  ...msg,
                  progress,
                  message_display: `Đang tải lên... ${progress}%`,
                }
              : msg
          )
        );
      };

      await uploadFileInChunks(file, {
        fileId: uuidv4(),
        replyId: messageReply?.id || '',
        roomId: roomId,
        onProgress: onProgress,
        clearTempMessage: () => {
          setMessages((prevMessage) =>
            prevMessage.filter((msg) => msg.id !== tempMessageId)
          );
        },
      }); // Gọi hàm upload từng file
    } catch (error) {
      console.error(`Failed to upload file ${file.name}`, error);
    }
  };

  const adjustTextareaHeight = (message: string) => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.max(textareaRef.current.scrollHeight, 40);

      textareaRef.current.style.height = `${newHeight}px`;
      textareaRef.current.style.overflowY =
        newHeight > 130 ? 'scroll' : 'hidden';
      setFormHeight(newHeight);
    }

    if (!message.trim() && textareaRef.current) {
      textareaRef.current.style.height = `40px`;
      textareaRef.current.style.overflowY = 'hidden';
      setFormHeight(40);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    submitForm: () => void
  ) => {
    if (e.key === 'Enter') {
      if (!e.shiftKey && !e.altKey) {
        e.preventDefault();
        if (text.trim()) {
          submitForm();
        }
      }
    }
  };

  const getFileType = (file: File): 'IMAGE' | 'FILE' | 'VIDEO' => {
    const mimeType = file.type;
    if (mimeType.startsWith('image/')) return 'IMAGE';
    if (mimeType.startsWith('video/')) return 'VIDEO';
    return 'FILE';
  };

  const handleCancelReply = () => {
    setIsReplyMessage(false);
    setMessageReply(null);
  };

  const getDateLabel = (created_at: string) => {
    const messageDate = moment(created_at, 'YYYY-MM-DD HH:mm');
    const today = moment();

    if (messageDate.isSame(today, 'day')) return 'Hôm nay';
    return messageDate.format('DD/MM/YYYY');
  };

  const { file_name, url_display, thumbnail_url_display } =
    messageReply?.file_id || {};

  const fileExtension = file_name?.split('.').pop()?.toLocaleLowerCase() || '';
  const isVideo = ['mp4', 'mov', 'avi', 'mkv'].includes(fileExtension);
  const isImage = ['png', 'jpg', 'jpeg', 'gif', 'svf'].includes(fileExtension);

  const renderReplyMedia = () => {
    if (isImage && url_display) {
      return (
        <img
          src={`${process.env.REACT_APP_FILE_URL}${url_display}`}
          alt="reply"
          className="w-[120px] h-[120px] object-cover"
        />
      );
    }

    if (isVideo && thumbnail_url_display) {
      return (
        <div className="relative w-[120px] h-[120px]">
          <img
            className="w-full h-full object-cover"
            src={`${process.env.REACT_APP_API_URL}/media/view/${thumbnail_url_display}`}
            alt="reply video"
          />
          <PlayButton />
        </div>
      );
    }

    return (
      <p className="text-[#252525] text-base truncate">
        {messageReply?.message_display}
      </p>
    );
  };

  return (
    <Formik
      initialValues={{ message: '' }}
      onSubmit={(_, { resetForm }) => {
        if (text.trim()) {
          onSendMessage(text.trim(), messageReply?.id);
          resetForm();
          setText('');
          adjustTextareaHeight('');
          textareaRef.current?.focus();
        }
      }}
    >
      {({ submitForm }) => (
        <div className="join join-vertical mb-5 mx-lg drop-shadow-md gap-[1px]">
          {isReplyMessage && messageReply && (
            <div
              className={clsx(
                'join-item px-6 py-5 grid grid-cols-[40px_1fr_auto] bg-white items-start border-b border-b-border'
              )}
            >
              <div>
                <ReplyMessageIcon />
              </div>
              <div className="min-w-0">
                {renderReplyMedia()}
                <p className="text-sm text-lightText truncate">
                  {messageReply.sender?.infor.full_name},
                  {` ${moment(messageReply.created_at).format(
                    'HH:mm'
                  )} ${getDateLabel(messageReply.created_at)}`}
                </p>
              </div>
              <div
                className="cursor-pointer"
                title="Đóng"
                onClick={handleCancelReply}
              >
                <CloseIcon />
              </div>
            </div>
          )}
          <Form
            className={clsx(
              'min-h-[50px] max-h-[150px] input flex items-center focus:outline-none focus-within:outline-none rounded-[30px] border-none join-item',
              { 'transition-[height 0.2s ease-in-out]': true },
              !disabled ? 'bg-white' : 'bg-[#F1F1F1]'
            )}
            style={{ height: `${formHeight}px` }}
          >
            <label className="sr-only">Nhập tin nhắn</label>

            <div className={clsx('flex items-center', { hidden: !!text })}>
              <button
                type="button"
                className="inline-flex justify-center p-2 text-gray-500  cursor-pointer"
                title="Gửi hình ảnh"
                onClick={() => document.getElementById('imageUpload')?.click()}
                disabled={disabled}
              >
                <GalleryIcon />

                <span className="sr-only">Upload image</span>
              </button>
              <input
                type="file"
                id="imageUpload"
                multiple
                className="hidden"
                accept=".jpg, .jpeg, .png, .gif, .webp, .jxl"
                onChange={handleFileChange}
                title="gửi ảnh"
                disabled={disabled}
              />
              <button
                type="button"
                title="Đính kèm file"
                onClick={() => document.getElementById('fileUpload')?.click()}
                className="p-2 text-gray-500 cursor-pointer"
                disabled={disabled}
              >
                <PaperClipIcon />
                <span className="sr-only">Add emoji</span>
              </button>
              <input
                type="file"
                id="fileUpload"
                multiple
                className="hidden"
                accept="*"
                onChange={handleFileChange}
                title="gửi file"
                disabled={disabled}
              />
            </div>
            <textarea
              rows={1}
              autoFocus={true}
              onPaste={handlePaste}
              onChange={handleInputChange}
              onKeyDown={(e) => handleKeyDown(e, submitForm)}
              ref={textareaRef}
              value={text}
              className={clsx(
                'block resize-none p-2.5 w-full text-[#252525]  border-0 focus:ring-0 max-h-[130px] scrollbar rounded-s-[10px]',
                !disabled ? 'bg-white' : 'bg-[#F1F1F1]'
              )}
              placeholder="Nhập tin nhắn"
              disabled={disabled}
            />
            <div className="flex items-center">
              <button
                type="button"
                title="Biểu cảm"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                disabled={disabled}
              >
                <SmileIcon />
              </button>
              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  role="tooltip"
                  className="absolute bottom-full right-0"
                >
                  <EmojiPickerPopover setText={setText} />{' '}
                </div>
              )}
            </div>
            <button
              type="submit"
              title="Gửi"
              className="inline-flex justify-center p-2 text-blue-600  cursor-pointer ml-xs"
              disabled={disabled}
            >
              <SendIcon />
              <span className="sr-only">Send message</span>
            </button>
            {/* </div> */}
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default ChatInput;
