import { Nurse as NurseInterface } from "../interfaces";

export const Nurse = ({ nurse }: { nurse: NurseInterface }) => {
  return (
    <>
      <p className="">{nurse.fullName}</p>
      <p className=""> NYU for {nurse.yearsOfExperience} years </p>
      <p>Unit #{nurse.unitName}</p>
    </>
  );
};
