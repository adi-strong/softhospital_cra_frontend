import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {PrescriptionsForm} from "./PrescriptionsForm";
import {useNavigate, useParams} from "react-router-dom";
import {useGetSinglePrescriptionQuery} from "./prescriptionApiSlice";

function EditPrescriptionPage() {
  const dispatch = useDispatch(), navigate = useNavigate()
  const { id } = useParams()
  const {data: prescription, isFetching, isSuccess, isError, refetch} = useGetSinglePrescriptionQuery(id)

  useEffect(() => {
    dispatch(onInitSidebarMenu('/member/treatments/prescriptions'))
  }, [dispatch])

  useEffect(() => {
    if (isSuccess && prescription && prescription?.isPublished)
      navigate('/member/treatments/prescriptions', {replace: true})
  }, [isSuccess, prescription, navigate])

  const onRefresh = async () => await refetch()

  return (
    <>
      <AppHeadTitle title="Prescription de l'ordonnance" />
      <AppBreadcrumb title="Prescription de l'ordonnance" links={[
        {path: '/member/treatments/prescriptions', label: 'Prescriptions médicales (à faire)'}
      ]} />

      <PrescriptionsForm data={prescription} loader={isFetching} isError={isError} onRefresh={onRefresh}/>
    </>
  )
}

export default memo(EditPrescriptionPage)
