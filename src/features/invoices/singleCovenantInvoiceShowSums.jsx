import {Col, Form, InputGroup, Row} from "react-bootstrap";
import {useEffect, useMemo, useState} from "react";
import {handleChange, onStrictNumChange} from "../../services/handleFormsFieldsServices";
import {AppDataTableBordered} from "../../components";
import {roundANumber} from "./singleInvoice";
import toast from "react-hot-toast";
import {useUpdateCovenantInvoiceMutation} from "./covenantInvoiceApiSlice";

export const SingleCovenantInvoiceShowSums = ({ data, onRefresh, setShow }) => {
  const [invoice, setInvoice] = useState({
    discount: 5,
    vTA: 10,
    check1: false,
    check2: false,
    isComplete: false,
    amount: 0,
    totalAmount: 0,
    sum: 0.00,
  })
  const [updateCovenantInvoice, {isLoading}] = useUpdateCovenantInvoiceMutation()

  let discountSum, taxSum

  discountSum = useMemo(() => {
    if (invoice.check1) {
      const subTotal = parseFloat(data?.subTotal)
      return parseFloat((subTotal * invoice.discount) / 100)
    }
    return 0
  }, [invoice, data])

  taxSum = useMemo(() => {
    if (invoice.check2) {
      const subTotal = parseFloat(data?.subTotal)
      return parseFloat((subTotal * invoice.vTA) / 100)
    }
    return 0
  }, [invoice, data])

  useEffect(() => {
    if (data && !data?.isPublished && invoice.check1) {
      const subTotal = parseFloat(data?.subTotal)
      const amount = subTotal - discountSum
      setInvoice(prev => {
        return {
          ...prev,
          amount,
        }
      })
    }
    else setInvoice(prev => {
      return {
        ...prev,
        amount: data?.subTotal,
      }
    })
  }, [data, invoice.check1, discountSum]) // handle get amount

  useEffect(() => {
    if (data && !data?.isPublished && invoice.check2) {
      setInvoice(prev => {
        return {
          ...prev,
          totalAmount: roundANumber(parseFloat(prev.amount + taxSum), 2),
        }
      })
    }
    else {
      setInvoice(prev => {
        return {
          ...prev,
          totalAmount: roundANumber((invoice.amount), 2)
        }
      })
    }
  }, [data, invoice.check2, invoice.amount, taxSum]) // handle get total

  const onReset = () => setInvoice({
    discount: 5,
    vTA: 10,
    check1: false,
    check2: false,
    isComplete: false,
    amount: 0,
    totalAmount: 0,
    sum: 0.00,
  })

  async function onSubmit(e) {
    e.preventDefault()
    const isComplete = data?.isComplete
    const isPublished = data?.isPublished
    const currency = data?.currency
    if (!isComplete) {
      if (invoice.sum > 0.00) {
        const query = await updateCovenantInvoice({ id: data?.id, currency, isPublished, ...invoice })
        if (!query?.error) {
          toast.success('Paiement bien efféctué.')
          onReset()
          setShow(false)
          onRefresh()
        } else toast.error('Erreur lors du chargement de données.')
      }
      else toast.error('Montant invalide.')
    }
    else toast.error('Cette a déjà été clôturée.')
  }

  return (
    <>
      <Row>
        <Col md={5} className='mb-3'>
          {data && !data?.isPublished &&
            <>
              <Row className='mb-3'>
                <Col>
                  <Form.Check
                    disabled={isLoading}
                    id='check1'
                    name='check1'
                    value={invoice.check1}
                    checked={invoice.check1}
                    onChange={(e) => handleChange(e, invoice, setInvoice)}
                    label='% Remise' />
                </Col>
                <Col md={7}>
                  <InputGroup>
                    <Form.Control
                      disabled={!invoice.check1 || isLoading}
                      type='number'
                      id='discount'
                      name='discount'
                      className='text-end'
                      value={invoice.discount}
                      onChange={(e) => onStrictNumChange(e, invoice, setInvoice)} />
                    <InputGroup.Text>%</InputGroup.Text>
                  </InputGroup>
                </Col>
              </Row>
              {/* DISCOUNT */}

              <Row className='mb-3'>
                <Col>
                  <Form.Check
                    disabled={isLoading}
                    id='check2'
                    name='check2'
                    value={invoice.check2}
                    checked={invoice.check2}
                    onChange={(e) => handleChange(e, invoice, setInvoice)}
                    label="'% Taux d'imposition" />
                </Col>
                <Col md={7}>
                  <InputGroup>
                    <Form.Control
                      disabled={!invoice.check2 || isLoading}
                      type='number'
                      id='vTA'
                      name='vTA'
                      className='text-end'
                      value={invoice.vTA}
                      onChange={(e) => onStrictNumChange(e, invoice, setInvoice)} />
                    <InputGroup.Text>%</InputGroup.Text>
                  </InputGroup>
                </Col>
              </Row>
              {/* TAX */}
            </>}
        </Col>

        <Col className='mb-3'>
          {/* SUMS */}
          <AppDataTableBordered
            tbody={
              <tbody className='text-end'>
                <tr className='bg-primary text-light fw-bold'>
                  <td>Sous Total HT</td>
                  <td>
                    {data && parseFloat(data?.subTotal).toFixed(2).toLocaleString()+' '}
                    {data && data?.currency && data.currency}
                  </td>
                </tr>
                <tr>
                  <td>% Remise</td>
                  <td>
                    {data && !data?.isPublished &&
                      <>
                        {invoice.check1 ?
                          <span className='text-primary'>
                            -({invoice.discount}%){' '}
                            {parseFloat(discountSum).toFixed(2).toLocaleString()+' '}
                            {data && data?.currency && data.currency}
                          </span> : '-'}
                      </>}

                    {data && data?.isPublished && data?.discount ?
                      <>
                        <span className='text-primary'>
                          -({data.discount}%){' '}
                          {parseFloat((data?.subTotal * data.discount) / 100).toFixed(2).toLocaleString()+' '}
                          {data && data?.currency && data.currency}
                        </span>
                      </> : '-'}
                  </td>
                </tr>

                <tr>
                  <th>Total HT</th>
                  <th>
                    {data && !data?.isPublished &&
                      <>
                        {parseFloat(invoice.amount).toFixed(2).toLocaleString()+' '}
                        {data && data?.currency && data.currency}
                      </>}

                    {data && data?.isPublished &&
                      <>
                        {parseFloat(data?.amount).toFixed(2).toLocaleString()+' '}
                        {data && data?.currency && data.currency}
                      </> }
                  </th>
                </tr>

                <tr>
                  <td>% Taux d'imposition</td>
                  <td>
                    {data && !data?.isPublished &&
                      <>
                        {invoice.check2 ?
                          <span className='text-primary'>
                            +({invoice.vTA}){' '}
                            {parseFloat(taxSum).toFixed(2).toLocaleString()+' '}
                            {data && data?.currency && data.currency}
                          </span> : '-'}
                      </>}

                    {data && data?.isPublished && data?.vTA ?
                      <>
                        <span className='text-primary'>
                          -({data.vTA}%){' '}
                          {parseFloat((data?.subTotal * data.vTA) / 100).toFixed(2).toLocaleString()+' '}
                          {data && data?.currency && data.currency}
                        </span>
                      </> : '-'}
                  </td>
                </tr>

                <tr className='bg-primary text-light'>
                  <th style={{ fontWeight: 900 }}>TOTAL TTC</th>
                  <th style={{ fontWeight: 900 }}>
                    {data && !data?.isPublished &&
                      <>
                        {parseFloat(invoice.totalAmount).toFixed(2).toLocaleString()+' '}
                        {data && data?.currency && data.currency}
                      </>}

                    {data && data?.isPublished &&
                      <>
                        {parseFloat(data?.totalAmount).toFixed(2).toLocaleString()+' '}
                        {data && data?.currency && data.currency}
                      </>}
                  </th>
                </tr>
              </tbody>}
          />
          {/* END SUMS */}

          {/* PAYMENT'S FORM*/}
          {data && !data?.isComplete &&
            <Form onSubmit={onSubmit}>
              <Form.Label htmlFor='sum' className='text-end'>Montant à payer</Form.Label>
              <Form.Control
                disabled={isLoading}
                type='number'
                id='sum'
                name='sum'
                value={invoice.sum}
                onChange={(e) => handleChange(e, invoice, setInvoice)}
                className='text-end mb-3'
                placeholder='Montant à payer' />

              <Form.Check
                disabled={isLoading}
                id='isComplete'
                name='isComplete'
                className='mb-3'
                label={<>Clôturer la facture <i className='bi bi-question-circle'/></>}
                value={invoice.isComplete}
                onChange={(e) => handleChange(e, invoice, setInvoice)}
                checked={invoice.isComplete} />

              {/*<Button type='submit' variant='success' disabled={isLoading}>
                {!isLoading
                  ? <> Valider <i className='bi bi-check'/></>
                  : <>Veuillez patienter <Spinner animation='border' size='sm'/></>}
              </Button>*/}
            </Form>}
          {/* END PAYMENT'S FORM*/}
        </Col>
      </Row>
    </>
  )
}
