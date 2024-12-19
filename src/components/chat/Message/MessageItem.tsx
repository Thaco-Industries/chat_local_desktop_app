// MessageItem.tsx
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { IMessage, IMessageItem } from '../../../interfaces/Message';
import moment from 'moment';
import { getAuthCookie } from '../../../actions/auth.action';
import { useMessageService } from '../../../services/MessageService';
import { useChatContext } from '../../../context/ChatContext';
import { ReplyMessageIcon } from '../../../assets/icons/reply-icon';
import MediaMessage from './components/MediaMessage';
import ActionButton from './components/ActionButton';
import PlayButton from './components/PlayButton';
import UserAvatar from '../../common/UserAvatar';
import ViewUserInforModal from './components/ViewUserInforModal';

const MessageItem: React.FC<IMessageItem> = ({
  message,
  setImageView,
  setVisible,
  showSenderInfo,
}) => {
  const userId = getAuthCookie()?.user.id || '';
  const { recallMessage } = useMessageService();
  const { setMessageReply, setIsReplyMessage, textareaRef, listMember } =
    useChatContext();

  const isUserMessage = message.sender_id === userId;

  const [showMessageOption, setShowMessageOption] = useState<boolean>(false);
  const [updatedMessage, setUpdatedMessage] = useState('');
  const [openFriendInfoModal, setOpenFriendInfoModal] =
    useState<boolean>(false);
  const [friendId, setFriendId] = useState<string>('');

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
      <div className="text-center text-textBody px-4 py-2 w-[350px] tablet:w-[300px] lg:w-max break-words self-center">
        {updatedMessage}
      </div>
    );
  }

  const { file_name, url_display, thumbnail_url_display } =
    message?.reply_id?.file_id || {};

  const fileExtension = file_name?.split('.').pop()?.toLocaleLowerCase() || '';
  const isVideo = ['mp4', 'mov', 'avi', 'mkv'].includes(fileExtension);
  const isImage = ['png', 'jpg', 'jpeg', 'gif', 'svf'].includes(fileExtension);

  const renderReplyMedia = () => {
    if (isImage && url_display && message.message_type === 'RECALLED') {
      return (
        <img
          src={`${process.env.REACT_APP_API_URL}/media/view/${url_display}`}
          alt="reply image"
          className="w-[120px] h-[120px] object-cover"
        />
      );
    }

    if (
      isVideo &&
      thumbnail_url_display &&
      message.message_type === 'RECALLED'
    ) {
      return (
        <div className="relative">
          <img
            className="w-[120px] h-[120px] object-cover"
            src={`${process.env.REACT_APP_API_URL}/media/view/${thumbnail_url_display}`}
            alt="reply video"
          />
          <PlayButton />
        </div>
      );
    }

    return (
      <p className="text-[#252525] text-base truncate">
        {message.reply_id?.message_display || 'Nội dung không khả dụng'}
      </p>
    );
  };

  const handleClickUserInRoom = (message: IMessage) => {
    setOpenFriendInfoModal(true);
    setFriendId(message.sender_id);
  };

  return (
    <div className={`flex gap-xs my-[2.5px]`}>
      {!isUserMessage && (
        <div
          className="cursor-pointer"
          onClick={() => handleClickUserInRoom(message)}
        >
          <UserAvatar
            fullName={message.sender?.infor.full_name}
            senderId={message.sender_id}
            showSenderInfo={showSenderInfo}
            url={message.sender?.infor.avt_url}
          />
        </div>
      )}

      <div className="flex flex-col flex-1">
        {showSenderInfo && (
          <div
            className={`flex items-center gap-xs mb-xxs ${
              isUserMessage ? 'flex-row-reverse ' : ''
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
                  {renderReplyMedia()}
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
      {openFriendInfoModal && (
        <ViewUserInforModal
          openViewUserInforModal={openFriendInfoModal}
          setOpenViewUserInforModal={setOpenFriendInfoModal}
          friendId={friendId}
          overlay={true}
        />
      )}
    </div>
  );
};

export default MessageItem;
