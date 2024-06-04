import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';

export const firebaseConfig = {
  apiKey: 'AIzaSyCN1J4COE3QSL6CdpGAqn_MNXhvfV4HWtM',
  authDomain: 'ayuta-5371d.firebaseapp.com',
  databaseURL: 'https://ayuta-5371d.firebaseio.com',
  projectId: 'ayuta-5371d',
  storageBucket: 'ayuta-5371d.appspot.com',
  messagingSenderId: '754324905665',
  appId: '1:754324905665:web:53e6a24b605e42cacbfe40',
  measurementId: 'G-LJF2D5P3ED',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = getMessaging(app);
