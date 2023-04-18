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
        document={data ? data?.nursingNumber : null}  />

      <Row className='mt-3'>
        <Col md={3} className='mb-3'>
          <h6 className='fw-bold'>PATIENT(E) :</h6>
          {patient &&
            <>
              <p className='text-uppercase'>{patient?.name+' '}</p>
              <p className='text-uppercase'>{patient?.lastName && patient.lastName+' '}</p>
              <p className='text-uppercase'>{patient?.firstName && patient.firstName}</p>
              <p className='text-uppercase'>{patient?.tel && patient.tel}</p>
              <p className='text-lowercase'>{patient?.email && patient.email}</p>
            </>}
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
