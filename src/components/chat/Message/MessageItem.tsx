// MessageItem.tsx
import clsx from 'clsx';
import React, { useState } from 'react';
import { IMessage, IMessageItem } from '../../../interfaces/Message';
import moment from 'moment';
import { getAuthCookie } from '../../../actions/auth.action';
import FileInfo from './components/FileInfor';
import PlayButton from './components/PlayButton';
import ImagePreview from './components/ImagePreview';
import { useMessageService } from '../../../services/MessageService';
import { useChatContext } from '../../../context/ChatContext';
import { ReplyMessageIcon } from '../../../assets/icons/reply-icon';
import getColorBackround from '../../../util/getColorBackground';
import getUserShortName from '../../../util/getUserShortName';
import DeleteMessageIcon from '../../../assets/icons/deleteMessage';
import ReplyMessageButtonIcon from '../../../assets/icons/reply-message';

const MessageItem: React.FC<IMessageItem> = ({
  message,
  setImageView,
  setVisible,
  showSenderInfo,
}) => {
  const userId = getAuthCookie()?.user.id || '';
  const isUserMessage = message.sender_id === userId;
  const [showMessageOption, setShowMessageOption] = useState(false);
  const { setMessageReply, setIsReplyMessage, textareaRef } = useChatContext();
  const { recallMessage } = useMessageService();

  const backgroundColor = getColorBackround(message.sender_id);
  const shortName = getUserShortName(message.sender?.infor.full_name ?? '');

  const handleClickMedia = (url: string) => {
    setImageView(url);
    setVisible(true);
  };

  const handleRecallMessage = async (roomId: string) => {
    try {
      await recallMessage(roomId);
    } catch (err) {
      console.error('API call failed: ', err);
    }
  };

  const renderMediaContent = () => {
    const file = message.file_id;
    if (!file) return null;

    const { file_type, url_display, file_size, file_name } = file;

    if (file_type === 'IMAGE') {
      return url_display.includes('.svg') ? (
        <FileInfo
          url={url_display}
          fileSize={file_size}
          file_name={file_name}
        />
      ) : (
        <ImagePreview
          url={url_display}
          onClick={() => handleClickMedia(url_display)}
          file_name={file_name}
        />
      );
    }
    if (file_type === 'VIDEO') {
      return (
        <div
          className="relative w-full"
          onClick={() => handleClickMedia(url_display)}
        >
          <video
            src={url_display}
            className="md:max-w-full max-h-[350px] object-contain rounded"
          />
          <PlayButton />
        </div>
      );
    }
    if (file_type === 'FILE') {
      return (
        <FileInfo
          url={url_display}
          fileSize={file_size}
          file_name={file_name}
        />
      );
    }
  };

  const handleReplyMessage = (message: IMessage) => {
    setIsReplyMessage(true);
    setMessageReply(message);
    textareaRef.current?.focus();
  };

  return (
    <div className={`flex gap-[15px]  my-[2.5px]`}>
      {!isUserMessage &&
        (message.sender?.infor.avt_url ? (
          <img
            src={message.sender?.infor.avt_url}
            className="rounded-full w-11 h-11 basis-11"
            alt="user-avatar"
          />
        ) : (
          <div
            style={{ background: backgroundColor }}
            className={`rounded-full w-11 h-11 flex justify-center items-center text-white font-semibold border border-white basis-11`}
          >
            {shortName}
          </div>
        ))}

      <div className="flex flex-col flex-1">
        {showSenderInfo && (
          <div
            className={clsx('flex items-center gap-xs mb-xxs', {
              'flex-row-reverse': isUserMessage,
            })}
          >
            <p>
              {message.sender &&
                (isUserMessage ? 'Bạn' : message.sender.infor.full_name)}
            </p>
            <p className="text-[#00000080] text-[10px]">
              {moment(message.created_at).format('HH:mm')}
            </p>
          </div>
        )}

        {message.message_display && (
          <div
            className={`flex gap-3 md:w-full ${
              isUserMessage && 'flex-row-reverse'
            }`}
            onMouseEnter={() => setShowMessageOption(true)}
            onMouseLeave={() => setShowMessageOption(false)}
          >
            <div
              className={`join join-vertical shrink max-w-[55%] ${
                isUserMessage ? 'bg-[#91CFFB80]' : 'bg-white'
              }`}
            >
              {message.reply_id && (
                <div
                  className={`join-item max-w-xs min-w-0 p-3 rounded-lg text-textBody italic flex gap-5 border-b border-border`}
                >
                  <ReplyMessageIcon fill="#7B87A1" />
                  <p
                    className={clsx('whitespace-pre-wrap break-words', {
                      'text-lightText': message.message_type === 'RECALLED',
                    })}
                  >
                    {message.reply_id.message_display}
                  </p>
                </div>
              )}
              <div className="join-item p-3 rounded-lg text-[#252525] inline-block">
                <p
                  className={clsx('whitespace-pre-wrap break-words', {
                    'text-lightText': message.message_type === 'RECALLED',
                  })}
                >
                  {message.message_display}
                </p>
              </div>
            </div>

            {message.message_type !== 'RECALLED' && (
              <div
                className={`join shadow min-h-lg h-lg w-[80px] ${
                  !showMessageOption ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <button
                  className="btn join-item bg-white text-textBody text-sm min-h-lg h-lg"
                  onClick={() => handleReplyMessage(message)}
                >
                  <ReplyMessageButtonIcon />
                </button>
                <button
                  className="btn join-item bg-white text-textBody text-sm min-h-lg h-lg"
                  onClick={() => handleRecallMessage(message.id)}
                >
                  <DeleteMessageIcon />
                </button>
              </div>
            )}
          </div>
        )}

        {renderMediaContent()}
      </div>
    </div>
  );
};

export default MessageItem;
