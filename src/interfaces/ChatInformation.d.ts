import { File, Photo } from './common';

export interface IChatInformationProps {
  setActiveTab: Dispatch<SetStateAction<'photos' | 'files' | null>>;
  photos: Photo[];
  files: File[];
  setVisible: Dispatch<SetStateAction<boolean>>;
  setImageView: Dispatch<SetStateAction<string>>;
}
