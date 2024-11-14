// MessageList.tsx
import React, { useEffect, forwardRef } from 'react';
import MessageItem from './MessageItem';
import { IMessageList } from '../../../interfaces/Message';
import moment from 'moment';

const MessageList: React.FC<IMessageList> = ({
  messages,
  setImageView,
  setVisible,
  loading,
}) => {
  // Group messages by date
  const getDateLabel = (created_at: string) => {
    const messageDate = moment(created_at, 'YYYY-MM-DD HH:mm');
    const today = moment();
    const yesterday = moment().subtract(1, 'days');

    if (messageDate.isSame(today, 'day')) return 'Hôm nay';
    if (messageDate.isSame(yesterday, 'day')) return 'Hôm qua';
    return messageDate.format('DD/MM/YYYY');
  };

  const groupedMessages = messages.reduce((acc, message) => {
    const dateLabel = getDateLabel(message.created_at);
    if (!acc[dateLabel]) acc[dateLabel] = [];
    acc[dateLabel].push(message);
    return acc;
  }, {} as Record<string, IMessageList['messages']>);

  return (
    <div className="flex flex-col gap-1 px-6 md:px-lg relative">
      {loading && <p>Loading more messages...</p>}
      <div id="endOfMessages" style={{ height: '1px' }}></div>
      {messages &&
        Object.entries(groupedMessages)
          .reverse() // Đảo ngược thứ tự của các ngày
          .map(([dateLabel, dayMessages]) => (
            <React.Fragment key={dateLabel}>
              <div className="flex items-center my-3">
                <div className="flex-grow border-t border-lightText"></div>
                <div className="px-4 text-center text-lightText">
                  {dateLabel}
                </div>
                <div className="flex-grow border-t border-lightText"></div>
              </div>

              {dayMessages
                .slice()
                .reverse()
                .map((message, index, reversedMessages) => {
                  const prevMessage =
                    index > 0 ? reversedMessages[index - 1] : null;

                  const showSenderInfo =
                    !prevMessage ||
                    moment(message.created_at).diff(
                      moment(prevMessage?.created_at),
                      'minutes'
                    ) > 5 ||
                    message.sender_id !== prevMessage?.sender_id;
                  return (
                    <MessageItem
                      key={message.id}
                      message={message}
                      setImageView={setImageView}
                      setVisible={setVisible}
                      showSenderInfo={showSenderInfo}
                    />
                  );
                })}
            </React.Fragment>
          ))}
    </div>
  );
};

export default MessageList;
