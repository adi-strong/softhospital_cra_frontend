import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Card, Col, Row} from "react-bootstrap";
import {TreatmentsList} from "./TreatmentsList";
import {TreatmentCategoriesList} from "./TreatmentCategoriesList";
import {useSelector} from "react-redux";

const Treatments = () => {
  const { fCurrency } = useSelector(state => state.parameters)

  return (
    <>
      <AppHeadTitle title='Traitements' />
      <AppBreadcrumb title='Traitements' />
      <Row>
        <Col md={7}>
          <Card className='border-0'>
            <Card.Body>
              <TreatmentsList currency={fCurrency} />
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          <Card className='border-0'>
            <Card.Body>
              <TreatmentCategoriesList currency={fCurrency} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Treatments
