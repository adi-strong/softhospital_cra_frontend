import {Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {useEffect, useState} from "react";
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
    if (data && data?.isCompleted) toast.error('Facture déjà clôturée 👌')
    else {
      const submit = await updateNursing({isCompleted: nursing.isCompleted, id: data?.id})
      if (!submit?.error) {
        toast.success('Opération bien efféctuée.')
        onRefresh()
      }
    }
  }

  return (
    <>
      <Row className='mt-5'>
        {/* PAYMENT'S FORM */}
        {!data?.isCompleted &&
          <>
            <Col md={6} />
            {data?.patient && !data.patient?.covenant &&
              <Col md={6}>
                <Form onSubmit={onSubmit}>
                  <Form.Check
                    id='isComplete'
                    label={<><i className='bi bi-question-circle'/> Clôturer le dossier</>}
                    disabled={isLoading}
                    className='mb-3'
                    name='isComplete'
                    value={nursing.isCompleted}
                    checked={nursing.isCompleted}
                    onChange={() => setNursing({...nursing, isCompleted: !nursing.isCompleted})} />

                  {nursing.isCompleted &&
                    <Button type='submit' disabled={isLoading}>
                      <i className='bi bi-check me-1'/>
                      {!isLoading ? 'Valider' : <>Veuillez patienter <Spinner animation='border' size='sm'/></>}
                    </Button>}
                </Form>
              </Col>}
          </>}
        {/* PAYMENT'S FORM */}
      </Row>
    </>
  )
}
