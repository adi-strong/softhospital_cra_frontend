import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Card, Col, Row} from "react-bootstrap";
import {ActsList} from "./ActsList";
import {ActCategoriesList} from "./ActCategoriesList";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../auth/authSlice";
import {useNavigate} from "react-router-dom";
import {allowShowActsPage} from "../../app/config";
import toast from "react-hot-toast";
import {useEffect} from "react";

const Acts = () => {
  const user = useSelector(selectCurrentUser), navigate = useNavigate()

  useEffect(() => {
    if (user && !allowShowActsPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

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
