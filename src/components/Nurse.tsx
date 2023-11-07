import '../Nurse.css'
import { Nurse as NurseInterface } from '../interfaces'



  export const Nurse = ({nurse}:{nurse:NurseInterface}) => {
    return (
        <>
            <p className='nurse-name'>{nurse.fullName}</p>
            <p className='nurse-experience'> NYU for {nurse.yearsOfExperience} years </p>
            <p>Unit #{nurse.unitName}</p>
        </>
    )
}

