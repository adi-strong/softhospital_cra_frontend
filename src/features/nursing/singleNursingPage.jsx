import {memo, useEffect, useMemo, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {AppBreadcrumb, AppDropdownFilerMenu, AppHeadTitle, AppMainError} from "../../components";
import {useGetSingleNursingQuery} from "./nursingApiSlice";
import {Card} from "react-bootstrap";
import {useParams} from "react-router-dom";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {useReactToPrint} from "react-to-print";
import {SingleNursingInvoiceDetails} from "./SingleNursingInvoiceDetails";

const dropDownItems = [
  {action: '#', label: <><i className='bi bi-arrow-clockwise'/> Actualiser</>, name: 'refresh'},
  {action: '#', label: <><i className='bi bi-printer'/> Impression</>, name: 'print'},
]

const SingleNursingPage = () => {
  const dispatch = useDispatch(), { id } = useParams()
  const {data: nursing, isFetching, isSuccess, isError, refetch} = useGetSingleNursingQuery(id)
  const {hospital} = useSelector(state => state.parameters)

  useEffect(() => {
    dispatch(onInitSidebarMenu('/member/treatments/nursing'))
  }, [dispatch]) // toggle submenu dropdown

  let patient
  patient = useMemo(() => isSuccess && nursing?.patient
    ? nursing.patient
    : null, [isSuccess, nursing])

  const onRefresh = async () => await refetch()

  const printRef = useRef()
  const onPrintInvoice = useReactToPrint({ content: () => printRef.current })
  async function onDropdownActionsClick(name: string) {
    switch (name) {
      case 'print':
        onPrintInvoice()
        break
      default:
        await onRefresh()
        break
    }
  }

  return (
    <div className='section dashboard'>
      <AppHeadTitle title={'Dossier Nursing'} />
      <AppBreadcrumb title={<><i className='bi bi-folder2-open'/> Dossier Nursing</>} links={[
        {path: '/member/treatments/nursing', label: 'Nursing'}
      ]} />

      <Card className='border-0'>
        <AppDropdownFilerMenu
          heading='Actions'
          items={dropDownItems}
          onClick={onDropdownActionsClick}/>

        <Card.Body>
          <h5 className='card-title' style={cardTitleStyle}>
            <i className='bi bi-folder2-open'/> Dossier n° {!isFetching && nursing && `#${nursing?.nursingNumber}`}
          </h5>
          {!isFetching && nursing &&
            <div className='container-fluid' ref={printRef}>
              <SingleNursingInvoiceDetails
                data={nursing}
                hospital={hospital}
                onRefresh={onRefresh}
                patient={patient ? patient : null} />
            </div>}
          {isFetching && <BarLoaderSpinner loading={isFetching}/>}
          {!nursing && isError && <AppMainError/>}
        </Card.Body>
      </Card>
    </div>
  )
}

export default memo(SingleNursingPage)
