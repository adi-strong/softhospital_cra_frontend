import {memo} from "react";
import {Col, Row, Table} from "react-bootstrap";
import {roundANumber} from "../invoices/singleInvoice";

function Item({ treatment, currency }) {
  return (
    <>
      <tr className='text-center'>
        <th scope='row'>#{treatment.id}</th>
        <td className='text-uppercase'>{treatment.wording}</td>
        <td className='text-uppercase text-start bg-light'>
          {treatment?.medicines.length > 0 && treatment.medicines.map((item, idx) =>
            <div key={idx} className='mb-3'>
              <p className='fw-bold mb-0 text-secondary'><i className='bi bi-capsule'/> {item?.medicine}</p>
              {item?.dosage}
            </div>)}
        </td>
        <td className='text-uppercase text-end text-secondary'>
          {treatment?.medicines.length > 0 && treatment.medicines.map((item, idx) =>
            <div key={idx} className='mb-3'>
              <p />
            </div>)}
          <p className='fw-bold'>
            {treatment?.price > 0.00
              ? <>
                {roundANumber(treatment.price, 2).toFixed(2).toLocaleString()+' '}
                <span>{currency && currency.value}</span>
              </>
              : '-'}
          </p>
        </td>
      </tr>
    </>
  )
}

const NursingInvoiceContent = (
  {
    treatments = [],
    currency,
    nursing,
    subTotal,
    netPayable,
    aTI,
    tax,
  }) => {
  return (
    <>
      <Table bordered responsive style={{ fontSize: '0.7rem' }}>
        <thead className='text-uppercase bg-dark text-light text-center'>
        <tr>
          <th>Svc id</th>
          <th>Service médical</th>
          <th>Médicaments</th>
          <th>Coût</th>
        </tr>
        </thead>

        <tbody>
        {treatments.length > 0 && treatments.map(treatment =>
          <Item
            key={treatment?.id}
            subTotal={subTotal}
            treatment={treatment}
            currency={currency}/>)}
        </tbody>
      </Table>

      <Row>
        <Col/>
        <Col md={6}>
          <Table striped bordered responsive className='w-100' style={{ fontSize: '0.7rem' }}>
            <tbody className='fw-bold text-uppercase'>
            <tr>
              <td>Sous-total</td>
              <td className='text-end'>
                {roundANumber(subTotal, 2).toFixed(2).toLocaleString()+' '}
                {currency && currency.value}
              </td>
            </tr>
            <tr>
              <td>Tva</td>
              <td className='text-end'>
                {nursing?.vTA
                  ? <span className='text-success'><i className='bi bi-plus'/>{nursing.vTA}%</span>
                  : '-'}
              </td>
            </tr>

            <tr style={{ fontWeight: 800, fontSize: '1.5rem' }}>
              <td>Montant TTC</td>
              <td className='text-end'>
                {tax.isTChecked
                  ? roundANumber(parseFloat(aTI), 2).toFixed(2).toLocaleString()+' '
                  : nursing?.vTA
                    ? parseFloat(subTotal + (subTotal * nursing.vTA) / 100)
                      .toFixed(2).toLocaleString()+' '
                    : roundANumber(parseFloat(subTotal), 2).toFixed(2).toLocaleString()+' '}
                {currency && currency.value}
              </td>
            </tr>

            <tr>
              <td className='text-danger'>Remise</td>
              <td className='text-end'>
                {nursing?.discount
                  ? <span className='text-danger'><i className='bi bi-dash'/>{nursing.discount}%</span>
                  : '-'}
              </td>
            </tr>

            <tr style={{ fontWeight: 800, fontSize: '1rem' }}>
              <td>Net à payer</td>
              <td className='text-end'>
                {roundANumber(netPayable, 2).toFixed(2).toLocaleString()+' '}
                {currency && currency.value}
              </td>
            </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  )
}

export default memo(NursingInvoiceContent)
