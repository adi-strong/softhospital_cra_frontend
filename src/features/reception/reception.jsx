import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Card, Col, Row} from "react-bootstrap";
import {AppointmentsList} from "../appointments/AppointmentsList";

function Reception() {
  return (
    <>
      <AppHeadTitle title='Réception (Fiches)' />
      <AppBreadcrumb/>
      <Row>
        <Col md={7}>
          <Card className='border-0'>
            <Card.Body>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className='border-0'>
            <Card.Body>
              <AppointmentsList/>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Reception
