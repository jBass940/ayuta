import { collection, getDocs } from 'firebase/firestore';
import { makeAutoObservable } from 'mobx';
import rootStore, { RootStore } from '../../store';
import { db } from '../../utils/firebaseConfig';
import { User } from '../../api/user';
import { LoadStatus } from '../../types';
import Api from './../../api';

export type Guest = {
  user: User;
  date: any;
};

class GuestsPageStore {
  rootStore: RootStore;

  guests: Guest[] = [];
  loadStatus: LoadStatus = 'init';

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  setLoadStstus = (loadStatus: LoadStatus) => {
    this.loadStatus = loadStatus;
  };

  get isLoading() {
    return this.loadStatus === 'load';
  }

  getGuests = async () => {
    this.setLoadStstus('load');

    const subColRef = collection(
      db,
      'users',
      String(this.rootStore.authStore.uid),
      'guests'
    );

    let promises: any = [];
    getDocs(subColRef)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const promise = async () => {
            const userId = doc.id;
            const user = await Api.user.get(userId);

            const date = doc.data();

            return {
              user: user,
              date: date.date.seconds * 1000,
            };
          };

          promises.push(promise());
        });
      })
      .then(() => {
        Promise.all(promises)
          .then((res: Guest[]) => {
            if (res?.length > 1) {
              res = res?.sort((a: Guest, b: Guest) => b.date - a.date);
            }

            this.guests = res;
          })
          .then(() => this.setLoadStstus('done'));
      });
  };

  clearGuests = () => {
    this.guests = [];
    this.setLoadStstus('init');
  };
}

const chatsStore = new GuestsPageStore(rootStore);
export default chatsStore;
