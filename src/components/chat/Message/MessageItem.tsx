// MessageItem.tsx
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { IMessage, IMessageItem } from '../../../interfaces/Message';
import moment from 'moment';
import { getAuthCookie } from '../../../actions/auth.action';
import { useMessageService } from '../../../services/MessageService';
import { useChatContext } from '../../../context/ChatContext';
import { ReplyMessageIcon } from '../../../assets/icons/reply-icon';
import getColorBackround from '../../../util/getColorBackground';
import getUserShortName from '../../../util/getUserShortName';
import MediaMessage from './components/MediaMessage';
import ActionButton from './components/ActionButton';

const MessageItem: React.FC<IMessageItem> = ({
  message,
  setImageView,
  setVisible,
  showSenderInfo,
}) => {
  const userId = getAuthCookie()?.user.id || '';
  const isUserMessage = message.sender_id === userId;
  const [showMessageOption, setShowMessageOption] = useState(false);
  const [updatedMessage, setUpdatedMessage] = useState('');
  const { setMessageReply, setIsReplyMessage, textareaRef, listMember } =
    useChatContext();
  const { recallMessage } = useMessageService();

  useEffect(() => {
    if (listMember && message.message_display) {
      // Tạo bản sao của message_display
      let modifiedMessage = message.message_display;

      Object.keys(listMember).forEach((memberKey) => {
        const fullName = listMember[memberKey]?.infor?.full_name;
        if (fullName) {
          const placeholder = `<#${memberKey}>`;
          modifiedMessage = modifiedMessage.replace(placeholder, fullName);
        }
      });

      setUpdatedMessage(modifiedMessage); // Cập nhật state với list đã thay đổi
    }
  }, [listMember, message]);

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

  const handleReplyMessage = (message: IMessage) => {
    setIsReplyMessage(true);
    setMessageReply(message);
    textareaRef.current?.focus();
  };

  if (message.message_type === 'NOTIFICATION') {
    return (
      <div className="text-center text-textBody px-4 py-2 w-[350px] sm:w-max break-words self-center">
        {updatedMessage}
      </div>
    );
  }

  return (
    <div className={`flex gap-xs my-[2.5px]`}>
      {!isUserMessage &&
        (message.sender?.infor.avt_url ? (
          <img
            src={message.sender?.infor.avt_url}
            className="rounded-full w-11 h-11"
            alt="user-avatar"
          />
        ) : (
          <div
            style={{ background: backgroundColor }}
            className={clsx(
              'rounded-full w-11 h-11 flex justify-center items-center text-white font-semibold border border-white relative',
              { 'opacity-0': !showSenderInfo }
            )}
          >
            <div className="absolute inset-0 bg-black bg-opacity-15 rounded-full"></div>
            {shortName}
          </div>
        ))}

      <div className="flex flex-col flex-1">
        {showSenderInfo && (
          <div
            className={`flex items-center gap-xs mb-xxs ${
              isUserMessage ? 'justify-end' : ''
            }`}
          >
            <p>
              {message.sender
                ? isUserMessage
                  ? 'Bạn'
                  : message.sender.infor.full_name
                : ''}
            </p>
            <p className="text-[#00000080] text-[10px]">
              {moment(message.created_at).format('HH:mm')}
            </p>
          </div>
        )}

        <div
          className={clsx('flex flex-col w-auto max-w-[90%]', {
            'items-end self-end': isUserMessage,
          })}
          onMouseEnter={() => setShowMessageOption(true)}
          onMouseLeave={() => setShowMessageOption(false)}
        >
          <div
            className={clsx('flex flex-row gap-3', {
              'flex-row-reverse gap-8': isUserMessage,
            })}
          >
            <div
              className={`join join-vertical inline-flex items-start rounded-lg ${
                isUserMessage ? 'bg-[#91CFFB80]' : 'bg-white'
              }`}
              style={{ wordBreak: 'break-word' }}
            >
              {message.reply_id && message.message_type !== 'RECALLED' && (
                <div className="join-item p-3 rounded-lg text-textBody italic gap-5 border-b border-border grid grid-cols-[20px_auto] items-start">
                  <ReplyMessageIcon fill="#7B87A1" />
                  <p className={'truncate whitespace-wrap'}>
                    {message.reply_id.message_display}
                  </p>
                </div>
              )}
              {message.message_display && message.message_type !== 'FILE' && (
                <div
                  className={clsx(
                    'join-item p-3 rounded-lg text-[#252525] inline-block max-w-full',
                    {
                      'border-t border-border':
                        message.reply_id && message.message_type !== 'RECALLED',
                    }
                  )}
                >
                  <p
                    className={clsx('whitespace-pre-wrap', {
                      'text-lightText': message.message_type === 'RECALLED',
                    })}
                  >
                    {message.message_display}
                  </p>
                </div>
              )}
            </div>
            {message.message_type !== 'RECALLED' &&
              message.message_type !== 'FILE' && (
                <ActionButton
                  handleRecallMessage={handleRecallMessage}
                  handleReplyMessage={handleReplyMessage}
                  message={message}
                  showMessageOption={showMessageOption}
                  isUserMessage={isUserMessage}
                />
              )}
          </div>
        </div>

        {message.message_type !== 'RECALLED' && (
          <MediaMessage
            handleClickMedia={handleClickMedia}
            message={message}
            isUserMessage={isUserMessage}
            handleRecallMessage={handleRecallMessage}
            handleReplyMessage={handleReplyMessage}
          />
        )}
      </div>
    </div>
  );
};

export default MessageItem;
