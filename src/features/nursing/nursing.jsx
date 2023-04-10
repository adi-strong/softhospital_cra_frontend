import {memo, useEffect} from "react";
import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {useDispatch, useSelector} from "react-redux";
import {Card} from "react-bootstrap";
import NursingList from "./NursingList";
import {selectCurrentUser} from "../auth/authSlice";
import {useNavigate} from "react-router-dom";
import {allowShowNursingPage} from "../../app/config";
import toast from "react-hot-toast";

function Nursing() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(onInitSidebarMenu('/member/treatments/nursing'))
  }, [dispatch]) // toggle submenu dropdown

  const user = useSelector(selectCurrentUser), navigate = useNavigate()
  useEffect(() => {
    if (user && !allowShowNursingPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

  return (
    <>
      <AppHeadTitle title='Nursing' />
      <AppBreadcrumb title='Nursing' />
      <Card className='border-0'>
        <Card.Body>
          <NursingList/>
        </Card.Body>
      </Card>
    </>
  )
}

export default memo(Nursing)
