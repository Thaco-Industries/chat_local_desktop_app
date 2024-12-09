import { Button, Modal } from 'flowbite-react';
import React, { Dispatch, SetStateAction } from 'react';

type Props = {
  openConfirmModal: boolean;
  setOpenConfirmModal: Dispatch<SetStateAction<boolean>>;
  handleRemoveMember: () => void;
  memberName: string;
};

function ConfirmRemoveMemberModal({
  openConfirmModal,
  setOpenConfirmModal,
  handleRemoveMember,
  memberName,
}: Props) {
  if (!openConfirmModal) return null;

  return (
    <Modal
      dismissible
      show={openConfirmModal}
      onClose={() => setOpenConfirmModal(false)}
    >
      <Modal.Header className="pt-lg px-lg">
        <p className="text-title font-semibold text-[18px]">Xóa thành viên</p>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <p className="text-title text-[18px] text-center">
            Bạn có chắc chắn muốn xóa ["{memberName}"] khỏi cuộc trò chuyện này
            không?
          </p>
        </div>
        <div className="flex gap-lg justify-center mt-sm">
          <button className="px-[20px] py-[10.5px] rounded-[24px] border border-[#949494] bg-white text-textBody">
            Hủy bỏ
          </button>
          <button
            className="px-[20px] py-[10.5px] rounded-[24px] bg-primary text-white"
            onClick={handleRemoveMember}
          >
            Xác nhận
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ConfirmRemoveMemberModal;
