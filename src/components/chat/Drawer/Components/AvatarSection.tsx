import ChangeLogoIcon from '../../../../assets/icons/change-logo';
import UserAvatar from '../../../common/UserAvatar';

export const AvatarSection: React.FC<{
  roomInfo: any;
  isLeader: boolean;
  avatars: string;
  setAvatars: (avatars: string) => void;
  handleUploadImage: (file: File) => Promise<string | undefined>;
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  submitForm: () => void;
}> = ({
  roomInfo,
  isLeader,
  avatars,
  setAvatars,
  handleUploadImage,
  setFieldValue,
  submitForm,
}) => {
  return (
    <div className="group relative">
      <UserAvatar
        fullName={roomInfo.room_name}
        senderId={
          roomInfo.is_group ? roomInfo.id : roomInfo.userRoom[0].user_id
        }
        url={avatars}
        size={60}
      />
      {roomInfo.is_group && isLeader && (
        <div
          className="group-hover:block hidden absolute -bottom-[2px] -right-2 z-10 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            document.getElementById('avatars')?.click();
          }}
        >
          <ChangeLogoIcon />
        </div>
      )}
      <input
        type="file"
        className="hidden"
        id="avatars"
        name="avatars"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file) {
            const uploadedAvatar = await handleUploadImage(file);
            if (uploadedAvatar) {
              setAvatars(uploadedAvatar);
              setFieldValue('avatars', uploadedAvatar);
              setTimeout(() => submitForm(), 0);
            }
          }
        }}
        title="gửi ảnh"
      />
    </div>
  );
};
