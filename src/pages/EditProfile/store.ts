import dayjs, { Dayjs } from 'dayjs';
import { makeAutoObservable } from 'mobx';
import Api from './../../api';
import { FetchState, Field } from '../../types';
import { User } from '../../api/user';
import { CityOption } from '../../mock/cities';
import rootStore, { RootStore } from './../../store';
// import { wallpaperImage } from '../../const';
// import { MODAL_TYPE } from '../../store/modalStore';

const initialFields: Record<string, Field> = {
  name: undefined,
  surname: undefined,
  birthday: null,
  city: null,
  invisible: false,
  wallpaper: undefined,
};

class EditProfileStore {
  rootStore: RootStore;

  fields = initialFields;
  wallpaperFile: File | undefined = undefined;
  isChangeWallpaper = false;

  fetchState: FetchState = 'done';

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  setFetchState = (fetchState: FetchState) => {
    this.fetchState = fetchState;
  };

  setFields = (fields: User) => {
    this.fields = {
      ...this.fields,
      name: fields['name'],
      surname: fields['surname'],
      birthday: fields['birthday'],
      city: fields['city'] as unknown as CityOption,
      invisible: fields['invisible'],
      wallpaper: fields['wallpaper'],
    };
  };

  onChange = (e: any) => {
    const { name, value } = e.target;

    if (!this.fields) return;

    this.fields[name] = value as string;
  };

  onChangeWallpaper = (value: any) => {
    this.fields.wallpaper = value;
  };

  setDate = (newValue: Dayjs) => {
    this.fields.birthday = newValue;
  };

  setCity = (newValue: CityOption | null) => {
    this.fields.city = newValue;
  };

  setWallpaperFile = (e: any) => {
    this.wallpaperFile = e.target.files[0];
  };

  changeWallpaper = () => {
    this.isChangeWallpaper = true;
  };

  toggleInvisible = (newValue: boolean) => {
    this.fields.invisible = newValue;
  };

  submitForm = async () => {
    this.setFetchState('pending');

    const payload: Record<string, any> = {
      name: this.fields['name'],
      surname: this.fields['surname'],
      // birthday: (this.fields['birthday'] as Dayjs).format(),
      birthday: dayjs(this.fields['birthday'] as Dayjs).format(),
      city: this.fields['city'] as unknown as CityOption,
      invisible: this.fields['invisible'],
    };

    if (this.isChangeWallpaper) {
      const wallpaper = await Api.file.uploadImage(
        this.rootStore.authStore.uid,
        this.wallpaperFile
      );

      payload['wallpaper'] = {
        imageId: wallpaper.imageId,
        imageSrc: wallpaper.imageSrc,
      };
    } else {
      payload['wallpaper'] = this.fields['wallpaper'];
    }

    this.rootStore.userStore.updateUser(payload).then(() => {
      this.rootStore.userStore.fetchUser();
      this.setFetchState('done');
      this.rootStore.modalStore.open({
        type: 'SUCCESS_UPDATE_PROFILE',
        title: 'Профиль успешно обновлён',
      });
    });
  };

  get imagePreview() {
    if (!this.wallpaperFile) return undefined;

    return URL.createObjectURL(this.wallpaperFile);
  }

  get isLoading() {
    return this.fetchState === 'pending';
  }
}

const editProfileStore = new EditProfileStore(rootStore);
export default editProfileStore;
