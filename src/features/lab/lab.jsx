import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Card} from "react-bootstrap";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {LabList} from "./LabList";
import {allowShowLabPage} from "../../app/config";
import {selectCurrentUser} from "../auth/authSlice";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

const Lab = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(onInitSidebarMenu('/member/treatments/lab'))
  }, [dispatch]) // toggle submenu dropdown

  const user = useSelector(selectCurrentUser), navigate = useNavigate()
  useEffect(() => {
    if (user && !allowShowLabPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

  return (
    <>
      <AppHeadTitle title='Laboratoire' />
      <AppBreadcrumb title='Laboratoire' />

      <Card className='border-0'>
        <Card.Body>
          <h5 className='card-title' style={cardTitleStyle}>Consultations (Résultats Labo)</h5>
          <LabList/>
        </Card.Body>
      </Card>
    </>
  )
}

export default Lab
