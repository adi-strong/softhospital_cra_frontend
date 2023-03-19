import {memo, useEffect, useMemo, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {AppBreadcrumb, AppDropdownFilerMenu, AppHeadTitle, AppMainError} from "../../components";
import {useGetSingleNursingQuery} from "./nursingApiSlice";
import {Card, Col, Row, Table} from "react-bootstrap";
import {useParams} from "react-router-dom";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {useReactToPrint} from "react-to-print";
import HospitalInfos from "../printing/HospitalInfos";
import HospitalInfos2 from "../printing/HospitalInfos2";
import {roundANumber} from "../invoices/singleInvoice";
import NursingInvoiceContent from "./NursingInvoiceContent";
import NursingInvoiceForm from "./NursingInvoiceForm";

const patientTDStyle = { width: '60%', textAlign: 'right' }

const dropDownItems = [
  {action: '#', label: 'Actualiser', name: 'refresh'},
  {action: '#', label: 'Impression', name: 'print'},
]

const SingleNursingPage = () => {
  const dispatch = useDispatch(), { id } = useParams()
  const {data: nursing, isFetching, isSuccess, isError, refetch} = useGetSingleNursingQuery(id)
  const {hospital, fCurrency} = useSelector(state => state.parameters)

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
        onRefresh()
        break
    }
  }

  // Handle Get Total Amount
  const [totalSum, setTotalSum] = useState(0)
  const [treatments, setTreatments] = useState([])
  const [subTotal, setSubTotal] = useState(0)
  useEffect(() => {
    if (!isFetching && nursing) {
      let tot = 0, total = 0
      const obj = []
      const treatments = nursing?.nursingTreatments ? nursing.nursingTreatments : []
      if (treatments.length > 0) {
        for (const key in treatments) {
          tot += parseFloat(treatments[key]?.treatment.price)
          total += parseFloat(treatments[key]?.treatment.price)
          obj.push({
            id: treatments[key]?.id,
            wording: treatments[key].treatment?.wording,
            price: parseFloat(treatments[key].treatment?.price),
            medicines: treatments[key]?.medicines ? treatments[key].medicines : []})
        }
        setSubTotal(total)
        setTreatments(obj)
      }
      else setTreatments([])
      setTotalSum(roundANumber(tot, 2))
    }
  }, [isFetching, nursing])
  // End Handle Get Total Amount

  // Form's constants
  const [netPayable, setNetPayable] = useState(0)
  const [discount, setDiscount] = useState({isDChecked: false, discount: 5})
  const [tax, setTax] = useState({isTChecked: false, vTA: 16, aTI: 0})
  const [sum, setSum] = useState(0)


  useEffect(() => {
    if (isSuccess && nursing && !tax.isTChecked && !discount.isDChecked) {
      if (nursing?.totalAmount > 0.00) setNetPayable(nursing.totalAmount)
      else setNetPayable(totalSum)
    }
  }, [isSuccess, nursing, discount, tax, totalSum])
  // End Form's constants

  // Get ATI SUM
  function onTaxChange({ target }) {
    const value = target.value > 0 && !isNaN(target.value) ? parseFloat(target.value) : 1
    if (nursing && tax.isTChecked) {
      const total = parseFloat(totalSum)
      const vTA = (total * value) / 100
      const aTI = roundANumber(total + vTA, 2)
      setTax({...tax, vTA: value, aTI})
      if (discount.isDChecked && tax.isTChecked) {
        const disc = (total * discount.discount) / 100
        const res = total - disc
        setNetPayable(roundANumber(res + aTI, 2))
      }
      else if (tax.isTChecked) setNetPayable(roundANumber(aTI, 2))
      else setNetPayable(roundANumber(total, 2))
    }
  }
  // End Get ATI SUM

  // Get NET PAYABLE
  useEffect(() => {
    if (nursing) {
      let totalAmount = parseFloat(subTotal)
      if (discount.isDChecked && tax.isTChecked) {
        const disc = (totalAmount * discount.discount) / 100
        const res = totalAmount - disc
        const total = tax.aTI + res
        setNetPayable(roundANumber(total, 2))
      }
      else if (discount.isDChecked) {
        const disc = (totalAmount * discount.discount) / 100
        const res = totalAmount - disc
        setNetPayable(roundANumber(res, 2))
      }
    }
  }, [nursing, discount, tax, subTotal])
  // END Get NET PAYABLE

  function onReset() {
    setDiscount({isDChecked: false, discount: 5})
    setTax({isTChecked: false, vTA: 16, aTI: 0})
    setSum(0)
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
          <h5 className='card-title' style={cardTitleStyle}><i className='bi bi-folder2-open'/> Facture</h5>
          {!isFetching && nursing && (
            <>
              <div ref={printRef} className='container-fluid pt-3'>
                <Row>
                  {/* Hôpital */}
                  <Col md={4}>
                    <HospitalInfos hospital={hospital} />
                  </Col>
                  {/* End Hôpital */}

                  <Col md={4}>
                    <Table bordered>
                      <tbody style={{ fontSize: '0.6rem' }}>
                      <tr className='text-uppercase fw-bold'>
                        <td className='bg-light'>N° de facture</td>
                        <td style={patientTDStyle}>{!isFetching && nursing && `#${nursing?.nursingNumber}`}</td>
                      </tr>
                      <tr className='text-uppercase fw-bold'>
                        <td className='bg-light'>Identifiant du patient</td>
                        <td style={patientTDStyle}>
                          {!isFetching && patient && (
                            <>
                              <span className='me-1'>{patient?.name}</span>
                              {patient?.lastName && <span className='me-1'>{patient.lastName}</span>}
                              {patient?.firstName && <span>{patient.firstName}</span>}
                            </>
                          )}
                        </td>
                      </tr>
                      <tr className='text-uppercase fw-bold'>
                        <td className='bg-light'>Date de facturation</td>
                        <td style={patientTDStyle}>{!isFetching && nursing && nursing?.createdAt}</td>
                      </tr>
                      <tr className='text-uppercase fw-bold'>
                        <td className='bg-light'>Date d'échéance</td>
                        <td style={patientTDStyle}>
                          {!isFetching && nursing && nursing?.updatedAt ? nursing.updatedAt : '--'}
                        </td>
                      </tr>
                      </tbody>
                    </Table>
                  </Col>

                  {/* Hôpital */}
                  <Col md={4}>
                    <HospitalInfos2 hospital={hospital} />
                  </Col>
                  {/* End Hôpital */}
                </Row>
                {/* HEADING */}

                <div className='text-center'>
                  <h5 style={{ fontWeight: 900 }}>
                    <i className='bi bi-piggy-bank-fill'/> Montant Total
                  </h5>
                  <p>
                    {!isFetching && nursing &&
                      <i className='fw-bold'>
                        <span className='text-secondary me-1'>{fCurrency && fCurrency.value}</span>
                        <span style={{ fontWeight: 900 }}>
                            {nursing?.totalAmount > 0.00
                              ? parseFloat(nursing.totalAmount).toFixed(2).toLocaleString()
                              : totalSum.toFixed(2).toLocaleString()}
                          </span>
                      </i>}
                  </p>

                  <h5 className='fw-bold text-primary'><i className='bi bi-cash-stack'/> Montant Payé</h5>
                  <p>
                    {!isFetching && nursing &&
                      <i className='fw-bold text-primary'>
                        <span className='text-secondary me-1'>{fCurrency && fCurrency.value}</span>
                        <span style={{ fontWeight: 900 }}>
                            {parseFloat(nursing?.paid ? nursing.paid : 0).toFixed(2).toLocaleString()}
                          </span>
                      </i>}
                  </p>

                  <h5 className='fw-bold text-danger'><i className='bi bi-currency-exchange'/> Reste</h5>
                  <p>
                    {!isFetching && nursing &&
                      <i className='fw-bold text-danger'>
                        <span className='text-secondary me-1'>{fCurrency && fCurrency.value}</span>
                        {nursing?.totalAmount > 0.00
                          ? roundANumber(nursing.totalAmount - (nursing?.paid ? nursing.paid : 0), 2)
                            .toFixed(2).toLocaleString()
                          : parseFloat(totalSum - (nursing?.paid ? nursing.paid : 0))
                            .toFixed(2).toLocaleString()}
                      </i>}
                  </p>
                </div>
                {/* OTHER INFOS */}

                <Row className='mt-3 mb-3 m-auto small' style={{ width: '80%' }}>
                  <Col>Pour toutes questions concernant cette facture, veuillez contacter :</Col>
                  <Col style={{ borderBottom: '1px dashed black' }}/>
                </Row>

                <NursingInvoiceContent
                  treatments={treatments}
                  currency={fCurrency}
                  nursing={nursing}
                  aTI={tax.aTI}
                  tax={tax}
                  setTax={setTax}
                  netPayable={netPayable}
                  subTotal={subTotal}/>
                {/* TABLE */}
              </div>
              {/* PRINTABLE */}

              <Row>
                <Col />
                <Col md={8}>
                  <NursingInvoiceForm
                    discount={discount}
                    setDiscount={setDiscount}
                    sum={sum}
                    setSum={setSum}
                    onReset={onReset}
                    onTaxChange={onTaxChange}
                    currency={fCurrency}
                    nursing={nursing}
                    tax={tax}
                    setTax={setTax}
                    totalAmount={subTotal}
                    refetch={refetch}
                    setNetPayable={setNetPayable} />
                </Col>
              </Row>
              {/* FORM */}
            </>
          )}
          {isFetching && <BarLoaderSpinner loading={isFetching}/>}
          {isError && <AppMainError/>}
        </Card.Body>
      </Card>
    </div>
  )
}

export default memo(SingleNursingPage)
