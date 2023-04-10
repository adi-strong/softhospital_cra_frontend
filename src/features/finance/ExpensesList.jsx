import {
  expensesPages, researchExpensesPages,
  totalResearchExpenses,
  useGetExpensesQuery,
  useLazyGetExpensesByPaginationQuery, useLazyGetResearchExpensesByPaginationQuery,
  useLazyGetResearchExpensesQuery
} from "./expenseApiSlice";
import {AppDataTableBorderless, AppMainError, AppPaginationComponent, AppTHead} from "../../components";
import {Button, Col, Form} from "react-bootstrap";
import {useEffect, useState} from "react";
import {AddExpense} from "./AddExpense";
import {limitStrTo} from "../../services";
import {useSelector} from "react-redux";
import {usernameFiltered} from "../../components/AppNavbar";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";

const ExpenseItem = ({id, expense, currency}) => {

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

  const [search, setSearch] = useState('')
  const [contents, setContents] = useState([])
  const [tempSearch, setTempSearch] = useState('')
  const [page, setPage] = useState(1)
  const [checkItems, setCheckItems] = useState({isSearching: false, isPaginated: false,})

  const toggleModal = () => setShow(!show)

  const [paginatedItems, setPaginatedItems] = useState([])
  const [researchPaginatedActs, setResearchPaginatedActs] = useState([])

  const [getExpensesByPagination, {isFetching: isFetching2, isError: isError2,}] = useLazyGetExpensesByPaginationQuery()
  const [getResearchExpenses, {isFetching: isFetching3, isError: isError3,}] = useLazyGetResearchExpensesQuery()
  const [getResearchExpensesByPagination, {
    isFetching: isFetching4,
    isError: isError4,
  }] = useLazyGetResearchExpensesByPaginationQuery()

  async function handlePagination(pagination) {
    const param = pagination + 1
    setPage(param)
    setCheckItems({isSearching: false, isPaginated: true})
    const { data: searchData, isSuccess } = await getExpensesByPagination(param)
    if (isSuccess && searchData) {
      setPaginatedItems(searchData)
    }
  } // handle main pagination

  async function handlePagination2(pagination) {
    const param = pagination + 1
    const keywords = {page: param, keyword: tempSearch}
    setPage(param)
    setCheckItems({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchExpensesByPagination(keywords)
    if (isSuccess && searchData) {
      setResearchPaginatedActs(searchData)
    }
  } // 2nd handle main pagination

  async function handleSubmit(e) {
    e.preventDefault()
    setPage(1)
    setTempSearch(search)
    setSearch('')
    setCheckItems({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchExpenses(search)
    if (isSuccess && searchData) {
      setResearchPaginatedActs(searchData)
    }
  } // submit search keywords

  const onRefresh = async () => {
    setCheckItems({isSearching: false, isPaginated: false})
    setSearch('')
    setTempSearch('')
    setPage(1)
    await refetch()
  }

  useEffect(() => {
    if (!checkItems.isSearching && !checkItems.isPaginated && isSuccess && expenses) {
      const items = expenses.ids?.map(id => expenses?.entities[id])
      setContents(items?.filter(f => f?.reason.toLowerCase().includes(search.toLowerCase())))
    }
    else if (!checkItems.isSearching && checkItems.isPaginated && isSuccess && expenses)
      setContents(paginatedItems?.filter(f => f?.reason.toLowerCase().includes(search.toLowerCase())))
    else if (checkItems.isSearching && !checkItems.isPaginated && isSuccess && expenses)
      setContents(researchPaginatedActs?.filter(f => f?.reason.toLowerCase().includes(search.toLowerCase())))
  }, [
    checkItems,
    isSuccess,
    expenses,
    search,
    researchPaginatedActs,
    paginatedItems,
  ])

  return (
    <>
      <AppDataTableBorderless
        loader={isLoading || isFetching2 || isFetching4}
        overview={
          <>
            <div className='mb-3'>
              {checkItems.isSearching ?
                totalResearchExpenses > 0 ?
                  <p>
                    Au total
                    <code className="mx-1 me-1">{totalResearchExpenses.toLocaleString()}</code>
                    dépenses(s) trouvé(s) suite à votre recherche ⏩ <b>{tempSearch}</b> :
                  </p> : 'Aucune occurence trouvée 🎈' : ''}
            </div>

            <Col md={5} className='mb-3'>
              <Button type='button' onClick={toggleModal}>
                <i className='bi bi-plus'/> Ajouter une nouvelle dépense
              </Button>
            </Col>

            <Col md={7} className='mb-3'>
              <form onSubmit={handleSubmit}>
                <Form.Control
                  placeholder='Votre recherche ici...'
                  aria-label='Votre recherche ici...'
                  autoComplete='off'
                  disabled={isFetching3}
                  name='search'
                  value={search}
                  onChange={({ target}) => setSearch(target.value)} />
              </form>
            </Col>
          </>
        }
        thead={
        <AppTHead
          onRefresh={onRefresh}
          isFetching={isFetching || isFetching2 || isFetching4 || isFetching3}
          loader={isLoading}
          items={[
            {label: '#'},
            {label: 'Bénéficiaire'},
            {label: 'Motif'},
            {label: 'Montant'},
            {label: <i className='bi bi-person'/>},
            {label: <i className='bi bi-calendar-range'/>},
          ]}
        />}
        tbody={
          <tbody>
            {!isError && isSuccess && contents.length > 0 &&
              contents.map(e => <ExpenseItem key={e?.id} id={e?.id} expense={e} currency={fCurrency}/>)}
          </tbody>} />

      {isLoading || isFetching || isFetching2 || isFetching3 || isFetching4
        ? <BarLoaderSpinner loading={isLoading || isFetching || isFetching2 || isFetching3 || isFetching4}/>
        : (
          <>
            {expensesPages > 1 && isSuccess && expenses
              && !checkItems.isSearching &&
              <AppPaginationComponent
                nextLabel=''
                previousLabel=''
                onPaginate={handlePagination}
                currentPage={page - 1}
                pageCount={expensesPages} />}

            {researchExpensesPages > 1 && isSuccess && expenses && checkItems.isSearching &&
              <AppPaginationComponent
                nextLabel=''
                previousLabel=''
                onPaginate={handlePagination2}
                currentPage={page - 1}
                pageCount={researchExpensesPages} />}
          </>
        )}

      {isError && <div className='mb-3'><AppMainError/></div>}
      {isError2 && <div className='mb-3'><AppMainError/></div>}
      {isError3 && <div className='mb-3'><AppMainError/></div>}
      {isError4 && <div className='mb-3'><AppMainError/></div>}

      <AddExpense show={show} onHide={toggleModal} boxId={boxId} />
    </>
  )
}
