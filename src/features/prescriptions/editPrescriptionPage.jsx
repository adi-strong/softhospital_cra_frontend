import {memo, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {PrescriptionsForm} from "./PrescriptionsForm";
import {useNavigate, useParams} from "react-router-dom";
import {useGetSinglePrescriptionQuery} from "./prescriptionApiSlice";
import {selectCurrentUser} from "../auth/authSlice";
import {allowShowPrescriptionsPage} from "../../app/config";
import toast from "react-hot-toast";

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

  const user = useSelector(selectCurrentUser)
  useEffect(() => {
    if (user && !allowShowPrescriptionsPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

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
