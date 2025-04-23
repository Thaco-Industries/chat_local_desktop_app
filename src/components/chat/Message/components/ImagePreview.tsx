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
    <div className="relative flex justify-end gap-2 flex-wrap max-w-[220px] lg:max-w-[350px] max-h-[350px]">
      <div
        className={clsx(
          'flex items-center justify-center bg-white rounded-[10px]',
          'w-full h-full min-w-[150px] min-h-[60px] max-w-[220px] lg:max-w-[350px] max-h-[350px]',
          {
            'justify-end': isUserMessage,
          }
        )}
      >
        <img
          src={url}
          alt="sent image"
          className="w-full h-full object-contain rounded cursor-pointer"
          onClick={onClick}
        />
      </div>
      <DownloadButton url={url} file_name={file_name} />
    </div>
  );
}

export default ImagePreview;
