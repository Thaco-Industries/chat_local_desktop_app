import clsx from 'clsx';
import DownloadOutlineIcon from '../../../assets/icons/download-outline';
import { IFileTabContentProps } from '../../../interfaces';

export const FileTabContent: React.FC<IFileTabContentProps> = ({
  groupedFiles,
  handleFileChoosen,
  isDelete,
  fileSelected,
}) => {
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
            {groupedFiles[date].map((file) => (
              <div
                className="flex items-center gap-sm"
                onClick={() => handleFileChoosen(file.id)}
              >
                {isDelete && (
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <input
                        type="checkbox"
                        checked={fileSelected.includes(file.id)}
                        className="checkbox border-background-600 [--chkbg:theme(colors.primary)] flex-shrink-0"
                      />
                    </label>
                  </div>
                )}
                <div
                  key={file.id}
                  title={file.name}
                  className="rounded-[2px] border border-primary p-xs relative min-w-0 flex-shrink flex-grow max-w-full"
                >
                  <div className="flex justify-between mb-1 gap-3">
                    <div className="text-sm text-title truncate w-[90%]">
                      {file.name}
                    </div>
                  </div>
                  <div className="flex gap-3 flex-shrink-0 flex-grow-0">
                    <p className="truncate w-full text-sm text-lightText">
                      {file.size}
                    </p>
                  </div>
                  <button
                    title="tải về"
                    className="rounded-sm absolute bottom-xs right-xs bg-white border border-border w-6 h-6"
                  >
                    <DownloadOutlineIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
