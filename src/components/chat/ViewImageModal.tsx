import React, { useEffect, useRef } from 'react';

type Props = {
  title: string;
  visible: boolean;
  imageView: string;
  onClose: () => void;
};

const ViewImageModal: React.FC<Props> = ({
  title,
  visible,
  imageView,
  onClose,
}) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const isVideo = /\.(mp4|webm|ogg)$/i.test(imageView);

  useEffect(() => {
    if (!modalRef.current) return;

    if (visible) {
      modalRef.current.showModal();
    } else {
      modalRef.current.classList.add('closing'); // Trigger fade-out
      modalRef.current.addEventListener(
        'animationend',
        () => modalRef.current?.close(),
        { once: true }
      );
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <dialog
      ref={modalRef}
      id="viewImageModal"
      className="modal transition-modal"
      onClose={handleClose}
    >
      <div className="modal-box flex flex-col justify-center items-center p-6 max-w-none">
        <h3 className="font-bold text-lg mb-4">{title}</h3>
        {isVideo ? (
          <div className="overflow-hidden max-h-[80vh] w-auto object-contain">
            <video src={imageView} controls autoPlay />
          </div>
        ) : (
          <img
            className=" max-h-[80vh] w-auto object-contain"
            src={imageView}
            alt={title}
          />
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleClose}>Close</button>
      </form>
    </dialog>
  );
};

export default ViewImageModal;
