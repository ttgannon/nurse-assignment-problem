import { EpicPatient } from "..";

export interface EpicUnit {
  fullUrl: string;
  link: Array<object>;
  entry: Array<object>;
  resource: {
    code: object;
    date: string;
    entry: Array<EpicPatient>;
    id: string;
    mode: string;
    resourceType: string;
    status: string;
    title: string;
  };
  search: object;
}
