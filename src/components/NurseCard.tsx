import { Button, Card, Col, Row } from "react-bootstrap";
import { Nurse as NurseComponent } from "./Nurse";
import { Nurse } from "../interfaces";

export const NurseCard = ({
  nurse,
  removeNurse,
}: {
  nurse: Nurse;
  removeNurse: (id: number) => void;
}) => {
  return (
    <>
      <Card body className="nurse-info">
        <Row>
          <Col xs={10}>
            <NurseComponent nurse={nurse} />
          </Col>
          <Col>
            <Button
              variant="danger"
              onClick={() => {
                removeNurse(nurse.id);
              }}
            >
              Remove
            </Button>
          </Col>
        </Row>
      </Card>
    </>
  );
};
