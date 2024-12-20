import DownloadButton from './DownloadButton';
import clsx from 'clsx';

type Props = {
  url: string;
  onClick: () => void;
  file_name: string;
  isUserMessage: boolean;
};

function ImagePreview({ url, onClick, file_name, isUserMessage }: Props) {
  return (
    <div className="relative flex justify-end gap-2 flex-wrap max-w-[220px] lg:max-w-[350px]">
      <div
        className={clsx(
          'flex items-center w-full min-w-[150px] min-h-[60px] bg-white justify-center rounded-[10px]',
          {
            'justify-end': isUserMessage,
          }
        )}
      >
        <img
          src={url}
          alt="sent image"
          className="tablet:max-w-full max-h-[350px] rounded cursor-pointer"
          onClick={onClick}
        />
      </div>
      <DownloadButton url={url} file_name={file_name} />
    </div>
  );
}

export default ImagePreview;
