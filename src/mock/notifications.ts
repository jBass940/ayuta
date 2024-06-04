export interface Notification {
  avatar: string;
  name: string;
  text: string;
  isOnlie: boolean;
}

export const notificationsMock: Notification[] = [
  {
    avatar:
      "https://firebasestorage.googleapis.com/v0/b/ayuta-pwa.appspot.com/o/admin%2Flogo-stub--man.svg?alt=media&token=5a8d5da6-6bd4-4867-aa01-281f47dc22f6",

    name: "Александр Иванов",
    text: "Хочет добавить вас в друзья",
    isOnlie: false,
  },
];
