import {Button, Col, Form, Row, Spinner, Table} from "react-bootstrap";
import {useEffect, useMemo, useState} from "react";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {roundANumber} from "./singleInvoice";
import {useGetSingleInvoiceQuery, useUpdateInvoiceMutation} from "./invoiceApiSlice";
import toast from "react-hot-toast";

export const InvoiceSumsData = ({ data, hosp, bedPrice = 0, daysCounter = 0 }) => {
  const {refetch} = useGetSingleInvoiceQuery(data?.id)
  const [updateInvoice, {isLoading}] = useUpdateInvoiceMutation()
  const [invoice, setInvoice] = useState({
    vTA: 10,
    discount: 5,
    subTotal: parseFloat(data?.subTotal),
    amount: parseFloat(data?.subTotal),
    totalAmount: parseFloat(data?.subTotal),
    sum: 0.00,
    hospDaysCounter: 0,
    check1: false,
    check2: false,
    isBedroomLeaved: false,
    isComplete: false,
  })

  useEffect(() => {
    if (bedPrice > 0.00 && daysCounter > 0) {
      const price = parseFloat(bedPrice * daysCounter)
      const subTotal = invoice.subTotal - price
      const total = subTotal + price
      setInvoice(prev => { return {...prev, subTotal: total} })
    }
  }, [daysCounter, bedPrice, invoice.subTotal]) // handle get subtotal

  let discountSum, taxSum

  discountSum = useMemo(() => {
    if (invoice.check1) {
      return parseFloat((invoice.subTotal * invoice.discount) / 100)
    }

    return 0
  }, [invoice]) // handle get discount's sum

  useEffect(() => {
    if (invoice.check1) {
      const total = roundANumber(invoice.subTotal - discountSum, 2)
      setInvoice(prev => { return {...prev, amount: total} })
    } else setInvoice(prev => { return {...prev, amount: invoice.subTotal} })
  }, [invoice.check1, invoice.subTotal, discountSum]) // handle get TOTAL HT amount

  taxSum = useMemo(() => {
    if (invoice.check2) {
      return parseFloat(invoice.subTotal * invoice.vTA) / 100
    }

    return 0
  }, [invoice]) // handle get tax's sum

  useEffect(() => {
    if (invoice.check2) {
      const total = roundANumber(invoice.amount + taxSum, 2)
      setInvoice(prev => { return {...prev, totalAmount: total} })
    } else setInvoice(prev => { return {...prev, totalAmount: invoice.amount} })
  }, [invoice.check2, invoice.amount, taxSum]) // handle get TOTAL TTC

  async function onSubmit(e) {
    e.preventDefault()
    if (invoice.sum > 0.00) {
      if (data && data?.isComplete) toast.error('Facture déjà clôturée 👌')
      else {
        const submit = await updateInvoice({
          id: data?.id,
          daysCounter,
          isPublished: data?.isPublished,
          ...invoice,
        })
        if (!submit?.error) {
          toast.success('Paiement bien efféctué.')
          await refetch()
        }
      }
    } // Fin si...
    else {
      toast.error('Montant invalide ❗')
    }
  }

  return (
    <>
      <Row className='mt-5'>
        <Col md={6}>
          {!data?.isPublished &&
            <>
              <Form.Group className='row mb-3'>
                <Col md={7}>
                  <Form.Check
                    id='check1'
                    label="% Remise"
                    name='check1'
                    disabled={isLoading}
                    value={invoice.check1}
                    checked={invoice.check1}
                    onChange={() => setInvoice({...invoice, check1: !invoice.check1})} />
                </Col>
                <Col md={5}>
                  <Form.Control
                    disabled={!invoice.check1 || isLoading}
                    type='number'
                    placeholder="% Remise"
                    className='text-end'
                    name='discount'
                    value={invoice.discount}
                    onChange={(e) => handleChange(e, invoice, setInvoice)} />
                </Col>
              </Form.Group>

              <Form.Group className='row mb-3'>
                <Col md={7}>
                  <Form.Check
                    id='check2'
                    label="% Taux d'imposition"
                    name='check2'
                    disabled={isLoading}
                    value={invoice.check2}
                    checked={invoice.check2}
                    onChange={() => setInvoice({...invoice, check2: !invoice.check2})} />
                </Col>
                <Col md={5}>
                  <Form.Control
                    disabled={!invoice.check2 || isLoading}
                    type='number'
                    placeholder="% Taux d'imposition"
                    className='text-end'
                    name='vTA'
                    value={invoice.vTA}
                    onChange={(e) => handleChange(e, invoice, setInvoice)} />
                </Col>
              </Form.Group>
            </>}
        </Col>
        {/* TAX AND DISCOUNT FIELDS */}

        <Col md={6}>
          <Table bordered className='w-100' style={{ fontSize: '0.7rem' }}>
            <tbody className='text-end'>
              <tr className='bg-primary text-light'>
                <th>Sous total</th>
                <th>
                  {parseFloat(invoice.subTotal).toFixed(2).toLocaleString()+' '}
                  {data?.currency}
                </th>
              </tr>{/* SOUS TOTAL HT */}

              <tr>
                <th className='text-primary'>Remise</th>
                <th>
                  <>
                    {!data?.isPublished &&
                      <>
                        {invoice.check1 ?
                          <span>
                            - (%{invoice.discount})
                            <span className='mx-1 me-1 text-primary'>
                              {parseFloat(discountSum).toFixed(2).toLocaleString()+' '}
                              {data?.currency}
                            </span>
                          </span> : '-'}
                      </>}

                    {data?.isPublished && data?.discount &&
                      <>
                        - (%{data.discount})
                        <span className='mx-1 text-primary'>
                          {parseFloat((data?.subTotal * data.discount) / 100)
                            .toFixed(2).toLocaleString()+' '}
                          {data?.currency}
                        </span>
                      </>}
                  </>
                </th>
              </tr>{/* REMISE */}

              <tr>
                <th>Total HT</th>
                <th>
                  {!data?.isPublished && parseFloat(invoice.amount).toFixed(2).toLocaleString()+' '}
                  {data?.isPublished && parseFloat(data?.amount).toFixed(2).toLocaleString()+' '}
                  {data?.currency}
                </th>
              </tr>{/* TOTAL HT */}

              <tr>
                <th className='text-primary'>Taux (d'imposition)</th>
                <th>
                  <>
                    {!data?.isPublished &&
                      <>
                        {invoice.check2 ?
                          <span>
                            + (%{invoice.vTA})
                            <span className='mx-1 me-1 text-primary'>
                              {parseFloat(taxSum).toFixed(2).toLocaleString()+' '}
                              {data?.currency}
                            </span>
                          </span> : '-'}
                      </>}

                    {data?.isPublished && data?.vTA &&
                      <>
                        + (%{data.vTA})
                        <span className='mx-1 text-primary'>
                          {parseFloat((data?.subTotal * data.vTA) / 100)
                            .toFixed(2).toLocaleString()+' '}
                          {data?.currency}
                        </span>
                      </>}
                  </>
                </th>
              </tr>{/* TAUX */}

              <tr className='bg-primary text-light'>
                <th>Total TTC</th>
                <th>
                  {!data?.isPublished && parseFloat(invoice.totalAmount).toFixed(2).toLocaleString()+' '}
                  {data?.isPublished && parseFloat(data?.totalAmount).toFixed(2).toLocaleString()+' '}
                  {data?.currency}
                </th>
              </tr>{/* TOTAL TTC */}
            </tbody>
          </Table>
        </Col>
        {/* SUMS DATA */}

        {/* PAYMENT'S FORM */}
        {!data?.isComplete &&
          <>
            <Col md={6} />
            <Col md={6} className='mt-3'>
              <h5 className='card-title text-end' style={cardTitleStyle}>
                <i className='bi bi-currency-exchange'/> Procéder au paiement
              </h5>
              <Form onSubmit={onSubmit}>
                <Form.Control
                  disabled={isLoading}
                  type='number'
                  className='text-end mb-3'
                  placeholder='Montant à payer'
                  name='sum'
                  value={invoice.sum}
                  onChange={(e) => handleChange(e, invoice, setInvoice)} />

                {hosp && !hosp?.isCompleted &&
                  <Form.Check
                    id='isBedroomLeaved'
                    label={<><i className='bi bi-question-circle'/> Libérer la chambre</>}
                    className='mb-3'
                    name='isBedroomLeaved'
                    value={invoice.isBedroomLeaved}
                    checked={invoice.isBedroomLeaved}
                    onChange={() => setInvoice({...invoice, isBedroomLeaved: !invoice.isBedroomLeaved})} />}

                {!data?.isComplete &&
                  <Form.Check
                    id='isComplete'
                    label={<><i className='bi bi-question-circle'/> Clôturer la facture</>}
                    className='mb-3'
                    name='isComplete'
                    value={invoice.isComplete}
                    checked={invoice.isComplete}
                    onChange={() => setInvoice({...invoice, isComplete: !invoice.isComplete})} />}

                <div className='text-end'>
                  <Button type='submit' variant='success' disabled={isLoading}>
                    {isLoading
                      ? <>Veuillez patienter <Spinner animation='border' size='sm'/></>
                      : <>Valider <i className='bi bi-check'/></>}
                  </Button>
                </div>
              </Form>
            </Col>
          </>}
        {/* PAYMENT'S FORM */}
      </Row>
    </>
  )
}
