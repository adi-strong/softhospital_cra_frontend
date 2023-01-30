import {useState} from "react";
import {useGetExpenseCategoriesQuery} from "./expenseCategoryApiSlice";
import {Button, Col, Form, InputGroup, Row} from "react-bootstrap";
import AppInputField from "../../components/forms/AppInputField";
import {handleChange, onSelectAsyncOption} from "../../services/handleFormsFieldsServices";
import {AppSelectOptions} from "../../components";

export const AddOutputForm = ({outputs, setOutputs, currency, loader = false}) => {
  const [output, setOutput] = useState({docRef: '', recipient: '', reason: '', amount: 1})
  const [validate, setValidate] = useState(false)
  const [category, setCategory] = useState(null)
  const {data: categories = [], isLoading: isLoadTags, isFetching, isSuccess} =
    useGetExpenseCategoriesQuery('ExpenseCategories')

  let options = []
  if (isSuccess) options = categories && categories.ids.map(id => {
    return {
      label: categories.entities[id].name,
      value: categories.entities[id]['@id'],
    }
  })

  const canSave = [output.docRef, output.reason, output.recipient, output.amount].every(Boolean)

  const onReset = () => {
    setOutput({...output, recipient: '', reason: '', amount: 1})
    setCategory(null)
  }

  function onSubmit(e) {
    e.preventDefault()
    e.stopPropagation()
    if (canSave) {
      setOutputs([...outputs, {...output, category: category ? category.value: null}])
      onReset()
    } else alert('Veuillez renseigner les champs obligatoires !')

    setValidate(true)
  }

  return (
    <Form noValidate onSubmit={onSubmit} validated={validate} className='mb-3 m-auto' style={{ width: '80%' }}>
      <Row>
        <AppInputField
          required
          autofocus
          disabled={loader}
          className='col-md-6'
          label={<>n° Document <i className='text-danger'>*</i></>}
          name='docRef'
          value={output.docRef}
          onChange={(e) => handleChange(e, output, setOutput)}
          placeholder='n° Document' />
        <AppInputField
          required
          disabled={loader}
          className='col-md-6'
          label={<>Bénéficiaire <i className='text-danger'>*</i></>}
          name='recipient'
          value={output.recipient}
          onChange={(e) => handleChange(e, output, setOutput)}
          placeholder='Bénéficiaire' />
        <AppInputField
          required
          disabled={loader}
          className='col-md-6'
          label={<>Motif <i className='text-danger'>*</i></>}
          name='reason'
          value={output.reason}
          onChange={(e) => handleChange(e, output, setOutput)}
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
              value={output.amount}
              onChange={(e) => handleChange(e, output, setOutput)}
              placeholder='Montant' />
            <Button type='button' disabled variant='secondary'>{currency && currency.value}</Button>
          </InputGroup>
        </Col>

        <AppSelectOptions
          className='mb-3 text-uppercase'
          disabled={isLoadTags || loader || isFetching}
          name='category'
          onChange={(e) => onSelectAsyncOption(e, setCategory)}
          value={category}
          options={options}
          placeholder='-- Catégorie --' />
      </Row>

      <div className='text-md-end'>
        <Button type='submit' variant='secondary' disabled={loader}>
          <i className='bi bi-plus'/> Ajouter
        </Button>
      </div>
    </Form>
  )
}
