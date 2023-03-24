import {useEffect, useState} from "react";
import {AppDataTableStripped, AppDelModal, AppMainError, AppPaginationComponent, AppTHead} from "../../components";
import {Badge, Button, ButtonGroup, Col, Form} from "react-bootstrap";
import {AddExams} from "./AddExams";
import {
  examsPages, researchExamsPages, totalResearchExams,
  useDeleteExamMutation,
  useGetExamsQuery,
  useLazyGetExamsByPaginationQuery, useLazyGetResearchExamsByPaginationQuery,
  useLazyGetResearchExamsQuery
} from "./examApiSlice";
import {limitStrTo} from "../../services";
import {useSelector} from "react-redux";
import toast from "react-hot-toast";
import {EditExam} from "./EditExam";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";

const ExamItem = ({ exam, currency, onRefresh }) => {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteExam, {isLoading}] = useDeleteExamMutation()

  const toggleEditModal = () => setShowEdit(!showEdit)
  const toggleDeleteModal = () => setShowDelete(!showDelete)

  async function onDelete() {
    toggleDeleteModal()
    try {
      const formData = await deleteExam(exam)
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
        <td><i className='bi bi-prescription2'/></td>
        <th scope='row'>#{exam.id}</th>
        <td className='text-uppercase'>{limitStrTo(25, exam.wording)}</td>
        <td className='text-uppercase' title={exam?.category ? exam.category.name : ''}>
          {exam?.category
            ? <Badge>{limitStrTo(15, exam.category.name)}</Badge>
            : '❓'}
        </td>
        <th scope='row'>
          {exam?.price
            ? <><span className="text-secondary me-1">{currency && currency.value}</span>
              {parseFloat(exam.price).toFixed(2).toLocaleString()}</>
            : '❓'}
        </th>
        <td className='text-md-end'>
          <ButtonGroup size='sm'>
            <Button type='button' variant='light' title='Modification' disabled={isLoading} onClick={toggleEditModal}>
              <i className='bi bi-pencil-square text-primary'/>
            </Button>
            <Button size='sm' variant='light' type='button' title='Suppression' disabled={isLoading} onClick={toggleDeleteModal}>
              <i className='bi bi-trash3 text-danger'/>
            </Button>
          </ButtonGroup>
        </td>
      </tr>

      <EditExam
        onHide={toggleEditModal}
        onRefresh={onRefresh}
        show={showEdit}
        currency={currency}
        data={exam} />
      <AppDelModal
        show={showDelete}
        onHide={toggleDeleteModal}
        onDelete={onDelete}
        text={
          <p>
            Êtes-
            vous certain(e) de vouloir supprimer l'examen <br/>
            <i className='bi bi-quote me-1'/>
            <span className="fw-bold text-uppercase">{exam.wording}</span>
            <i className='bi bi-quote mx-1'/>
          </p>
        } />
    </>
  )
}

