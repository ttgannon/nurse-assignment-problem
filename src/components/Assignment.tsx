import { Button, Card, Col, Container, Row } from "react-bootstrap"
import { Nurse } from "./Nurse"
import '../Nurse.css'
import { NurseCard } from "./NurseCard";

export const Assignment = ({nurses, patients}) => {
    const patientsPerNurse = patients.length / nurses.length;
    const nursesAndPatients = [];
    let patientIdx = 0;
    for (const nurse of nurses) {
        const assignedPatients = patients.slice(patientIdx, patientIdx + patientsPerNurse);
        nursesAndPatients.push({ nurse, patients: assignedPatients });
        patientIdx += patientsPerNurse;
      }
      console.log(nursesAndPatients);
    
    return (
        <>
        <Container>
            <Row>
                {nursesAndPatients.map(nurse => (
                        <Col xs={4}>
                                <Card body className='nurse-info'>
                                    <Row><h3>Nurse:</h3>
                                        <Col xs={10}>
                                            <Nurse nurse={nurse.nurse} />
                                        </Col>
                                        <Col>
                                            <Button variant="danger">Remove</Button>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <h3>Patients:</h3>
                                    {
                                        nurse.patients.map(patient => (
                                            <div>
                                                <h6>{patient.fullName}</h6>
                                                <h6>{patient.unitName}</h6>
                                            </div>
                                            
                                        ))
                                    }
                                    </Row>
                            </Card>
                        </Col>
                    ))} 
                </Row>
            </Container>
        </>          
    )
}