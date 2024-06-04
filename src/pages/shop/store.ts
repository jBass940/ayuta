import { makeAutoObservable, runInAction } from "mobx";
import { Gift } from "../../types";
import Api from "./../../api";

export class ShopStore {
  activeTabIndex = 0;
  shopGifts: Gift[] = [];
  userGifts: Gift[] = [];
  gift?: Gift;

  constructor() {
    makeAutoObservable(this);
  }

  setActiveTabIndex = (tabIndex: number) => {
    this.activeTabIndex = tabIndex;
  };

  getUserGifts = (userId: string) => {
    Api.gift.getUserGifts(userId).then((gifts: Gift[]) => {
      runInAction(() => (this.userGifts = gifts.filter((gift) => gift.type === "WON")));
    });
  };

  getShopGifts = () => {
    Api.gift.getShopGifts().then((gifts: Gift[]) => {
      console.log("получили подарки ", gifts);
      runInAction(() => (this.shopGifts = gifts));
    });
  };

  setGift(gift?: Gift) {
    this.gift = gift;
  }
}

const shopStore = new ShopStore();
export default shopStore;
