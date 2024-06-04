export const degreeToGiftCategory: Record<number, string> = {
  1: "blue_4",
  2: "green_2",
  3: "???",
  4: "red_4",
  5: "yellow_2",
  6: "???",
  7: "blue_3",
  8: "yellow_1",
  9: "???",
  10: "red_3",
  11: "blue_2",
  12: "no_ads",
  13: "red_2",
  14: "red_1",
  15: "gift",
  16: "blue_1", // +
  17: "green_1",
  18: "vip",
};

// export const degreeToGiftCategory: Record<number, string> = {
//   1: "vip",
//   2: "green_1",
//   3: "blue_1",
//   4: "gift",
//   5: "red_1",
//   6: "red_2",
//   7: "no_ads",
//   8: "blue_2",
//   9: "red_3",
//   10: "???",
//   11: "yellow_1",
//   12: "blue_3",
//   13: "???",
//   14: "yellow_2",
//   15: "red_4",
//   16: "???",
//   17: "green_2",
//   18: "blue_4",
// };

// 1 - делим на 360 и получаем остаток
// 2 - то что осталось делим на 20
// 3 - прибавляем 1 для удобства подсчёта
// 4 - откидываем дробную часть
