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
          className={clsx('bg-white p-5', {
            'mb-4': dateIndex !== Object.keys(groupedFiles).length - 1,
          })}
        >
          <div className="flex flex-col gap-4 w-full">
            <h2 className="font-semibold">Ngày {date}</h2>
            {groupedFiles[date].map((file) => {
              const { url_display, file_name, file_size } = file;
              return (
                <div
                  key={file.id}
                  className="flex items-center gap-[9px] cursor-pointer flex-wrap"
                  onClick={(e) =>
                    handleFileClick(e, url_display, file_name, file.id)
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
                            'lg:max-w-[190px]': !isDelete,
                            'lg:max-w-[155px]': isDelete,
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
                    </div>
                    <DownloadButton url={url_display} file_name={file_name} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
