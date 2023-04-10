import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Card} from "react-bootstrap";
import {ConsultationsList} from "./ConsultationsList";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../auth/authSlice";
import {useNavigate} from "react-router-dom";
import {allowShowConsultationsPage} from "../../app/config";
import toast from "react-hot-toast";
import {useEffect} from "react";

function Consultations() {
  const user = useSelector(selectCurrentUser), navigate = useNavigate()

  useEffect(() => {
    if (user && !allowShowConsultationsPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

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
