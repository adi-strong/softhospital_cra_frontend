import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Card, Col, Row} from "react-bootstrap";
import {ActsList} from "./ActsList";
import {ActCategoriesList} from "./ActCategoriesList";

const Acts = () => {
  return (
    <>
      <AppHeadTitle title='Actes médicaux' />
      <AppBreadcrumb title='Actes médicaux' />
      <Row>
        <Col md={7}>
          <Card className='border-0'>
            <Card.Body className='pt-4'>
              <ActsList/>
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          <Card className='border-0'>
            <Card.Body className='pt-4'>
              <ActCategoriesList/>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Acts
