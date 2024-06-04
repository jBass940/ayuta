import { makeAutoObservable, toJS } from "mobx";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import { RootStore } from ".";
// import { wallpaperImage } from "../const";
import { LoadStatus } from "../types";
import Api from "./../api/";
import { User } from "../api/user";
import { initialUser } from "../const";

export type Sex = "MALE" | "FEMALE";

export class UserStore {
  rootStore: RootStore;

  user: User = initialUser;

  // wp = wallpaperImage;

  private status: LoadStatus = "init";

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  setStatus(status: LoadStatus) {
    this.status = status;
  }

  // setWp(wp?: string) {
  //   if (!wp) return;
  //   this.wp = wp;
  // }

  setUser = (user: User) => {
    this.user = user;
  };

  clearUser = () => {
    this.user = initialUser;
  };

  createUser = async (userId: string, fields: any) => {
    this.setStatus("load");

    await Api.user
      .create(userId, fields)
      .then((user: User) => this.setUser(user))
      .catch((e: any) => console.error(e))
      .finally(() => this.setStatus("done"));
  };

  fetchUser = async (id?: string) => {
    if (!this.rootStore.authStore.uid) return;

    const userId = id || this.rootStore.authStore.uid;

    // this.setStatus("load");

    await Api.user
      .get(userId)
      .then((newUser: User) => {
        this.setUser({
          ...this.user,
          ...newUser,
        });
      })
      .catch((e: any) => console.error(e));
    // .finally(() => this.setStatus("done"));

    console.debug("this.user: ", toJS(this.user));
  };

  updateUser = async (updatedFields: any, userId?: string) => {
    if (!this.rootStore?.authStore?.uid) return;

    const id = userId || this.rootStore?.authStore?.uid;

    const userDoc = doc(db, "users", id);

    await updateDoc(userDoc, {
      ...updatedFields,
    })
      .then(() => console.log("update user success"))
      .catch((e) => console.log(e));
  };

  get isLoadUser() {
    return this.status === "done";
  }
}
