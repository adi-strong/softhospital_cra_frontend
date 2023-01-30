import {useGetExpensesQuery} from "./expenseApiSlice";
import {AppDataTableBorderless, AppMainError, AppTHead} from "../../components";
import {Button} from "react-bootstrap";
import {useState} from "react";
import {AddExpense} from "./AddExpense";
import {limitStrTo} from "../../services";
import {useSelector} from "react-redux";
import {usernameFiltered} from "../../components/AppNavbar";

const ExpenseItem = ({id, currency}) => {
  const { expense } = useGetExpensesQuery('Expense', {
    selectFromResult: ({ data }) => ({ expense: data.entities[id] })
  })

  return (
    <>
      <tr>
        <th scope='row'>#{expense?.docRef ? expense.docRef : '❓'}</th>
        <td className='text-uppercase' title={expense?.recipient ? expense.recipient : ''}>
          {expense?.recipient ? limitStrTo(18, expense.recipient) : '❓'}
        </td>
        <td className='text-capitalize' title={expense?.reason ? expense?.reason : ''}>
          {expense?.reason ? limitStrTo(18, expense.reason) : '❓'}
        </td>
        <td className='fw-bolder'>
          {expense?.amount
            ? <>
                <span className='me-1 text-secondary'>{currency && currency.value}</span>
                {parseFloat(expense.amount).toFixed(2).toLocaleString()}</>
            : '❓'}
        </td>
        <td className='text-capitalize'>
          {expense?.user
            ? expense.user?.name
              ? usernameFiltered(expense.user.name)
              : expense.user.username
            : '❓'}
        </td>
        <td colSpan={3}>{expense?.createdAt ? expense.createdAt : '❓'}</td>
      </tr>
    </>
  )
}

export const ExpensesList = ({boxId}) => {
  const [show, setShow] = useState(false)
  const {data: expenses = [], isLoading, isSuccess, isFetching, isError, refetch} = useGetExpensesQuery('Expense')
  const { fCurrency } = useSelector(state => state.parameters)

  let content, errors
  if (isSuccess) content = expenses && expenses.ids.map(id => <ExpenseItem key={id} id={id} currency={fCurrency}/>)
  else if (isError) errors = <AppMainError/>

  const toggleModal = () => setShow(!show)

  const onRefresh = async () => await refetch()

  return (
    <>
      <AppDataTableBorderless
        loader={isLoading}
        overview={
          <>
            <div>
              <Button type='button' onClick={toggleModal}>
                <i className='bi bi-plus'/> Ajouter une nouvelle dépense
              </Button>
            </div>
          </>
        }
        thead={<AppTHead onRefresh={onRefresh} isFetching={isFetching} loader={isLoading} items={[
          {label: '#'},
          {label: 'Bénéficiaire'},
          {label: 'Motif'},
          {label: 'Montant'},
          {label: <i className='bi bi-person'/>},
          {label: <i className='bi bi-calendar-range'/>},
        ]}/>}
        tbody={<tbody>{content}</tbody>} />

      {errors && errors}

      <AddExpense show={show} onHide={toggleModal} boxId={boxId} />
    </>
  )
}
