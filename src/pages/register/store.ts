import { Dayjs } from 'dayjs';
import { makeAutoObservable } from 'mobx';
import { CityOption } from '../../mock/cities';
import { Field } from '../../types';

const initialFields: Record<string, Field> = {
  name: undefined,
  surname: undefined,
  birthday: null,
  city: null,
  sex: undefined,
  email: undefined,
  password: undefined,
  passwordConfirm: undefined,
  termOfUse: false,
};

class RegisterStore {
  fields = initialFields;

  isShowPassword = false;
  isShowPasswordConfirm = false;

  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  setIsLoading = (value: boolean) => {
    this.isLoading = value;
  };

  onChange(e: any) {
    const { name, value } = e.target;

    this.fields[name] = value as string;
  }

  setDate(newValue: Dayjs) {
    this.fields.birthday = newValue;
  }

  setCity(newValue: CityOption | null) {
    this.fields.city = newValue;
  }

  toggleIsShowPassword() {
    this.isShowPassword = !this.isShowPassword;
  }

  onChangeCheckbox(e: any) {
    const { name, checked } = e.target;
    this.fields[name] = checked as boolean;
  }

  get isDisabled() {
    return Object.values(this.fields).some((field) => !field);
  }

  togglePasswordVisible = () => {
    this.isShowPassword = !this.isShowPassword;
  };

  toggleConfirmPasswordVisible = () => {
    this.isShowPasswordConfirm = !this.isShowPasswordConfirm;
  };

  clear() {
    this.fields = initialFields;
    this.isShowPassword = false;
    this.isShowPasswordConfirm = false;
    this.isLoading = false;
  }
}

const registerStore = new RegisterStore();
export default registerStore;
