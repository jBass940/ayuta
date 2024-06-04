import { makeAutoObservable, runInAction, toJS } from "mobx";
import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./../../utils/firebaseConfig";
import rootStore, { RootStore } from "../../store";
import { Gift, LoadStatus, Post } from "../../types";
import Api from "./../../api";
import { User } from "../../api/user";
import { initialFriends, initialGifts, initialUser } from "../../const";
import { ScrollBlockItem } from "./components/ScrollBlock";

export type ProfileStatus = {
  status: string;
  isLoading: boolean;
};

const initProfileStatus: ProfileStatus = {
  status: "",
  isLoading: false,
};

export class ProfileStore {
  rootStore: RootStore;

  user = initialUser;
  friends: User[] = [];
  gifts: Gift[] = [];
  // noFriends = false;

  avatarPreview?: File;

  galleryImages: Post[] = [];
  activeSlideIndex = 0;

  posts: Post[] = [];

  isOpenGallery = false;
  isOpenGiftWonModal = false;
  isOpenWheelPayDataModal = false;
  isOpenVipModal = false;

  isDropdownOpen = false;

  successModal = {
    isOpen: false,
    text: "",
  };

  giftWonLink = "";

  status: ProfileStatus = initProfileStatus;

  private fetchStatus: LoadStatus = "init";

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  setFetchStatus(status: LoadStatus) {
    this.fetchStatus = status;
  }

  setStatus = (newStatus: Partial<ProfileStatus>) => {
    this.status = { ...this.status, ...newStatus };
  };

  setIsOpenVipModal = (value: boolean) => {
    this.isOpenVipModal = value;
  };

  setAvatarPreview(file: File) {
    this.avatarPreview = file;
    console.debug("this.avatarPreview: ", toJS(this.avatarPreview));
  }

  setIsOpenGallery(value: boolean) {
    this.isOpenGallery = value;
    this.setActiveSlideIndex(0);
  }

  setIsOpenGiftWonModal(value: boolean) {
    this.isOpenGiftWonModal = value;
  }

  setIsOpenWheelPayDataModal(value: boolean) {
    this.isOpenWheelPayDataModal = value;
  }

  setActiveSlideIndex(index: number) {
    this.activeSlideIndex = index;
  }

  updateSuccessModal(newState: any) {
    this.successModal = newState;
  }

  toggleDropdownVisible() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  get avatarPreviewLocalUrl() {
    if (!this.avatarPreview) return "";

    return URL.createObjectURL(this.avatarPreview);
  }

  clearAvatarPreview() {
    this.avatarPreview = undefined;
  }

  setGiftWonLink(link: string) {
    this.giftWonLink = link;
  }

  fetchProfile = (id: string) => {
    this.clearUser();

    // this.fetchUser(id).then(async () => {
    //   await this.getGalleryImages(id);
    //   await this.getFriends();
    //   await this.getGifts(id);
    //   await this.getPosts(id);
    // });

    this.fetchUser(id).then(() => {
      Promise.all([this.getGalleryImages(id), this.getFriends(), this.getPosts(id), this.getGifts(id)]);
    });
  };

  fetchUser = async (userId: string) => {
    this.setFetchStatus("load");

    await Api.user
      .get(userId)
      .then((user: User) => {
        runInAction(() => (this.user = user));
      })
      .catch((e: any) => console.error(e));
    // .finally(() => this.setFetchStatus("done"));
  };

  get isLoadUser() {
    return this.fetchStatus === "init" || this.fetchStatus === "load";
  }

  get noUser() {
    return this.fetchStatus === "error";
  }

  getGalleryImages = async (userId: string) => {
    this.galleryImages = [];

    const subColRef = collection(db, "users", userId, "posts");

    const querySnapshot = await getDocs(subColRef);
    querySnapshot.forEach((doc) => {
      const post = doc.data();

      if (post.isBlog) return;

      this.galleryImages.push({
        postId: doc.id,
        imageSrc: post["imageSrc"],
        imageId: post["imageId"],
      });
    });
  };

