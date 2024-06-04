import { makeAutoObservable, action, toJS } from "mobx";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";
import rootStore from "./../../store";
import { LoadStatus } from "../../types";
import { User } from "../../api/user";
import { CityOption } from "../../mock/cities";
import moment from "moment";
const { authStore } = rootStore;

type Filter = Record<string, FilterValue>;

type FilterValue = string | number | undefined | null | CityOption;

const initFilter: Filter = {
  name: "",
  surname: "",
  city: null,
  sex: "",
  ageFrom: "",
  ageTo: "",
};

// const Sex = {
//   Мужчина: 'male',
//   Женщина: 'female',
// };

const Sex = {
  male: "Мужчина",
  female: "Женщина",
};

export class Store {
  filter = initFilter;
  private status: LoadStatus = "init";

  users: User[] = [];
  filteredUsers: User[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  updateFilter(key: string, value: FilterValue) {
    // if (key === 'city' && value) {
    //   this.filter.city = value as CityOption;
    // }

    this.filter[key] = value;
  }

  async fetchUsers() {
    this.clear();

    this.status = "load";

    const giftsColRef = collection(db, "users");

    await getDocs(giftsColRef)
      .then(
        action("fetchUsersSuccess", (response) => {
          response.forEach((doc) => {
            const user = doc.data();
            this.users.push({ ...(user as User), id: doc.id });
          });

          const vipUsers = this.users.filter((user) => user?.isVip);
          const notVipUsers = this.users.filter((user) => !user?.isVip);

          this.users = [...vipUsers, ...notVipUsers].filter((user) => user.id !== authStore.uid);

          // this.users = [...vipUsers, ...notVipUsers];
          // console.log('this.users >>> ', this.users);

          this.filteredUsers = toJS(this.users);
          console.log("ЮЗЕРЫ ПОЛУЧЕНЫ -> ", toJS(this.filteredUsers));
        })
      )
      .catch(() => {
        console.error("get users error");
      })
      .finally(() => {
        this.status = "done";
      });
  }

  clear() {
    this.users = [];
    this.filter = initFilter;
  }

  get isLoadUsers() {
    return this.status === "load";
  }

  applyFilter = () => {
    this.filteredUsers = this.users
      .filter((user) => {
        if (!this.filter.name) return true;
        if (user.name.includes(String(this.filter.name))) return true;
      })
      .filter((user) => {
        if (!this.filter.surname) return true;
        if (user.surname.includes(String(this.filter.surname))) return true;
      })
      .filter((user) => {
        if (!this.filter.city) return true;
        if (!user?.city) return false;
        if ((this.filter.city as CityOption)?.id === user?.city?.id) return true;
      })
      .filter((user) => {
        if (!this.filter.sex) return true;
        if (!user?.sex) return false;
        // @ts-ignore
        if (this.filter.sex === Sex[user.sex]) return true;
      })
      .filter((user) => {
        if (!this.filter.ageFrom) return true;

        const age = moment().diff(user.birthday, "years", false);

        if (age >= Number(this.filter.ageFrom)) return true;
      })
      .filter((user) => {
        if (!this.filter.ageTo) return true;

        const age = moment().diff(user.birthday, "years", false);

        if (Number(this.filter.ageTo) >= age) return true;
      });
  };

  clearFilter = () => {
    this.filter = initFilter;
    this.filteredUsers = this.users;
  };

  get isFilterNotEmpty() {
    return Object.values(this.filter).some((val) => val);
  }
}

const store = new Store();
export default store;
