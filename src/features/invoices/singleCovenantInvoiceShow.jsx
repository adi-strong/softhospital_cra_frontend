import {cardTitleStyle} from "../../layouts/AuthLayout";
import moment from "moment";
import {Col, Row, Table} from "react-bootstrap";
import {SingleCovenantInvoiceShowSums} from "./singleCovenantInvoiceShowSums";

export const SingleCovenantInvoiceShow = ({ onToggle, data, setShow, onRefresh }) => {
  return (
    <>
      <p>
        <span className='text-primary bi bi-arrow-left' style={{ cursor: 'pointer' }} onClick={onToggle}>
          {' '}Revenir
        </span>
      </p>

      <h5 className='card-title' style={cardTitleStyle}>Facture mensuel n°#{data?.id}</h5>
      <p>Date de facturation : {data?.date &&
        <span className='text-capitalize'>{moment(data.date).format('ll')}</span>}</p>

      <Row className='mt-5 mb-3'>
        <Col md={4} className='mb-3'>
          <h6 className='text-primary'>TOTAL TTC</h6>
          <span className='text-primary'>
            {data?.currency && data.currency+' '}
            {data && parseFloat(data?.totalAmount).toFixed(2).toLocaleString()}
          </span> <br/>

          <hr/>

          <h6>MONTANT PAYÉ</h6>
          <span>
            {data?.currency && data.currency+' '}
            {data && parseFloat(data?.paid).toFixed(2).toLocaleString()}
          </span> <br/>

          <hr/>

          <h6 className='text-danger'>RESTE</h6>
          <span className='text-danger'>
            {data?.currency && data.currency+' '}
            {data && parseFloat(data?.leftover).toFixed(2).toLocaleString()}
          </span>
        </Col>

        <Col md={8} className='mb-3'>
          <Table striped bordered className='w-100'>
            <thead className='text-center'>
              <tr className='bg-primary text-light'>
                <th>Désignation</th>
                <th>Sommation</th>
              </tr>
            </thead>

            <tbody className='text-center'>
              <tr>
                <th>Fiches médicales</th>
                <th className='text-end'>
                  {data && parseFloat(data?.filesPrice).toFixed(2).toLocaleString()+' '}
                  {data && data?.currency && data.currency}
                </th>
              </tr>
              <tr>
                <th>Actes médicaux</th>
                <th className='text-end'>
                  {data && parseFloat(data?.totalActsBaskets).toFixed(2).toLocaleString()+' '}
                  {data && data?.currency && data.currency}
                </th>
              </tr>
              <tr>
                <th>Examens</th>
                <th className='text-end'>
                  {data && parseFloat(data?.totalExamsBaskets).toFixed(2).toLocaleString()+' '}
                  {data && data?.currency && data.currency}
                </th>
              </tr>
              <tr>
                <th>Premier(s) soin(s)</th>
                <th className='text-end'>
                  {data && parseFloat(data?.totalNursingPrice).toFixed(2).toLocaleString()+' '}
                  {data && data?.currency && data.currency}
                </th>
              </tr>
              <tr>
                <th>Hospitalisations</th>
                <th className='text-end'>
                  {data && parseFloat(data?.hospPrice).toFixed(2).toLocaleString()+' '}
                  {data && data?.currency && data.currency}
                </th>
              </tr>
              <tr className='text-primary'>
                <th>TOTAL</th>
                <th className='text-end'>
                  {data && parseFloat(data?.subTotal).toFixed(2).toLocaleString()+' '}
                  {data && data?.currency && data.currency}
                </th>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>

      <SingleCovenantInvoiceShowSums data={data} setShow={setShow} onRefresh={onRefresh}/>
    </>
  )
}
