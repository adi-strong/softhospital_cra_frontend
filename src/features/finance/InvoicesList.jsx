import {useEffect, useState} from "react";
import {AppDataTableBorderless, AppMainError, AppPaginationComponent, AppTHead} from "../../components";
import {
  invoicesPages, researchInvoicesPages,
  totalResearchInvoices,
  useGetInvoicesQuery,
  useLazyGetInvoicesByPaginationQuery, useLazyGetResearchInvoicesByPaginationQuery,
  useLazyGetResearchInvoicesQuery
} from "../invoices/invoiceApiSlice";
import {InvoiceItem} from "../invoices/InvoiceItem";
import {Form} from "react-bootstrap";
import {useSelector} from "react-redux";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";

export function InvoicesList() {
  const [search, setSearch] = useState('')
  const { fCurrency } = useSelector(state => state.parameters)
  const {data: invoices = [], isLoading, isFetching, isSuccess, isError, refetch} = useGetInvoicesQuery('Invoices')

  const [contents, setContents] = useState([])
  const [tempSearch, setTempSearch] = useState('')
  const [page, setPage] = useState(1)
  const [checkItems, setCheckItems] = useState({isSearching: false, isPaginated: false,})

  const [paginatedItems, setPaginatedItems] = useState([])
  const [researchPaginatedItems, setResearchPaginatedItems] = useState([])

  const [getInvoicesByPagination, {isFetching: isFetching2, isError: isError2,}] = useLazyGetInvoicesByPaginationQuery()
  const [getResearchInvoices, {isFetching: isFetching3, isError: isError3,}] = useLazyGetResearchInvoicesQuery()
  const [getResearchInvoicesByPagination, {
    isFetching: isFetching4,
    isError: isError4,
  }] = useLazyGetResearchInvoicesByPaginationQuery()

  async function handlePagination(pagination) {
    const param = pagination + 1
    setPage(param)
    setCheckItems({isSearching: false, isPaginated: true})
    const { data: searchData, isSuccess } = await getInvoicesByPagination(param)
    if (isSuccess && searchData) {
      setPaginatedItems(searchData)
    }
  } // handle main pagination

  async function handlePagination2(pagination) {
    const param = pagination + 1
    const keywords = {page: param, keyword: tempSearch}
    setPage(param)
    setCheckItems({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchInvoicesByPagination(keywords)
    if (isSuccess && searchData) {
      setResearchPaginatedItems(searchData)
    }
  } // 2nd handle main pagination

  async function handleSubmit(e) {
    e.preventDefault()
    setPage(1)
    setTempSearch(search)
    setSearch('')
    setCheckItems({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchInvoices(search)
    if (isSuccess && searchData) {
      setResearchPaginatedItems(searchData)
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
    if (!checkItems.isSearching && !checkItems.isPaginated && isSuccess && invoices)
      setContents(invoices?.filter(f => f?.fullName.toLowerCase().includes(search.toLowerCase())))
    else if (!checkItems.isSearching && checkItems.isPaginated && isSuccess && invoices)
      setContents(paginatedItems?.filter(f => f?.fullName.toLowerCase().includes(search.toLowerCase())))
    else if (checkItems.isSearching && !checkItems.isPaginated && isSuccess && invoices)
      setContents(researchPaginatedItems?.filter(f => f?.fullName.toLowerCase().includes(search.toLowerCase())))
  }, [
    checkItems,
    isSuccess,
    invoices,
    search,
    researchPaginatedItems,
    paginatedItems,
  ])

  return (
    <>
      <AppDataTableBorderless
        loader={isLoading || isFetching2 || isFetching4}
        thead={
          <AppTHead
            loader={isLoading}
            isFetching={isFetching || isFetching2 || isFetching4 || isFetching3}
            onRefresh={onRefresh}
            items={[
              {label: '#'},
              {label: 'Patient(e)'},
              {label: <><i className='bi bi-piggy-bank'/> Total</>},
              {label: <><i className='bi bi-cash-coin'/> Payé</>},
              {label: <><i className='bi bi-currency-exchange'/> Reste</>},
              {label: 'Date'},
            ]}
          />}
        tbody={
          <tbody>
            {!isError && isSuccess && contents.length > 0 &&
              contents.map(i => <InvoiceItem key={i?.id} invoice={i} currency={fCurrency}/>)}
          </tbody>
        }
        overview={
          <>
            <div className='mb-3'>
              {checkItems.isSearching ?
                totalResearchInvoices > 0 ?
                  <p>
                    Au total
                    <code className="mx-1 me-1">{totalResearchInvoices.toLocaleString()}</code>
                    facture(s) trouvé(s) suite à votre recherche ⏩ <b>{tempSearch}</b> :
                  </p> : 'Aucune occurence trouvée 🎈' : ''}
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Control
                disabled={isFetching3}
                name='search'
                value={search}
                onChange={({ target }) => setSearch(target.value)}
                placeholder='Rechercher' />
            </Form>
          </>
        } />

      {isLoading || isFetching || isFetching2 || isFetching3 || isFetching4
        ? <BarLoaderSpinner loading={isLoading || isFetching || isFetching2 || isFetching3 || isFetching4}/>
        : (
          <>
            {invoicesPages > 1 && isSuccess && invoices
              && !checkItems.isSearching &&
              <AppPaginationComponent
                onPaginate={handlePagination}
                currentPage={page - 1}
                pageCount={invoicesPages} />}

            {researchInvoicesPages > 1 && isSuccess && invoices && checkItems.isSearching &&
              <AppPaginationComponent
                onPaginate={handlePagination2}
                currentPage={page - 1}
                pageCount={researchInvoicesPages} />}
          </>
        )}

      {isError && <div className='mb-3'><AppMainError/></div>}
      {isError2 && <div className='mb-3'><AppMainError/></div>}
      {isError3 && <div className='mb-3'><AppMainError/></div>}
      {isError4 && <div className='mb-3'><AppMainError/></div>}
    </>
  )
}
