import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {AppBreadcrumb, AppHeadTitle} from "../../components";

const SingleNursingPage = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(onInitSidebarMenu('/member/treatments/nursing'))
  }, [dispatch]) // toggle submenu dropdown

  return (
    <>
      <AppHeadTitle title={'Nursing | '} />
      <AppBreadcrumb title={'Nursing | '} links={[
        {path: '/member/treatments/nursing', label: 'Nursing'}
      ]} />
    </>
  )
}

export default memo(SingleNursingPage)
