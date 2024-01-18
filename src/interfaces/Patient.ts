export interface Patient {
  id: number;
  patient_id: string;
  last_name: string;
  first_name: string;
  unit: string;
  acuityScore: number;
  continent: boolean;
  independently_mobile: boolean;
  num_meds: number;
  high_risk_meds: number;
  num_devices: number;
  num_drips: number;
  new_trach: number;
  tube_feeds: number;
  wound_care: number;
}
