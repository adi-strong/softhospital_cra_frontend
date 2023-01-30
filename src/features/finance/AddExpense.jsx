import {AppLgModal} from "../../components";
import {useAddNewExpenseMutation} from "./expenseApiSlice";
import {useState} from "react";
import {Button} from "react-bootstrap";
import {AddExpenseForm} from "./AddExpenseForm";
import {useSelector} from "react-redux";
import toast from "react-hot-toast";
import {limitStrTo} from "../../services";

const Item = ({expense, onClick, currency}) => {
  return (
    <>
      <tr>
        <td className='fw-bold'>#{expense.docRef}</td>
        <td className='text-uppercase'>{expense.recipient}</td>
        <td className='text-uppercase'>{limitStrTo(18, expense.reason)}</td>
        <td className='fw-bolder'>
          <span className='me-1 text-secondary'>{currency && currency.value}</span>
          {expense.amount}
        </td>
        <td className='text-end'>
          <Button type='button' variant='light' onClick={onClick}>
            <i className='bi bi-dash'/>
          </Button>
        </td>
      </tr>
    </>
  )
}

export const AddExpense = ({show, onHide, boxId}) => {
  const [addNewExpense, {isLoading}] = useAddNewExpenseMutation()
  const [expenses, setExpenses] = useState([])
  const { fCurrency } = useSelector(state => state.parameters)

  const onReset = () => setExpenses([])

  const onRemove = (index) => {
    const values = [...expenses]
    values.splice(index, 1)
    setExpenses(values)
  }

  async function onSubmit() {
    if (expenses.length > 0) {
      let values = [...expenses]
      for (const key in expenses) {
        try {
          const formData = await addNewExpense({...expenses[key], box: boxId})
          if (!formData.error) {
            values = values.filter(item => item !== expenses[key])
            setExpenses(values)
            toast.success('Dépense bien efféctuée.')
            if (values.length < 1) onHide()
          }
          else {
            const violations = formData.error.data.violations
            if (violations) {
              violations.forEach(({propertyPath, message}) => {
                toast.error(`${propertyPath}: ${message}`, {
                  style: {
                    background: 'red',
                    color: '#fff',
                  }
                })
              })
            }
          }
        }
        catch (e) { }
      }
    }
    else alert('Aucune information renseignée !')
  }

  return (
    <>
      <AppLgModal
        show={show}
        onHide={onHide}
        className='bg-light'
        title='Ajouter une dépense'
        onClick={onSubmit}
        loader={isLoading}>
        <AddExpenseForm expenses={expenses} setExpenses={setExpenses} currency={fCurrency} loader={isLoading} /> <hr/>
        <div className='dashboard'>
          <div className='top-selling'>
            <table className='table'>
              <thead>
              <tr>
                <th>#</th>
                <th>Bénéficiaire</th>
                <th>Motif</th>
                <th>Montant</th>
                <th className='text-end' style={{ cursor: 'pointer' }} onClick={onReset}>
                  <i className='bi bi-arrow-clockwise text-primary'/>
                </th>
              </tr>
              </thead>
              <tbody>
              {expenses && expenses.map((expense, key) =>
                <Item key={key} expense={expense} onClick={() => onRemove(key)} currency={fCurrency}/>)}
              </tbody>
            </table>
          </div>
        </div>
      </AppLgModal>
    </>
  )
}
