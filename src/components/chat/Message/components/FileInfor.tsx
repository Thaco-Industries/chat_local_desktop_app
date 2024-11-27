import DownloadButton from './DownloadButton';

interface Props {
  url: string;
  fileSize?: string;
  file_name: string;
}
export default function FileInfo({ url, fileSize, file_name }: Props) {
  const getFileExtension = (fileName: string) => {
    const index = fileName.lastIndexOf('.');
    return index !== -1 ? fileName.slice(index + 1) : '';
  };

  const removeExtensionFileName = (fileName: string) => {
    const index = fileName.lastIndexOf('.');
    return index !== -1 ? fileName.slice(0, index) : '';
  };

  return (
    <div
      className="max-w-[220px] lg:max-w-[350px] relative bg-white rounded-[10px] p-4 shadow"
      title={file_name}
    >
      <div className="text-title text-sm font-semibold flex">
        <p className="truncate">{removeExtensionFileName(file_name)}</p>
        <span>.{getFileExtension(file_name)}</span>
      </div>
      <div className="text-lightText text-[13px] mt-[10px] mb-4">
        {fileSize}
      </div>
      <DownloadButton url={url} file_name={file_name} />
    </div>
  );
}
