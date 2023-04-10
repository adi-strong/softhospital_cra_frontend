import {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
  agentsAppPages, researchAgentsAppPages, useLazyGetAgentAppointmentsQuery,
  useLazyGetAgentsAppByPaginationQuery,
  useLazyGetResearchAgentsAppByPaginationQuery,
  useLazyGetResearchAgentsAppQuery
} from "./agentAppointmentsApiSlice";
import {onSetData, onSetIsError, onSetIsFetching, onSetIsSuccess} from "./agentAppointmentsSlice";
import {AppDataTableStripped, AppMainError, AppPaginationComponent, AppTHead} from "../../components";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {ButtonGroup, Form} from "react-bootstrap";
import img from '../../assets/app/img/default_profile.jpg';
import {entrypoint} from "../../app/store";
import {limitStrTo} from "../../services";
import moment from "moment";
import {Link} from "react-router-dom";

const Item = ({ appointment }) => {
  let patient, consult
  patient = useMemo(() => {
    if (appointment?.patient) {
      return appointment.patient
    }
    return null
  }, [appointment])

  consult = useMemo(() => {
    if (appointment?.consultation) return appointment.consultation
    return null
  }, [appointment])

  return (
    <>
      <tr>
        <th>#{appointment?.id}</th>
        <td className='text-primary fw-bold'>
          {patient && (
            <>
              <img
                src={patient?.profile ? entrypoint+patient.profile?.contentUrl : img}
                className='rounded-circle me-1'
                width={33}
                height={33}
                alt=''/>
              {patient?.firstName && <span className='text-capitalize me-1'>{patient.firstName}</span>}
              {patient?.name.toUpperCase()}
            </>)}
        </td>
        <td className='text-uppercase text-primary'>
          {consult && consult?.file ? `(#${consult?.id}) ${limitStrTo(20, consult.file?.wording)}` : '-'}
        </td>
        <td>{appointment?.appointmentDate ? moment(appointment.appointmentDate).calendar() : '-'}</td>
        <td>{appointment?.createdAt ? appointment.createdAt : '-'}</td>
        <td className='text-end'>
          <ButtonGroup size='sm'>
            <Link to={`/member/treatments/consultations/${consult?.id}/${patient?.slug}`} className='me-2'>
              <i className='bi bi-eye-fill'/>
            </Link>
            <Link to={`/member/treatments/consultations/edit/${consult?.id}/${patient?.slug}`}>
              <i className='bi bi-pencil-square'/>
            </Link>
          </ButtonGroup>
        </td>
      </tr>
    </>
  )
}

