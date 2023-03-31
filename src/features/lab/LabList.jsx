import {AppDataTableStripped, AppMainError, AppPaginationComponent, AppTHead} from "../../components";
import {
  labsPages, researchLabsPages,
  totalResearchLabs,
  useGetLabItemsQuery,
  useLazyGetLabsByPaginationQuery,
  useLazyGetResearchLabsByPaginationQuery,
  useLazyGetResearchLabsQuery
} from "./labApiSlice";
import {useEffect, useState} from "react";
import {LabItem} from "./LabItem";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {Form} from "react-bootstrap";

const thead = [
  {label: '#'},
  {label: 'Fiche'},
  {label: 'Patient(e)'},
  {label: 'Date de prescription'},
]

export function LabList() {
  const {data: labs = [], isLoading, isFetching, isError, isSuccess, refetch} = useGetLabItemsQuery('Lab')
  const [search, setSearch] = useState('')
  const [contents, setContents] = useState([])
  const [tempSearch, setTempSearch] = useState('')
  const [page, setPage] = useState(1)
  const [checkItems, setCheckItems] = useState({isSearching: false, isPaginated: false,})

  const [paginatedItems, setPaginatedItems] = useState([])
  const [researchPaginatedItems, setResearchPaginatedItems] = useState([])

  const [getLabsByPagination, {isFetching: isFetching2, isError: isError2,}] = useLazyGetLabsByPaginationQuery()
  const [getResearchLabs, {isFetching: isFetching3, isError: isError3,}] = useLazyGetResearchLabsQuery()
  const [getResearchLabsByPagination, {
    isFetching: isFetching4,
    isError: isError4,
  }] = useLazyGetResearchLabsByPaginationQuery()

  async function handlePagination(pagination) {
    const param = pagination + 1
    setPage(param)
    setCheckItems({isSearching: false, isPaginated: true})
    const { data: searchData, isSuccess } = await getLabsByPagination(param)
    if (isSuccess && searchData) {
      setPaginatedItems(searchData)
    }
  } // handle main pagination

  async function handlePagination2(pagination) {
    const param = pagination + 1
    const keywords = {page: param, keyword: tempSearch}
    setPage(param)
    setCheckItems({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchLabsByPagination(keywords)
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
    const { data: searchData, isSuccess } = await getResearchLabs(search)
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
    if (!checkItems.isSearching && !checkItems.isPaginated && isSuccess && labs)
      setContents(labs.filter(l => l?.fullName.toLowerCase().includes(search.toLowerCase())))
    else if (!checkItems.isSearching && checkItems.isPaginated && isSuccess && labs)
      setContents(paginatedItems?.filter(f => f?.wording.toLowerCase().includes(search.toLowerCase())))
    else if (checkItems.isSearching && !checkItems.isPaginated && isSuccess && labs)
      setContents(researchPaginatedItems?.filter(f => f?.wording.toLowerCase().includes(search.toLowerCase())))
  }, [isSuccess, labs, search, checkItems, paginatedItems, researchPaginatedItems])

  return (
    <>
      <AppDataTableStripped
        loader={isLoading || isFetching2 || isFetching4}
        thead={
        <AppTHead
          isImg
          onRefresh={onRefresh}
          isFetching={isFetching || isFetching2 || isFetching4 || isFetching3}
          items={thead}/>}
        tbody={
          <tbody>
            {!isError && isSuccess && contents.length > 0 &&
              contents.map(l => <LabItem key={l?.id} lab={l}/>)}
          </tbody>}
        overview={
          <>
            <div className='mb-3'>
              {checkItems.isSearching ?
                totalResearchLabs > 0 ?
                  <p>
                    Au total
                    <code className="mx-1 me-1">{totalResearchLabs.toLocaleString()}</code>
                    bon(s) d'examens suite à votre recherche ⏩ <b>{tempSearch}</b> :
                  </p> : 'Aucune occurence trouvée 🎈' : ''}
            </div>
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
          </>
        } />

      {isLoading || isFetching || isFetching2 || isFetching3 || isFetching4
        ? <BarLoaderSpinner loading={isLoading || isFetching || isFetching2 || isFetching3 || isFetching4}/>
        : (
          <>
            {labsPages > 1 && isSuccess && labs
              && !checkItems.isSearching &&
              <AppPaginationComponent
                nextLabel=''
                previousLabel=''
                onPaginate={handlePagination}
                currentPage={page - 1}
                pageCount={labsPages} />}

            {researchLabsPages > 1 && isSuccess && labs && checkItems.isSearching &&
              <AppPaginationComponent
                nextLabel=''
                previousLabel=''
                onPaginate={handlePagination2}
                currentPage={page - 1}
                pageCount={researchLabsPages} />}
          </>
        )}

      {isError && <div className='mb-3'><AppMainError/></div>}
      {isError2 && <div className='mb-3'><AppMainError/></div>}
      {isError3 && <div className='mb-3'><AppMainError/></div>}
      {isError4 && <div className='mb-3'><AppMainError/></div>}
    </>
  )
}
