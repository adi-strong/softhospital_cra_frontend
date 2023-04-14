import {memo, useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {AppBreadcrumb, AppDropdownFilerMenu, AppHeadTitle, AppMainError} from "../../components";
import {useNavigate, useParams} from "react-router-dom";
import {Card} from "react-bootstrap";
import {useReactToPrint} from "react-to-print";
import {useGetSingleConsultQuery} from "./consultationApiSlice";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {SingleConsultSection1} from "./sections/SingleConsultSection1";
import {SingleConsultSection2} from "./sections/SingleConsultSection2";
import {SingleConsultSection3} from "./sections/SingleConsultSection3";
import {selectCurrentUser} from "../auth/authSlice";
import {allowShowSingleConsultationsPage} from "../../app/config";
import toast from "react-hot-toast";

const dropdownItems = [
  {label: <><i className='bi bi-arrow-clockwise'/> Actualiser</>, name: 'refresh', action: '#'},
  {label: <><i className='bi bi-printer'/> Impression</>, name: 'print', action: '#'},
]

function SingleConsultationPage() {
  const dispatch = useDispatch(), { id } = useParams(), printRef = useRef()
  const {hospital} = useSelector(state => state.parameters)
  const {data: consult, isFetching, isSuccess, isError, refetch} = useGetSingleConsultQuery(id)

  useEffect(() => { dispatch(onInitSidebarMenu('/member/treatments/consultations')) }, [dispatch])

  const handlePrint = useReactToPrint({content: () => printRef.current})

  async function handleClick( name ) {
    if (name === 'refresh') await refetch()
    else handlePrint()
  }
  const user = useSelector(selectCurrentUser), navigate = useNavigate()

  useEffect(() => {
    if (user && !allowShowSingleConsultationsPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

  return (
    <div className='section dashboard'>
      <AppHeadTitle title={`Fiche n° ${id}`} />
      <AppBreadcrumb title={`Fiche n° ${id}`} links={[{
        label: 'Liste de fiches',
        path: '/member/treatments/consultations'
      }]} />

      <Card className='border-0'>
        <AppDropdownFilerMenu
          items={dropdownItems}
          onClick={handleClick}
          heading='Actions' />

        <Card.Body style={{ minHeight: 800 }}>
          {/* PRINTABLE */}
          <div className='mt-4 container-fluid' ref={printRef}>
            {!(isError || isFetching) && isSuccess && consult &&
              <SingleConsultSection1 consult={consult} hospital={hospital}/>}

            {!(isError || isFetching) && isSuccess && consult && <SingleConsultSection2 hospital={hospital} consult={consult} />}

            {!(isError || isFetching) && isSuccess && consult && <SingleConsultSection3 hospital={hospital} />}
          </div>
          {/* END PRINTABLE */}
          {isFetching && <BarLoaderSpinner loading={isFetching}/>}
          {isError && <AppMainError/>}
        </Card.Body>
      </Card>
    </div>
  )
}

export default memo(SingleConsultationPage)
