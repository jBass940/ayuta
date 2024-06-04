// Scripts for firebase and firebase messaging
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
  apiKey: 'AIzaSyCN1J4COE3QSL6CdpGAqn_MNXhvfV4HWtM',
  authDomain: 'ayuta-5371d.firebaseapp.com',
  databaseURL: 'https://ayuta-5371d.firebaseio.com',
  projectId: 'ayuta-5371d',
  storageBucket: 'ayuta-5371d.appspot.com',
  messagingSenderId: '754324905665',
  appId: '1:754324905665:web:53e6a24b605e42cacbfe40',
  measurementId: 'G-LJF2D5P3ED',
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  // eslint-disable-next-line no-restricted-globals
  self.registration.showNotification(notificationTitle, notificationOptions);
});
