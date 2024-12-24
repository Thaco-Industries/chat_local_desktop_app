import DownloadButton from '../../Message/components/DownloadButton';

interface FileProps {
  url_display: string;
  file_name: string;
  file_size?: number;
}

export const FileSection: React.FC<{
  files: IFileInfor[];
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
      {files
        .slice(0, 3)
        .map(({ url_display, file_name, file_size, system_deleted }, idx) => (
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
              <p className="truncate text-sm leading-[17px] max-w-[220px]">
                {removeExtensionFileName(file_name)}
              </p>
              <span className="text-sm leading-[15px]">
                .{getFileExtension(file_name)}
              </span>
            </div>
            <p className="text-sm text-lightText mt-xxs">
              {convertFileSize(file_size)}
            </p>
            {system_deleted && (
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
            {!system_deleted && (
              <DownloadButton
                url={`${process.env.REACT_APP_API_URL}/media/view/${url_display}`}
                file_name={file_name}
              />
            )}
          </div>
        ))}
    </>
  );
};
