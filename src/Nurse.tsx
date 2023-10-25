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

export const Nurse = ({nurse}: { nurse: Nurse }) => {
    return (
        <>
            <Card body className='nurse-info'>
                <Row>
                    <Col xs={10}>
                        <p className='nurse-name'>{nurse.fullName}</p>
                        <p className='nurse-experience'> NYU for {nurse.yearsOfExperience} years </p>
                        <p>Unit #{nurse.unitName}</p>
                    </Col>
                    <Col>
                        <ExButton />
                    </Col>
                </Row>
            </Card>
        </>
    )
}

function removeElement() {
    console.log('removed');
}

const ExButton = () => {
    const hoverStyle = {
        cursor: 'pointer',
    }
    return (
        <img src='src/assets/x-circle-fill.svg' 
        onClick={removeElement} 
        className='deleteBtn'
        style={hoverStyle}
        />
    )
}