import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Card} from "react-bootstrap";
import {ConsultationsList} from "./ConsultationsList";

function Consultations() {
  return (
    <>
      <AppHeadTitle title='Consultations' />
      <AppBreadcrumb title='Consultations' />
      <Card className='border-0'>
        <Card.Body>
          <ConsultationsList/>
        </Card.Body>
      </Card>
    </>
  )
}

export default Consultations
