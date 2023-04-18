import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Card, Col, Row} from "react-bootstrap";
import {TreatmentsList} from "./TreatmentsList";
import {TreatmentCategoriesList} from "./TreatmentCategoriesList";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../auth/authSlice";
import {useNavigate} from "react-router-dom";
import {allowShowTreatmentsPage} from "../../app/config";
import toast from "react-hot-toast";
import {useEffect} from "react";

const Treatments = () => {
  const { fCurrency } = useSelector(state => state.parameters)
  const user = useSelector(selectCurrentUser), navigate = useNavigate()

  useEffect(() => {
    if (user && !allowShowTreatmentsPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

  return (
    <>
      <AppHeadTitle title='Traitements' />
      <AppBreadcrumb title='Premier(s) soin(s)' />
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
