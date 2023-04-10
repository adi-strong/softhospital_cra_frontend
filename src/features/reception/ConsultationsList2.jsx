import {
  consultationsPages, researchConsultationsPages, totalResearchConsultations,
  useAddNewConsultationMutation,
  useGetConsultationsQuery,
  useLazyGetConsultationsByPaginationQuery,
  useLazyGetResearchConsultationsByPaginationQuery,
  useLazyGetResearchConsultationsQuery
} from "../consultations/consultationApiSlice";
import {
  AppAddModal,
  AppDataTableStripped,
  AppLgModal,
  AppMainError,
  AppPaginationComponent,
  AppTHead
} from "../../components";
import {useEffect, useState} from "react";
import {ConsultationItem2} from "./ConsultationItem2";
import {Button, Col, Form} from "react-bootstrap";
import {AddPatientForm} from "./AddPatientForm";
import {useAddNewPatientMutation} from "../patients/patientApiSlice";
import toast from "react-hot-toast";
import {AddConsultForm} from "./AddConsultForm";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../auth/authSlice";
import {allowActionsToPatients} from "../../app/config";

const thead = [
  {label: '#'},
  {label: 'Fiche'},
  {label: 'Patient(e)'},
  {label: <><i className='bi bi-calendar-event'/> Date</>},
]

