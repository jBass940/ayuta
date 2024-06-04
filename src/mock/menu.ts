export interface MenuItem {
  icon?: string;
  label: string;
  link: string;
  hideOnMobile?: boolean;
  protected?: boolean;
}

export interface SubscriptionItem {
  icon: string;
  label: string;
  date: string;
}

export const menu: MenuItem[] = [
  {
    icon: "pen",
    label: "Редактировать профиль",
    link: "/profile/edit",
    protected: true,
  },
  {
    icon: "chat",
    label: "Сообщения",
    link: "/chats",
    hideOnMobile: true,
    protected: true,
  },
  {
    icon: "basket",
    label: "Магазин",
    link: "/shop",
    hideOnMobile: true,
  },
  {
    icon: "eye",
    label: "Гости",
    link: "/guests",
    hideOnMobile: true,
    protected: true,
  },
  {
    icon: "search",
    label: "Поиск",
    link: "/search",
    hideOnMobile: true,
  },
  {
    icon: "bell",
    label: "Уведомления",
    link: "/notifications",
    protected: true,
  },
  {
    icon: "info",
    label: "О сервисе",
    link: "/faq",
  },
];

export const menuBottom: MenuItem[] = [
  {
    icon: "eyeDark",
    label: "Гости",
    link: "/invisible",
    hideOnMobile: true,
  },
  {
    icon: "searchDark",
    label: "Поиск",
    link: "/search",
    hideOnMobile: true,
  },
  {
    icon: "chatDark",
    label: "Сообщения",
    link: "/chats",
    hideOnMobile: true,
  },
  {
    icon: "basketDark",
    label: "Магазин",
    link: "/shop",
    hideOnMobile: true,
  },
];
