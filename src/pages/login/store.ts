import { makeAutoObservable } from 'mobx';

const initialFields: Record<string, Record<string, string>> = {
  email: {
    value: '',
    error: '',
  },
  password: {
    value: '',
    error: '',
  },
};

class LoginStore {
  fields = initialFields;
  isShowPassword = false;

  constructor() {
    makeAutoObservable(this);
  }

  onChange(e: any) {
    const { name, value } = e.target;

    this.fields[name] = {
      value: value as string,
      error: '',
    };
  }

  togglePasswordVisible = () => {
    this.isShowPassword = !this.isShowPassword;
  };
}

const loginStore = new LoginStore();
export default loginStore;
