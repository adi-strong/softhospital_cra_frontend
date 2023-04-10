import {memo, useEffect} from "react";
import {Card} from "react-bootstrap";
import {AppDropdownFilerMenu, AppMainError} from "../../components";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {useRef} from "react";
import {useReactToPrint} from "react-to-print";
import {useSelector} from "react-redux";
import {useGetSinglePrescriptionQuery} from "../prescriptions/prescriptionApiSlice";
import {useNavigate, useParams} from "react-router-dom";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {OrderPatientInfos} from "./OrderPatientInfos";
import {SingleOrderSection1} from "./SingleOrderSection1";
import parser from "html-react-parser";
import {selectCurrentUser} from "../auth/authSlice";
import {allowShowOrdersPage} from "../../app/config";
import toast from "react-hot-toast";

const dropdownItems = [
  {label: <><i className='bi bi-arrow-clockwise'/> Actualiser</>, name: 'refresh', action: '#'},
  {label: <><i className='bi bi-printer'/> Impression</>, name: 'print', action: '#'},
]

function SingleOrderPage() {
  const printRef = useRef(), { id } = useParams()
  const { hospital } = useSelector(state => state.parameters)
  const {data: order, isFetching, isSuccess, isError, refetch} = useGetSinglePrescriptionQuery(id)

  const handlePrint = useReactToPrint({content: () => printRef.current})

  async function handleClick( name ) {
    if (name === 'print') handlePrint()
    else await refetch()
  }

  const user = useSelector(selectCurrentUser), navigate = useNavigate()
  useEffect(() => {
    if (user && !allowShowOrdersPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

  return (
    <div className='section dashboard'>
      <Card className='border-0'>
        <AppDropdownFilerMenu
          items={dropdownItems}
          onClick={handleClick}
          heading='Actions' />

        <Card.Body>
          <h5 className='card-title' style={cardTitleStyle}> Prescription médical</h5>
          {/* PRINTABLE */}
          <div className='container-fluid mt-4' ref={printRef}>
            <div className='d-flex justify-content-between'>
              <h6 className='bi bi-file-medical mb-3'> Ordonnance</h6>
              <div className='mb-3'>
                {hospital &&
                  <>
                    <h6 className='card-title text-end' style={{ fontWeight: 800, padding: '2px 0 1px 0', }}>
                      {hospital?.denomination}
                    </h6>
                    <address>
                      {hospital?.address ? <div className='text-end'>{hospital.address}</div> : 'Adresse :'}
                    </address>
                    <div>
                      {hospital?.tel ? <div className='text-end'>{hospital.tel}</div> : 'n° de Téléphone :'}
                    </div>
                    <div>
                      {hospital?.email ? <div className='text-end'>{hospital.email}</div> : 'Email :'}
                    </div>
                  </>} {/* HOSPITAL INFOS */}
              </div>
            </div>

            {/* PATIENT'S INFOS */}
            {!isFetching && isSuccess && order && <OrderPatientInfos data={order?.patient} order={order}/>}
            {/* END PATIENT'S INFOS */}

            <hr/>

            {/* ... */}
            {!isFetching && isSuccess && order && <SingleOrderSection1 order={order}/>}

            {!isFetching && isSuccess && order &&
              <div style={{ position: 'relative', bottom: 0 }} className='w-75 m-auto'>
                <b><i className='bi bi-exclamation-triangle'/> Note : </b>
                {order?.descriptions && parser(order.descriptions)}
                <p className='text-end mt-5'>
                  Date : {order?.updatedAt && order.updatedAt}
                </p>
              </div>}
            {/* ... */}
          </div>
          {/* END PRINTABLE */}
          {isError && <AppMainError/>}
          {isFetching && <BarLoaderSpinner loading={isFetching}/>}
        </Card.Body>
      </Card>
    </div>
  )
}

export default memo(SingleOrderPage)
