import { makeAutoObservable, runInAction } from 'mobx';
import rootStore, { RootStore } from '../../../../store';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '../../../../utils/firebaseConfig';
import Api from './../../../../api';
import { Gift } from '../../../../types';
import { getOpponentId } from '../../../../utils';

type Draft = {
  id: string;
  message: string;
  userA: string;
  userB: string;
};

const initDraft = {
  id: '',
  message: '',
  userA: '',
  userB: '',
};

export class ActionButtonsStore {
  rootStore: RootStore;

  draft: Draft = initDraft;
  userGifts: Gift[] = [];
  gift?: Gift;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  setGift = (gift?: Gift) => {
    if (gift === undefined) {
      this.gift = undefined;
    } else {
      this.gift = {
        ...gift,
        comment: '',
        isVisible: false,
      };
    }
  };

  updateGift = (key: string, value: string | boolean) => {
    // @ts-ignore
    this.gift[key] = value;
  };

  getOpponentId = (chatId: string) => {
    return chatId
      .split('__')
      .filter((userId) => userId !== this.rootStore.authStore.uid)?.[0];
  };

  generateChatId = (userA: string, userB: string) => {
    let key1 = '';
    let key2 = '';

    if (userA > userB) {
      key1 = userB;
      key2 = userA;
    } else {
      key1 = userA;
      key2 = userB;
    }

    return `${key1}__${key2}`;
  };

  checkChatExist = async (
    userA: string,
    userB: string,
    redirectToChat: (chatId: string) => void
  ) => {
    const chatId = this.generateChatId(userA, userB);
    const chatRef = doc(db, 'chats', chatId);

    const docSnap = await getDoc(chatRef);

    if (docSnap.exists()) {
      redirectToChat(chatId);
    } else {
      this.draft.id = chatId;
      this.rootStore.modalStore.open({ type: 'FIRST_MESSAGE' });
    }
  };

  updateMessageTextDraft = (text: string) => {
    this.draft.message = text;
  };

  submitFirstMessage = async (
    authorId: string,
    redirectToChat: (chatId: string) => void
  ) => {
    const chatRef = doc(db, 'chats', this.draft.id);

    await setDoc(chatRef, {
      userA: this.draft.id.split('__')[0],
      isUserAonline: false,
      userB: this.draft.id.split('__')[1],
      isUserBonline: false,
      lastMessageText: this.draft.message,
      lastMessageDate: serverTimestamp(),
      lastMessageUserId: authorId,
    });

    const messagesCollectionRef = collection(
      db,
      'chats',
      this.draft.id,
      'messages'
    );

    addDoc(messagesCollectionRef, {
      createdAt: serverTimestamp(),
      text: this.draft.message,
      userId: authorId,
    }).then(() => {
      redirectToChat(String(this.draft.id));

      const opponentId = getOpponentId(
        this.draft.id,
        String(this.rootStore.authStore.uid)
      );

      this.rootStore.notificationStore
        .create(opponentId, {
          userId: opponentId,
          type: 'CHAT',
          chatId: this.draft.id,
        })
        .then(() => {
          console.log('success add notification');
        });

      this.draft = initDraft;
      this.rootStore.modalStore.close();
    });
  };

  getUserGifts = async () => {
    const userId = this.rootStore.authStore.uid;

    return await Api.gift.getUserGifts(userId).then((gifts: Gift[]) => {
      // runInAction(() => {
      //   const item = gifts.filter((gift) => gift.type === 'WON')[0];
      //   this.userGifts = Array(120).fill(item);
      // });

      runInAction(() => {
        this.userGifts = gifts.filter((gift) => gift.type === 'WON');
      });
    });
  };

  submitGift = async (userId: string) => {
    console.log('selected gift ', this.gift);

    const deletedGiftUid = this.gift?.uid;

    const q = query(
      collection(db, 'users', String(this.rootStore.authStore.uid), 'gifts')
    );

    await getDocs(q).then((docs) => {
      docs.forEach(async (doc) => {
        if (doc.id === deletedGiftUid) {
          await deleteDoc(doc.ref);
        } else {
          return Promise.resolve();
        }
      });
    });

    const gift = {
      ...this.gift,
      type: 'RECEIVED',
      donatorId: String(this.rootStore.authStore.uid),
    };

    delete gift.uid;

    await Api.gift.addGiftToUser(userId, gift);
  };
}

const actionButtonsStore = new ActionButtonsStore(rootStore);
export default actionButtonsStore;
