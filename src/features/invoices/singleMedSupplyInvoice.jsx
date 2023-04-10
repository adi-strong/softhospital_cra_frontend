import {memo, useEffect, useMemo, useRef} from "react";
import {useGetSingleSupplyMedicineInvoiceQuery} from "../medicines/drugStoreApiSlice";
import {useParams} from "react-router-dom";
import {Card, Col, Row, Table} from "react-bootstrap";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {AppDropdownFilerMenu, AppMainError} from "../../components";
import {useReactToPrint} from "react-to-print";
import moment from "moment";
import {useDispatch} from "react-redux";
import {onInitSidebarMenu} from "../navigation/navigationSlice";

const TopItem = ({ document, provider, date}) => {
  return (
    <>
      <Table className='w-100 text-center' bordered>
        <thead className='bg-primary text-white'>
        <tr>
          <th>N° document</th>
          <th>Fournisseur</th>
          <th>Date</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td className='text-uppercase'>{document}</td>
          <td className='text-uppercase'>{provider?.wording}</td>
          <td>{date ? date : '-'}</td>
        </tr>
        </tbody>
      </Table>

      <div className='text-center'>
        <address>
          {provider?.address && <><b>Adresse</b> <br/> {provider?.address} <br/></>}
          {provider?.tel && <><b>N° Tél</b> <br/> {provider?.tel} <br/></>}
          {provider?.email && <><b>Email</b> <br/> {provider?.email} <br/></>}
        </address>
      </div>
    </>
  )
}

const ContentItem = ({ invoice, taxItems }) => {
  let dataItems, taxSum
  dataItems = useMemo(() => {
    if (invoice?.drugstoreSupplyMedicines) {
      return invoice?.drugstoreSupplyMedicines
    }
    return []
  }, [invoice])

  taxSum = useMemo(() => {
    if (taxItems && taxItems?.length > 0) {
      const items = taxItems
      let total = 0
      for (const key in items) {
        total += items[key]?.amount
      }
      return total
    }
    return null
  }, [taxItems])

  return (
    <>
      <Table style={{ fontSize: '0.7rem' }} className='w-100' bordered>
        <thead className='bg-primary text-light text-center'>
        <tr>
          <th>Désignation</th>
          <th>Unité</th>
          <th>Expiration</th>
          <th>Qté</th>
          <th>PU HT</th>
          <th>TVA</th>
          <th>TOTAL HT</th>
        </tr>
        </thead>
        <tbody>
          {dataItems && dataItems?.length > 0 && dataItems?.map((item, idx) =>
            <tr key={idx}>
              <th className='text-capitalize'>{item?.medicine ? item.medicine?.wording : '-'}</th>
              <td className='text-capitalize text-center'>{item?.medicine
                ? item.medicine?.consumptionUnit
                  ? item.medicine.consumptionUnit?.wording
                  : '-'
                : '-'}</td>
              <td className='text-center fw-bold'>
                {item?.expiryDate ? moment(item.expiryDate).format('ll') : '-'}
              </td>
              <td className='text-capitalize text-end'>
                {item?.otherQty > 0
                  ? <>{parseInt(item.otherQty).toLocaleString()} {item?.quantityLabel}</>
                  : parseInt(item?.quantity).toLocaleString()}
              </td>
              <th className='text-end'>
                {parseFloat(item?.cost).toFixed(2).toLocaleString()} {invoice?.currency}
              </th>
              <td className='text-center'>{item?.vTA ? `${item.vTA}%` : ''}</td>
              <th className='text-end'>
                {item?.otherQty > 0
                  ? parseFloat(item.otherQty * item?.cost).toFixed(2).toLocaleString()+' '
                  : parseFloat(item?.quantity * item?.cost).toFixed(2).toLocaleString()+' '}
                {invoice?.currency}
              </th>
            </tr>)}
        </tbody>
      </Table>

      <Row>
        <Col md={5}>
          <Table style={{ fontSize: '0.7rem' }} className='w-100' bordered>
            <thead className='text-primary text-center'>
            <tr>
              <th>Base HT</th>
              <th>% TVA</th>
              <th>Montant TVA</th>
            </tr>
            </thead>
            <tbody>
              {taxItems && taxItems?.length > 0 && taxItems?.map((item, idx) =>
                <tr key={idx}>
                  <th>{parseFloat(item?.sum).toFixed(2).toLocaleString()} {invoice?.currency}</th>
                  <th className='text-center text-primary'>{item?.vTA}%</th>
                  <td style={{ fontWeight: 800 }} className='text-end text-primary'>
                    {parseFloat(item?.amount).toFixed(2).toLocaleString()} {invoice?.currency}
                  </td>
                </tr>)}
            </tbody>
          </Table>
        </Col>

        <Col>
          <Table style={{ fontSize: '0.7rem' }} bordered>
            <tbody className='text-end'>
            <tr className='bg-primary text-light'>
              <td style={{ fontWeight: 900, fontSize: '0.8rem' }}>SOUS TOTAL HT</td>
              <td style={{ fontWeight: 900, fontSize: '0.8rem' }}>
                {parseFloat(invoice?.subTotal).toFixed(2).toLocaleString()} {invoice?.currency}
              </td>
            </tr>
            <tr>
              <th className='text-primary'>TVA</th>
              <th className='text-primary'>
                {taxSum
                  ? <>{parseFloat(taxSum).toFixed(2).toLocaleString()} {invoice?.currency}</>
                  : '-'}
              </th>
            </tr>
            <tr>
              <td style={{ fontSize: '1.3rem', fontWeight: 900 }}>TOTAL TTC</td>
              <td style={{ fontSize: '1.3rem', fontWeight: 900 }}>
                {parseFloat(invoice?.total).toFixed(2).toLocaleString()} {invoice?.currency}
              </td>
            </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  )
}

