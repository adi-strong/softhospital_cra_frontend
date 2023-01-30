import {useState} from "react";
import {Button, Col, Form, InputGroup, Row} from "react-bootstrap";
import AppInputField from "../../components/forms/AppInputField";
import {handleChange, onSelectAsyncOption} from "../../services/handleFormsFieldsServices";
import {useGetExpenseCategoriesQuery} from "./expenseCategoryApiSlice";
import {AppSelectOptions} from "../../components";

export const AddExpenseForm = ({expenses, setExpenses, currency, loader = false}) => {
  const [expense, setExpense] = useState({docRef: '', recipient: '', reason: '', amount: 1})
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

  const canSave = [expense.docRef, expense.reason, expense.recipient, expense.amount].every(Boolean)

  const onReset = () => {
    setExpense({...expense, recipient: '', reason: '', amount: 1})
    setCategory(null)
  }

  function onSubmit(e) {
    e.preventDefault()
    e.stopPropagation()
    if (canSave) {
      setExpenses([...expenses, {...expense, category: category ? category.value: null}])
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
          value={expense.docRef}
          onChange={(e) => handleChange(e, expense, setExpense)}
          placeholder='n° Document' />
        <AppInputField
          required
          disabled={loader}
          className='col-md-6'
          label={<>Bénéficiaire <i className='text-danger'>*</i></>}
          name='recipient'
          value={expense.recipient}
          onChange={(e) => handleChange(e, expense, setExpense)}
          placeholder='Bénéficiaire' />
        <AppInputField
          required
          disabled={loader}
          className='col-md-6'
          label={<>Motif <i className='text-danger'>*</i></>}
          name='reason'
          value={expense.reason}
          onChange={(e) => handleChange(e, expense, setExpense)}
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
              value={expense.amount}
              onChange={(e) => handleChange(e, expense, setExpense)}
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
