import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Card} from "react-bootstrap";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {LabList} from "./LabList";

const Lab = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(onInitSidebarMenu('/member/treatments/lab'))
  }, [dispatch]) // toggle submenu dropdown

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
