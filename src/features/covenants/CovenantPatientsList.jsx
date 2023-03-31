import {AppDataTableBorderless, AppMainError, AppPaginationComponent, AppTHead} from "../../components";
import {CovenantPatientsItem} from "./CovenantPatientsItem";
import {useEffect, useState} from "react";
import {Col, Form} from "react-bootstrap";
import {Link} from "react-router-dom";
import {
  covenantPatientsPages, researchCovenantPatientsPages, totalCovenantsPatients,
  totalResearchCovenantPatients,
  useLazyGetCovenantPatientsByPaginationQuery, useLazyGetResearchCovenantPatientsByPaginationQuery,
  useLazyGetResearchCovenantPatientsQuery
} from "../patients/patientApiSlice";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";

const thead = [
  {label: '#'},
  {label: 'Nom'},
  {label: 'Sexe'},
  {label: 'État-civl'},
  {label: <><i className='bi bi-calendar-event'/></>},
]

export function CovenantPatientsList(
  {
    id,
    patients,
    isError,
    isFetching,
    isLoading,
    onRefresh,
    isSuccess,
    checkPatients,
    page,
    setTempSearch,
    search,
    setCheckPatients,
    setPage,
    setSearch,
    tempSearch,
  }) {
  const [contents, setContents] = useState([])

  const [paginatedItems, setPaginatedItems] = useState([])
  const [researchPaginatedItems, setResearchPaginatedItems] = useState([])

  const [getCovenantPatientsByPagination, {isFetching: isFetching2, isError: isError2,}] = useLazyGetCovenantPatientsByPaginationQuery()
  const [getResearchCovenantPatients, {isFetching: isFetching3, isError: isError3,}] = useLazyGetResearchCovenantPatientsQuery()
  const [getResearchCovenantPatientsByPagination, {
    isFetching: isFetching4,
    isError: isError4,
  }] = useLazyGetResearchCovenantPatientsByPaginationQuery()

  async function handlePagination(pagination) {
    const param = pagination + 1
    setPage(param)
    setCheckPatients({isSearching: false, isPaginated: true})
    const { data: searchData, isSuccess } = await getCovenantPatientsByPagination({id, page: param})
    if (isSuccess && searchData) {
      setPaginatedItems(searchData)
    }
  } // handle main pagination

  async function handlePagination2(pagination) {
    const param = pagination + 1
    const keywords = {page: param, keyword: tempSearch}
    setPage(param)
    setCheckPatients({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchCovenantPatientsByPagination({ id, search: keywords })
    if (isSuccess && searchData) {
      setResearchPaginatedItems(searchData)
    }
  } // 2nd handle main pagination

  async function handleSubmit(e) {
    e.preventDefault()
    setPage(1)
    setTempSearch(search)
    setSearch('')
    setCheckPatients({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchCovenantPatients({ id, keyword: search })
    if (isSuccess && searchData) {
      setResearchPaginatedItems(searchData)
    }
  } // submit search keywords

  useEffect(() => {
    if (!checkPatients.isSearching && !checkPatients.isPaginated && isSuccess && patients) setContents(patients?.filter(p => (
      (p.name.toLowerCase().includes(search.toLowerCase())) ||
      p?.lastName.toLowerCase().includes(search.toLowerCase()) ||
      p?.firstName.toLowerCase().includes(search.toLowerCase())
    )))
    else if (!checkPatients.isSearching && checkPatients.isPaginated && isSuccess && patients)
      setContents(paginatedItems?.filter(p => (
        (p.name.toLowerCase().includes(search.toLowerCase())) ||
        p?.lastName.toLowerCase().includes(search.toLowerCase()) ||
        p?.firstName.toLowerCase().includes(search.toLowerCase())
      )))
    else if (checkPatients.isSearching && !checkPatients.isPaginated && isSuccess && patients)
      setContents(researchPaginatedItems?.filter(p => (
        (p.name.toLowerCase().includes(search.toLowerCase())) ||
        p?.lastName.toLowerCase().includes(search.toLowerCase()) ||
        p?.firstName.toLowerCase().includes(search.toLowerCase())
      )))
  }, [isSuccess, patients, search, checkPatients, paginatedItems, researchPaginatedItems]) // handle get data

  return (
    <>
      <AppDataTableBorderless
        title='Liste des patients'
        loader={isLoading || isFetching2 || isFetching4}
        tbody={
          <tbody>
            {!isError && isSuccess && contents.length > 0 &&
              contents.map(p => <CovenantPatientsItem key={p?.id} patient={p} onRefresh={onRefresh}/>)}
          </tbody>}
        thead={
          <AppTHead
            isImg
            loader={isLoading || isFetching2 || isFetching4 || isFetching3}
            isFetching={isFetching}
            items={thead}
            onRefresh={onRefresh}/>}
        overview={
          <>
            <div className='mb-3'>
              {checkPatients.isSearching ?
                totalResearchCovenantPatients > 0 ?
                  <p>
                    Au total
                    <code className="mx-1 me-1">{totalResearchCovenantPatients.toLocaleString()}</code>
                    patient(s) trouvé(s) suite à votre recherche ⏩ <b>{tempSearch}</b> :
                  </p> : 'Aucune occurence trouvée 🎈'
                :
                <p>
                  {totalCovenantsPatients < 1
                    ? 'Aucun patient(s) enregistré(s).'
                    : <>Il y a au total <code>{totalCovenantsPatients.toLocaleString()}</code> patient(s) enregistré(s) :</>}
                </p>}
            </div>

            <Col md={4}>
              <Link to='/member/patients/add' className='btn btn-primary bi bi-person-plus'> Aouter un patient</Link>
            </Col>
            <Col>
              <Form onSubmit={handleSubmit}>
                <Form.Control
                  autoComplete='off'
                  name='search'
                  value={search}
                  onChange={({ target }) => setSearch(target.value)}
                  placeholder='Rechercher' />
              </Form>
            </Col>
          </>
        }/>

      {isLoading || isFetching || isFetching2 || isFetching3 || isFetching4
        ? <BarLoaderSpinner loading={isLoading || isFetching || isFetching2 || isFetching3 || isFetching4}/>
        : (
          <>
            {covenantPatientsPages > 1 && isSuccess && patients
              && !checkPatients.isSearching &&
              <AppPaginationComponent
                nextLabel=''
                previousLabel=''
                onPaginate={handlePagination}
                currentPage={page - 1}
                pageCount={covenantPatientsPages} />}

            {researchCovenantPatientsPages > 1 && isSuccess && patients && checkPatients.isSearching &&
              <AppPaginationComponent
                nextLabel=''
                previousLabel=''
                onPaginate={handlePagination2}
                currentPage={page - 1}
                pageCount={researchCovenantPatientsPages} />}
          </>
        )}

      {isError && <div className='mb-3'><AppMainError/></div>}
      {isError2 && <div className='mb-3'><AppMainError/></div>}
      {isError3 && <div className='mb-3'><AppMainError/></div>}
      {isError4 && <div className='mb-3'><AppMainError/></div>}
    </>
  )
}