  getPosts = async (userId: string) => {
    Api.post.getUserPosts(userId).then((userPosts: Post[]) => {
      runInAction(() => {
        this.posts = userPosts;
      });
      this.setFetchStatus("done");
    });
  };

  getFriends = async () => {
    if (!this.user?.friends) return;

    const friendsId = this.user?.friends;

    let requests = friendsId.map((i) => Api.user.get(i));

    await Promise.all(requests).then((users) => {
      this.friends = users;
    });
  };

  getGifts = async (userId: string) => {
    await Api.gift.getUserGifts(userId).then((gifts: Gift[]) => {
      runInAction(() => {
        this.gifts = gifts?.filter((gift) => gift.type === "RECEIVED");
        this.setFetchStatus("done");
      });
    });
  };

  saveAvatar = async (profileUserId: string) => {
    const userId = this.rootStore.authStore.uid;

    if (!userId) return;

    console.debug("1: ", toJS(profileStore.avatarPreview));
    const savedImage = await Api.file.uploadImage(userId, profileStore.avatarPreview);

    if (!savedImage) return;

    const isSuccessCreatePost = await Api.post
      .create(userId, {
        imageId: savedImage.imageId,
        imageSrc: savedImage.imageSrc,
      })
      .then((r: any) => r);

    if (!isSuccessCreatePost) return;

    await this.rootStore.userStore
      .updateUser({
        avatar: { ...savedImage },
      })
      .then(() => {
        this.rootStore.modalStore.close();
        this.clearAvatarPreview();

        // this.fetchUser(userId).then(() => {
        //   this.getGalleryImages(userId);
        // });

        this.rootStore.userStore.fetchUser();
        this.fetchProfile(profileUserId);
      });
  };

  updateAvatar = (userId: string, callbackFn: any) => {
    const activeSlide = this.galleryImages[profileStore.activeSlideIndex];

    this.rootStore.userStore
      .updateUser({
        avatar: activeSlide,
      })
      .then(() => {
        callbackFn();

        this.toggleDropdownVisible();
        this.setIsOpenGallery(false);
        this.setActiveSlideIndex(0);

        this.fetchUser(userId).then(() => {
          this.rootStore.modalStore.open({ type: "UPDATE_AVATAR" });
          this.getGalleryImages(userId);
        });

        this.rootStore.userStore.fetchUser();
      });
  };

  deleteAvatar = async (userId: string, callbackFn: any, deleteField: any) => {
    callbackFn();

    const activeSlide = this.galleryImages[profileStore.activeSlideIndex];

    await Api.file.deleteImage(userId, activeSlide.imageId).then(async () => {
      if (Number(this.rootStore.userStore?.user?.avatar.imageId) === Number(activeSlide.imageId)) {
        // сравниваем установлена ли удалённая картинка в качестве аватарки
        // если да то сбрасываем значения
        await this.rootStore.userStore.updateUser({
          avatar: deleteField(),
        });
      }

      profileStore.setIsOpenGallery(false);
      profileStore.setActiveSlideIndex(0);

      await this.rootStore.userStore.fetchUser().then(() => {
        profileStore.fetchUser(userId).then(() => {
          profileStore.updateSuccessModal({
            isOpen: true,
            text: "Фотография успешно удалена",
          });

          profileStore.getGalleryImages(userId);
        });
      });
    });
  };

  get isFriend() {
    if (this.user?.friends && this.user?.friends?.includes(String(this.rootStore.authStore.uid))) {
      return true;
    }

    return false;
  }

  addVisit = async (userId: string) => {
    await setDoc(doc(db, "users", userId, "guests", String(this.rootStore.authStore.uid)), {
      date: serverTimestamp(),
    });
  };

  clearUser = () => {
    this.user = initialUser;
    this.friends = [];
    this.gifts = [];
    this.galleryImages = [];
    this.activeSlideIndex = 0;
    this.posts = [];
  };
}

const profileStore = new ProfileStore(rootStore);
export default profileStore;
