import {useState} from "react";
import {Button, Col, Form, InputGroup, Row} from "react-bootstrap";
import AppInputField from "../../components/forms/AppInputField";
import {handleChange} from "../../services/handleFormsFieldsServices";

export const AddInputForm = ({inputs, setInputs, currency, loader = false}) => {
  const [validate, setValidate] = useState(false)
  const [input, setInput] = useState({docRef: '', porter: '', reason: '', amount: 1})

  const canSave = [input.docRef, input.porter, input.reason, input.amount].every(Boolean)

  const onReset = () => setInput({...input, porter: '', reason: '', amount: 1})

  function onSubmit(e) {
    e.preventDefault()
    e.stopPropagation()
    let obj = [...inputs]
    if (canSave) {
      obj.unshift(input)
      setInputs(obj)
      onReset()
    }
    else alert('Veuillez renseigner les champs obligatoires !')

    setValidate(true)
  }

  return (
    <>
      <Form noValidate onSubmit={onSubmit} validated={validate} className='mb-3 m-auto' style={{ width: '80%' }}>
        <Row>
          <AppInputField
            required
            autofocus
            disabled={loader}
            className='col-md-6'
            label={<>n° Document <i className='text-danger'>*</i></>}
            name='docRef'
            value={input.docRef}
            onChange={(e) => handleChange(e, input, setInput)}
            placeholder='n° Document' />
          <AppInputField
            required
            disabled={loader}
            className='col-md-6'
            label={<>Porteur <i className='text-danger'>*</i></>}
            name='porter'
            value={input.porter}
            onChange={(e) => handleChange(e, input, setInput)}
            placeholder='Porteur' />
          <AppInputField
            required
            disabled={loader}
            className='col-md-6'
            label={<>Motif <i className='text-danger'>*</i></>}
            name='reason'
            value={input.reason}
            onChange={(e) => handleChange(e, input, setInput)}
            placeholder='Motif' />
          <Col md={6}>
            <Form.Label htmlFor='amount'>Montant <i className='text-danger'>*</i></Form.Label>
            <InputGroup>
              <Button type='button' disabled variant='secondary'>{currency && currency.currency}</Button>
              <Form.Control
                required
                disabled={loader}
                type='number'
                name='amount'
                value={input.amount}
                onChange={(e) => handleChange(e, input, setInput)}
                placeholder='Montant' />
              <Button type='button' disabled variant='secondary'>{currency && currency.value}</Button>
            </InputGroup>
          </Col>
        </Row>

        <div className='text-md-end'>
          <Button type='submit' variant='secondary' disabled={loader}>
            <i className='bi bi-plus'/> Ajouter
          </Button>
        </div>
      </Form>
    </>
  )
}
