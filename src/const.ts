import { User } from "./api/user";
import { Gift } from "./types";

export const wallpaperSrc =
  "https://firebasestorage.googleapis.com/v0/b/ayuta-5371d.appspot.com/o/static%2Fbg.jpg?alt=media&token=69c4b659-c543-4f8e-8488-779c24ba3ec6";

export const avatarMale =
  "https://firebasestorage.googleapis.com/v0/b/ayuta-5371d.appspot.com/o/static%2FavatarMale.svg?alt=media&token=b34c2e46-fb77-4573-80a7-1db1d3b1f616";

export const avatarFemale =
  "https://firebasestorage.googleapis.com/v0/b/ayuta-5371d.appspot.com/o/static%2FavatarFemale.svg?alt=media&token=a13ed194-e834-4e97-9b0b-0b2aa740a2fa";

export const notificationSoundLink =
  "https://firebasestorage.googleapis.com/v0/b/ayuta-5371d.appspot.com/o/static%2Fnotification.mp3?alt=media&token=3165cf88-57e7-4106-8a5f-96a3b3980c1b";

export const initialUser: User = {
  name: "",
  surname: "",
  sex: undefined,
  birthday: undefined,
  city: undefined,
  email: "",
  status: "",
  invisible: false,
  avatar: {
    imageId: "",
    imageSrc: "",
  },
  wallpaper: {
    imageId: "",
    imageSrc: wallpaperSrc,
  },
  friends: [],
  gifts: [],
  activeChat: "",
};

export const initialFriends: User[] = [
  {
    ...initialUser,
    avatar: {
      imageId: "",
      imageSrc: "/avatarMale.svg",
    },
  },
  {
    ...initialUser,
    avatar: {
      imageId: "",
      imageSrc: "/avatarFemale.svg",
    },
  },
  {
    ...initialUser,
    avatar: {
      imageId: "",
      imageSrc: "/avatarMale.svg",
    },
  },
  {
    ...initialUser,
    avatar: {
      imageId: "",
      imageSrc: "/avatarFemale.svg",
    },
  },
  {
    ...initialUser,
    avatar: {
      imageId: "",
      imageSrc: "/avatarMale.svg",
    },
  },
  {
    ...initialUser,
    avatar: {
      imageId: "",
      imageSrc: "/avatarFemale.svg",
    },
  },
];

export const initialGifts: Gift[] = [
  {
    id: "",
    image: "/gift_new.jpg",
    price: "",
    category: "",
  },
  {
    id: "",
    image: "/gift_new.jpg",
    price: "",
    category: "",
  },
  {
    id: "",
    image: "/gift_new.jpg",
    price: "",
    category: "",
  },
  {
    id: "",
    image: "/gift_new.jpg",
    price: "",
    category: "",
  },
  {
    id: "",
    image: "/gift_new.jpg",
    price: "",
    category: "",
  },
  {
    id: "",
    image: "/gift_new.jpg",
    price: "",
    category: "",
  },
  {
    id: "",
    image: "/gift_new.jpg",
    price: "",
    category: "",
  },
];
