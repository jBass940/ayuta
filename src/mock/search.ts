export interface ISearchMock {
  uid?: string;
  avatar: string;
  name: string;
  surname: string;
  vip?: boolean;
}

// export const searchMock: ISearchMock[] = [
//   {
//     avatar:
//       "https://lisa.ru/wp-content/uploads/2018/06/alone-beautiful-blurred-background-720598.jpg",
//     name: "Ирина Петрова",
//     vip: true,
//   },
//   {
//     avatar:
//       "https://drasler.ru/wp-content/uploads/2019/05/%D0%90%D0%B2%D0%B0%D1%82%D0%B0%D1%80%D0%BA%D0%B8-%D0%B4%D0%BB%D1%8F-%D0%BC%D1%83%D0%B6%D1%87%D0%B8%D0%BD-%D1%81%D0%B5%D1%80%D1%8C%D0%B5%D0%B7%D0%BD%D1%8B%D0%B5-%D0%BF%D0%BE%D0%B4%D0%B1%D0%BE%D1%80%D0%BA%D0%B0-%D1%84%D0%BE%D1%82%D0%BE-029.jpg",
//     name: "Александр Петров",
//   },
//   {
//     avatar:
//       "https://drasler.ru/wp-content/uploads/2019/05/%D0%90%D0%B2%D0%B0%D1%82%D0%B0%D1%80%D0%BA%D0%B8-%D0%B4%D0%BB%D1%8F-%D0%BC%D1%83%D0%B6%D1%87%D0%B8%D0%BD-%D1%81%D0%B5%D1%80%D1%8C%D0%B5%D0%B7%D0%BD%D1%8B%D0%B5-%D0%BF%D0%BE%D0%B4%D0%B1%D0%BE%D1%80%D0%BA%D0%B0-%D1%84%D0%BE%D1%82%D0%BE-001.jpg",
//     name: "Александр Петров",
//     vip: true,
//   },
//   {
//     avatar:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxaKBZAKmthHwHQvGsHemkFYXh6wFOhQSnbnyEhZlg7VQZGblq73b-hzAvLcxoBF7bGPs&usqp=CAU",
//     name: "Лера Петрова",
//     vip: true,
//   },
//   {
//     avatar:
//       "https://rus-pic.ru/wp-content/uploads/2021/12/avatarki-dlja-malchikov-41-foto-e7202eb.jpg",
//     name: "Александр Петров",
//   },
//   {
//     avatar: "https://vjoy.cc/wp-content/uploads/2020/11/bezymyannyjpk.jpg",
//     name: "Оля Смирнова",
//   },
//   {
//     avatar:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxaKBZAKmthHwHQvGsHemkFYXh6wFOhQSnbnyEhZlg7VQZGblq73b-hzAvLcxoBF7bGPs&usqp=CAU",
//     name: "Лера Петрова",
//     vip: true,
//   },
//   {
//     avatar:
//       "https://drasler.ru/wp-content/uploads/2019/05/%D0%90%D0%B2%D0%B0%D1%82%D0%B0%D1%80%D0%BA%D0%B8-%D0%B4%D0%BB%D1%8F-%D0%BC%D1%83%D0%B6%D1%87%D0%B8%D0%BD-%D1%81%D0%B5%D1%80%D1%8C%D0%B5%D0%B7%D0%BD%D1%8B%D0%B5-%D0%BF%D0%BE%D0%B4%D0%B1%D0%BE%D1%80%D0%BA%D0%B0-%D1%84%D0%BE%D1%82%D0%BE-001.jpg",
//     name: "Александр Петров",
//   },
//   {
//     avatar:
//       "https://rus-pic.ru/wp-content/uploads/2021/12/avatarki-dlja-malchikov-41-foto-e7202eb.jpg",
//     name: "Александр Петров",
//     vip: true,
//   },
//   {
//     avatar:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxaKBZAKmthHwHQvGsHemkFYXh6wFOhQSnbnyEhZlg7VQZGblq73b-hzAvLcxoBF7bGPs&usqp=CAU",
//     name: "Лера Петрова",
//     vip: true,
//   },
//   {
//     avatar:
//       "https://drasler.ru/wp-content/uploads/2019/05/%D0%90%D0%B2%D0%B0%D1%82%D0%B0%D1%80%D0%BA%D0%B8-%D0%B4%D0%BB%D1%8F-%D0%BC%D1%83%D0%B6%D1%87%D0%B8%D0%BD-%D1%81%D0%B5%D1%80%D1%8C%D0%B5%D0%B7%D0%BD%D1%8B%D0%B5-%D0%BF%D0%BE%D0%B4%D0%B1%D0%BE%D1%80%D0%BA%D0%B0-%D1%84%D0%BE%D1%82%D0%BE-001.jpg",
//     name: "Александр Петров",
//   },
//   {
//     avatar: "https://vjoy.cc/wp-content/uploads/2020/11/bezymyannyjpk.jpg",
//     name: "Оля Смирнова",
//     vip: true,
//   },
//   {
//     avatar: "https://vjoy.cc/wp-content/uploads/2020/12/original.jpeg",
//     name: "Ирина Алёхина",
//   },
//   {
//     avatar:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSHfp-0A8RgcYn4pbGfw-D5zOX5IIfejWDEVhSMLbvL_5orvn7WLBx7Jtjz9ge6CVrjLI&usqp=CAU",
//     name: "Катя Ефимова",
//   },
//   {
//     avatar: "https://schtirlitz.ru/wp-content/uploads/kartinka-v-vk_19.jpg",
//     name: "Лера Петрова",
//     vip: true,
//   },
//   {
//     avatar:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsHyHEq0kcWFcNcwqHFiZ0AHkz-vBfSd6wmTj7yi1wiria5A7UrV148LBrOOe_Ix5Iukg&usqp=CAU",
//     name: "Александр Петров",
//   },
//   {
//     avatar:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxaKBZAKmthHwHQvGsHemkFYXh6wFOhQSnbnyEhZlg7VQZGblq73b-hzAvLcxoBF7bGPs&usqp=CAU",
//     name: "Оля Смирнова",
//     vip: true,
//   },
//   {
//     avatar: "https://vjoy.cc/wp-content/uploads/2020/12/original.jpeg",
//     name: "Ирина Алёхина",
//     vip: true,
//   },
//   {
//     avatar:
//       "https://drasler.ru/wp-content/uploads/2019/05/%D0%90%D0%B2%D0%B0%D1%82%D0%B0%D1%80%D0%BA%D0%B8-%D0%B4%D0%BB%D1%8F-%D0%BC%D1%83%D0%B6%D1%87%D0%B8%D0%BD-%D1%81%D0%B5%D1%80%D1%8C%D0%B5%D0%B7%D0%BD%D1%8B%D0%B5-%D0%BF%D0%BE%D0%B4%D0%B1%D0%BE%D1%80%D0%BA%D0%B0-%D1%84%D0%BE%D1%82%D0%BE-029.jpg",
//     name: "Александр Петров",
//   },
//   {
//     avatar:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxaKBZAKmthHwHQvGsHemkFYXh6wFOhQSnbnyEhZlg7VQZGblq73b-hzAvLcxoBF7bGPs&usqp=CAU",
//     name: "Лера Петрова",
//   },
//   {
//     avatar:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsHyHEq0kcWFcNcwqHFiZ0AHkz-vBfSd6wmTj7yi1wiria5A7UrV148LBrOOe_Ix5Iukg&usqp=CAU",
//     name: "Александр Петров",
//     vip: true,
//   },
//   {
//     avatar: "https://vjoy.cc/wp-content/uploads/2020/11/bezymyannyjpk.jpg",
//     name: "Оля Смирнова",
//   },
//   {
//     avatar:
//       "https://avatarko.ru/avatar/kartinka/12/devushka_kapyushon_11101.jpg",
//     name: "Ирина Алёхина",
//     vip: true,
//   },
//   {
//     avatar:
//       "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSHfp-0A8RgcYn4pbGfw-D5zOX5IIfejWDEVhSMLbvL_5orvn7WLBx7Jtjz9ge6CVrjLI&usqp=CAU",
//     name: "Катя Ефимова",
//   },
// ];
