import {Button, Card, Col, Form, Row, Spinner, Table} from "react-bootstrap";
import {useEffect, useMemo, useState} from "react";
import {MedicineAddSaleForm} from "./MedicineAddSaleForm";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {AppTHead} from "../../components";
import {limitStrTo} from "../../services";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {useOnPostMedicineSalesMutation} from "./medicineApiSlice";
import {roundANumber} from "../invoices/singleInvoice";
import toast from "react-hot-toast";

const theadItems = [ {label: 'Désignation'}, {label: 'Quantité'}, {label: 'PU'}, {label: 'Montant'} ]

const Item = ({ loader = false, currency, item, index, onChange, onRemoveItem }) => {
  return (
    <>
      <tr>
        <th className='text-capitalize' title={item?.wording}>{limitStrTo(20, item?.wording)}</th>
        <td className='text-center'>
          <input
            style={{ width: 80 }}
            className='text-end'
            name='qty'
            value={item?.qty}
            onChange={(e) => onChange(e, index)}
            type='number'
            disabled={loader} />
        </td>
        <td className='text-end fw-bold text-primary'>
          {parseFloat(item?.price).toFixed(2).toLocaleString()+' '}
          {currency && currency?.value}
        </td>
        <td className='text-end' style={{ fontWeight: 800 }}>
          {parseFloat(item?.price * item?.qty).toFixed(2).toLocaleString()+' '}
          {currency && currency?.value}
        </td>
        <td className='text-end text-danger' style={{ cursor: 'pointer' }} onClick={() => onRemoveItem(index)}>
          <i className='bi bi-dash-circle'/>
        </td>
      </tr>
    </>
  )
}

