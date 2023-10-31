import './Nurse.css'
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


interface Nurse {
    fullName: string
    yearsOfExperience: number
    unitName: string
  }

  export const Nurse = ({nurse}) => {
    return (
        <>
            <p className='nurse-name'>{nurse.fullName}</p>
            <p className='nurse-experience'> NYU for {nurse.yearsOfExperience} years </p>
            <p>Unit #{nurse.unitName}</p>
        </>
    )
}

