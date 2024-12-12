import { FileHandle } from '../../../../util/downloadFile';
import DownloadButton from './DownloadButton';

interface Props {
  url: string;
  fileSize?: string;
  file_name: string;
}
export default function FileInfo({ url, fileSize, file_name }: Props) {
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
      <p className="text-sm text-lightText mt-xxs">
        {convertFileSize(fileSize)}
      </p>

      <DownloadButton url={url} file_name={file_name} />
    </div>
  );
}
