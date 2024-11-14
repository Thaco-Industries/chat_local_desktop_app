import DownloadButton from './DownloadButton';

interface Props {
  url: string;
  fileSize?: string;
  file_name: string;
}
export default function FileInfo({ url, fileSize, file_name }: Props) {
  return (
    <div
      className="w-[250px] md:w-[350px] relative bg-white rounded-[10px] p-4 shadow"
      title={url}
    >
      <div className="text-title text-sm font-semibold leading-none truncate">
        {url}
      </div>
      <div className="text-lightText text-[13px] mt-[10px] mb-4">
        {fileSize}
      </div>
      <DownloadButton url={url} file_name={file_name} />
    </div>
  );
}
