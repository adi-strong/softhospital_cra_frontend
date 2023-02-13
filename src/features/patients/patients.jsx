import {Card} from "react-bootstrap";
import {PatientsList} from "./PatientsList";

function Patients() {
  return (
    <>
      <div className='dashboard section'>
        <Card className='border-0 top-selling overflow-auto'>
          <Card.Body>
            <PatientsList/>
          </Card.Body>
        </Card>
      </div>
    </>
  )
}

export default Patients
