import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {NursingForm} from "./NursingForm";
import {useGetSingleNursingQuery} from "./nursingApiSlice";
import {useParams} from "react-router-dom";

const EditNursingPage = () => {
  const dispatch = useDispatch(), { id } = useParams()
  const {data: nursing, isFetching, isError, refetch} = useGetSingleNursingQuery(id)

  useEffect(() => {
    dispatch(onInitSidebarMenu('/member/treatments/nursing'))
  }, [dispatch]) // toggle submenu dropdown

  const onRefresh = async () => await refetch()

  return (
    <>
      <AppHeadTitle title='Traitement' />
      <AppBreadcrumb title='Traitement' links={[
        {path: '/member/treatments/nursing', label: 'Nursing'}
      ]} />

      <NursingForm
        loader={isFetching}
        data={nursing}
        onRefresh={onRefresh}
        isError={isError}/>
    </>
  )
}

export default memo(EditNursingPage)
