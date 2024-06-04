import { makeAutoObservable, runInAction } from 'mobx';
import {
  doc,
  setDoc,
  updateDoc,
  getDocs,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';
import { RootStore } from '.';
import notificationSound from './../assets/notification.mp3';
import Api from './../api';
import { User } from '../api/user';
import { setAvatarUrl } from '../utils';

export type Notification = {
  uid: string;
  userId: string; // кому адресована нотификация
  type: string;
  isRead: boolean;
  status?: 'AWAITED' | 'ACCEPTED' | 'REJECTED';
  chatId?: string;
  inviteUserId?: string;
  avatar?: string;
  userName?: string;
};

export class NotificationStore {
  rootStore: RootStore;

  notifications: Notification[] = [];
  inviteNotifications: Notification[] = [];
  isSubscribe = false;

  notificationText = '';

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  createDb = async (userId: string) => {
    await setDoc(doc(db, 'users', userId, 'notifications', 'init'), {})
      .then(() => {
        console.log('notification created');
      })
      .catch(() => alert('notification create error'));
  };

  subscribe = (userId: string) => {
    const q = query(collection(db, 'users', userId, 'notifications'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log('catch update');

      let oldNotifications: Notification[] = this.notifications;
      let newNotifications: Notification[] = [];

      querySnapshot.forEach((doc) => {
        newNotifications.push({ ...doc.data(), uid: doc.id } as Notification);
      });

      console.log('newNotifications >>> ', newNotifications);

      this.notifications = newNotifications.filter((n) => n?.uid !== 'init');
      this.combineInviteNotifications();
    });

    runInAction(() => {
      this.isSubscribe = true;
    });

    console.log('subscribe to notification collection ');
  };

  readNotifications = async (userId: string, type: string) => {
    const q = query(
      collection(db, 'users', userId, 'notifications'),
      // where('userId', '==', userId),
      // where("type", "==", "friend") // fix with props
      where('type', '==', type)
    );

    await getDocs(q).then((notificationsSnapshot) => {
      notificationsSnapshot.forEach(async (doc) => {
        // console.log(doc.id, ' => ', doc.data());

        await updateDoc(doc.ref, {
          isRead: true,
        });
      });
    });
  };

  playSound = () => {
    const audio = new Audio(notificationSound);
    audio.play();
  };

  get unreadFriendInviteNotifications() {
    return this.notifications.filter(
      (notification) => notification.type === 'FRIEND' && !notification.isRead
    )?.length;
  }

  get unreadChatNotifications() {
    return this.notifications.filter(
      (notification) => notification.type === 'CHAT'
    )?.length;
  }

  create = async (userId: string, notification: Partial<Notification>) => {
    await addDoc(collection(db, 'users', userId, 'notifications'), {
      ...notification,
    })
      .then(() => {
        console.log('add notification');
      })
      .catch(() => alert('add notification'));
  };

  deleteChatNotifications = async (userId: string, chatId: string) => {
    const q = query(
      collection(db, 'users', userId, 'notifications'),
      where('chatId', '==', chatId)
    );

    await getDocs(q).then((notificationsSnapshot) => {
      notificationsSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    });
  };

  combineInviteNotifications = () => {
    let invites = this.notifications.filter((n) => n.type === 'FRIEND');

    let requests = invites.map((i) => Api.user.get(i.inviteUserId));

    Promise.all(requests).then((resp) => {
      invites.forEach((invite, index) => {
        invites[index] = {
          ...invite,
          avatar:
            resp?.[index]?.avatar.src || setAvatarUrl(resp[index] as User),
          userName: `${resp?.[index]?.name} ${resp?.[index]?.surname}`,
        };
      });
      this.inviteNotifications = invites;
    });
  };

  updateNotification = async (
    userId: string,
    notificationUid: string,
    data: Partial<Notification>
  ) => {
    const notificationDocRef = doc(
      db,
      'users',
      userId,
      'notifications',
      notificationUid
    );

    await updateDoc(notificationDocRef, {
      ...data,
    });
  };

  setNotificationtext = (notificationtext: string) => {
    this.notificationText = notificationtext;
  };
}
