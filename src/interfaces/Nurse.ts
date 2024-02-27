export interface Nurse {
  id: number | string;
  nurse_name: string;
  years_exp: number;
  unit: number;
  unitDetails: {
    id: number;
    unit_name: string;
  };
}
