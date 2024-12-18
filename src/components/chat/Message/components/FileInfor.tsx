import { FileHandle } from '../../../../util/downloadFile';
import DownloadButton from './DownloadButton';

interface Props {
  url: string;
  fileSize?: string;
  file_name: string;
  isDelete?: boolean;
}
export default function FileInfo({
  url,
  fileSize,
  file_name,
  isDelete,
}: Props) {
  const { handleFileDownload } = FileHandle();

  const getFileExtension = (fileName: string) => {
    const index = fileName.lastIndexOf('.');
    return index !== -1 ? fileName.slice(index + 1) : '';
  };

  const removeExtensionFileName = (fileName: string) => {
    const index = fileName.lastIndexOf('.');
    return index !== -1 ? fileName.slice(0, index) : '';
  };

  const convertFileSize = (fileSize: string | undefined) => {
    if (!fileSize) return;
    const changeFileSizeToNumber = Number(fileSize);
    if (changeFileSizeToNumber < 1) {
      return `${(changeFileSizeToNumber * 1024).toFixed(0)} KB`;
    } else {
      return `${changeFileSizeToNumber} MB`;
    }
  };

  const handleDownload = async (
    e: React.MouseEvent<HTMLDivElement>,
    url: string,
    file_name: string
  ) => {
    e.stopPropagation();
    handleFileDownload(url, file_name);
  };

  return (
    <div
      className="w-[220px] lg:w-[350px] relative bg-white rounded-[10px] p-4 shadow cursor-pointer"
      title={file_name}
      onClick={(e) => handleDownload(e, url, file_name)}
    >
      <div className="flex">
        <p className="truncate text-sm leading-[15px] ">
          {removeExtensionFileName(file_name)}
        </p>
        <span className="text-sm leading-[15px]">
          .{getFileExtension(file_name)}
        </span>
      </div>
      <div className="flex gap-xs items-center mt-xxs">
        <p className="text-sm text-lightText ">{convertFileSize(fileSize)}</p>
        {isDelete && (
          <div className="flex gap-xxs">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.9987 14.6615C11.6654 14.6615 14.6654 11.6615 14.6654 7.99479C14.6654 4.32812 11.6654 1.32812 7.9987 1.32812C4.33203 1.32812 1.33203 4.32812 1.33203 7.99479C1.33203 11.6615 4.33203 14.6615 7.9987 14.6615Z"
                stroke="#C60808"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 5.32812V8.66146"
                stroke="#C60808"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.99609 10.6719H8.00208"
                stroke="#C60808"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-red-700">File đã bị xóa</p>
          </div>
        )}
      </div>
      <DownloadButton url={url} file_name={file_name} />
    </div>
  );
}
