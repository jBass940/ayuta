import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import { Gift, Image } from "../types";
import { CityOption } from "../mock/cities";
// import { wallpaperImage } from "./../const";

export type User = {
  id?: string;
  name: string;
  surname: string;
  sex?: string;
  birthday?: Date;
  city?: CityOption;
  email: string;
  status: string;
  invisible: boolean;
  avatar: Image;
  wallpaper: Image;
  friends: (string | User)[];
  gifts: Gift[];
  isOnline?: boolean;
  lastVisitDate?: any;
  isVip?: boolean;
  activeChat: string;
};

const create = async (id: string, fields: any) => {
  const user = {
    invisible: false,
    status: "",
    avatar: "",
    // wallpaper: wallpaperImage,
    ...fields,
  };

  const newUser = await setDoc(doc(db, "users", id), user)
    .then((u) => {
      return u;
    })
    .catch(() => {
      console.debug("ошибка при создании нового пользака");
    });

  return newUser;
};

const get = async (userId: string) => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);

  let user: User | undefined = undefined;
  if (docSnap.exists()) {
    user = {
      id: docSnap.id,
      ...docSnap.data(),
    } as User;
  }

  return user;
};

export default Object.assign({
  create,
  get,
});
