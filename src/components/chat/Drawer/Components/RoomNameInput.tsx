import clsx from 'clsx';
import Edit from '../../../../assets/icons/edit';
import CustomField from '../../../common/customField';
import { useEffect, useRef } from 'react';

export const RoomNameInput: React.FC<{
  roomName: string;
  isLeader: boolean;
  isActiveInput: boolean;
  setIsActiveInput: (state: boolean) => void;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  handleBlur: (e: React.FocusEvent<any>) => void;
  submitForm: () => void;
}> = ({
  roomName,
  isLeader,
  isActiveInput,
  setIsActiveInput,
  setFieldValue,
  handleBlur,
  submitForm,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      // Đặt chiều cao tự động dựa trên nội dung
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [roomName]); // Chỉ chạy lại khi roomName thay đổi

  return (
    <div className="group flex gap-2 relative max-w-[140px] sm:max-w-[300px] tablet:max-w-[460px]">
      <textarea
        ref={textareaRef}
        name="roomName"
        maxLength={50}
        className={clsx(
          'focus:ring-0 text-center text-[16px] break-words w-[220px] font-semibold resize-none overflow-hidden border-none min-h-[24px] leading-[18px]',
          {
            shadow: isActiveInput,
          }
        )}
        disabled={!isActiveInput}
        placeholder="Nhập tên phòng"
        value={roomName}
        onChange={(e) => {
          setFieldValue('roomName', e.target.value);
        }}
        onBlur={(e) => {
          setIsActiveInput(false);
          handleBlur(e);
          submitForm();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            submitForm();
            setIsActiveInput(false);
          }
        }}
      />
      {isLeader && !isActiveInput && (
        <div
          className="group-hover:flex justify-center items-center hidden cursor-pointer flex-shrink-0 w-6 h-6 bg-white rounded-full shadow absolute -right-3"
          onClick={() => setIsActiveInput(true)}
        >
          <Edit />
        </div>
      )}
    </div>
  );
};
