import { IChatDrawerDetail } from './common';

export interface IChatDrawer extends IChatDrawerDetail {
  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
}
