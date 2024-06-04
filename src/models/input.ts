import { Dayjs } from "dayjs";

export type BaseField = {
  value: string | boolean | Dayjs | null;
  error: string;
};

export type ISelectOption = {
  label: string;
  value: string;
};
