import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Card, Col, Row} from "react-bootstrap";
import {ExamsList} from "./ExamsList";
import {ExamCategoriesList} from "./ExamCategoriesList";

const Exams = () => {
  return (
    <>
      <AppHeadTitle title='Examens' />
      <AppBreadcrumb title='Examens'/>
      <Row>
        <Col md={7}>
          <Card className='border-0'>
            <Card.Body className='pt-4'>
              <ExamsList/>
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          <Card className='border-0'>
            <Card.Body>
              <ExamCategoriesList/>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Exams
