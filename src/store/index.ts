import { AuthStore } from './authStore';
import { UserStore } from './userStore';
import { ModalStore } from './modalStore';
import { NotificationStore } from './notificationStore';
import { SubscribtionsStore } from './subscriptionsStore';

export class RootStore {
  authStore = new AuthStore(this);
  userStore = new UserStore(this);
  modalStore = new ModalStore(this);
  notificationStore = new NotificationStore(this);
  subscribtionsStore = new SubscribtionsStore(this);
}

const store = new RootStore();

export default store;
