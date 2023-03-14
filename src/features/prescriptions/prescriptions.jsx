import {memo, useEffect} from "react";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {useDispatch} from "react-redux";
import {Card} from "react-bootstrap";
import {PrescriptionsList} from "./PrescriptionsList";

function Prescriptions() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(onInitSidebarMenu('/member/treatments/prescriptions'))
  }, [dispatch]) // toggle submenu dropdown

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
