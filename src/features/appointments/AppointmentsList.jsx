import {
  appointmentsPages, researchAppointmentsPages,
  useGetAppointmentsQuery,
  useLazyGetAppointmentsByPaginationQuery,
  useLazyGetResearchAppointmentsByPaginationQuery,
  useLazyGetResearchAppointmentsQuery,
  useToggleAppointmentMutation
} from "./appointmentApiSlice";
import {AppDataTableBorderless, AppMainError, AppPaginationComponent, AppTHead} from "../../components";
import {useEffect, useState} from "react";
import {AppointmentItem} from "./AppointmentItem";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {AddAppointment} from "./AddAppointment";
import {Button, Col, Form} from "react-bootstrap";

const thead = [
  {label: '#'},
  {label: 'Patient(e)'},
  {label: 'Date & Heure'},
]

export function AppointmentsList() {
  const {data: appointments = [], isLoading, isFetching, isSuccess, isError, refetch} =
    useGetAppointmentsQuery('Appointments')
  const [toggleAppointment] = useToggleAppointmentMutation()
  const [contents, setContents] = useState([])
  const [search, setSearch] = useState('')
  const [tempSearch, setTempSearch] = useState('')
  const [page, setPage] = useState(1)
  const [show, setShow] = useState(false)

  const toggleModal = () => setShow(!show)

  const handleSearch = ({ target }) => setSearch(target.value)

  // Handle search and Pagination
  const [checkAppointments, setCheckAppointments] = useState({
    isSearching: false,
    isSearching2: false,
    isPaginated: false,
  })
  const [getAppointmentsByPagination, {
    data: paginatedAppointments,
    isSuccess: isSuccess2,
    isFetching: isFetching2,
    isError: isError2,
  }] = useLazyGetAppointmentsByPaginationQuery()
  const [getResearchAppointments, {
    data: researchAppointments,
    isSuccess: isSuccess3,
    isFetching: isFetching3,
    isError: isError3,
  }] = useLazyGetResearchAppointmentsQuery()
  const [getResearchAppointmentsByPagination, {
    data: researchAndPagination,
    isSuccess: isSuccess4,
    isFetching: isFetching4,
    isError: isError4,
  }] = useLazyGetResearchAppointmentsByPaginationQuery()

  async function handlePagination(pagination) {
    const param = pagination + 1
    setPage(param)
    setCheckAppointments({isSearching: false, isPaginated: true, isSearching2: false})
    await getAppointmentsByPagination(param)
  } // handle main pagination

  async function handlePagination2(pagination) {
    const param = pagination + 1
    const keywords = {page: param, keyword: tempSearch}
    setPage(param)
    setCheckAppointments({isSearching2: true, isSearching: false, isPaginated: false})
    await getResearchAppointmentsByPagination(keywords)
  } // 2nd handle main pagination

  async function onSubmit(e) {
    e.preventDefault()
    setPage(1)
    setTempSearch(search)
    setSearch('')
    setCheckAppointments({isSearching: true, isSearching2: false, isPaginated: false})
    await getResearchAppointments(search)
  }
  // End Handle search and Pagination

  const onRefresh = async () => {
    setPage(1)
    setTempSearch('')
    setSearch('')
    setCheckAppointments({isPaginated: false, isSearching: false, isSearching2: false})
    await refetch()
  }

  useEffect(() => {
    if (isSuccess2 && paginatedAppointments && checkAppointments.isPaginated && !(checkAppointments.isSearching && checkAppointments.isSearching2)) {
      setContents(paginatedAppointments?.filter(p => p?.fullName.toLowerCase().includes(search.toLowerCase())))
    }
    else if (isSuccess3 && researchAppointments && checkAppointments.isSearching && !(checkAppointments.isSearching2 && checkAppointments.isPaginated)) {
      setContents(researchAppointments?.filter(p => p?.fullName.toLowerCase().includes(search.toLowerCase())))
    }
    else if (isSuccess4 && researchAndPagination && checkAppointments.isSearching2 && !(checkAppointments.isSearching && checkAppointments.isPaginated)) {
      setContents(researchAndPagination?.filter(p => p?.fullName.toLowerCase().includes(search.toLowerCase())))
    }
    else if (isSuccess && appointments && !(checkAppointments.isSearching && checkAppointments.isSearching2 && checkAppointments.isPaginated)) {
      setContents(appointments.filter(p => p?.fullName.toLowerCase().includes(search.toLowerCase())))
    }
  }, [
    isSuccess,
    appointments,
    checkAppointments,
    search,
    paginatedAppointments,
    isSuccess2,
    isSuccess3,
    researchAppointments,
    isSuccess4,
    researchAndPagination,
  ])

  return (
    <>
      <AppDataTableBorderless
        thead={
          <AppTHead
            isImg
            loader={isLoading || isFetching2 || isFetching3}
            isFetching={isFetching || isFetching2 || isFetching3 || isFetching4}
            onRefresh={onRefresh}
            items={thead}/>}
        tbody={
          <tbody>
          {!isLoading && contents.length > 0 && contents.map(item =>
            <AppointmentItem
              key={item?.id}
              page={page}
              search={tempSearch}
              appointment={item}
              onRefresh={onRefresh}
              onToggleAppointment={toggleAppointment}/>)}
          </tbody>
        }
        title='Liste des rendez-vous'
        overview={
          <>
            <Col md={6}>
              <Form onSubmit={onSubmit}>
                <Form.Control
                  disabled={isFetching3}
                  name='search'
                  placeholder='Rechercher'
                  autoComplete='off'
                  value={search}
                  onChange={handleSearch} />
              </Form>
            </Col>
            <Col>
              <Button type='button' className='w-100' onClick={toggleModal}>
                <i className='bi bi-plus'/> Fixer un rendez-vous
              </Button>
            </Col>
          </>
      } />
      {(isLoading || isFetching2 || isFetching4) && <BarLoaderSpinner loading={isLoading || isFetching2 || isFetching4}/>}
      {appointmentsPages > 1 && isSuccess && appointments
        && !checkAppointments.isSearching && !checkAppointments.isSearching2 &&
        <AppPaginationComponent
          pageRangeDisplayed={2}
          nextLabel=''
          previousLabel=''
          onPaginate={handlePagination}
          currentPage={page - 1}
          pageCount={appointmentsPages} />}
      {researchAppointmentsPages > 1 && isSuccess3 && researchAppointments && checkAppointments.isSearching &&
        <AppPaginationComponent
          pageRangeDisplayed={2}
          nextLabel=''
          previousLabel=''
          onPaginate={handlePagination2}
          currentPage={page - 1}
          pageCount={researchAppointmentsPages} />}
      {researchAppointmentsPages > 1 && isSuccess4 && researchAndPagination && checkAppointments.isSearching2 &&
        <AppPaginationComponent
          pageRangeDisplayed={2}
          nextLabel=''
          previousLabel=''
          onPaginate={handlePagination2}
          currentPage={page - 1}
          pageCount={researchAppointmentsPages} />}
      {isError && <div className='mb-3'><AppMainError/></div>}
      {isError2 && <div className='mb-3'><AppMainError/></div>}
      {isError3 && <div className='mb-3'><AppMainError/></div>}
      {isError4 && <div className='mb-3'><AppMainError/></div>}

      <AddAppointment
        onHide={toggleModal}
        show={show} />
    </>
  )
}
