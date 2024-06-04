import { makeAutoObservable, toJS } from "mobx";
import { RootStore } from ".";
import { addDoc, collection, doc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";

export type SubscriptionType = "VIP" | "WHEEL";

export type Subscription = {
  docId: string;
  type: SubscriptionType;
  month?: number;
  createdAt: number;
  periodStart?: any;
  periodEnd?: any;
  attemptsCount?: number;
  isAdViewed?: boolean;
};

export class SubscribtionsStore {
  rootStore: RootStore;

  subscriptions: Subscription[] = [];

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);

    this.rootStore = rootStore;
  }

  get = async () => {
    if (!this.rootStore.authStore.uid) return;

    this.subscriptions = [];

    const docRef = collection(db, "users", this.rootStore.authStore.uid, "subscriptions");
    const subscriptions = await getDocs(docRef);

    let subscriptionsBuffer: Subscription[] = [];

    subscriptions.forEach((doc) => {
      const { type, month, createdAt, periodStart, attemptsCount, isAdViewed } = doc.data();

      // вот тут проверить срок подписки. не валидные выкинуть

      subscriptionsBuffer.push({
        docId: doc.id,
        type,
        month,
        attemptsCount,
        createdAt: createdAt.seconds * 1000,
        isAdViewed,
        periodStart: periodStart ? periodStart.seconds * 1000 : undefined,
      });
    });

    this.subscriptions = subscriptionsBuffer;

    console.debug("подписки пользователя ", toJS(this.subscriptions));
  };

  create = async (newSubscription: Partial<Subscription>) => {
    if (!this.rootStore.authStore.uid) return;

    const subscriptionDocRef = collection(db, "users", this.rootStore.authStore.uid, "subscriptions");

    await addDoc(subscriptionDocRef, {
      ...newSubscription,
      createdAt: serverTimestamp(),
    }).then(() => this.get());
  };

  update = async ({ id, payload }: { id: string; payload: Partial<Subscription> }) => {
    if (!this.rootStore.authStore.uid) return;

    const subscriptionDocRef = doc(db, "users", this.rootStore.authStore.uid, "subscriptions", id);

    await updateDoc(subscriptionDocRef, payload).then(() => this.get());
  };

  getSubscriptionByType = (subscriptionType: SubscriptionType) => {
    if (!this.subscriptions.length) return;

    return this.subscriptions.find((subscription) => subscription.type === subscriptionType);
  };
}
