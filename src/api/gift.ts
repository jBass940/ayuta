import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';
import { Gift } from '../types';

const getShopGifts = async () => {
  const q = query(collection(db, 'gifts'), orderBy('id'));

  const querySnapshot = await getDocs(q);

  const gifts: Gift[] = [];
  querySnapshot.forEach((doc) => {
    const gift = doc.data() as Gift;
    gifts.push(gift);
  });

  return gifts;
};

const getUserGifts = async (userId: string) => {
  const giftsColRef = collection(db, 'users', userId, 'gifts');

  const querySnapshot = await getDocs(giftsColRef);

  const gifts: Gift[] = [];
  querySnapshot.forEach((doc) => {
    const gift = {
      uid: doc.id,
      ...doc.data(),
    } as Gift;

    gifts.push(gift);
  });

  return gifts;
};

const getRandomGiftByCategory = async (category: string) => {
  // получаем подарки выбранной категории
  const q = query(collection(db, 'gifts'), where('category', '==', category));

  const gifts: Gift[] = [];
  await getDocs(q).then((_gifts) => {
    _gifts.forEach((doc) => {
      gifts.push(doc.data() as Gift);
    });
  });

  // случайный элемент массива
  const rand = Math.floor(Math.random() * gifts.length);

  // берём один подарок по рандомному индексу
  return gifts[rand];
};

const addGiftToUser = async (userId: string, gift: Gift) => {
  const collectionRef = collection(db, 'users', userId, 'gifts');

  return await addDoc(collectionRef, {
    ...gift,
  }).then(() => {
    console.log('success add gift');
  });
};

export default Object.assign({
  getShopGifts,
  getUserGifts,
  getRandomGiftByCategory,
  addGiftToUser,
});
