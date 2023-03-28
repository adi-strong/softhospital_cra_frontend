import {PrintHospitalInfos} from "../invoices/PrintHospitalInfos";
import {Col, Row} from "react-bootstrap";
import {useState} from "react";
import {NursingInvoiceDataTable} from "./NursingInvoiceDataTable";

export const SingleNursingInvoiceDetails = ({ hospital, data, patient, onRefresh }) => {
  const [nursing, setNursing] = useState({
    sum: 0.00,
    subTotal: parseFloat(data?.subTotal),
    totalAmount: parseFloat(data?.totalAmount),
    isCompleted: false,
    discount: 5,
    isPayed: true,
    check: false,
  })

  return (
    <>
      <PrintHospitalInfos
        hospital={hospital} invoice={data}
        patient={patient}
        document={data ? data?.nursingNumber : null}
        releasedDate={data ? data?.createdAt : null}  />

      <Row className='mt-3'>
        <Col md={3} className='mb-3'>
          <h6 className='fw-bold'>FACTURE À :</h6>
          {patient &&
            <>
              <p className='text-uppercase'>{patient?.name+' '}</p>
              <p className='text-uppercase'>{patient?.lastName && patient.lastName+' '}</p>
              <p className='text-uppercase'>{patient?.firstName && patient.firstName}</p>
              <p className='text-uppercase'>{patient?.tel && patient.tel}</p>
              <p className='text-lowercase'>{patient?.email && patient.email}</p>
            </>}

          <div className='fw-bold mt-5'>
            <h5 className='text-primary'>NET À PAYER</h5>
            <h6 className='text-primary'>
              {parseFloat(nursing.totalAmount).toFixed(2).toLocaleString()+' '}
              {data?.currency}
            </h6> <hr/>
            <h5>MONTANT PAYÉ</h5>
            <h6>
              {parseFloat(data?.paid).toFixed(2).toLocaleString()+' '}
              {data?.currency}
            </h6> <hr/>
            <h5 className='text-danger'>RESTE</h5>
            <h6 className='text-danger'>
              {parseFloat(nursing?.totalAmount - data?.paid).toFixed(2).toLocaleString()+' '}
              {data?.currency}
            </h6>
          </div>
        </Col>

        <Col>
          <NursingInvoiceDataTable
            data={data}
            nursing={nursing}
            setNursing={setNursing}
            onRefresh={onRefresh}/>
        </Col>
      </Row>
    </>
  )
}
