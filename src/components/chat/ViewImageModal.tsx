import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import DownloadOutlineIcon from '../../assets/icons/download-outline';
import { FileHandle } from '../../util/downloadFile';

type Props = {
  title: string;
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  imageView: string;
};

const ViewImageModal: React.FC<Props> = ({
  title,
  setVisible,
  visible,
  imageView,
}) => {
  const isVideo = /\.(mp4|webm|ogg)$/i.test(imageView);
  const { handleFileDownload } = FileHandle();

  const handleDownload = async (url: string, file_name: string) => {
    handleFileDownload(url, file_name);
  };

  const closeModal = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <>
      {visible && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center w-full h-full bg-black bg-opacity-50"
          aria-hidden="true"
          onClick={closeModal}
        >
          <div
            className="relative w-full h-full p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal content */}
            <div className="relative flex flex-col bg-white rounded-lg shadow w-full h-full">
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 border-b rounded-t">
                <h3 className="text-xl font-semibold text-textBody">
                  Hình ảnh, video
                </h3>
                <button
                  type="button"
                  onClick={closeModal}
                  className="text-gray-400 bg-transparent hover:bg-borborder-border hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-autoborder-border inline-flex justify-center items-center"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              {/* Modal body */}
              <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
                {isVideo ? (
                  <video
                    className="max-w-full max-h-full object-contain"
                    autoPlay
                    controls
                  >
                    <source src={imageView} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    className="max-w-full max-h-full object-contain"
                    src={imageView}
                    alt={title}
                  />
                )}
              </div>
              {/* Modal footer */}
              <div className="flex items-center justify-center p-4 border-t border-border rounded-b">
                <div
                  className="border-border cursor-pointer"
                  onClick={() => handleDownload(imageView, '')}
                  title="Tải"
                >
                  <DownloadOutlineIcon />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewImageModal;
