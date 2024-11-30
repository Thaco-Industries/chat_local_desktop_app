import clsx from 'clsx';
import DownloadOutlineIcon from '../../../../assets/icons/download-outline';
import { FileHandle } from '../../../../util/downloadFile';

interface Props {
  isFile?: boolean;
  url: string;
  file_name: string;
}

export default function DownloadButton({
  isFile = false,
  url,
  file_name,
}: Props) {
  const { handleFileDownload } = FileHandle();

  const handleDownload = async (
    e: React.MouseEvent<HTMLButtonElement>,
    url: string,
    file_name: string
  ) => {
    e.stopPropagation();
    handleFileDownload(url, file_name);
  };

  return (
    <button
      className={clsx(
        'w-6 h-6 bg-white rounded border border-[#e1e1e1] inline-flex justify-center items-center',
        {
          'absolute right-3 bottom-4': !isFile,
        }
      )}
      title="Tải"
      onClick={(e) => handleDownload(e, url, file_name)}
    >
      <DownloadOutlineIcon />
    </button>
  );
}