export function ConsultationsList2() {
  const user = useSelector(selectCurrentUser)
  const {
    data: consultations = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    refetch} = useGetConsultationsQuery('Consultations')
  const [search, setSearch] = useState('')
  const [tempSearch, setTempSearch] = useState('')
  const [show, setShow] = useState(false)
  const [show2, setShow2] = useState(false)
  const [patient, setPatient] = useState({name: '', firstName: '', sex: 'none', tel: ''})
  const [consult, setConsult] = useState({
    doctor: null,
    patient: null,
    file: null,
    treatments: null,
    bed: null,
    hospReleasedAt: new Date(),
    temperature: 0.0,
    weight: 0.0,
    arterialTension: '',
    cardiacFrequency: '',
    respiratoryFrequency: '',
    oxygenSaturation: '',
    comment: '',
  })
  const [contents, setContents] = useState([])

  let errors

  const [addNewPatient, {
    isLoading: isPatientLoading,
    isError: isPatientError,
    error: patientError
  }] = useAddNewPatientMutation()

  const [addNewConsultation, {
    isLoading: isConsultLoading,
    isError: isConsultError,
    error: consultError
  }] = useAddNewConsultationMutation()

  let patientErrors = {name: null, firstName: null, tel: null}
  let consultErrors = {doctor: null, patient: null}

  const toggleShow = () => setShow(!show)
  const toggleShow2 = () => setShow2(!show2)

  // Handle submit patient's data
  const onResetPatientData = () => setPatient({tel: '', name: '', firstName: '', sex: 'none'})

  const isPatientValid = [patient.name].every(Boolean) || !isPatientLoading
  async function onSubmitPatientData(e) {
    e.preventDefault()
    if (isPatientValid) {
      const formData = await addNewPatient(patient)
      if (!formData.error) {
        toast.success('Enregistrement bien efféctuée.')
        onResetPatientData()
        toggleShow()
      }
    }
    else alert('Veuillez renseigner le nom du patient ❗')
  }
  // End Handle submit patient's data

  // Handle submit consultation's data
  const onResetConsultData = () => setConsult({
    doctor: null,
    patient: null,
    file: null,
    treatments: null,
    bed: null,
    hospReleasedAt: new Date(),
    temperature: 0.0,
    weight: 0.0,
    arterialTension: '',
    cardiacFrequency: '',
    respiratoryFrequency: '',
    oxygenSaturation: '',
    comment: '',
  })

  const isConsultValid = [consult.patient, consult.doctor].every(Boolean) || !isPatientLoading
  async function onSubmitConsultData(e) {
    e.preventDefault()
    if (isConsultValid) {
      const formData = await addNewConsultation(consult)
      if (!formData.error) {
        toast.success('Enregistrement bien efféctuée.')
        onResetConsultData()
        toggleShow2()
      }
    }
    else alert('Veuillez renseigner les champs obligatoires ❗')
  }
  // End Handle submit consultation's data

  if (isPatientError) {
    const { violations } = patientError.data
    if (violations) {
      violations.forEach(({ propertyPath, message }) => {
        patientErrors[propertyPath] = message;
      });
    }
  }

  if (isConsultError) {
    const { violations } = consultError.data
    if (violations) {
      violations.forEach(({ propertyPath, message }) => {
        consultErrors[propertyPath] = message;
      });
    }
  }

  if (isError) errors = <AppMainError/>

  // Research and Pagination
  const [page, setPage] = useState(1)
  const [paginatedConsults, setPaginatedConsult] = useState([])
  const [paginatedConsults2, setPaginatedConsult2] = useState([])
  const [checkConsultations, setCheckConsultations] = useState({isSearching: false, isPaginated: false})
  const [getConsultationsByPagination, {
    isFetching: isFetching2,
    isError: isError2
  }] = useLazyGetConsultationsByPaginationQuery()
  const [getResearchConsultations, {
    isFetching: isFetching3,
    isError: isError3
  }] = useLazyGetResearchConsultationsQuery()
  const [getResearchConsultationsByPagination, {
    isFetching: isFetching4,
    isError: isError4
  }] = useLazyGetResearchConsultationsByPaginationQuery()

  async function handlePagination(pagination) {
    const param = pagination + 1
    setPage(param)
    setCheckConsultations({isSearching: false, isPaginated: true})
    const { data: paginatedData, isSuccess } = await getConsultationsByPagination(param)
    if (isSuccess && paginatedData)
      setPaginatedConsult(paginatedData)
  }

  async function handlePagination2(pagination) {
    const param = pagination + 1
    setPage(param)
    setSearch('')
    const keywords = {page: param, keyword: tempSearch}
    setCheckConsultations({isSearching: true, isPaginated: false})
    const { data: paginatedData, isSuccess } = await getResearchConsultationsByPagination(keywords)
    if (isSuccess && paginatedData)
      setPaginatedConsult2(paginatedData)
  }

  async function onDeepSearch(e) {
    e.preventDefault()
    setPage(1)
    setTempSearch(search)
    setSearch('')
    setCheckConsultations({isSearching: true, isPaginated: false})
    const { data: paginatedData, isSuccess } = await getResearchConsultations(search)
    if (isSuccess && paginatedData)
      setPaginatedConsult2(paginatedData)
  } // submit search keywords

  const handleSearch = ({ target }) => {
    const value = target.value
    setSearch(value)
  }
  // End Research and Pagination

  const onRefresh = async () => {
    setPage(1)
    setSearch('')
    setSearch('')
    setCheckConsultations({isPaginated: false, isSearching: false})
    await refetch()
  }

  useEffect(() => {
    if (consultations && isSuccess && !checkConsultations.isSearching && !checkConsultations.isPaginated)
      setContents(consultations.filter(p => p?.fullName.toLowerCase().includes(search.toLowerCase())))
    else if (paginatedConsults && !checkConsultations.isSearching && checkConsultations.isPaginated)
      setContents(paginatedConsults.filter(p => p?.fullName.toLowerCase().includes(search.toLowerCase())))
    else if (paginatedConsults2 && checkConsultations.isSearching && !checkConsultations.isPaginated)
      setContents(paginatedConsults2.filter(p => p?.fullName.toLowerCase().includes(search.toLowerCase())))
  }, [consultations, search, checkConsultations, paginatedConsults, paginatedConsults2, isSuccess])

  return (
    <>
      <AppDataTableStripped
        loader={isLoading || isFetching2 || isFetching4}
        title='Fiches de consultation'
        thead={
          <AppTHead
            loader={isLoading || isFetching2}
            isFetching={isFetching || isFetching2 || isFetching3 || isFetching4}
            onRefresh={onRefresh}
            items={thead}/>}
        tbody={
          <tbody>
          {contents.length > 0 && contents.map(consult => <ConsultationItem2 key={consult?.id} consult={consult}/>)}
          </tbody>
        }
        overview={
          <>
            {totalResearchConsultations > 0 && checkConsultations.isSearching &&
              <p>Au total
                <code className='mx-1 me-1'>{parseInt(totalResearchConsultations.toLocaleString())}</code>
                fiche(s) trouvée(s) suite à votre recherche ⏩ <b>"{tempSearch}"</b> :
              </p>}
            {totalResearchConsultations < 1 && checkConsultations.isSearching &&
              <p>Aucun élément trouvé suite à votre recherche ⏩ <b>"{tempSearch}"</b> :</p>}

            <Col md={5} className='mb-2'>
              <Form onSubmit={onDeepSearch}>
                <Form.Control
                  disabled={isFetching3}
                  name='search'
                  autoComplete='off'
                  value={search}
                  onChange={handleSearch}
                  placeholder='Rechercher' />
              </Form>
            </Col>

            {user && allowActionsToPatients(user?.roles[0]) &&
              <Col className='text-md-end'>
                <Button type='button' className='me-1 mb-2' onClick={toggleShow}>
                  <i className='bi bi-person-plus'/> Patient(e)
                </Button>

                <Button type='button' variant='success' className='mb-2' onClick={toggleShow2}>
                  <i className='bi bi-plus'/> Anamnèse & signes vitaux
                </Button>
              </Col>}
          </>
        } />
      {consultationsPages > 1 && isSuccess && consultations && !checkConsultations.isSearching &&
        <AppPaginationComponent
          nextLabel=''
          previousLabel=''
          pageCount={consultationsPages}
          currentPage={page - 1}
          onPaginate={handlePagination} />}
      {researchConsultationsPages > 1 && isSuccess && consultations && checkConsultations.isSearching &&
        <AppPaginationComponent
          nextLabel=''
          previousLabel=''
          pageCount={researchConsultationsPages}
          currentPage={page - 1}
          onPaginate={handlePagination2} />}
      {errors && <div className='mb-3'>{errors}</div>}
      {isError2 && <div className='mb-3'><AppMainError/></div>}
      {isError3 && <div className='mb-3'><AppMainError/></div>}
      {isError4 && <div className='mb-3'><AppMainError/></div>}

      <AppAddModal
        loader={isPatientLoading}
        className='bg-light'
        onHide={toggleShow}
        show={show}
        title={<><i className='bi bi-person-plus'/> Enregistrer un(e) patient(e)</>}>
        <AddPatientForm
          onReset={onResetPatientData}
          patient={patient}
          setPatient={setPatient}
          apiErrors={patientErrors}
          onSubmit={onSubmitPatientData}
          loader={isPatientLoading} />
      </AppAddModal>

      <AppLgModal
        loader={isConsultLoading}
        show={show2}
        onClick={onSubmitConsultData}
        onHide={toggleShow2}
        title={<><i className='bi bi-plus'/> Anamnèse & signes vitaux</>}
        className='bg-light'>
        <AddConsultForm
          loader={isConsultLoading}
          onReset={onResetConsultData}
          consult={consult}
          apiErrors={consultErrors}
          setConsult={setConsult} />
      </AppLgModal>
    </>
  )
}
