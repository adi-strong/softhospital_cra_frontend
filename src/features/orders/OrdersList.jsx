import {
  ordersPages, researchOrdersPages,
  totalOrders,
  useGetOrdersQuery,
  useLazyGetOrdersByPaginationQuery,
  useLazyGetResearchOrdersByPaginationQuery,
  useLazyGetResearchOrdersQuery
} from "./orderApiSlice";
import {AppDataTableStripped, AppMainError, AppPaginationComponent, AppTHead} from "../../components";
import {useEffect, useState} from "react";
import {OrderItem} from "./OrderItem";
import {Form} from "react-bootstrap";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";

const thead = [
  {label: '#'},
  {label: 'Fiche'},
  {label: 'Patient(e)'},
  {label: <><i className='bi bi-person'/> Par</>},
  {label: 'Date de prescription'},
]

export function OrdersList() {
  const {data: orders = [], isLoading, isFetching, isSuccess, isError, refetch} = useGetOrdersQuery('Orders')
  const [search, setSearch] = useState('')
  const [contents, setContents] = useState([])
  const [tempSearch, setTempSearch] = useState('')
  const [page, setPage] = useState(1)
  const [checkItems, setCheckItems] = useState({isSearching: false, isPaginated: false,})

  const [paginatedItems, setPaginatedItems] = useState([])
  const [researchPaginatedItems, setResearchPaginatedItems] = useState([])

  const [getOrdersByPagination, {isFetching: isFetching2, isError: isError2,}] = useLazyGetOrdersByPaginationQuery()
  const [getResearchOrders, {isFetching: isFetching3, isError: isError3,}] = useLazyGetResearchOrdersQuery()
  const [getResearchOrdersByPagination, {
    isFetching: isFetching4,
    isError: isError4,
  }] = useLazyGetResearchOrdersByPaginationQuery()

  async function handlePagination(pagination) {
    const param = pagination + 1
    setPage(param)
    setCheckItems({isSearching: false, isPaginated: true})
    const { data: searchData, isSuccess } = await getOrdersByPagination(param)
    if (isSuccess && searchData) {
      setPaginatedItems(searchData)
    }
  } // handle main pagination

  async function handlePagination2(pagination) {
    const param = pagination + 1
    const keywords = {page: param, keyword: tempSearch}
    setPage(param)
    setCheckItems({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchOrdersByPagination(keywords)
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
    const { data: searchData, isSuccess } = await getResearchOrders(search)
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
    if (!checkItems.isSearching && !checkItems.isPaginated && isSuccess && orders)
      setContents(orders.filter(p => p?.fullName.toLowerCase().includes(search.toLowerCase())))
    else if (!checkItems.isSearching && checkItems.isPaginated && isSuccess && orders)
      setContents(paginatedItems?.filter(f => f?.fullName.toLowerCase().includes(search.toLowerCase())))
    else if (checkItems.isSearching && !checkItems.isPaginated && isSuccess && orders)
      setContents(researchPaginatedItems?.filter(f => f?.fullName.toLowerCase().includes(search.toLowerCase())))
  }, [isSuccess, orders, search, checkItems, paginatedItems, researchPaginatedItems])

  return (
    <>
      <AppDataTableStripped
        loader={isLoading || isFetching2 || isFetching4}
        thead={
          <AppTHead
            loader={isLoading}
            isFetching={isFetching}
            onRefresh={onRefresh}
            items={thead}
            isImg/>}
        title='Liste des ordonnances'
        tbody={
          <tbody>
            {!isError && isSuccess && contents.length > 0 &&
              contents.map(o => <OrderItem key={o?.id} order={o}/>)}
          </tbody>
        }
        overview={
          <>
            <div className='mb-3'>
              {checkItems.isSearching ?
                totalOrders > 0 ?
                  <p>
                    Au total
                    <code className="mx-1 me-1">{totalOrders.toLocaleString()}</code>
                    ordonnance(s) trouvée(s) suite à votre recherche ⏩ <b>{tempSearch}</b> :
                  </p> : 'Aucune occurence trouvée 🎈' : ''}
            </div>

            <div>
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
            </div>
          </>
        } />

      {isLoading || isFetching || isFetching2 || isFetching3 || isFetching4
        ? <BarLoaderSpinner loading={isLoading || isFetching || isFetching2 || isFetching3 || isFetching4}/>
        : (
          <>
            {ordersPages > 1 && isSuccess && orders
              && !checkItems.isSearching &&
              <AppPaginationComponent
                onPaginate={handlePagination}
                currentPage={page - 1}
                pageCount={ordersPages} />}

            {researchOrdersPages > 1 && isSuccess && orders && checkItems.isSearching &&
              <AppPaginationComponent
                nextLabel=''
                previousLabel=''
                onPaginate={handlePagination2}
                currentPage={page - 1}
                pageCount={researchOrdersPages} />}
          </>
        )}

      {isError && <div className='mb-3'><AppMainError/></div>}
      {isError2 && <div className='mb-3'><AppMainError/></div>}
      {isError3 && <div className='mb-3'><AppMainError/></div>}
      {isError4 && <div className='mb-3'><AppMainError/></div>}
    </>
  )
}