export function MedicineSaleForm({ currency }) {
  const [items, setItems] = useState([])
  const [invoice, setInvoice] = useState({
    amount: 0,
    subTotal: 0,
    discount: 5,
    vTA: 10,
    totalAmount: 0,
    check1: false,
    check2: false,
  })

  const onReset = () => {
    setInvoice({amount: 0, discount: 5, vTA: 10, totalAmount: 0, check2: false, check1: false, subTotal: 0})
    setItems([])
  }

  function onChange( event, index ) {
    const name = event.target.name
    const value = event.target.value > 0 && !isNaN(event.target.value) ? parseFloat(event.target.value) : 1
    const values = [...items]
    values[index][name] = value <= values[index]['quantity'] ? value : 1
    setItems(values)
  }

  function onRemoveItem( index ) {
    const values = [...items]
    values.splice(index, 1)
    setItems(values)
  }

  useEffect(() => {
    if (items.length > 0) {
      let sum = 0
      for (const key in items) {
        sum += (items[key]?.price * items[key]?.qty)
      }
      setInvoice(prev => { return {...prev, subTotal: roundANumber(sum, 2)} })
    } else setInvoice(prev => { return {...prev, subTotal: 0} })
  }, [items]) // handle get subtotal

  let discountAmount
  discountAmount = useMemo(() => invoice.check1
    ? (invoice.subTotal * invoice.discount) / 100
    : 0, [invoice]) // handle discount amount

  useEffect(() => {
    if (invoice.check1) {
      const total = invoice.subTotal - ((invoice.subTotal * invoice.discount) / 100)
      setInvoice(prev => { return {...prev, amount: roundANumber(total, 2)} })
    } else setInvoice(prev => { return {...prev, amount: prev.subTotal} })
  }, [invoice.check1, invoice.discount, invoice.subTotal]) // handle get total ht

  let vTAAmount
  vTAAmount = useMemo(() => invoice.check2
    ? (invoice.subTotal * invoice.vTA) / 100
    : 0, [invoice]) // handle get vTA amount

  useEffect(() => {
    if (invoice.check2) {
      const total = invoice.amount + vTAAmount
      setInvoice(prev => { return {...prev, totalAmount: total} })
    } else setInvoice(prev => { return {...prev, totalAmount: prev.amount} })
  }, [invoice.check2, invoice.amount, vTAAmount]) // handle get total amount

  const [onPostMedicineSales, {isLoading}] = useOnPostMedicineSalesMutation()
  async function onSubmit(e) {
    e.preventDefault()
    if (items.length > 0) {
      const submit = await onPostMedicineSales({
        ...invoice,
        values: items,
        currency: currency})
      if (!submit?.error) {
        toast.success('Vente bien efféctuée.')
        onReset()
      }
    }
    else alert("🤕 aucun produit n'a été renseigné ❗")
  } // handle submit data

  return (
    <>
      <Row>
        <Col md={7}>
          <Card className='border-0'>
            <Card.Body>
              <h5 className='card-title' style={cardTitleStyle}><i className='bi bi-basket2'/> Vente</h5>
              <Form onSubmit={onSubmit}>
                <Table bordered hover responsive style={{ fontSize: '0.7rem' }}>
                  <AppTHead items={theadItems} className='text-center' onRefresh={onReset} />
                  <tbody>
                  {items.length > 0 && items.map((item, idx) =>
                    <Item
                      key={idx}
                      item={item}
                      index={idx}
                      loader={isLoading}
                      currency={currency}
                      onRemoveItem={onRemoveItem}
                      onChange={onChange} />)}
                  </tbody>
                </Table>

                <Row>
                  <Col md={6} className='mb-2'>
                    <Form.Group className='row mb-3'>
                      <Col md={7}>
                        <Form.Check
                          id='check1'
                          label='% Remise'
                          name='check1'
                          value={invoice.check1}
                          checked={invoice.check1}
                          onChange={() => setInvoice({...invoice, check1: !invoice.check1})}
                          disabled={isLoading} />
                      </Col>
                      <Col md={5}>
                        <Form.Control
                          className='text-end'
                          type='number'
                          name='discount'
                          value={invoice.discount}
                          onChange={(e) => handleChange(e, invoice, setInvoice)}
                          disabled={isLoading || !invoice.check1} />
                      </Col>
                    </Form.Group>

                    {/*<Form.Group className='row mb-3'>
                      <Col md={7}>
                        <Form.Check
                          id='check2'
                          label='% TVA'
                          name='check2'
                          value={invoice.check2}
                          checked={invoice.check2}
                          onChange={() => setInvoice({...invoice, check2: !invoice.check2})}
                          disabled={isLoading}/>
                      </Col>
                      <Col md={5}>
                        <Form.Control
                          className='text-end'
                          type='number'
                          name='vTA'
                          value={invoice.vTA}
                          onChange={(e) => handleChange(e, invoice, setInvoice)}
                          disabled={isLoading || !invoice.check2}/>
                      </Col>
                    </Form.Group>*/}
                  </Col>

                  <Col md={6} className='mb-2'>
                    <Table bordered responsive style={{ fontSize: '0.7rem' }}>
                      <tbody>
                        <tr className='fw-bold bg-primary text-light'>
                          <td>SOUS TOTAL</td>
                          <td className='text-end'>
                            {invoice.subTotal.toFixed(2).toLocaleString()} {currency && currency?.value}
                          </td>
                        </tr>
                        <tr className='fw-bold text-primary'>
                          <td>Remise</td>
                          <td className='text-end'>
                            {invoice.check1 && `- (${invoice.discount}%) `}
                            {invoice.check1
                              ? roundANumber(discountAmount, 2).toFixed(2).toLocaleString()+' '
                              : '-'}
                            {invoice.check1 && currency && currency?.value}
                          </td>
                        </tr>
                        <tr className='fw-bold'>
                          <td>Total HT</td>
                          <td className='text-end'>
                            {invoice.amount.toFixed(2).toLocaleString()} {currency && currency?.value}
                          </td>
                        </tr>
                        {/*<tr className='fw-bold text-primary'>
                          <td>TVA</td>
                          <td className='text-end'>
                            {invoice.check2 && `+ (${invoice.vTA}%) `}
                            {invoice.check2
                              ? roundANumber(vTAAmount, 2).toFixed(2).toLocaleString() + ' '
                              : '-'}
                            {invoice.check2 && currency && currency?.value}
                          </td>
                        </tr>*/}
                        <tr className='bg-primary text-light'>
                          <td style={{ fontWeight: 800 }}>TOTAL TTC</td>
                          <td style={{ fontWeight: 800 }} className='text-end'>
                            {invoice.totalAmount.toFixed(2).toLocaleString()+' '}
                            {currency && currency?.value}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>

                  <div className='mt-1 text-end'>
                    <Button type='submit' variant='success' disabled={isLoading}>
                      {isLoading
                        ? <>Veuillez patienter <Spinner animation='border' size='sm'/></>
                        : <>Valider <i className='bi bi-check'/></>}
                    </Button>
                  </div>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* ********************************************************************** */}
        {/* ********************************************************************** */}

        <Col md={5}>
          <Card className='border-0'>
            <Card.Body>
              <MedicineAddSaleForm items={items} setItems={setItems} currency={currency} loader={isLoading} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}
