// export function plural(number: any, titles: any) {
//   let cases: any = [2, 0, 1, 1, 1, 2];
//   return titles[
//     number % 100 > 4 && number % 100 < 20
//       ? 2
//       : cases[number % 10 < 5 ? number % 10 : 5]
//   ];
// }

export const pluralize = ({
  count,
  one,
  few,
  many,
}: {
  count: number;
  one: string;
  few: string;
  many: string;
}) => {
  // дорога дороги дорог
  // дорогу дороги дорог
  const n = Math.abs(count) % 100;

  if (n % 100 >= 11 && n % 100 <= 14) return many;

  switch (n % 10) {
    case 1:
      return one;
    case 2:
    case 3:
    case 4:
      return few;
    default:
      return many;
  }
};
