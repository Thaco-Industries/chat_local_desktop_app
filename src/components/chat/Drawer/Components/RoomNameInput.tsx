import clsx from 'clsx';
import Edit from '../../../../assets/icons/edit';
import CustomField from '../../../common/customField';

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
  return (
    <div className="group flex gap-2 relative max-w-[140px] sm:max-w-[300px] tablet:max-w-[460px] ">
      <CustomField
        type="text"
        name="roomName"
        maxLength={50}
        className={clsx('focus:ring-0 text-center max-w-[220px] truncate', {
          shadow: isActiveInput,
        })}
        disabled={!isActiveInput}
        placeholder="Nhập tên phòng"
        value={roomName}
        onChange={(e) => setFieldValue('roomName', e.target.value)}
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
