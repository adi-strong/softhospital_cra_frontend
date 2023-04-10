import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Card, Col, Row} from "react-bootstrap";
import {FilesList} from "./FilesList";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {AddFiles} from "./AddFiles";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../auth/authSlice";
import {useNavigate} from "react-router-dom";
import {allowShowFilesPage} from "../../app/config";
import toast from "react-hot-toast";
import {useEffect} from "react";

const Files = () => {
  const user = useSelector(selectCurrentUser), navigate = useNavigate()

  useEffect(() => {
    if (user && !allowShowFilesPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

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
