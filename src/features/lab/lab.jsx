import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Card, Col, Row} from "react-bootstrap";
import {cardTitleStyle} from "../../layouts/AuthLayout";

const Lab = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(onInitSidebarMenu('/treatments/lab'))
  }, [dispatch]) // toggle submenu dropdown

  return (
    <>
      <AppHeadTitle title='Laboratoire' />
      <AppBreadcrumb title='Laboratoire' />
      <Row>
        <Col md={7}>
          <Card className='border-0'>
            <Card.Body>
              <h5 className='card-title' style={cardTitleStyle}>Résultats</h5>
            </Card.Body>
          </Card>
        </Col> {/* laboratory's results */}
        <Col md={5}>
          <Card className='border-0'>
            <Card.Body>
              <h5 className='card-title' style={cardTitleStyle}>Dernières consultations</h5>
            </Card.Body>
          </Card>
        </Col> {/* lasts consultations */}
      </Row>
    </>
  )
}

export default Lab
