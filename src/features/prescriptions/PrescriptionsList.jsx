import {AppDataTableStripped, AppMainError, AppPaginationComponent, AppTHead} from "../../components";
import {
  prescriptionsPages, researchPrescriptionsPages,
  totalResearchPrescriptions,
  useGetPrescriptionsQuery,
  useLazyGetPrescriptionsByPaginationQuery, useLazyGetResearchPrescriptionsByPaginationQuery,
  useLazyGetResearchPrescriptionsQuery
} from "./prescriptionApiSlice";
import {useEffect, useState} from "react";
import {PrescriptionItem} from "./PrescriptionItem";
import {Form} from "react-bootstrap";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";

const thead = [
  {label: '#'},
  {label: 'Fiche'},
  {label: 'Patient(e)'},
  {label: <><i className='bi bi-person'/> Par</>},
  {label: 'Date de prescription'},
]

export function PrescriptionsList() {
  const {data: prescriptions = [], isLoading, isFetching, isSuccess, isError, refetch} =
    useGetPrescriptionsQuery('Prescription')

  const [search, setSearch] = useState('')
  const [contents, setContents] = useState([])
  const [tempSearch, setTempSearch] = useState('')
  const [page, setPage] = useState(1)
  const [checkItems, setCheckItems] = useState({isSearching: false, isPaginated: false,})

  const [paginatedItems, setPaginatedItems] = useState([])
  const [researchPaginatedItems, setResearchPaginatedItems] = useState([])

  const [getPrescriptionsByPagination, {isFetching: isFetching2, isError: isError2,}] = useLazyGetPrescriptionsByPaginationQuery()
  const [getResearchPrescriptions, {isFetching: isFetching3, isError: isError3,}] = useLazyGetResearchPrescriptionsQuery()
  const [getResearchPrescriptionsByPagination, {
    isFetching: isFetching4,
    isError: isError4,
  }] = useLazyGetResearchPrescriptionsByPaginationQuery()

  async function handlePagination(pagination) {
    const param = pagination + 1
    setPage(param)
    setCheckItems({isSearching: false, isPaginated: true})
    const { data: searchData, isSuccess } = await getPrescriptionsByPagination(param)
    if (isSuccess && searchData) {
      setPaginatedItems(searchData)
    }
  } // handle main pagination

  async function handlePagination2(pagination) {
    const param = pagination + 1
    const keywords = {page: param, keyword: tempSearch}
    setPage(param)
    setCheckItems({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchPrescriptionsByPagination(keywords)
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
    const { data: searchData, isSuccess } = await getResearchPrescriptions(search)
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
    if (!checkItems.isSearching && !checkItems.isPaginated && isSuccess && prescriptions)
      setContents(prescriptions.filter(p => p?.fullName.toLowerCase().includes(search.toLowerCase())))
    else if (!checkItems.isSearching && checkItems.isPaginated && isSuccess && prescriptions)
      setContents(paginatedItems?.filter(p => p?.fullName.toLowerCase().includes(search.toLowerCase())))
    else if (checkItems.isSearching && !checkItems.isPaginated && isSuccess && prescriptions)
      setContents(researchPaginatedItems?.filter(p => p?.fullName.toLowerCase().includes(search.toLowerCase())))
  }, [isSuccess, prescriptions, search, checkItems, paginatedItems, researchPaginatedItems])

  return (
    <>
      <AppDataTableStripped
        loader={isLoading || isFetching2 || isFetching4}
        thead={
          <AppTHead
            loader={isLoading}
            isFetching={isFetching || isFetching2 || isFetching4 || isFetching3}
            onRefresh={onRefresh}
            items={thead}
            isImg/>}
        tbody={
          <tbody>
            {!isError && isSuccess && contents.length > 0 &&
              contents.map(p => <PrescriptionItem key={p?.id} prescription={p}/>)}
          </tbody>
        }
        overview={
          <>
            <div className="mb-3">
              {checkItems.isSearching ?
                totalResearchPrescriptions > 0 ?
                  <p>
                    Au total
                    <code className="mx-1 me-1">{totalResearchPrescriptions.toLocaleString()}</code>
                    prescription(s) trouvé(s) suite à votre recherche ⏩ <b>{tempSearch}</b> :
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
            {prescriptionsPages > 1 && isSuccess && prescriptions
              && !checkItems.isSearching &&
              <AppPaginationComponent
                nextLabel=''
                previousLabel=''
                onPaginate={handlePagination}
                currentPage={page - 1}
                pageCount={prescriptionsPages} />}

            {researchPrescriptionsPages > 1 && isSuccess && prescriptions && checkItems.isSearching &&
              <AppPaginationComponent
                nextLabel=''
                previousLabel=''
                onPaginate={handlePagination2}
                currentPage={page - 1}
                pageCount={researchPrescriptionsPages} />}
          </>
        )}

      {isError && <div className='mb-3'><AppMainError/></div>}
      {isError2 && <div className='mb-3'><AppMainError/></div>}
      {isError3 && <div className='mb-3'><AppMainError/></div>}
      {isError4 && <div className='mb-3'><AppMainError/></div>}
    </>
  )
}
