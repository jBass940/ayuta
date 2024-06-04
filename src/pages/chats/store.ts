import {
  doc,
  collection,
  onSnapshot,
  or,
  query,
  where,
} from 'firebase/firestore';
import { makeAutoObservable } from 'mobx';
import rootStore, { RootStore } from '../../store';
import { db } from '../../utils/firebaseConfig';
import { User } from '../../api/user';
import { getOpponentId } from '../../utils';
import { Chat } from '../../types';
class ChatsStore {
  rootStore: RootStore;

  chats: Record<string, Chat> = {};
  chatsSubscriber: any = undefined;

  userSubscribers: any[] = [];
  users: Record<string, User> = {};

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  listen = async () => {
    const userId = this.rootStore.authStore.uid;

    const q = query(
      collection(db, 'chats'),
      or(where('userA', '==', userId), where('userB', '==', userId))
    );

    let chats: Record<string, Chat> = {};
    this.chatsSubscriber = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach(async (doc) => {
        const id = doc.id;

        const chat: Chat = {
          id: doc.id,
          ...doc.data(),
        } as Chat;

        chats[id] = chat;

        this.subscribeToUser(chat);
      });

      this.chats = chats;
      chats = {};
    });
  };

  subscribeToUser = (chat: Chat) => {
    if (String(chat?.id) in this.userSubscribers) return;

    const opponentId = getOpponentId(
      String(chat?.id),
      String(this.rootStore.authStore.uid)
    );

    const subscriber = onSnapshot(doc(db, 'users', opponentId), (doc) => {
      this.users[opponentId] = doc.data() as User;
    });

    this.userSubscribers.push(subscriber);
  };

  close = () => {
    // отписка от прослушивания чатов
    this.chatsSubscriber();

    // отписка от прослушивания пользователей
    Object.entries(this.userSubscribers).forEach(([_, item]) => item());
  };
}

const chatsStore = new ChatsStore(rootStore);
export default chatsStore;
