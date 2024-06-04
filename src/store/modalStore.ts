import { makeAutoObservable } from "mobx";
import { RootStore } from ".";

export type MODAL_TYPE =
  | "AUTH_INVITATION"
  | "FIRST_MESSAGE"
  | "SEND_INVITE"
  | "SHOW_GIFT"
  | "BUY_WHEEL_SUBSCRIPTION"
  | "GIFT_WON"
  | "SHOW_AD"
  | "SET_AVATAR"
  | "SUCCESS_SET_AVATAR"
  | "GALLERY"
  | "UPDATE_AVATAR"
  | "SUCCESS_SET_STATUS"
  | "SUCCESS_UPDATE_PROFILE"
  | "GIVE_GIFT"
  | "SELECT_GIFT"
  | "SHOW_RECEIVED_GIFT";

const BASE_TYPE = ["SUCCESS_SET_STATUS", "SUCCESS_UPDATE_PROFILE"];

export class ModalStore {
  rootStore: RootStore;

  type: MODAL_TYPE | undefined = undefined;
  title: string | undefined = undefined;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  open = ({ type, title }: { type: MODAL_TYPE; title?: string }) => {
    this.type = type;
    this.title = title;
  };

  close = () => {
    this.type = undefined;
    this.title = undefined;
  };

  visible(type?: MODAL_TYPE) {
    return this.type === type;
  }

  get baseType() {
    if (!this.type) return false;
    return BASE_TYPE.includes(this.type);
  }
}
