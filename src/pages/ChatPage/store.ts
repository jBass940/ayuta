import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  or,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { makeAutoObservable, runInAction } from 'mobx';
import { db } from '../../utils/firebaseConfig';
import rootStore, { RootStore } from '../../store';
import { User } from '../../api/user';
import { Chat } from '../../types';
import { getOpponentId, setAvatarUrl } from '../../utils';
import Api from './../../api';

export type Message = {
  createdAt: any;
  text: string;
  userId: string;
};

class ChatPageStore {
  rootStore: RootStore;

  chats: Chat[] = [];

  messages: Message[] = [];
  messageText: string = '';
  unsubscribe: any = undefined;
  unsubscribeOnlineListener: any = undefined;
  companion?: User;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  init = async (chatId: string, myId: string) => {
    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('createdAt', 'asc')
    );

    this.unsubscribe = onSnapshot(q, (querySnapshot) => {
      let messages: Message[] = [];

      querySnapshot.forEach((doc) => {
        messages.push(doc.data() as Message);
      });

      this.messages = messages;
    });

    this.rootStore.notificationStore.deleteChatNotifications(myId, chatId);

    this.rootStore.userStore.updateUser({ activeChat: chatId });
  };

  removeListener = () => {
    this.unsubscribe();

    runInAction(() => {
      this.companion = undefined;
      this.messages = [];
    });

    this.rootStore.userStore.updateUser({ activeChat: '' });
  };

  watchIsOnlineUser = async (chatId: string) => {
    const opponentId = getOpponentId(
      chatId,
      String(this.rootStore.authStore.uid)
    );

    this.unsubscribeOnlineListener = onSnapshot(
      doc(db, 'users', opponentId),
      (doc) => {
        const data = doc.data();
        this.companion = data as User;
      }
    );
  };

  removeOnlineListener = () => {
    this.unsubscribeOnlineListener();
  };

  getChats = async (userId: string) => {
    // тут поставить лоадер
    this.chats = [];

    const q = query(
      collection(db, 'chats'),
      or(where('userA', '==', userId), where('userB', '==', userId))
      // orderBy("lastMessageDate")
      // orderByChild("timestamp")
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      const user = await Api.user
        .get(getOpponentId(doc.id, String(this.rootStore.authStore.uid)))
        .then((user: User) => user);

      const chat = {
        ...doc.data(),
        avatar: user?.avatar?.imageSrc || setAvatarUrl(user),
        name: `${user?.name} ${user?.surname}`,
        isOnline: Boolean(user?.isOnline),
      };

      this.chats.push(chat as Chat);
    });

    this.chats = this.chats
      .sort((a, b) => a?.lastMessageDate?.seconds - b?.lastMessageDate?.seconds)
      .reverse();
  };

  updateMessageText = (messageText: string) => {
    this.messageText = messageText;
  };

  sendMessage = (chatId: string, authorId: string) => {
    const messagesCollectionRef = collection(db, 'chats', chatId, 'messages');

    addDoc(messagesCollectionRef, {
      createdAt: serverTimestamp(),
      text: this.messageText,
      userId: authorId,
    }).then(async () => {
      const chatDoc = doc(db, 'chats', chatId);

      return await updateDoc(chatDoc, {
        lastMessageDate: serverTimestamp(),
        lastMessageText: this.messageText,
        lastMessageUserId: authorId,
      }).then(async () => {
        this.updateMessageText('');

        // отправить нотификацию
        const companionId = chatId
          .split('__')
          .filter((user) => user !== authorId)[0];

        // тут просто прочекать онлайн он или нет один раз
        // const chatDoc = doc(db, 'chats', chatId);
        // const chatData = await getDoc(chatDoc);

        // if (chatData.exists()) {
        //   const chatInfo = chatData.data();
        //   console.log('chatInfo >>> ', chatInfo);

        //   let onlineStatus = false;
        //   if (companionId === chatInfo.userA)
        //     onlineStatus = chatInfo.isUserAonline;
        //   if (companionId === chatInfo.userB)
        //     onlineStatus = chatInfo.isUserBonline;
        // }

        if (this.companion?.activeChat === chatId) return;

        this.rootStore.notificationStore
          .create(companionId, {
            userId: companionId,
            type: 'CHAT',
            chatId: chatId,
          })
          .then(() => console.log('success add notification'));
      });
      // .catch(() => console.error("updateStatus error"));
    });
  };
}

const chatPageStore = new ChatPageStore(rootStore);
export default chatPageStore;
