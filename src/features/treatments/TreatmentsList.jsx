import {useEffect, useState} from "react";
import {AppDataTableStripped, AppDelModal, AppMainError, AppPaginationComponent, AppTHead} from "../../components";
import {Badge, Button, ButtonGroup, Col, Form} from "react-bootstrap";
import {AddTreatments} from "./AddTreatments";
import {limitStrTo} from "../../services";
import {
  researchTreatmentsPages, totalResearchTreatments,
  treatmentsPages,
  useDeleteTreatmentMutation,
  useGetTreatmentsQuery,
  useLazyGetResearchTreatmentsByPaginationQuery,
  useLazyGetResearchTreatmentsQuery,
  useLazyGetTreatmentsByPaginationQuery
} from "./treatmentApiSlice";
import toast from "react-hot-toast";
import {EditTreatment} from "./EditTreatment";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";

const TreatmentItem = ({ treatment, currency, onRefresh }) => {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteTreatment, {isLoading}] = useDeleteTreatmentMutation()

  const toggleEditModal = () => setShowEdit(!showEdit)
  const toggleDeleteModal = () => setShowDelete(!showDelete)

  async function onDelete() {
    toggleDeleteModal()
    try {
      const formData = await deleteTreatment(treatment)
      if (!formData.error) {
        toast.success('Suppression bien efféctuée.', {icon: '😶'})
        onRefresh()
      }
    }
    catch (e) { toast.error(e.message) }
  }

  return (
    <>
      <tr>
        <td><i className='bi bi-clipboard-pulse'/></td>
        <th scope='row'>#{treatment.id}</th>
        <td className='text-uppercase' title={treatment.wording}>{limitStrTo(30, treatment.wording)}</td>
        <td className='text-uppercase' title={treatment?.category ? treatment.category.name : ''}>
          {treatment?.category ?<Badge>{limitStrTo(18, treatment.category.name)}</Badge> : '❓'}
        </td>
        <th scope='row'>
          <span className='me-1 text-secondary'>{currency && currency.value}</span>
          {parseFloat(treatment.price).toFixed(2).toLocaleString()}
        </th>
        <td className='text-md-end'>
          <ButtonGroup size='sm'>
            <Button
              type='button'
              variant='light'
              title='Modification'
              disabled={isLoading}
              onClick={toggleEditModal}>
              <i className='bi bi-pencil-square text-primary'/>
            </Button>
            <Button
              size='sm'
              variant='light'
              type='button'
              title='Suppression'
              disabled={isLoading}
              onClick={toggleDeleteModal}>
              <i className='bi bi-trash3 text-danger'/>
            </Button>
          </ButtonGroup>
        </td>
      </tr>

      <EditTreatment
        currency={currency}
        data={treatment}
        show={showEdit}
        onHide={toggleEditModal}
        onRefresh={onRefresh} />
      <AppDelModal
        show={showDelete}
        onHide={toggleDeleteModal}
        onDelete={onDelete}
        text={
          <p>
            Êtes-vous certain(e) de vouloir supprimer le traitement <br/>
            <i className='bi bi-quote me-1'/>
            <span className="fw-bold text-uppercase">{treatment.wording}</span>
            <i className='bi bi-quote mx-1'/>
          </p>
        } />
    </>
  )
}

