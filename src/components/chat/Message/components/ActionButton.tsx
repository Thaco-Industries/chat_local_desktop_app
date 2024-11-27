import DeleteMessageIcon from '../../../../assets/icons/deleteMessage';
import ReplyMessageButtonIcon from '../../../../assets/icons/reply-message';
import { IMessage } from '../../../../interfaces';

type Props = {
  showMessageOption: boolean;
  handleReplyMessage: (message: IMessage) => void;
  handleRecallMessage: (messageId: string) => void;
  message: IMessage;
  isUserMessage: boolean;
};

const ActionButton: React.FC<Props> = ({
  showMessageOption,
  handleRecallMessage,
  handleReplyMessage,
  message,
  isUserMessage,
}) => {
  return (
    <div
      className={`join shadow min-h-lg h-lg w-[80px] self-end ${
        showMessageOption ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <button
        className="btn join-item bg-white text-textBody text-sm min-h-lg h-lg"
        title="Trả lời"
        onClick={() => handleReplyMessage(message)}
      >
        <ReplyMessageButtonIcon />
      </button>
      <button
        className="btn join-item bg-white text-textBody text-sm min-h-lg h-lg"
        title="Thu hồi"
        disabled={!isUserMessage}
        onClick={() => handleRecallMessage(message.id)}
      >
        <DeleteMessageIcon isUserMessage={isUserMessage} />
      </button>
    </div>
  );
};

export default ActionButton;
