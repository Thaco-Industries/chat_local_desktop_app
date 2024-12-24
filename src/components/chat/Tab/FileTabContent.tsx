import clsx from 'clsx';
import DownloadOutlineIcon from '../../../assets/icons/download-outline';
import { IFileTabContentProps } from '../../../interfaces';
import DownloadButton from '../Message/components/DownloadButton';
import { FileHandle } from '../../../util/downloadFile';
import { Checkbox } from 'flowbite-react';

export const FileTabContent: React.FC<IFileTabContentProps> = ({
  groupedFiles,
  handleFileChoosen,
  isDelete,
  fileSelected,
}) => {
  const { handleFileDownload } = FileHandle();

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
    const changeFileSizeToNumber = fileSize;
    if (changeFileSizeToNumber < 1) {
      return `${(changeFileSizeToNumber * 1024).toFixed(0)} KB`;
    } else {
      return `${changeFileSizeToNumber} MB`;
    }
  };

  const handleFileClick = (
    e: React.MouseEvent<HTMLDivElement>,
    url: string,
    file_name: string,
    fileId: string
  ) => {
    e.stopPropagation();
    if (isDelete) {
      handleFileChoosen(fileId);
    } else {
      handleFileDownload(url, file_name);
    }
  };

  return (
    <div>
      {Object.keys(groupedFiles).map((date, dateIndex) => (
        <div
          key={date}
          className={clsx('bg-white', {
            'mb-[5px]': dateIndex !== Object.keys(groupedFiles).length - 1,
          })}
        >
          <div className="flex flex-col gap-4 w-full">
            <h2 className="px-md pt-md font-semibold">Ngày {date}</h2>
            {groupedFiles[date].map((file) => {
              const { url_display, file_name, file_size } = file;
              return (
                <div
                  key={file.id}
                  className="px-md flex items-center gap-[9px] cursor-pointer flex-wrap"
                  onClick={(e) =>
                    handleFileClick(
                      e,
                      `${process.env.REACT_APP_API_URL}/media/view/${url_display}`,
                      file_name,
                      file.id
                    )
                  }
                >
                  {isDelete && (
                    <div className="form-control flex-shrink-0">
                      <Checkbox
                        checked={fileSelected.includes(file.id)}
                        onChange={() => handleFileChoosen(file.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="focus:ring-0 focus:ring-offset-0 text-primary bg-white border-[#D9D9D9] cursor-pointer w-[16px] h-[16px]"
                      />
                    </div>
                  )}
                  <div
                    key={file.id}
                    title={file_name}
                    className="rounded-[2px] border border-primary p-xs relative min-w-0 flex-grow max-w-full box-border"
                  >
                    <div className="flex justify-between mb-1 gap-3">
                      <div className="flex justify-between">
                        <p
                          className={clsx('text-sm text-title truncate', {
                            'lg:max-w-[220px]': !isDelete,
                            'lg:max-w-[195px]': isDelete,
                          })}
                        >
                          {removeExtensionFileName(file_name)}
                        </p>
                        <span>.{getFileExtension(file_name)}</span>
                      </div>
                    </div>
                    <div className="flex gap-3 flex-shrink-0 flex-grow-0">
                      <p className="text-sm text-lightText">
                        {convertFileSize(file_size)}
                      </p>
                      {file.system_deleted && (
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
                    {!file.system_deleted && (
                      <DownloadButton url={url_display} file_name={file_name} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="h-xxs bg-background-500 mt-md"></div>
        </div>
      ))}
    </div>
  );
};