export const ExamsList = () => {
  const [search, setSearch] = useState('')
  const [showNew, setShowNew] = useState(false)
  const {data: exams = [], isLoading, isFetching, isSuccess, isError, refetch} = useGetExamsQuery('Exam')
  const { fCurrency } = useSelector(state => state.parameters)

  const [contents, setContents] = useState([])

  const [tempSearch, setTempSearch] = useState('')
  const [page, setPage] = useState(1)
  const [checkExams, setCheckExams] = useState({isSearching: false, isPaginated: false,})

  const handleToggleNewExam = () => setShowNew(!showNew)

  const [paginatedExams, setPaginatedExams] = useState([])
  const [researchExams, setResearchExams] = useState([])

  const [getExamsByPagination, {isFetching: isFetching2, isError: isError2,}] = useLazyGetExamsByPaginationQuery()
  const [getResearchExams, {isFetching: isFetching3, isError: isError3,}] = useLazyGetResearchExamsQuery()
  const [getResearchExamsByPagination, {
    isFetching: isFetching4,
    isError: isError4,
  }] = useLazyGetResearchExamsByPaginationQuery()

  async function handlePagination(pagination) {
    const param = pagination + 1
    setPage(param)
    setCheckExams({isSearching: false, isPaginated: true})
    const { data: searchData, isSuccess } = await getExamsByPagination(param)
    if (isSuccess && searchData) {
      setPaginatedExams(searchData)
    }
  } // handle main pagination

  async function handlePagination2(pagination) {
    const param = pagination + 1
    const keywords = {page: param, keyword: tempSearch}
    setPage(param)
    setCheckExams({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchExamsByPagination(keywords)
    if (isSuccess && searchData) {
      setResearchExams(searchData)
    }
  } // 2nd handle main pagination

  async function handleSubmit(e) {
    e.preventDefault()
    setPage(1)
    setTempSearch(search)
    setSearch('')
    setCheckExams({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchExams(search)
    if (isSuccess && searchData) {
      setResearchExams(searchData)
    }
  } // submit search keywords

  const onRefresh = async () => {
    setCheckExams({isSearching: false, isPaginated: false})
    setSearch('')
    setTempSearch('')
    setPage(1)
    await refetch()
  }

  useEffect(() => {
    if (!checkExams.isSearching && !checkExams.isPaginated && isSuccess && exams)
      setContents(exams.filter(f => f?.wording.toLowerCase().includes(search.toLowerCase())))
    else if (!checkExams.isSearching && checkExams.isPaginated && isSuccess && exams)
      setContents(paginatedExams?.filter(f => f?.wording.toLowerCase().includes(search.toLowerCase())))
    else if (checkExams.isSearching && !checkExams.isPaginated && isSuccess && exams)
      setContents(researchExams?.filter(f => f?.wording.toLowerCase().includes(search.toLowerCase())))
  }, [
    checkExams,
    isSuccess,
    exams,
    search,
    researchExams,
    paginatedExams,
  ])

  return (
    <>
      <AppDataTableStripped
        loader={isLoading || isFetching2 || isFetching4}
        title='Liste des examens disponibles'
        overview={
          <>
            {(checkExams.isSearching || checkExams.isSearching2) &&
              <p>
                Au total
                <code className="me-1 mx-1">{totalResearchExams.toLocaleString()}</code>
                examen(s) trouvé(s) suite à votre recherche ⏩ <b>{tempSearch}</b> :
              </p>}

            <Col md={3}>
              <Button
                type='button'
                title='Enregistrer un acte médical'
                className='mb-1 me-1'
                onClick={handleToggleNewExam}>
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
            loader={isLoading || isFetching2 || isFetching4}
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
            {!isLoading && contents.length > 0 && contents.map(exam =>
              <ExamItem
                key={exam?.id}
                onRefresh={onRefresh}
                exam={exam}
                currency={fCurrency}
                isFetching={isFetching}/>)}
          </tbody> } />

      {isLoading || isFetching || isFetching2 || isFetching3 || isFetching4
        ? <BarLoaderSpinner loading={isLoading || isFetching || isFetching2 || isFetching3 || isFetching4}/>
        : (
          <>
            {examsPages > 1 && isSuccess && exams
              && !checkExams.isSearching &&
              <AppPaginationComponent
                nextLabel=''
                previousLabel=''
                onPaginate={handlePagination}
                currentPage={page - 1}
                pageCount={examsPages} />}

            {researchExamsPages > 1 && isSuccess && exams && checkExams.isSearching &&
              <AppPaginationComponent
                nextLabel=''
                previousLabel=''
                onPaginate={handlePagination2}
                currentPage={page - 1}
                pageCount={researchExamsPages} />}
          </>
        )}

      {isError && <div className='mb-3'><AppMainError/></div>}
      {isError2 && <div className='mb-3'><AppMainError/></div>}
      {isError3 && <div className='mb-3'><AppMainError/></div>}
      {isError4 && <div className='mb-3'><AppMainError/></div>}

      <AddExams onHide={handleToggleNewExam} show={showNew} currency={fCurrency} />
    </>
  )
}