export const AppointmentsList2 = ({ id }) => {
  const {
    isFetching,
    isSuccess,
    isError,
    appointments} = useSelector(state => state.agentAppointments)
  const dispatch = useDispatch()

  const [contents, setContents] = useState([])
  const [search, setSearch] = useState('')
  const [tempSearch, setTempSearch] = useState('')
  const [page, setPage] = useState(1)
  const [checkItems, setCheckItems] = useState({isSearching: false, isPaginated: false,})
  const [getAppointments, {isLoading: isLoad, isSuccess: isOk, isError: isErr}] = useLazyGetAgentAppointmentsQuery()

  useEffect(() => {
    async function fetchAgentAppointments(id) {
      if (appointments.length < 1) {
        dispatch(onSetIsFetching(true))
        const {data} = await getAppointments(id)
        dispatch(onSetIsFetching(isLoad))
        dispatch(onSetIsSuccess(isOk))
        dispatch(onSetIsError(isErr))
        if (!isError) dispatch(onSetData(data))
      }
    }

    if (id) {
      fetchAgentAppointments(id)
    }
  }, [id, appointments, dispatch, getAppointments, isErr, isError, isOk, isLoad])

  const [paginatedItems, setPaginatedItems] = useState([])
  const [researchPaginatedItems, setResearchPaginatedItems] = useState([])

  const [getAgentsAppByPagination, {isFetching: isFetching2, isError: isError2,}] = useLazyGetAgentsAppByPaginationQuery()
  const [getResearchAgentsApp, {isFetching: isFetching3, isError: isError3,}] = useLazyGetResearchAgentsAppQuery()
  const [getResearchAgentsAppByPagination, {
    isFetching: isFetching4,
    isError: isError4,
  }] = useLazyGetResearchAgentsAppByPaginationQuery()

  async function handlePagination(pagination) {
    const param = pagination + 1
    setPage(param)
    setCheckItems({isSearching: false, isPaginated: true})
    const { data: searchData, isSuccess } = await getAgentsAppByPagination({page: param, id})
    if (isSuccess && searchData) {
      setPaginatedItems(searchData)
    }
  } // handle main pagination

  async function handlePagination2(pagination) {
    const param = pagination + 1
    const keywords = {page: param, keyword: tempSearch}
    setPage(param)
    setCheckItems({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchAgentsAppByPagination({ search: keywords, id})
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
    const { data: searchData, isSuccess } = await getResearchAgentsApp({ keyword: search, id})
    if (isSuccess && searchData) {
      setResearchPaginatedItems(searchData)
    }
  } // submit search keywords

  async function onRefresh() {
    setCheckItems({isPaginated: false, isSearching: false})
    setSearch('')
    setTempSearch('')
    setPage(1)
    dispatch(onSetIsFetching(true))
    const {data} = await getAppointments(id)
    dispatch(onSetIsFetching(isLoad))
    dispatch(onSetIsSuccess(isOk))
    dispatch(onSetIsError(isErr))
    if (!isError) dispatch(onSetData(data))
  }

  useEffect(() => {
    if (!checkItems.isSearching && !checkItems.isPaginated && isSuccess && appointments)
      setContents(appointments.filter(f => f?.fullName.toLowerCase().includes(search.toLowerCase())))
    else if (!checkItems.isSearching && checkItems.isPaginated && isSuccess && appointments)
      setContents(paginatedItems?.filter(f => f?.fullName.toLowerCase().includes(search.toLowerCase())))
    else if (checkItems.isSearching && !checkItems.isPaginated && isSuccess && appointments)
      setContents(researchPaginatedItems?.filter(f => f?.fullName.toLowerCase().includes(search.toLowerCase())))
  }, [
    checkItems,
    isSuccess,
    appointments,
    search,
    researchPaginatedItems,
    paginatedItems,
  ])

  return (
    <>
      <AppDataTableStripped
        loader={isFetching}
        thead={
        <AppTHead
          loader={isFetching}
          isFetching={isFetching || isFetching2 || isFetching4 || isFetching3}
          onRefresh={onRefresh}
          items={[
            {label: '#'},
            {label: 'Patient(e)'},
            {label: 'Fiche'},
            {label: 'Date et Heure'},
            {label: 'Date d\'enregistrement'},
          ]}
        />}
        tbody={
        <tbody>
          {!(isError || isError2 || isError3 || isError4) && isSuccess && contents.length > 0 &&
            contents.map((item, idx) => <Item key={idx} appointment={item}/>)}
        </tbody>}
        overview={
        <>
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
        </>}
      />

      {isFetching || isFetching2 || isFetching3 || isFetching4
        ? <BarLoaderSpinner loading={isFetching || isFetching2 || isFetching3 || isFetching4}/>
        : (
          <>
            {agentsAppPages > 1 && isSuccess && appointments
              && !checkItems.isSearching &&
              <AppPaginationComponent
                nextLabel=''
                previousLabel=''
                onPaginate={handlePagination}
                currentPage={page - 1}
                pageCount={agentsAppPages} />}

            {researchAgentsAppPages > 1 && isSuccess && appointments && checkItems.isSearching &&
              <AppPaginationComponent
                nextLabel=''
                previousLabel=''
                onPaginate={handlePagination2}
                currentPage={page - 1}
                pageCount={researchAgentsAppPages} />}
          </>
        )}

      {isError && <div className='mb-3'><AppMainError/></div>}
      {isError2 && <div className='mb-3'><AppMainError/></div>}
      {isError3 && <div className='mb-3'><AppMainError/></div>}
      {isError4 && <div className='mb-3'><AppMainError/></div>}
    </>
  )
}
