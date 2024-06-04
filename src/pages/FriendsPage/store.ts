import { makeAutoObservable, action } from 'mobx';
// import { collection, getDocs, query, where } from 'firebase/firestore';
// import { db } from '../../utils/firebaseConfig';
// import rootStore from '../../store';
import { LoadStatus } from '../../types';
import { User } from '../../api/user';
import Api from '../../api';
// const { authStore } = rootStore;

const initParams: Record<string, string> = {
  name: '',
  surname: '',
  sex: '',
};

export class Store {
  params = initParams;
  private status: LoadStatus = 'init';

  friends: User[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  async fetchFriends(userId: string) {
    this.clear();

    this.status = 'load';

    const user = await Api.user.get(userId);

    if (!user?.friends) return;

    const friendsId = user?.friends;

    let requests = friendsId.map((i: any) => Api.user.get(i));

    await Promise.all(requests).then((users) => {
      this.friends = users;
    });

    this.status = 'done';
  }

  clear() {
    this.friends = [];
  }

  get isLoadUsers() {
    return this.status === 'load';
  }
}

const store = new Store();
export default store;
