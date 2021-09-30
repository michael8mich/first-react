export interface ISelectProps {
    mode?: "multiple" | "tags" | undefined,
    placeholder?: string,
    style?: Object,
    label?: string,
    tname: string,
    where: string,
    what: string
  }
 export interface MSelectValue {
    label: string;
    value: string;
    code?: string
  }
  