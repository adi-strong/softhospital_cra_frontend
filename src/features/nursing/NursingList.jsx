import {
  nursingsPages, researchNursingsPages, totalResearchNursings,
  useGetNursingsQuery,
  useLazyGetNursingsByPaginationQuery, useLazyGetResearchNursingsByPaginationQuery,
  useLazyGetResearchNursingsQuery
} from "./nursingApiSlice";
import {AppDataTableStripped, AppMainError, AppPaginationComponent, AppTHead} from "../../components";
import {useEffect, useState} from "react";
import {NursingItem} from "./NursingItem";
import {Form} from "react-bootstrap";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";

const thead = [
  {label: '#'},
  {label: 'Fiche'},
  {label: 'Patient(e)'},
]

export function NursingList() {
  const {data: nursings = [], isLoading, isFetching, isSuccess, isError, refetch} = useGetNursingsQuery('Nursing')
  const [contents, setContents] = useState([])
  const [tempSearch, setTempSearch] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [checkItems, setCheckItems] = useState({isSearching: false, isPaginated: false,})

  const [paginatedItems, setPaginatedItems] = useState([])
  const [researchPaginatedItems, setResearchPaginatedItems] = useState([])

  const [getNursingsByPagination, {isFetching: isFetching2, isError: isError2,}] = useLazyGetNursingsByPaginationQuery()
  const [getResearchNursings, {isFetching: isFetching3, isError: isError3,}] = useLazyGetResearchNursingsQuery()
  const [getResearchNursingsByPagination, {
    isFetching: isFetching4,
    isError: isError4,
  }] = useLazyGetResearchNursingsByPaginationQuery()

  async function handlePagination(pagination) {
    const param = pagination + 1
    setPage(param)
    setCheckItems({isSearching: false, isPaginated: true})
    const { data: searchData, isSuccess } = await getNursingsByPagination(param)
    if (isSuccess && searchData) {
      setPaginatedItems(searchData)
    }
  } // handle main pagination

  async function handlePagination2(pagination) {
    const param = pagination + 1
    const keywords = {page: param, keyword: tempSearch}
    setPage(param)
    setCheckItems({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchNursingsByPagination(keywords)
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
    const { data: searchData, isSuccess } = await getResearchNursings(search)
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
    if (!checkItems.isSearching && !checkItems.isPaginated && isSuccess && nursings)
      setContents(nursings.filter(n => n?.fullName.toLowerCase().includes(search.toLowerCase())))
    else if (!checkItems.isSearching && checkItems.isPaginated && isSuccess && nursings)
      setContents(paginatedItems?.filter(f => f?.fullName.toLowerCase().includes(search.toLowerCase())))
    else if (checkItems.isSearching && !checkItems.isPaginated && isSuccess && nursings)
      setContents(researchPaginatedItems?.filter(f => f?.fullName.toLowerCase().includes(search.toLowerCase())))
  }, [isSuccess, nursings, search, checkItems, paginatedItems, researchPaginatedItems])

  return (
    <>
      <AppDataTableStripped
        loader={isLoading || isFetching2 || isFetching4}
        thead={
          <AppTHead
            isImg
            loader={isLoading}
            isFetching={isFetching || isFetching2 || isFetching4 || isFetching3}
            onRefresh={onRefresh}
            items={thead}/>}
        title='Traitements des patients'
        tbody={
          <tbody>
            {!isError && isSuccess && contents.length > 0 &&
              contents.map(n => <NursingItem key={n?.id} nursing={n}/>)}
          </tbody>
        }
        overview={
          <>
            <div className='mb-3'>
              {checkItems.isSearching ?
                totalResearchNursings > 0 ?
                  <p>
                    Au total
                    <code className="mx-1 me-1">{totalResearchNursings.toLocaleString()}</code>
                    fiches de traitements trouvées suite à votre recherche ⏩ <b>{tempSearch}</b> :
                  </p> : 'Aucune occurence trouvée 🎈' : ''}
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Control
                autoComplete='off'
                placeholder='Rechercher'
                name='search'
                value={search}
                onChange={({ target }) => setSearch(target.value)} />
            </Form>
          </>
        } />

      {isLoading || isFetching || isFetching2 || isFetching3 || isFetching4
        ? <BarLoaderSpinner loading={isLoading || isFetching || isFetching2 || isFetching3 || isFetching4}/>
        : (
          <>
            {nursingsPages > 1 && isSuccess && nursings
              && !checkItems.isSearching &&
              <AppPaginationComponent
                nextLabel=''
                previousLabel=''
                onPaginate={handlePagination}
                currentPage={page - 1}
                pageCount={nursingsPages} />}

            {researchNursingsPages > 1 && isSuccess && nursings && checkItems.isSearching &&
              <AppPaginationComponent
                nextLabel=''
                previousLabel=''
                onPaginate={handlePagination2}
                currentPage={page - 1}
                pageCount={researchNursingsPages} />}
          </>
        )}

      {isError && <div className='mb-3'><AppMainError/></div>}
      {isError2 && <div className='mb-3'><AppMainError/></div>}
      {isError3 && <div className='mb-3'><AppMainError/></div>}
      {isError4 && <div className='mb-3'><AppMainError/></div>}
    </>
  )
}

export default NursingList
