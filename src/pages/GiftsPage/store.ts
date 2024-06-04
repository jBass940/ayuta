import { makeAutoObservable, action, runInAction } from 'mobx';
// import { collection, getDocs, query, where } from 'firebase/firestore';
// import { db } from '../../utils/firebaseConfig';
// import rootStore from '../../store';
import { Gift, LoadStatus } from '../../types';
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

  gifts: Gift[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  fetchGifts = (userId: string) => {
    this.status = 'load';
    this.clear();

    Api.gift.getUserGifts(userId).then((gifts: Gift[]) => {
      runInAction(() => {
        console.log('gifts >>> ', gifts);
        this.gifts = gifts?.filter((gift) => gift.type === 'RECEIVED');
        this.status = 'done';
      });
    });
  };

  clear() {
    this.gifts = [];
  }

  get isLoadUsers() {
    return this.status === 'load';
  }
}

const store = new Store();
export default store;
