export interface Item {
  id: string;
  date: string;
}

export interface Photo extends Item {
  src: string;
  isVideo: boolean;
}

export interface File extends Item {
  name: string;
  size: string;
}

export interface IModalImageSetData {
  setVisible: Dispatch<SetStateAction<boolean>>;
  setImageView: Dispatch<SetStateAction<string>>;
}

export interface IChatDrawerDetail extends IModalImageSetData {
  visible: boolean;
  imageView: string;
  roomId: string;
}

declare global {
  interface Window {
    electronAPI: {
      sendNotification: (data: { title: string; message: string }) => void;
      onNewMessage: (
        callback: (event: Event, message: { text: string }) => void
      ) => void;
    };
  }
}
