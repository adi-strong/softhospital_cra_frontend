import {Button, Col, Form, InputGroup, Row, Spinner} from "react-bootstrap";
import {useEffect, useState} from "react";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {useUpdateNursingMutation} from "./nursingApiSlice";
import toast from "react-hot-toast";

export const NursingTreatmentForm = ({data, setLoader, onRefresh}) => {
  const [nursingTreatments, setNursingTreatments] = useState([])
  const [updateNursing, {isLoading}] = useUpdateNursingMutation()

  useEffect(() => {
    if (data && data?.nursingTreatments) {
      const items = data.nursingTreatments
      const obj = []
      for (const key in items) {
        const item = items[key]
        obj.push({
          ...item,
          isValid: !!(item?.medicines && item.medicines.length > 0),
          medicines: item?.medicines && item.medicines.length < 1 ? [{wording: '', quantity: ''}] : item.medicines})
      }
      setNursingTreatments(obj)
    }
  }, [data]) // handle get treatments

  const onAddItem = index => {
    const values = [...nursingTreatments]
    values[index]['medicines'].push({wording: '', quantity: ''})
    setNursingTreatments(values)
  }

  const onRemoveItem = (index, key) => {
    const values = [...nursingTreatments]
    const items = values[index]['medicines']
    items.splice(key, 1)
    values[index]['medicines'] = items
    setNursingTreatments(values)
  }

  const handleChangeItem = (event, index, key) => {
    const values = [...nursingTreatments]
    const items = values[index]['medicines']
    items[key][event.target.name] = event.target.value
    values[index]['medicines'] = items
    setNursingTreatments(values)
  }

  async function onSubmit(e) {
    e.preventDefault()
    try {
      const submit = await updateNursing({treatmentValues: nursingTreatments, id: data?.id})
      if (!submit.error) {
        setLoader(false)
        toast.success('Opération bien efféctuée.')
        onRefresh()
      }
    } catch (e) { setLoader(false) }
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        {nursingTreatments && nursingTreatments.length > 0 && nursingTreatments.map((n, idx) =>
          <Row
            key={idx}
            className='mx-3 me-3 bg-light p-2 mb-2' style={{ border: '1px solid lightgray', borderRadius: 6 }}>
            <Col md={4}>
              <h5 className='card-title text-capitalize fw-bold' style={cardTitleStyle}>
                <i className='bi bi-journal-plus'/> {n?.treatment.wording}
              </h5> <hr/>
              <div className="text-end text-primary"><i className='bi bi-arrow-bar-right'/></div>
            </Col>

            <Col md={8} className='bg-info'>
              <h6 className="text-center text-dark mt-2 fw-bold"><i className='bi bi-caret-down-fill'/> Procédure</h6>
              {n?.medicines && n.medicines.length > 0 && n.medicines.map((m, key) =>
                <InputGroup key={key} className='mb-3'>
                  <InputGroup.Text>Produit</InputGroup.Text>
                  <Form.Control
                    required
                    disabled={n?.isValid || isLoading}
                    autoComplete='off'
                    name='wording'
                    value={m?.wording}
                    onChange={(e) => handleChangeItem(e, idx, key)} />

                  <InputGroup.Text>Dosage / Quantité</InputGroup.Text>
                  <Form.Control
                    required
                    disabled={n?.isValid || isLoading}
                    autoComplete='off'
                    className='text-end'
                    name='quantity'
                    value={m?.quantity}
                    onChange={(e) => handleChangeItem(e, idx, key)} />
                  {n?.medicines && n.medicines.length > 1 && !n?.isValid &&
                    <Button type='button' variant='outline-danger' disabled={isLoading} onClick={() => onRemoveItem(idx, key)}>
                      <i className='bi bi-x'/>
                    </Button>}
                </InputGroup>)}
              {n?.medicines && n.medicines.length > 0 && !n?.isValid &&
                <div className='text-end mb-3'>
                  <Button type='button' variant='dark' disabled={isLoading} onClick={() => onAddItem(idx)}>
                    <i className='bi bi-plus'/>
                  </Button>
                </div>}
            </Col>
          </Row>)}

        <div className='text-end me-3'>
          <Button type='submit' disabled={isLoading}>
            <i className='bi bi-check me-1'/>
            {!isLoading ? 'Valider' : <>Veuillez patienter <Spinner animation='border' size='sm'/></>}
          </Button>
        </div>
      </Form>
    </>
  )
}
