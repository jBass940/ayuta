import { User } from './api/user';
import { avatarFemale, avatarMale } from './const';

export const setAvatarUrl = (user: User) => {
  if (!user?.avatar?.imageSrc) {
    return user?.sex === 'male' ? avatarMale : avatarFemale;
  }

  return user?.avatar?.imageSrc;
};

export const setUserName = (user?: User) => {
  if (!user) {
    return '-';
  }

  return `${user.name} ${user.surname}`;
};

export const getOpponentId = (chatId: string, myId: string) => {
  return chatId.split('__').filter((userId) => userId !== myId)?.[0];
};

export const generateChatId = (userA: string, userB: string) => {
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