const SingleMedSupplyInvoice = () => {
  const {id} = useParams(), printRef = useRef(), dispatch = useDispatch()
  const {data: invoice, isLoading, isSuccess, isError} = useGetSingleSupplyMedicineInvoiceQuery(id)

  useEffect(() => { dispatch(onInitSidebarMenu('/member/drugstore/categories')) }, [dispatch])

  let taxItems
  taxItems = useMemo(() => {
    if (isSuccess && invoice && invoice?.drugstoreSupplyMedicines) {
      const items = invoice.drugstoreSupplyMedicines
      const sums = {}
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        const vTA = item?.vTA
        const sum = item?.otherQty > 0
          ? item?.cost * item.otherQty
          : item.cost * item?.quantity
        if (!sums[vTA]) sums[vTA] = sum
        else sums[vTA] += sum
      }

      const obj = []
      if (sums) {
        for (const i in sums) {
          obj.push({vTA: i, sum: sums[i], amount: (sums[i] * i) / 100})
        }
      }

      return obj
    }
    return null
  }, [isSuccess, invoice])

  const handlePrint = useReactToPrint({content: () => printRef.current})

  function onClick(name) {
    handlePrint()
  }

  return (
    <div className='section dashboard'>
      <Card className='border-0'>
        <AppDropdownFilerMenu
          items={[{label: <><i className='bi bi-printer'/> Impression</>, name: 'print', action: '#'}]}
          onClick={onClick}
          heading='Actions' />

        <Card.Body>
          <div className='container-fluid' ref={printRef}>
            <h5 className='card-title' style={cardTitleStyle}>Facture d'approvisionnement n° {id}</h5>
            {!isError && isSuccess && invoice &&
              <>
                <TopItem document={invoice?.document} provider={invoice?.provider} date={invoice?.released}/>
                <ContentItem invoice={invoice} taxItems={taxItems} />
              </>}
          </div>

          {isLoading && <BarLoaderSpinner loading={isLoading}/>}
          {isError && <AppMainError/>}
        </Card.Body>
      </Card>
    </div>
  )
}

export default memo(SingleMedSupplyInvoice)
