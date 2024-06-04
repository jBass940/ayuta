import { makeAutoObservable } from "mobx";
import { Gift } from "../../types";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";
import { Subscription } from "../../store/subscriptionsStore";
import dayjs from "dayjs";

class Store {
  degree = 0;
  isShowCloseAdModalBtn = false;

  gift?: Gift;

  timer: any = null;
  seconds = 0;

  subscription: Subscription | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  setGift = (gift?: Gift) => {
    this.gift = gift;
  };

  runShowCloseBtn = () => {
    setTimeout(() => (this.isShowCloseAdModalBtn = true), 8000);
  };

  generateDegrees = () => {
    const randomDegree = Math.round(Number(Math.random().toFixed(5)) * 10000);

    if (randomDegree < 1000) return 1000;
    if (randomDegree > 5000) return 5000;

    return randomDegree;
  };

  addGift = async (userId: string, gift: Gift) => {
    const giftsCollectionRef = collection(db, "users", userId, "gifts");

    await addDoc(giftsCollectionRef, gift)
      .then(() => {
        console.log("add gift success");
        this.setGift(gift);
      })
      .catch(() => console.log("add gift error"));
  };

  checkWheelStatus = (subscription: Subscription | undefined, updateWheelCb: () => void) => {
    this.subscription = subscription;

    // (1) - если нет активной подписки (нет активной подписки - нет и таймера)
    // так же если есть аквтиная подписка, но нет periodStart (т е нет времени первого кручения)
    if (!subscription || !subscription?.periodStart) {
      this.seconds = 0;
      this.deleteTimer();
      return;
    }

    // (2) - далее смотрим если

    // если актвная подписка есть
    // если есть время первого кручения то устанавливаем таймер
    // если нет времени первого кручения то устанавливаем таймер

    // (2) - если превышен период с первого кручения
    // if (diff >= 120) {
    //   updateWheelCb();
    //   return;
    // }

    // (3) - если есть подписка, но не подходит по условию
    // if (noAttempts && isAdViewed && diff < 120) {
    this.createTimer(updateWheelCb);
    //   return;
    // }

    // (4) - default
    // this.seconds = 0;
    // this.deleteTimer();
  };

  createTimer = (updateWheelCb: () => void) => {
    // const noAttempts = subscription?.attemptsCount === 0;
    // const isAdViewed = subscription?.isAdViewed;
    const start = dayjs(this.subscription?.periodStart).add(1, "day");
    const end = dayjs(Date.now());

    console.debug("this.subscription?.periodStart >>> ", this.subscription?.periodStart);
    console.debug("Date.now() >>> ", Date.now());

    const seconds = end.diff(start, "seconds");

    console.debug("diff ", seconds);

    this.seconds = seconds;

    this.deleteTimer();

    this.timer = setInterval(() => {
      console.debug("this.seconds >>> ", this.seconds);

      if (this.seconds >= 120) {
        this.seconds = 0;
        this.deleteTimer();
        updateWheelCb();
      }

      this.seconds = this.seconds - 1;

      // if (this.seconds <= 0) {
      //   this.deleteTimer();
      //   updateWheelCb();
      // }
    }, 1000);
  };

  deleteTimer = () => {
    clearInterval(this.timer);
  };
}

const store = new Store();
export default store;
