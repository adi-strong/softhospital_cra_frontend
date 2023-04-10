import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Card, Col, Row} from "react-bootstrap";
import {ExamsList} from "./ExamsList";
import {ExamCategoriesList} from "./ExamCategoriesList";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../auth/authSlice";
import {useNavigate} from "react-router-dom";
import {allowShowExamsPage} from "../../app/config";
import toast from "react-hot-toast";
import {useEffect} from "react";

const Exams = () => {
  const user = useSelector(selectCurrentUser), navigate = useNavigate()

  useEffect(() => {
    if (user && !allowShowExamsPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

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
