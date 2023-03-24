import {
  patientsPages, researchPatientsPages,
  totalPatients, totalResearchPatients,
  useGetPatientsQuery,
  useLazyGetPatientsByPaginationQuery, useLazyGetResearchPatientsByPaginationQuery, useLazyGetResearchPatientsQuery
} from "./patientApiSlice";
import {useEffect, useState} from "react";
import {AppDataTableBorderless, AppMainError, AppPaginationComponent, AppTHead} from "../../components";
import {PatientItem} from "./PatientItem";
import {PatientsOverView} from "./PatientsOverView";

const tHead = [
  {label: '#'},
  {label: 'Nom'},
  {label: 'Sexe'},
  {label: 'Âge'},
  {label: 'État-civil'},
  {label: <><i className='bi bi-question-circle'/></>},
  {label: <><i className='bi bi-calendar-event'/> Date</>},
]

export function PatientsList() {
  const [search, setSearch] = useState('')
  const [tempSearch, setTempSearch] = useState('')
  const [contents, setContents] = useState([])
  const [page, setPage] = useState(1)
  const {data: patients = [], isLoading, isFetching, isSuccess, isError, refetch} = useGetPatientsQuery('Patient')

  const onRefresh = async () => {
    setPage(1)
    setSearch('')
    setCheckPatients({isPaginated: false, isSearching: false})
    await refetch()
  }
  // On refresh

  let error
  if (isError) error = <AppMainError/> // Error


  // Patients by pagination request
  const [checkPatients, setCheckPatients] = useState({isSearching: false, isPaginated: false})
  const [patientsPaginated, setPatientsPaginated] = useState([])
  const [researchPatients, setResearchPatients] = useState([])
  const [getPatientsByPagination, {isFetching: isFetching2, isError: isError2}] = useLazyGetPatientsByPaginationQuery()
  const [getResearchPatients, {isFetching: isFetching3, isError: isError3}] = useLazyGetResearchPatientsQuery()
  const [getResearchPatientsByPagination, {isFetching: isFetching4, isError: isError4}] =
    useLazyGetResearchPatientsByPaginationQuery()

  async function handlePagination(pagination) {
    const param = pagination + 1
    setPage(param)
    setCheckPatients({isSearching: false, isPaginated: true})
    const { data: paginatedData, isSuccess } = await getPatientsByPagination(param)
    if (isSuccess && paginatedData) setPatientsPaginated(paginatedData)
  } // handle main pagination

  async function handlePagination2(pagination) {
    const param = pagination + 1
    const keywords = {page: param, keyword: tempSearch}
    setPage(param)
    setCheckPatients({isSearching: true, isPaginated: false})
    const { data: paginatedData, isSuccess } = await getResearchPatientsByPagination(keywords)
    if (isSuccess && paginatedData) setResearchPatients(paginatedData)
  } // 2nd handle main pagination

  async function handleDeepSearch(e) {
    e.preventDefault()
    setPage(1)
    setTempSearch(search)
    setSearch('')
    setCheckPatients({isSearching: true, isPaginated: false})
    const { data: researchPatientsData, isSuccess } = await getResearchPatients(search)
    if (isSuccess && researchPatientsData) setResearchPatients(researchPatientsData)
  } // handle deep search
  // Patients by pagination request

  // Handle get patients
  useEffect(() => {
    if (!checkPatients.isSearching && !checkPatients.isPaginated && patients && isSuccess)
      setContents(patients.filter(p => (
        (p.name.toLowerCase().includes(search.toLowerCase())) ||
        p?.lastName.toLowerCase().includes(search.toLowerCase()) ||
        p?.firstName.toLowerCase().includes(search.toLowerCase())
    )))
    else if (!checkPatients.isSearching && checkPatients.isPaginated && patients)
      setContents(patientsPaginated.filter(p => (
        (p.name.toLowerCase().includes(search.toLowerCase())) ||
        p?.lastName.toLowerCase().includes(search.toLowerCase()) ||
        p?.firstName.toLowerCase().includes(search.toLowerCase())
    )))
    else if (checkPatients.isSearching && !checkPatients.isPaginated && patients)
      setContents(researchPatients.filter(p => (
        (p.name.toLowerCase().includes(search.toLowerCase())) ||
        p?.lastName.toLowerCase().includes(search.toLowerCase()) ||
        p?.firstName.toLowerCase().includes(search.toLowerCase())
    )))
  }, [patients, search, checkPatients, patientsPaginated, isSuccess, researchPatients])
  // End Handle get patients

  return (
    <>
      <AppDataTableBorderless
        thead={
          <AppTHead
            isImg
            loader={isLoading || isFetching2}
            isFetching={isFetching || isFetching2 || isFetching3 || isFetching4}
            onRefresh={onRefresh}
            items={tHead}/>}
        loader={isLoading || isFetching2 || isFetching4}
        tbody={
          <tbody>
          {contents.length > 0 && contents.map(patient =>
            <PatientItem key={patient?.id} patient={patient}/>)}
          </tbody>
        }
        title='Liste des patients'
        overview={
          <PatientsOverView
            setSearch={setSearch}
            totalItems={totalPatients}
            search={search}
            tempSearch={tempSearch}
            researchTotalItems={totalResearchPatients}
            isResearch={checkPatients.isSearching}
            onDeepSearch={handleDeepSearch}
            searchLoader={isFetching3}/>
        } />
      {patientsPages > 1 && isSuccess && patients && !checkPatients.isSearching &&
        <AppPaginationComponent
          pageCount={patientsPages}
          onPaginate={handlePagination}
          currentPage={page - 1}/>}
      {researchPatientsPages > 1 && isSuccess && patients && checkPatients.isSearching &&
        <AppPaginationComponent
          pageCount={researchPatientsPages}
          onPaginate={handlePagination2}
          currentPage={page - 1}/>}
      {error && <div className='mb-3'>{error}</div>}
      {isError2 && <div className='mb-3'><AppMainError/></div>}
      {isError3 && <div className='mb-3'><AppMainError/></div>}
      {isError4 && <div className='mb-3'><AppMainError/></div>}
    </>
  )
}
