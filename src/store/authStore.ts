import { makeAutoObservable, runInAction } from "mobx";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./../utils/firebaseConfig";
import { Dayjs } from "dayjs";
import { RootStore } from ".";
import { User } from "../api/user";
import { CityOption } from "../mock/cities";
import { FetchState } from "../types";

export class AuthStore {
  rootStore: RootStore;

  uid: string | undefined = undefined;
  fetchState: FetchState = "done";

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;

    // this.checkAuth();
  }

  setUid = (uid: string) => {
    this.uid = uid;
  };

  register = async (fields: any, successCallback: (userId: string) => void) => {
    this.fetchState = "pending";

    const auth = getAuth();
    const userUid = await createUserWithEmailAndPassword(auth, fields.email as string, fields.password as string)
      .then(async (userCredential) => {
        return userCredential.user.uid;
      })
      .catch((error) => {
        console.log(error.code, error.message);
        this.rootStore.notificationStore.setNotificationtext("В регистрации произошла ошибка. Попробуйте ещё раз");
      })
      .finally(() => (this.fetchState = "done"));

    if (!userUid) return;

    this.rootStore.userStore
      .createUser(userUid, {
        name: fields.name,
        surname: fields.surname,
        birthday: (fields.birthday as Dayjs).format(),
        city: fields.city as CityOption,
        sex: fields.sex,
        email: fields.email,
        activeChat: "",
      })
      .then(() => {
        this.rootStore.userStore.fetchUser(userUid);
        this.rootStore.notificationStore.createDb(userUid).then(() => {
          successCallback(userUid);
        });
      })
      .catch(() => {
        this.rootStore.notificationStore.setNotificationtext("В процессе регистрации произошла ошибка. Попробуйте ещё раз");
      });
  };

  login = async (email: string, password: string, successCb: (uid: string) => void) => {
    this.fetchState = "pending";

    console.log(email, password);

    const auth = getAuth();

    await signInWithEmailAndPassword(auth, email, password)
      .then(async ({ user }) => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const _user = docSnap.data() as User;
          this.rootStore.userStore.setUser(_user);
          successCb(String(user.uid));
        }
      })
      .catch((e) => {
        console.error(e);
        this.rootStore.notificationStore.setNotificationtext("Проверьте корректность введенных данных и попробуйте ещё раз");
      })
      .finally(() => (this.fetchState = "done"));
  };

  logOut = async () => {
    // сначала выводит онлайн статус в false
    await this.rootStore.userStore.updateUser({ isOnline: false });

    const auth = getAuth();
    await signOut(auth)
      .then(() => {
        runInAction(() => {
          this.uid = "";
          this.rootStore.userStore.clearUser();
        });

        // successCallback();
      })
      .catch((error) => {
        console.error(error);
        // this.rootStore.notificationStore.setNotificationtext('Ошибка');
      });
  };

  checkAuth = () => {
    const auth = getAuth();
    onAuthStateChanged(
      auth,
      async (user) => {
        const uid = user ? String(user?.uid) : "";

        this.setUid(uid);

        if (!uid) return;

        if (this.uid) {
          await this.rootStore.userStore.fetchUser();
          await this.rootStore.subscribtionsStore.get();
        }

        return;
      },
      () => {
        // not auth
        runInAction(() => (this.uid = ""));
        return false;
      }
    );
  };

  get isAuth() {
    return this.uid !== "";
  }

  get isLoading() {
    return this.fetchState === "pending";
  }
}
