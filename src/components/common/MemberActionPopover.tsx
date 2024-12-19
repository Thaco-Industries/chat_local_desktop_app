import { Popover } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import MoreIcon from '../../assets/icons/more';
import { useRoomService } from '../../services/RoomService';
import ConfirmRemoveMemberModal from '../chat/ConfirmRemoveMemberModal';
import ConfirmModal from '../modal/ConfirmModal';

type Props = {
  roomId: string;
  memberId: string;
  memberName: string;
};

function MemberActionPopover({ roomId, memberId, memberName }: Props) {
  const { removeMember, changeRoomLeader } = useRoomService();
  const [isOpen, setIsOpen] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false);
  const [openChangeLeaderModal, setOpenChangeLeaderModal] =
    useState<boolean>(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleRemoveMember = async () => {
    await removeMember(roomId, memberId);
    setIsOpen(false);
    setOpenConfirmModal(false);
  };

  const handleChangeRoomLeader = async () => {
    const payload = {
      roomId,
      memberId,
    };
    await changeRoomLeader(payload);
    setIsOpen(false);
    setOpenChangeLeaderModal(false);
  };

  return (
    <div className="self-center" ref={popoverRef}>
      <Popover
        aria-labelledby="default-popover"
        content={
          <div className=" h-[94px] pl-5 pr-[18px] pt-5 pb-[25px] bg-white rounded-lg shadow justify-center items-center inline-flex">
            <div className="self-stretch flex-col justify-center items-start gap-[15px] inline-flex">
              <div
                className="self-stretch grow shrink basis-0 justify-between items-center inline-flex cursor-pointer"
                onClick={() => setOpenConfirmModal(true)}
              >
                <div className="text-textBody">Xóa khỏi nhóm</div>
              </div>
              <div
                className="self-stretch grow shrink basis-0 justify-start items-center gap-2.5 inline-flex cursor-pointer"
                onClick={() => setOpenChangeLeaderModal(true)}
              >
                <div className="text-textBody">Chuyển trưởng nhóm</div>
              </div>
            </div>
          </div>
        }
        open={isOpen}
        arrow={false}
        placement="top"
      >
        <button
          type="button"
          className=""
          title="thêm"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <MoreIcon />
        </button>
      </Popover>
      <ConfirmRemoveMemberModal
        openConfirmModal={openConfirmModal}
        setOpenConfirmModal={setOpenConfirmModal}
        handleRemoveMember={handleRemoveMember}
        memberName={memberName}
      />
      <ConfirmModal
        content={`Bạn có chắc muốn chuyển quyền trưởng nhóm cho ${memberName}?`}
        handleConfirm={handleChangeRoomLeader}
        openModal={openChangeLeaderModal}
        setOpenModal={setOpenChangeLeaderModal}
        title="Thông báo"
      />
    </div>
  );
}

export default MemberActionPopover;
