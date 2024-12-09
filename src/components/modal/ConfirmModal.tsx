import { Modal } from 'flowbite-react';
import React from 'react';

type Props = {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  title: string;
  content: string;
  handleConfirm: () => void;
};

function ConfirmModal({
  openModal,
  setOpenModal,
  title,
  content,
  handleConfirm,
}: Props) {
  const handleCancel = () => {
    setOpenModal(false);
  };

  return (
    <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header className="pt-lg px-lg">
        <p className="text-title font-semibold text-[18px]">{title}</p>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <p className="text-title text-[18px] text-center">{content}</p>
        </div>
        <div className="flex gap-lg justify-center mt-sm">
          <button
            className="px-[20px] py-[10.5px] rounded-[24px] border border-[#949494] bg-white text-textBody"
            onClick={handleCancel}
          >
            Hủy bỏ
          </button>
          <button
            className="px-[20px] py-[10.5px] rounded-[24px] bg-primary text-white"
            onClick={handleConfirm}
          >
            Xác nhận
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ConfirmModal;
