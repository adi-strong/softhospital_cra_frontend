import {PrintHospitalInfos} from "./PrintHospitalInfos";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {Col, Row} from "react-bootstrap";
import {useMemo} from "react";
import {InvoiceDataTable} from "./InvoiceDataTable";

export const SingleInvoiceDetails = ({ invoice, hospital, loader = false}) => {
  let patient
  patient = useMemo(() => invoice && invoice?.patient
    ? invoice.patient
    : null, [invoice])

  return (
    <>
      <PrintHospitalInfos
        hospital={hospital} invoice={invoice}
        patient={patient}
        document={invoice ? invoice?.invoiceNumber : null}
        releasedDate={invoice ? invoice?.releasedAt : null}  />

      <Row className='mt-3'>
        <Col md={3} className='mb-3'>
          <h6 className='fw-bold'>FACTURE À :</h6>
          {!loader && patient &&
            <>
              <p className='text-uppercase'>{patient?.name+' '}</p>
              <p className='text-uppercase'>{patient?.lastName && patient.lastName+' '}</p>
              <p className='text-uppercase'>{patient?.firstName && patient.firstName}</p>
              <p className='text-uppercase'>{patient?.tel && patient.tel}</p>
              <p className='text-lowercase'>{patient?.email && patient.email}</p>
            </>}

          {!loader && invoice &&
            <div className='fw-bold mt-5'>
              <h5 className='text-primary'>TOTAL TTC</h5>
              <h6 className='text-primary'>
                {parseFloat(invoice?.totalAmount).toFixed(2).toLocaleString()+' '}
                {invoice?.currency && invoice.currency}
              </h6> <hr/>
              <h5>MONTANT PAYÉ</h5>
              <h6>
                {parseFloat(invoice?.paid).toFixed(2).toLocaleString()+' '}
                {invoice?.currency && invoice.currency}
              </h6> <hr/>
              <h5 className='text-danger'>RESTE</h5>
              <h6 className='text-danger'>
                {parseFloat(invoice?.leftover).toFixed(2).toLocaleString()+' '}
                {invoice?.currency && invoice.currency}
              </h6>
            </div>}
        </Col>
        {/* Patient */}

        <Col className='mb-3'>
          {!loader && invoice && <InvoiceDataTable invoice={invoice} />}
        </Col>
        {/* Invoice Data */}
      </Row>

      {loader && <BarLoaderSpinner loading={loader} />}
    </>
  )
}
