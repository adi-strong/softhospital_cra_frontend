import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Card, Col, Row} from "react-bootstrap";
import {FilesList} from "./FilesList";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {AddFiles} from "./AddFiles";

const Files = () => {
  return (
    <>
      <AppHeadTitle title='Types de fiches' />
      <AppBreadcrumb title='Types de fiches médicales' />
      <Row>
        <Col md={7}>
          <Card className='border-0'>
            <Card.Body>
              <FilesList/>
            </Card.Body>
          </Card>
        </Col> {/* list */}
        <Col md={5}>
          <Card className='border-0'>
            <Card.Body>
              <h5 className='card-title' style={cardTitleStyle}>Ajout des types de fiches</h5>
              <AddFiles/>
            </Card.Body>
          </Card>
        </Col> {/* add files */}
      </Row>
    </>
  )
}

export default Files
