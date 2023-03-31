import {AppDataTableStripped, AppMainError, AppPaginationComponent, AppTHead} from "../../components";
import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {
  consultationsPages, researchConsultationsPages, totalResearchConsultations,
  useGetConsultationsQuery,
  useLazyGetConsultationsByPaginationQuery, useLazyGetResearchConsultationsByPaginationQuery,
  useLazyGetResearchConsultationsQuery
} from "./consultationApiSlice";
import {ConsultationItem} from "./ConsultationItem";
import {Col, Form, Row} from "react-bootstrap";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";

const thead = [
  {label: '#'},
  {label: 'Fiche'},
  {label: 'Patient(e)'},
  {label: <><i className='bi bi-person'/></>},
  {label: <><i className='bi bi-calendar-event'/> Date</>},
]

export const ConsultationsList = () => {
  const {
    data: consultations = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    refetch} = useGetConsultationsQuery('Consultations')
  const [contents, setContents] = useState([])
  const [tempSearch, setTempSearch] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [checkConsults, setCheckConsults] = useState({isSearching: false, isPaginated: false,})

  const [paginatedItems, setPaginatedItems] = useState([])
  const [researchPaginatedItems, setResearchPaginatedItems] = useState([])

  const [getConsultationsByPagination, {isFetching: isFetching2, isError: isError2,}] = useLazyGetConsultationsByPaginationQuery()
  const [getResearchConsultations, {isFetching: isFetching3, isError: isError3,}] = useLazyGetResearchConsultationsQuery()
  const [getResearchConsultationsByPagination, {
    isFetching: isFetching4,
    isError: isError4,
  }] = useLazyGetResearchConsultationsByPaginationQuery()

  async function handlePagination(pagination) {
    const param = pagination + 1
    setPage(param)
    setCheckConsults({isSearching: false, isPaginated: true})
    const { data: searchData, isSuccess } = await getConsultationsByPagination(param)
    if (isSuccess && searchData) {
      setPaginatedItems(searchData)
    }
  } // handle main pagination

  async function handlePagination2(pagination) {
    const param = pagination + 1
    const keywords = {page: param, keyword: tempSearch}
    setPage(param)
    setCheckConsults({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchConsultationsByPagination(keywords)
    if (isSuccess && searchData) {
      setResearchPaginatedItems(searchData)
    }
  } // 2nd handle main pagination

  async function handleSubmit(e) {
    e.preventDefault()
    setPage(1)
    setTempSearch(search)
    setSearch('')
    setCheckConsults({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchConsultations(search)
    if (isSuccess && searchData) {
      setResearchPaginatedItems(searchData)
    }
  } // submit search keywords

  const onRefresh = async () => {
    setCheckConsults({isSearching: false, isPaginated: false})
    setSearch('')
    setTempSearch('')
    setPage(1)
    await refetch()
  }

  useEffect(() => {
    if (!checkConsults.isSearching && !checkConsults.isPaginated && isSuccess && consultations)
      setContents(consultations.filter(c => c?.fullName.toLowerCase().includes(search.toLowerCase())))
    else if (!checkConsults.isSearching && checkConsults.isPaginated && isSuccess && consultations)
      setContents(paginatedItems?.filter(c => c?.fullName.toLowerCase().includes(search.toLowerCase())))
    else if (checkConsults.isSearching && !checkConsults.isPaginated && isSuccess && consultations)
      setContents(researchPaginatedItems?.filter(c => c?.fullName.toLowerCase().includes(search.toLowerCase())))
  }, [isSuccess, consultations, search, checkConsults, paginatedItems, researchPaginatedItems])

  return (
    <>
      <AppDataTableStripped
        loader={isLoading || isFetching2 || isFetching4}
        title='Liste des consultations'
        thead={
          <AppTHead
            isImg
            loader={isLoading}
            isFetching={isFetching || isFetching2 || isFetching4 || isFetching3}
            onRefresh={onRefresh}
            items={thead} />}
        tbody={
          <tbody>
            {!isError && isSuccess && contents.length > 0 &&
              contents.map(c => <ConsultationItem key={c?.id} consult={c}/>)}
          </tbody>
        }
        overview={
          <div className='mt-2'>
            <div className='mb-3'>
              {checkConsults.isSearching ?
                totalResearchConsultations > 0 ?
                  <p>
                    Au total
                    <code className="mx-1 me-1">{totalResearchConsultations.toLocaleString()}</code>
                    fiche(s) trouvée(s) suite à votre recherche ⏩ <b>{tempSearch}</b> :
                  </p> : 'Aucune occurence trouvée 🎈' : ''}
            </div>

            <Row>
              <Col md={4} className='mb-2'>
                <Link to='/member/treatments/consultations/add' className='btn btn-primary'>
                  <i className='bi bi-plus me-1'/>
                  Nouvelle consultation
                </Link>
              </Col>

              <Col className='mb-2'>
                <Form onSubmit={handleSubmit}>
                  <Form.Control
                    name='search'
                    value={search}
                    onChange={({ target }) => setSearch(target.value)}
                    autoComplete='off'
                    placeholder='Rechercher' />
                </Form>
              </Col>
            </Row>
          </div>
        } />

      {isLoading || isFetching || isFetching2 || isFetching3 || isFetching4
        ? <BarLoaderSpinner loading={isLoading || isFetching || isFetching2 || isFetching3 || isFetching4}/>
        : (
          <>
            {consultationsPages > 1 && isSuccess && consultations
              && !checkConsults.isSearching &&
              <AppPaginationComponent
                onPaginate={handlePagination}
                currentPage={page - 1}
                pageCount={consultationsPages} />}

            {researchConsultationsPages > 1 && isSuccess && consultations && checkConsults.isSearching &&
              <AppPaginationComponent
                onPaginate={handlePagination2}
                currentPage={page - 1}
                pageCount={researchConsultationsPages} />}
          </>
        )}

      {isError && <div className='mb-3'><AppMainError/></div>}
      {isError2 && <div className='mb-3'><AppMainError/></div>}
      {isError3 && <div className='mb-3'><AppMainError/></div>}
      {isError4 && <div className='mb-3'><AppMainError/></div>}
    </>
  )
}
