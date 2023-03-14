import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {AppBreadcrumb, AppHeadTitle} from "../../components";

function LabShowResultsPage() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(onInitSidebarMenu('/member/treatments/lab'))
  }, [dispatch]) // toggle submenu dropdown

  return (
    <>
      <AppHeadTitle title='Résultats des analyses du Labo' />
      <AppBreadcrumb title='Résultats des analyses du Labo' links={[
        {path: '/member/treatments/lab', label: 'Laboratoire'}
      ]} />
    </>
  )
}

export default memo(LabShowResultsPage)
