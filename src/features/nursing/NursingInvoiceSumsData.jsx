import {Button, Col, Form, Row, Spinner, Table} from "react-bootstrap";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {useEffect, useState} from "react";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {useUpdateNursingMutation} from "./nursingApiSlice";
import toast from "react-hot-toast";

export const NursingInvoiceSumsData = ({ data, nursing, setNursing, onRefresh }) => {
  const [updateNursing, {isLoading}] = useUpdateNursingMutation()
  const [discountSum, setDiscount] = useState(0)

  useEffect(() => {
    if (data.discount) {
      setDiscount(parseFloat((nursing.subTotal * data.discount) / 100))
    }
    else if (nursing.check) {
      const discount = parseFloat((nursing.subTotal * nursing.discount) / 100)
      setDiscount(parseFloat(nursing.subTotal - discount))
    }
    else setDiscount(0)
  }, [data, nursing])

  useEffect(() => {
    if (data?.discount) {
      const total = parseFloat(nursing.subTotal - ((nursing.subTotal * data.discount) / 100))
      setNursing(prev => { return {...prev, totalAmount: total} })
    }
    else if (nursing.check) {
      const total = parseFloat(nursing.subTotal - discountSum)
      setNursing(prev => { return {...prev, totalAmount: total} })
    }
    else setNursing(prev => { return {...prev, totalAmount: prev.subTotal} })
  }, [nursing.check, nursing.subTotal, discountSum, setNursing, data])

  async function onSubmit(e) {
    e.preventDefault()
    if (data?.patient && !data.patient?.covenant) {
      const totalAmount = data.discount
        ? parseFloat(nursing.subTotal - ((nursing.subTotal * data.discount) / 100))
        : parseFloat(nursing.subTotal)
      if (nursing.sum > 0.00) {
        if (data && data?.isCompleted) toast.error('Facture déjà clôturée 👌')
        else {
          const submit = await updateNursing(!data?.isPayed ? {
            id: data?.id,
            sum: nursing.sum.toString(),
            subTotal: nursing.subTotal.toString(),
            totalAmount: nursing.totalAmount.toString(),
            isCompleted: nursing.isCompleted,
            discount: nursing.check ? parseFloat(nursing.discount) : null,
            isPayed: nursing.isPayed
          } : {
            id: data?.id,
            sum: nursing.sum.toString(),
            subTotal: nursing.subTotal.toString(),
            totalAmount: totalAmount.toString(),
            isCompleted: nursing.isCompleted,
          })
          if (!submit?.error) {
            toast.success('Paiement bien efféctué.')
            onRefresh()
          }
        }
      } // Fin si...
      else toast.error('Montant invalide ❗')
    }
  }

  return (
    <>
      <Row className='mt-5'>
        <Col md={6}>
          {!data?.isPayed &&
            <>
              <Form.Group className='row mb-3'>
                <Col md={7}>
                  <Form.Check
                    id='check1'
                    label="% Remise"
                    name='check1'
                    disabled={isLoading}
                    value={nursing.check}
                    checked={nursing.check1}
                    onChange={() => setNursing({...nursing, check: !nursing.check})} />
                </Col>
                <Col md={5}>
                  <Form.Control
                    disabled={!nursing.check || isLoading}
                    type='number'
                    placeholder="% Remise"
                    className='text-end'
                    name='discount'
                    value={nursing.discount}
                    onChange={(e) => handleChange(e, nursing, setNursing)} />
                </Col>
              </Form.Group>
            </>}
        </Col>

        <Col md={6}>
          <Table bordered className='w-100' style={{ fontSize: '0.7rem' }}>
            <tbody className='text-end'>
              <tr className='bg-primary text-light'>
                <th>Sous total</th>
                <th>
                  {parseFloat(nursing.subTotal).toFixed(2).toLocaleString()+' '}
                  {data?.currency}
                </th>
              </tr>{/* SOUS TOTAL HT */}

              <tr>
                <th className='text-primary'>Remise</th>
                <th>
                  <>
                    {!data?.isPayed &&
                      <>
                        {nursing.check ?
                          <span>
                            - (%{nursing.discount})
                            <span className='mx-1 me-1 text-primary'>
                              {parseFloat(discountSum).toFixed(2).toLocaleString()+' '}
                              {data?.currency}
                            </span>
                          </span> : '-'}
                      </>}

                    {data?.isPayed && data?.discount &&
                      <>
                        - (%{data.discount})
                        <span className='mx-1 text-primary'>
                          {parseFloat(discountSum)
                            .toFixed(2).toLocaleString()+' '}
                          {data?.currency}
                        </span>
                      </>}
                  </>
                </th>
              </tr>{/* REMISE */}

              <tr className='bg-primary text-light'>
                <th>NET À PAYER</th>
                <th>
                  {parseFloat(nursing.totalAmount).toFixed(2).toLocaleString()+' '}
                  {data?.currency}
                </th>
              </tr>{/* TOTAL TTC */}
            </tbody>
          </Table>
        </Col>

        {/* PAYMENT'S FORM */}
        {!data?.isCompleted &&
          <>
            <Col md={6} />
            {data?.patient && !data.patient?.covenant &&
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
                    value={nursing.sum}
                    onChange={(e) => handleChange(e, nursing, setNursing)} />

                  <Form.Check
                    id='isComplete'
                    label={<><i className='bi bi-question-circle'/> Clôturer le dossier</>}
                    disabled={isLoading}
                    className='mb-3'
                    name='isComplete'
                    value={nursing.isCompleted}
                    checked={nursing.isCompleted}
                    onChange={() => setNursing({...nursing, isCompleted: !nursing.isCompleted})} />

                  <div className='text-end'>
                    {<Button type='submit' variant='success' disabled={isLoading}>
                      {isLoading
                        ? <>Veuillez patienter <Spinner animation='border' size='sm'/></>
                        : <>Valider <i className='bi bi-check'/></>}
                    </Button>}
                  </div>
                </Form>
              </Col>}
          </>}
        {/* PAYMENT'S FORM */}
      </Row>
    </>
  )
}
