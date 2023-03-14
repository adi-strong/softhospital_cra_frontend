import {memo, useEffect} from "react";
import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {useDispatch} from "react-redux";
import {Card} from "react-bootstrap";
import NursingList from "./NursingList";

function Nursing() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(onInitSidebarMenu('/member/treatments/nursing'))
  }, [dispatch]) // toggle submenu dropdown

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