export const TreatmentsList = ({ currency }) => {
  const [showNew, setShowNew] = useState(false)
  const {data: treatments = [], isLoading, isFetching, isSuccess, isError, refetch} = useGetTreatmentsQuery('Treatment')

  const [contents, setContents] = useState([])
  const [search, setSearch] = useState('')
  const [tempSearch, setTempSearch] = useState('')
  const [page, setPage] = useState(1)
  const [checkTreatments, setCheckTreatments] = useState({isSearching: false, isPaginated: false,})

  const handleToggleNewTreatments = () => setShowNew(!showNew)

  const [paginatedTreatments, setPaginatedTreatments] = useState([])
  const [researchPaginatedTreatments, setResearchPaginatedTreatments] = useState([])

  const [getTreatmentsByPagination, {isFetching: isFetching2, isError: isError2,}] = useLazyGetTreatmentsByPaginationQuery()
  const [getResearchTreatments, {isFetching: isFetching3, isError: isError3,}] = useLazyGetResearchTreatmentsQuery()
  const [getResearchTreatmentsByPagination, {
    isFetching: isFetching4,
    isError: isError4,
  }] = useLazyGetResearchTreatmentsByPaginationQuery()

  async function handlePagination(pagination) {
    const param = pagination + 1
    setPage(param)
    setCheckTreatments({isSearching: false, isPaginated: true})
    const { data: searchData, isSuccess } = await getTreatmentsByPagination(param)
    if (isSuccess && searchData) {
      setPaginatedTreatments(searchData)
    }
  } // handle main pagination

  async function handlePagination2(pagination) {
    const param = pagination + 1
    const keywords = {page: param, keyword: tempSearch}
    setPage(param)
    setCheckTreatments({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchTreatmentsByPagination(keywords)
    if (isSuccess && searchData) {
      setResearchPaginatedTreatments(searchData)
    }
  } // 2nd handle main pagination

  async function handleSubmit(e) {
    e.preventDefault()
    setPage(1)
    setTempSearch(search)
    setSearch('')
    setCheckTreatments({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchTreatments(search)
    if (isSuccess && searchData) {
      setResearchPaginatedTreatments(searchData)
    }
  } // submit search keywords

  const onRefresh = async () => {
    setCheckTreatments({isSearching: false, isPaginated: false})
    setSearch('')
    setTempSearch('')
    setPage(1)
    await refetch()
  }

  useEffect(() => {
    if (!checkTreatments.isSearching && !checkTreatments.isPaginated && isSuccess && treatments) {
      const items = treatments.ids?.map(id => { return treatments?.entities[id] })
      setContents(items?.filter(f => f?.wording.toLowerCase().includes(search.toLowerCase())))
    }
    else if (!checkTreatments.isSearching && checkTreatments.isPaginated && isSuccess && treatments)
      setContents(paginatedTreatments?.filter(f => f?.wording.toLowerCase().includes(search.toLowerCase())))
    else if (checkTreatments.isSearching && !checkTreatments.isPaginated && isSuccess && treatments)
      setContents(researchPaginatedTreatments?.filter(f => f?.wording.toLowerCase().includes(search.toLowerCase())))
  }, [
    checkTreatments,
    isSuccess,
    treatments,
    search,
    researchPaginatedTreatments,
    paginatedTreatments,
  ])

  return (
    <>
      <AppDataTableStripped
        loader={isLoading || isFetching2 || isFetching4}
        title='Liste de traitements'
        overview={
          <>
            {checkTreatments.isSearching &&
              <p>
                Au total
                <code className="mx-1 me-1">{totalResearchTreatments.toLocaleString()}</code>
                traitement(s) suite à votre recherche ⏩ <b>{tempSearch}</b> :
              </p>}

            <Col md={3}>
              <Button
                type='button'
                title='Enregistrer un traitement'
                className='mb-1 me-1'
                onClick={handleToggleNewTreatments}>
                <i className='bi bi-plus'/> Enregistrer
              </Button>
            </Col> {/* add new patient and printing's launch button */}
            <Col className='text-md-end'>
              <form onSubmit={handleSubmit}>
                <Form.Control
                  placeholder='Votre recherche ici...'
                  aria-label='Votre recherche ici...'
                  autoComplete='off'
                  disabled={isFetching3}
                  name='search'
                  value={search}
                  onChange={({ target }) => setSearch(target.value)} />
              </form>
            </Col> {/* search form for patients */}
          </>
        }
        thead={
        <AppTHead
          isImg
          loader={isLoading || isFetching2 || isFetching4 || isFetching3}
          isFetching={isFetching || isFetching2 || isFetching4 || isFetching3}
          onRefresh={onRefresh}
          items={[
            {label: '#'},
            {label: 'Libéllé'},
            {label: 'Catégorie'},
            {label: 'Prix'},
          ]}/>}
        tbody={
          <tbody>
            {!isLoading && contents.length > 0 && contents.map(item =>
              <TreatmentItem key={item?.id} treatment={item} onRefresh={onRefresh} currency={currency}/>)}
          </tbody>} />

      {isLoading || isFetching || isFetching2 || isFetching3 || isFetching4
        ? <BarLoaderSpinner loading={isLoading || isFetching || isFetching2 || isFetching3 || isFetching4}/>
        : (
          <>
            {treatmentsPages > 1 && isSuccess && treatments
              && !checkTreatments.isSearching &&
              <AppPaginationComponent
                nextLabel=''
                previousLabel=''
                onPaginate={handlePagination}
                currentPage={page - 1}
                pageCount={treatmentsPages} />}

            {researchTreatmentsPages > 1 && isSuccess && treatments && checkTreatments.isSearching &&
              <AppPaginationComponent
                nextLabel=''
                previousLabel=''
                onPaginate={handlePagination2}
                currentPage={page - 1}
                pageCount={researchTreatmentsPages} />}
          </>
        )}

      {isError && <div className='mb-3'><AppMainError/></div>}
      {isError2 && <div className='mb-3'><AppMainError/></div>}
      {isError3 && <div className='mb-3'><AppMainError/></div>}
      {isError4 && <div className='mb-3'><AppMainError/></div>}

      <AddTreatments onHide={handleToggleNewTreatments} show={showNew} />
    </>
  )
}
