import DownloadButton from '../../Message/components/DownloadButton';

interface FileProps {
  url_display: string;
  file_name: string;
  file_size?: number;
}

export const FileSection: React.FC<{
  files: FileProps[];
  handleFileDownload: (url: string, fileName: string) => void;
}> = ({ files, handleFileDownload }) => {
  const getFileExtension = (fileName: string) => {
    const index = fileName.lastIndexOf('.');
    return index !== -1 ? fileName.slice(index + 1) : '';
  };

  const removeExtensionFileName = (fileName: string) => {
    const index = fileName.lastIndexOf('.');
    return index !== -1 ? fileName.slice(0, index) : '';
  };

  const convertFileSize = (fileSize: number | undefined) => {
    if (!fileSize) return;
    return fileSize < 1
      ? `${(fileSize * 1024).toFixed(0)} KB`
      : `${fileSize} MB`;
  };

  return (
    <>
      {files.slice(0, 3).map(({ url_display, file_name, file_size }, idx) => (
        <div
          key={idx}
          className="rounded-[2px] border border-primary p-xs relative cursor-pointer"
          onClick={() =>
            handleFileDownload(
              `${process.env.REACT_APP_API_URL}/media/view/${url_display}`,
              file_name
            )
          }
        >
          <div className="flex">
            <p className="truncate text-sm leading-[15px] max-w-[220px]">
              {removeExtensionFileName(file_name)}
            </p>
            <span className="text-sm leading-[15px]">
              .{getFileExtension(file_name)}
            </span>
          </div>
          <p className="text-sm text-lightText mt-xxs">
            {convertFileSize(file_size)}
          </p>
          <DownloadButton
            url={`${process.env.REACT_APP_API_URL}/media/view/${url_display}`}
            file_name={file_name}
          />
        </div>
      ))}
    </>
  );
};
