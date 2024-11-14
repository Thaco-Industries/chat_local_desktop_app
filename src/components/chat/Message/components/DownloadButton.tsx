import DownloadOutlineIcon from '../../../../assets/icons/download-outline';

interface Props {
  url: string;
  file_name: string;
}
export default function DownloadButton({ url, file_name }: Props) {
  const handleDownload = async () => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const anchor = document.createElement('a');
      anchor.href = downloadUrl;
      anchor.download = file_name || 'file';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      // Giải phóng URL Blob sau khi tải xuống
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Tải file thất bại:', error);
    }
  };

  return (
    <button
      className="w-6 h-6 bg-white rounded border border-[#e1e1e1] inline-flex justify-center items-center absolute right-3 bottom-4"
      onClick={handleDownload}
      title="Tải"
    >
      <DownloadOutlineIcon />
    </button>
  );
}
