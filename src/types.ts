import { Dayjs } from 'dayjs';
// import { SlideImage } from 'yet-another-react-lightbox/*';
import { CityOption } from './mock/cities';

export type Field =
  | string
  | boolean
  | null
  | undefined
  | Dayjs
  | CityOption
  | Partial<Post>
  | Date;

export type LoadStatus = 'init' | 'load' | 'done' | 'error';
export type FetchState = 'pending' | 'done' | 'error';

// export type Image = SlideImage & {
//   title: string;
//   description: string;
// };

export type GiftType = 'WON' | 'RECEIVED';

export type Gift = {
  uid?: string;
  id: string;
  image: string;
  price: string;
  category: string;
  type?: GiftType;
  comment?: string;
  isVisible?: boolean;
  donatorId?: string;
};

export type Image = {
  // createdAt: number;
  imageId: string;
  imageSrc: string;
};

export type Post = Image & {
  postId?: string;
  isBlog?: false;
  text?: string;
  title?: string;
};

export type Chat = {
  id?: string;
  lastMessageDate: any;
  lastMessageText: string;
  lastMessageUserId: string;
  userA: string;
  isUserAonline: boolean;
  userB: string;
  isUserBonline: boolean;
  avatar?: string;
  name?: string;
  isOnline: boolean;
};
