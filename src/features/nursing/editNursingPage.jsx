import {memo, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {NursingForm} from "./NursingForm";
import {useGetSingleNursingQuery} from "./nursingApiSlice";
import {useNavigate, useParams} from "react-router-dom";
import {selectCurrentUser} from "../auth/authSlice";
import {allowShowNursingPage} from "../../app/config";
import toast from "react-hot-toast";

const EditNursingPage = () => {
  const dispatch = useDispatch(), { id } = useParams()
  const {data: nursing, isFetching, isError, refetch} = useGetSingleNursingQuery(id)

  useEffect(() => {
    dispatch(onInitSidebarMenu('/member/treatments/nursing'))
  }, [dispatch]) // toggle submenu dropdown

  const onRefresh = async () => await refetch()

  const user = useSelector(selectCurrentUser), navigate = useNavigate()
  useEffect(() => {
    if (user && !allowShowNursingPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

  useEffect(() => {
    if (nursing && nursing?.isCompleted) {
      toast.error(`Le dossier n°${nursing?.id} est déjà clos.`)
      navigate('/member/treatments/nursing', {replace: true})
    }
  }, [nursing, navigate])

  return (
    <>
      <AppHeadTitle title='Traitement' />
      <AppBreadcrumb title={<><i className='bi bi-folder2-open'/> Traitement</>} links={[
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
