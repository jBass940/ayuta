import { makeAutoObservable, toJS } from "mobx";

type Form = {
  title: string;
  text: string;
  image?: File;
};

const initialForm: Form = {
  title: "",
  text: "",
  image: undefined,
};

class PostStore {
  form: Form = initialForm;

  constructor() {
    makeAutoObservable(this);
  }

  onChange = (e: any) => {
    const { name, value } = e.target;

    if (!this.form) return;

    // @ts-ignore
    this.form[name] = value;
  };

  setAvatarPreview = (file: File) => {
    this.form.image = file;
  };

  submitForm = () => {
    console.log("form data ", toJS(this.form));
  };

  clearForm = () => {
    this.form = initialForm;
  };

  get avatarPreviewLocalUrl() {
    if (!this.form.image) return "";

    return URL.createObjectURL(this.form.image);
  }

  createPost() {
    // сохранить фотку в хранилище с id и получить её урл и id
    // создать пост т е сохранить документ в коллекцию
  }
}

const postStore = new PostStore();
export default postStore;
