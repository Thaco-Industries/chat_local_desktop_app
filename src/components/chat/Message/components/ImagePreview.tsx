import React from 'react';
import DownloadButton from './DownloadButton';

type Props = { url: string; onClick: () => void; file_name: string };

function ImagePreview({ url, onClick, file_name }: Props) {
  return (
    <div className="relative flex justify-end gap-2 flex-wrap">
      <img
        src={url}
        alt="sent image"
        className="w-[80%] md:max-w-full max-h-[350px] object-contain rounded"
        onClick={onClick}
      />
      <DownloadButton url={url} file_name={file_name} />
    </div>
  );
}

export default ImagePreview;
