import {useEffect, useMemo, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {AppBreadcrumb, AppDropdownFilerMenu, AppHeadTitle, AppMainError} from "../../components";
import {Link, useParams} from "react-router-dom";
import {Card, Col, Row, Table} from "react-bootstrap";
import {entrypoint} from "../../app/store";
import {useGetSingleInvoiceQuery, useUpdateInvoiceMutation} from "./invoiceApiSlice";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {InvoiceForm} from "./InvoiceForm";
import toast from "react-hot-toast";
import { useReactToPrint } from "react-to-print";

const dropDownItems = [
  {action: '#', label: 'Actualiser', name: 'refresh'},
  {action: '#', label: 'Impression', name: 'print'},
]

export function roundANumber(num1, num2) {
  return parseFloat( parseInt(num1 * Math.pow(10, num2) + .5)) / Math.pow(10, num2)
}

const patientTDStyle = { width: '60%', textAlign: 'right' }
const pricePaddingStyle = { paddingTop: 36 }

function SingleInvoice() {
  const dispatch = useDispatch(), { id } = useParams()
  const { hospital, fCurrency } = useSelector(state => state.parameters)
  const { data: invoice, isFetching, isSuccess, isError, refetch} = useGetSingleInvoiceQuery(id)
  const [netPayable, setNetPayable] = useState(0)
  const [discount, setDiscount] = useState({isDChecked: false, discount: 5})
  const [tax, setTax] = useState({isTChecked: false, vTA: 16, aTI: 0})
  const [form, setForm] = useState({sum: 0, isBedroomLeaved: false, isComplete: false})
  const [hospDaysCounter, setHospDaysCounter] = useState(null)

  const [updateInvoice, {isLoading}] = useUpdateInvoiceMutation()

  useEffect(() => {
    dispatch(onInitSidebarMenu('/member/finance/invoices'))
  }, [dispatch])

  let patient, consult, error
  if (isError) error = <AppMainError/>

  patient = useMemo(() => isSuccess && invoice
    ? invoice?.patient ? invoice.patient : null
    : null, [isSuccess, invoice])

  consult = useMemo(() => isSuccess && invoice
    ? invoice?.consultation ? invoice.consultation : null
    : null, [isSuccess, invoice])

  // ****************************************************************************************

  let actsInvoiceBaskets, examsInvoiceBaskets, grossTotal, paid, actsSum, examsSum
  actsInvoiceBaskets = useMemo(() => isSuccess && invoice
    ? invoice?.actsInvoiceBaskets ? invoice.actsInvoiceBaskets : null
    : null, [isSuccess, invoice])

  examsInvoiceBaskets = useMemo(() => isSuccess && invoice
    ? invoice?.examsInvoiceBaskets ? invoice.examsInvoiceBaskets : null
    : null, [isSuccess, invoice])

  grossTotal = useMemo(() => {
    if (isSuccess && invoice) {
      const consultData = consult?.consultation
      const counter = consultData && consultData?.hospitalization ? consultData.hospitalization?.daysCounter : 1
      setHospDaysCounter(counter)

      const amount = parseFloat(invoice?.amount)
      const hospAmount = parseFloat(invoice?.hospitalizationAmount)
      const total = amount + hospAmount
      return parseFloat(total)
    }
    return 0
  }, [isSuccess, invoice, consult])

  paid = useMemo(() => {
    if (isSuccess && invoice) {
      return invoice.paid
    }
    return 0
  }, [isSuccess, invoice])

  actsSum = useMemo(() => {
    let total = 0
    if (isSuccess && invoice && invoice?.actsInvoiceBaskets) {
      const acts = invoice?.actsInvoiceBaskets
      for (const key in acts) {
        total += parseFloat(acts[key]?.price)
      }
      return total
    }
    return total
  }, [isSuccess, invoice])

  examsSum = useMemo(() => {
    let total = 0
    if (isSuccess && invoice && invoice?.examsInvoiceBaskets) {
      const exams = invoice?.examsInvoiceBaskets
      for (const key in exams) {
        total += parseFloat(exams[key]?.price)
      }
      return total
    }
    return total
  }, [isSuccess, invoice])


  useEffect(() => {
    if (isSuccess && invoice && !tax.isTChecked && !discount.isDChecked)
      setNetPayable(roundANumber(invoice?.totalSum, 2))
  }, [isSuccess, invoice, discount, tax])


  // Get ATI SUM
  function onTaxChange({ target }) {
    const value = target.value > 0 && !isNaN(target.value) ? parseFloat(target.value) : 1
    if (invoice && tax.isTChecked) {
      const total = parseFloat(invoice.totalSum)
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
    if (invoice) {
      let totalAmount = parseFloat(invoice?.totalSum)
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
  }, [invoice, discount, tax])
  // END Get NET PAYABLE

  function onReset() {
    setForm({sum: 0, isBedroomLeaved: false, isComplete: false})
    setDiscount({isDChecked: false, discount: 5})
    setTax({isTChecked: false, vTA: 16, aTI: 1})
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (invoice && consult) {
      if (form.sum > 0.00) {
        const hosp = invoice?.hospitalization
        const isBedroomLeaved = hosp && hosp?.isCompleted ? hosp.isCompleted : form.isBedroomLeaved
        const isComplete = invoice?.isComplete ? invoice.isComplete : form.isComplete

        if (discount.isDChecked && tax.isTChecked) {
          const formData1 = await updateInvoice({
            id: invoice?.id,
            sum: form.sum.toString(),
            discount: parseFloat(discount.discount),
            vTA: parseFloat(tax.vTA),
            isBedroomLeaved,
            isComplete,
          })
          if (!formData1.error) {
            toast.success('Opération bien efféctuée.')
            onReset()
            await refetch()
          }
        } // Taxe et Remise existent
        else if (discount.isDChecked) {
          const formData2 = await updateInvoice({
            id: invoice?.id,
            sum: form.sum.toString(),
            discount: parseFloat(discount.discount),
            isBedroomLeaved,
            isComplete,
          })
          if (!formData2.error) {
            toast.success('Opération bien efféctuée.')
            onReset()
            await refetch()
          }
        } // Seulement la Remise existante
        else if (tax.isTChecked) {
          const formData3 = await updateInvoice({
            id: invoice?.id,
            sum: form.sum.toString(),
            vTA: parseFloat(tax.vTA),
            isBedroomLeaved,
            isComplete,
          })
          if (!formData3.error) {
            toast.success('Opération bien efféctuée.')
            onReset()
            await refetch()
          }
        } // Seulement la Taxe existante
        else {
          const formData3 = await updateInvoice({
            id: invoice?.id,
            sum: form.sum.toString(),
            isBedroomLeaved,
            isComplete,
          })
          if (!formData3.error) {
            toast.success('Opération bien efféctuée.')
            onReset()
            await refetch()
          }
        }
      }
      else toast.error('Aucun montant renseigné.')
    }
  }

  const printRef = useRef()
  const onPrintInvoice = useReactToPrint({ content: () => printRef.current })
  async function onDropdownActionsClick(name: string) {
    switch (name) {
      case 'print':
        onPrintInvoice()
        break
      default:
        await refetch()
        break
    }
  }

  return (
    <div className='section dashboard'>
      <AppHeadTitle title={'Facture n° #'+id} />
      <AppBreadcrumb title={'Facture n° #'+id} />

      <Card className='border-0 pt-3'>
        <AppDropdownFilerMenu
          heading='Actions'
          items={dropDownItems}
          onClick={onDropdownActionsClick}/>
        <Card.Body>
          <div className='container-fluid pt-4' ref={printRef}>
            <Row>
              {/* Hôpital */}
              <Col md={4}>
                {hospital && (
                  <>
                    <h4 className='card-title text-uppercase fw-bold' style={cardTitleStyle}>
                      {hospital?.denomination}
                    </h4>
                    <p>{hospital?.address ? hospital.address : 'Adresse :'}</p>
                    <p>{hospital?.tel ? hospital.tel : 'N° d Téléphone :'}</p>
                    <p>{hospital?.email ? hospital.email : 'Adresse E-mail :'}</p>
                  </>
                )}
              </Col>
              {/* End Hôpital */}

              {/* Identification du patient */}
              <Col md={4}>
                <Table bordered>
                  <tbody style={{ fontSize: '0.6rem' }}>
                  <tr className='text-uppercase fw-bold'>
                    <td className='bg-light'>N° de facture</td>
                    <td style={patientTDStyle}>{!isFetching && invoice && `#${invoice?.invoiceNumber}`}</td>
                  </tr>
                  <tr className='text-uppercase fw-bold'>
                    <td className='bg-light'>Identifiant du patient</td>
                    <td style={patientTDStyle}>
                      {!isFetching && patient && (
                        <>
                          {patient?.name+' '}
                          {patient?.lastName && patient.lastName+' '}
                          {patient?.firstName && patient.firstName+' '}
                        </>
                      )}
                    </td>
                  </tr>
                  <tr className='text-uppercase fw-bold'>
                    <td className='bg-light'>Date de facturation</td>
                    <td style={patientTDStyle}>{!isFetching && invoice && invoice?.releasedAt}</td>
                  </tr>
                  <tr className='text-uppercase fw-bold'>
                    <td className='bg-light'>Date d'échéance</td>
                    <td style={patientTDStyle}>
                      {!isFetching && invoice && invoice?.updatedAt ? invoice.updatedAt : '--'}
                    </td>
                  </tr>
                  </tbody>
                </Table>
              </Col>
              {/* End Identification du patient */}

              {/* Logo */}
              <Col md={4}>
                {hospital?.logo && <img src={entrypoint + hospital.logo?.contentUrl} className='img-fluid' alt='Logo'/>}
              </Col>
              {/* End Logo */}
            </Row>

            <Row className='mt-3'>
              <Col>
                <h5 style={{ fontWeight: 900 }}>
                  <i className='bi bi-piggy-bank-fill'/> Montant Total
                </h5>
                <p>
                  {!isFetching && invoice &&
                    <i className='fw-bold'>
                      <span className='text-secondary me-1'>{fCurrency && fCurrency.value}</span>
                      <span style={{ fontWeight: 900 }}>
                        {parseFloat(invoice?.totalSum).toFixed(2).toLocaleString()}
                      </span>
                    </i>}
                </p>

                <h5 className='fw-bold text-primary'><i className='bi bi-cash-stack'/> Montant Payé</h5>
                <p>
                  {!isFetching && invoice &&
                    <i className='fw-bold text-primary'>
                      <span className='text-secondary me-1'>{fCurrency && fCurrency.value}</span>
                      {parseFloat(paid).toFixed(2).toLocaleString()}
                    </i>}
                </p>

                <h5 className='fw-bold text-danger'><i className='bi bi-currency-exchange'/> Reste</h5>
                <p>
                  {!isFetching && invoice &&
                    <i className='fw-bold text-danger'>
                      <span className='text-secondary me-1'>{fCurrency && fCurrency.value}</span>
                      {parseFloat(invoice?.totalSum - invoice?.paid).toFixed(2).toLocaleString()}
                    </i>}
                </p>
              </Col>

              <Col md={8}>
                <Table bordered responsive style={{ fontSize: '0.7rem' }}>
                  <thead className='text-uppercase bg-dark text-light text-center'>
                  <tr>
                    <th>Service médical</th>
                    <th>Coût</th>
                  </tr>
                  </thead>

                  <tbody>
                  <tr>
                    <td>
                      <h5 className='card-title pb-0 mb-0' style={cardTitleStyle}>Fiche :</h5>
                      <div className='text-uppercase text-end mb-0 fw-bold'>
                        {!isFetching && consult && consult?.file && consult.file?.wording}
                      </div>
                    </td>
                    <td style={{ paddingTop: 31 }} className='text-end'>
                      {!isFetching && consult && consult?.file
                        && <span className='fw-bold'>
                          {parseFloat(consult.file?.price).toFixed(2).toLocaleString()+' '}
                          {fCurrency && fCurrency.value}
                        </span>}
                    </td>
                  </tr>

                  {actsInvoiceBaskets && actsInvoiceBaskets.length > 0 &&
                    <>
                      <tr>
                        <td>
                          <h5 className='card-title pb-0 mb-0' style={cardTitleStyle}>
                            Actes Médicaux :
                          </h5>
                          <div className='text-uppercase mt-1 mb-0 fw-bold text-end'>
                            {actsInvoiceBaskets && actsInvoiceBaskets?.map((act, idx) => (
                              <div key={idx} className='text-uppercase mt-1 mb-0'>
                                {act.act?.wording} -
                              </div>
                            ))}
                          </div>
                        </td>

                        <td style={pricePaddingStyle} className='fw-bold'>
                          {actsInvoiceBaskets && actsInvoiceBaskets?.map((act, idx) => (
                            <div key={idx} className='mt-1 mb-0 text-end'>
                              {parseFloat(act.price) > 0.1
                                ? <>
                                  {parseFloat(act.price).toFixed(2).toLocaleString()+' '}
                                  {fCurrency && fCurrency.value}
                                </>
                                : '-'}
                            </div>
                          ))}
                        </td>
                      </tr>

                      <tr>
                        <td
                          style={{ fontWeight: 800 }}
                          className='text-center text-uppercase bg-light text-secondary'>Sous-total</td>
                        <td
                          style={{ fontWeight: 800 }}
                          className='text-uppercase bg-light text-secondary text-end'>
                          {actsSum.toFixed(2).toLocaleString()+' '}
                          {fCurrency && fCurrency.value}
                        </td>
                      </tr>
                    </>}

                  {examsInvoiceBaskets && examsInvoiceBaskets.length > 0 &&
                    <>
                      <tr>
                        <td>
                          <h5 className='card-title pb-0 mb-0' style={cardTitleStyle}>
                            Examens :
                          </h5>
                          <div className='text-uppercase text-end mt-1 mb-0 fw-bold'>
                            {examsInvoiceBaskets && examsInvoiceBaskets?.map((item, idx) => (
                              <div key={idx} className='text-uppercase mt-1 mb-0'>
                                {item.exam?.wording} -
                              </div>
                            ))}
                          </div>
                        </td>

                        <td style={pricePaddingStyle} className='fw-bold text-end'>
                          {examsInvoiceBaskets && examsInvoiceBaskets?.map((item, idx) => (
                            <div key={idx} className='mt-1 mb-0'>
                              {parseFloat(item.price).toFixed(2).toLocaleString()+' '}
                              {fCurrency && fCurrency.value}
                            </div>
                          ))}
                        </td>
                      </tr>

                      <tr>
                        <td
                          style={{ fontWeight: 800 }}
                          className='text-center text-uppercase bg-light text-secondary'>Sous-total</td>
                        <td
                          style={{ fontWeight: 800 }}
                          className='text-uppercase bg-light text-secondary text-end'>
                          {examsSum.toFixed(2).toLocaleString()+' '}
                          {fCurrency && fCurrency.value}
                        </td>
                      </tr>
                    </>}

                  {!isFetching && invoice && invoice?.consultation && invoice.consultation?.hospitalization && (
                    <>
                      <tr>
                        <td>
                          <h5 className='card-title pb-0 mb-0' style={cardTitleStyle}>
                            Hospitalisation
                          </h5>
                          <div className='text-uppercase mt-1 mb-0 text-end'>
                            <i className='bi bi-x'/> {parseInt(hospDaysCounter).toLocaleString()} jour(s)
                          </div>
                        </td>
                        <td style={pricePaddingStyle} className='fw-bold text-end'>
                          {!isFetching && invoice && invoice?.hospitalizationAmount
                            && parseFloat(invoice.consultation?.hospitalization.bed.price)
                              .toFixed(2)
                              .toLocaleString()+' '}
                          {fCurrency && fCurrency.value}
                        </td>
                      </tr>

                      <tr>
                        <td
                          style={{ fontWeight: 800 }}
                          className='text-center text-uppercase bg-light text-secondary'>Sous-total</td>
                        <td
                          style={{ fontWeight: 800 }}
                          className='text-uppercase bg-light text-secondary text-end'>
                          {parseFloat(invoice?.hospitalizationAmount).toFixed(2).toLocaleString()+' '}
                          {fCurrency && fCurrency.value}
                        </td>
                      </tr>
                    </>
                  )}

                  <tr className='text-uppercase' style={{ fontWeight: 800, fontSize: '1.2rem' }}>
                    <td className='bg-warning'>Total général</td>
                    <td className='bg-warning text-end'>
                      {!isFetching && invoice && parseFloat(grossTotal).toFixed(2).toLocaleString()+' '}
                      {fCurrency && fCurrency.value}
                    </td>
                  </tr>
                  </tbody>
                </Table>

                {!isFetching && invoice && (
                  <>
                    <Table bordered striped style={{ fontSize: '0.7rem', width: '80%' }} className='float-end'>
                      <tbody className='fw-bold text-uppercase'>
                      <tr>
                        <td>Sous-total</td>
                        <td className='text-end'>
                          {!isFetching && invoice
                            && roundANumber(grossTotal, 2).toFixed(2).toLocaleString()+' '}
                          {fCurrency && fCurrency.value}
                        </td>
                      </tr>

                      <tr>
                        <td>Tva</td>
                        <td className='text-end'>
                          {!isFetching && invoice && invoice?.vTA
                            ? <span className='text-success'><i className='bi bi-plus'/>{invoice.vTA}%</span> : '-'}
                        </td>
                      </tr>

                      <tr style={{ fontWeight: 800, fontSize: '1.5rem' }}>
                        <td>Montant TTC</td>
                        <td className='text-end'>
                          {!isFetching && invoice && (
                            <>
                              {tax.isTChecked
                                ? parseFloat(roundANumber(tax.aTI, 2)).toFixed(2).toLocaleString()+' '
                                : invoice?.vTA
                                  ? parseFloat(grossTotal + (grossTotal * invoice?.vTA) / 100)
                                  .toFixed(2).toLocaleString()+' '
                                  : parseFloat(roundANumber(grossTotal, 2)).toFixed(2).toLocaleString()+' '}
                              {fCurrency && fCurrency.value}
                            </>
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td className='text-danger'>Remise</td>
                        <td className='text-end'>
                          {!isFetching && invoice && invoice?.discount
                            ? <span className='text-danger'><i className='bi bi-dash'/>{invoice.discount}%</span> : '-'}
                        </td>
                      </tr>

                      <tr style={{ fontWeight: 800, fontSize: '1rem' }}>
                        <td>Net à payer</td>
                        <td className='text-end'>
                          {!isFetching && invoice && (
                            <>
                              {parseFloat(netPayable).toFixed(2).toLocaleString()+' '}
                              {fCurrency && fCurrency.value}
                            </>
                          )}
                        </td>
                      </tr>
                      </tbody>
                    </Table>
                  </>
                )}

                {error && error}

                {isFetching && <BarLoaderSpinner loading={isFetching}/>}
              </Col>
            </Row>

            <Row className='mt-3 mb-3 m-auto small' style={{ width: '80%' }}>
              <Col>Pour toutes questions concernant cette facture, veuillez contacter :</Col>
              <Col style={{ borderBottom: '1px dashed black' }}/>
            </Row>
          </div>
          {/* Printable */}

          <hr/>

          {/* Form */}
          <Row>
            <Col/>
            <Col md={8}>
              <InvoiceForm
                onSubmit={onSubmit}
                onTaxChange={onTaxChange}
                currency={fCurrency}
                loader={isLoading || isFetching}
                discount={discount}
                setDiscount={setDiscount}
                consult={consult}
                invoice={invoice}
                tax={tax}
                setTax={setTax}
                form={form}
                totalAmount={invoice ? parseFloat(invoice?.totalSum) : 1}
                setNetPayable={setNetPayable}
                setForm={setForm} />
            </Col>
          </Row>
          {/* End Form */}

          {consult && consult?.nursing &&
            <Row>
              <Col/>
              <Col md={8}>
                <h5>
                  <i className='bi bi-folder2-open me-1'/>
                  Voir aussi le
                  <Link
                    to={`/member/treatments/nursing/${consult.nursing?.id}/show`}
                    className='text-decoration-none mx-1 me-1'>
                    {'👉 '}
                    dossier Nursing
                  </Link>
                  du patient
                </h5>
              </Col>
            </Row>}
        </Card.Body>
      </Card>
    </div>
  )
}

export default SingleInvoice
