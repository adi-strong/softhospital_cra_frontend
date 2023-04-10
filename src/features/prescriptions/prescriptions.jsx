import {memo, useEffect} from "react";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {useDispatch, useSelector} from "react-redux";
import {Card} from "react-bootstrap";
import {PrescriptionsList} from "./PrescriptionsList";
import {selectCurrentUser} from "../auth/authSlice";
import {useNavigate} from "react-router-dom";
import {allowShowPrescriptionsPage} from "../../app/config";
import toast from "react-hot-toast";

function Prescriptions() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(onInitSidebarMenu('/member/treatments/prescriptions'))
  }, [dispatch]) // toggle submenu dropdown

  const user = useSelector(selectCurrentUser), navigate = useNavigate()
  useEffect(() => {
    if (user && !allowShowPrescriptionsPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

  return (
    <>
      <AppHeadTitle title='Prescriptions médicales (à faire)' />
      <AppBreadcrumb title='Prescriptions médicales (à faire)' />

      <Card className='border-0'>
        <Card.Body>
          <PrescriptionsList/>
        </Card.Body>
      </Card>
    </>
  )
}

export default memo(Prescriptions)
