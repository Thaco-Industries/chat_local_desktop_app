// MessageList.tsx
import React, { forwardRef } from 'react';
import MessageItem from './MessageItem';
import { IMessageList } from '../../../interfaces/Message';
import moment from 'moment';
import { getDateLabel } from '../../../util/getDateLabel';
import { Spinner } from 'flowbite-react';

const MessageList = forwardRef<HTMLDivElement, IMessageList>(
  ({ messages, setImageView, setVisible, hasMoreData }, ref) => {
    const groupedMessages = messages.reduce((acc, message) => {
      const dateLabel = getDateLabel(message.created_at);
      if (!acc[dateLabel]) acc[dateLabel] = [];
      acc[dateLabel].push(message);
      return acc;
    }, {} as Record<string, IMessageList['messages']>);

    return (
      <div className="flex flex-col gap-1 px-6 md:px-lg relative ">
        {hasMoreData && (
          <div className="text-center" ref={ref}>
            <Spinner size="xl" />
          </div>
        )}

        {messages &&
          Object.entries(groupedMessages)
            .reverse() // Đảo ngược thứ tự của các ngày
            .map(([dateLabel, dayMessages]) => (
              <React.Fragment key={dateLabel}>
                <div className="flex items-center my-3">
                  <div className="flex-grow border-t border-lightText opacity-50"></div>
                  <div className="px-4 text-center text-lightText">
                    {dateLabel}
                  </div>
                  <div className="flex-grow border-t border-lightText opacity-50"></div>
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
                      ) > 3 ||
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
  }
);

export default MessageList;
