import {
  covenantsPages, researchCovenantsPages,
  totalCovenants,
  totalResearchCovenants,
  useGetCovenantsQuery,
  useLazyGetCovenantsByPaginationQuery, useLazyGetResearchCovenantsByPaginationQuery,
  useLazyGetResearchCovenantsQuery
} from "../covenants/covenantApiSlice";
import {useEffect, useState} from "react";
import {AppDataTableBorderless, AppMainError, AppPaginationComponent, AppTHead} from "../../components";
import {Col, Form} from "react-bootstrap";
import {Link} from "react-router-dom";
import {CovenantItem} from "../covenants/CovenantItem";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../auth/authSlice";
import {allowShowSingleConsultationsPage} from "../../app/config";

export function CovenantInvoicesList() {
  const {data: covenants = [], isLoading, isFetching, isSuccess, isError, refetch} = useGetCovenantsQuery('Covenant')
  const [search, setSearch] = useState('')
  const [contents, setContents] = useState([])
  const [tempSearch, setTempSearch] = useState('')
  const [page, setPage] = useState(1)
  const [checkCovenants, setCheckCovenants] = useState({isSearching: false, isPaginated: false,})
  const user = useSelector(selectCurrentUser)


  const handleRefresh = async () => {
    setCheckCovenants({isSearching: false, isPaginated: false})
    setSearch('')
    setTempSearch('')
    setPage(1)
    await refetch()
  }

  const [paginatedItems, setPaginatedItems] = useState([])
  const [researchPaginatedCovenants, setResearchPaginatedCovenants] = useState([])

  const [getCovenantsByPagination, {isFetching: isFetching2, isError: isError2,}] = useLazyGetCovenantsByPaginationQuery()
  const [getResearchCovenants, {isFetching: isFetching3, isError: isError3,}] = useLazyGetResearchCovenantsQuery()
  const [getResearchCovenantsByPagination, {
    isFetching: isFetching4,
    isError: isError4,
  }] = useLazyGetResearchCovenantsByPaginationQuery()

  async function handlePagination(pagination) {
    const param = pagination + 1
    setPage(param)
    setCheckCovenants({isSearching: false, isPaginated: true})
    const { data: searchData, isSuccess } = await getCovenantsByPagination(param)
    if (isSuccess && searchData) {
      setPaginatedItems(searchData)
    }
  } // handle main pagination

  async function handlePagination2(pagination) {
    const param = pagination + 1
    const keywords = {page: param, keyword: tempSearch}
    setPage(param)
    setCheckCovenants({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchCovenantsByPagination(keywords)
    if (isSuccess && searchData) {
      setResearchPaginatedCovenants(searchData)
    }
  } // 2nd handle main pagination

  async function handleSubmit(e) {
    e.preventDefault()
    setPage(1)
    setTempSearch(search)
    setSearch('')
    setCheckCovenants({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchCovenants(search)
    if (isSuccess && searchData) {
      setResearchPaginatedCovenants(searchData)
    }
  } // submit search keywords

  useEffect(() => {
    if (!checkCovenants.isSearching && !checkCovenants.isPaginated && isSuccess && covenants) {
      const items = covenants.ids?.map(id => covenants?.entities[id])
      setContents(items?.filter(c => c?.denomination.toLowerCase().includes(search.toLowerCase())))
    }
    else if (!checkCovenants.isSearching && checkCovenants.isPaginated && isSuccess && covenants)
      setContents(paginatedItems?.filter(f => f?.denomination.toLowerCase().includes(search.toLowerCase())))
    else if (checkCovenants.isSearching && !checkCovenants.isPaginated && isSuccess && covenants)
      setContents(researchPaginatedCovenants?.filter(f => f?.denomination.toLowerCase().includes(search.toLowerCase())))
  },
    [isSuccess, covenants, search, checkCovenants, paginatedItems, researchPaginatedCovenants]) // handle get data

  return (
    <>
      <AppDataTableBorderless
        loader={isLoading || isFetching2 || isFetching4}
        title='Liste des organismes'
        overview={
          <>
            <div className='mb-3'>
              {checkCovenants.isSearching ?
                totalResearchCovenants > 0 ?
                  <p>
                    Au total
                    <code className="mx-1 me-1">{totalResearchCovenants.toLocaleString()}</code>
                    organisme(s) trouvé(s) suite à votre recherche ⏩ <b>{tempSearch}</b> :
                  </p> : 'Aucune occurence trouvée 🎈'
                :
                <p>
                  {totalCovenants < 1
                    ? 'Aucun organisme(s) enregistré(s).'
                    : <>Il y a au total <code>{totalCovenants.toLocaleString()}</code> organisme(s) enregistré(s) :</>}
                </p>}
            </div>

            {user && allowShowSingleConsultationsPage(user?.roles[0] &&
              <Col md={2}>
                <Link
                  to='/member/patients/covenants/add'
                  className='btn btn-primary mb-1 me-1'>
                  <i className='bi bi-plus'/> Enregistrer
                </Link>
              </Col>)} {/* buttons */}
            <Col md={10}> {/* search */}
              <form onSubmit={handleSubmit}>
                <Form.Control
                  placeholder='Votre recherche ici...'
                  aria-label='Votre recherche ici...'
                  autoComplete='off'
                  disabled={covenants.length < 1}
                  name='search'
                  value={search}
                  onChange={({ target }) => setSearch(target.value)} />
              </form>
            </Col>
          </>
        }
        thead={
          <AppTHead
            isImg
            onRefresh={handleRefresh}
            loader={isLoading}
            isFetching={isFetching || isFetching2 || isFetching4 || isFetching3}
            items={[
              {label: '#'},
              {label: 'Dénomination'},
              {label: 'Point focal'},
              {label: 'n° Tél'},
              {label: 'Email'},
              {label: 'Date'},
            ]}/>}
        tbody={
          <tbody>
          {!isError && isSuccess && contents.length > 0 &&
            contents.map(c => <CovenantItem key={c?.id} covenant={c} user={user}/>)}
          </tbody>} />

      {isLoading || isFetching || isFetching2 || isFetching3 || isFetching4
        ? <BarLoaderSpinner loading={isLoading || isFetching || isFetching2 || isFetching3 || isFetching4}/>
        : (
          <>
            {covenantsPages > 1 && isSuccess && covenants
              && !checkCovenants.isSearching &&
              <AppPaginationComponent
                onPaginate={handlePagination}
                currentPage={page - 1}
                pageCount={covenantsPages} />}

            {researchCovenantsPages > 1 && isSuccess && covenants && checkCovenants.isSearching &&
              <AppPaginationComponent
                onPaginate={handlePagination2}
                currentPage={page - 1}
                pageCount={researchCovenantsPages} />}
          </>
        )}

      {isError && <div className='mb-3'><AppMainError/></div>}
      {isError2 && <div className='mb-3'><AppMainError/></div>}
      {isError3 && <div className='mb-3'><AppMainError/></div>}
      {isError4 && <div className='mb-3'><AppMainError/></div>}
    </>
  )
}
