export interface Nurse {
  id: number;
  nurse_name: string;
  years_exp: number;
  unit: number;
  unitDetails: {
    id: number;
    unit_name: string;
  };
}
