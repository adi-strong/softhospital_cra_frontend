import {useState} from "react";
import {AppDataTableStripped, AppDelModal, AppMainError, AppTHead} from "../../components";
import {Badge, Button, ButtonGroup, Col, Form, InputGroup} from "react-bootstrap";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {AddExams} from "./AddExams";
import {useDeleteExamMutation, useGetExamsQuery} from "./examApiSlice";
import {limitStrTo} from "../../services";
import {useSelector} from "react-redux";
import toast from "react-hot-toast";
import {EditExam} from "./EditExam";

const ExamItem = ({id, currency}) => {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteExam, {isLoading}] = useDeleteExamMutation()
  const { exam } = useGetExamsQuery('Exam', {
    selectFromResult: ({ data }) => ({ exam: data.entities[id] })
  })

  const toggleEditModal = () => setShowEdit(!showEdit)
  const toggleDeleteModal = () => setShowDelete(!showDelete)

  async function onDelete() {
    toggleDeleteModal()
    try {
      const formData = await deleteExam(exam)
      if (!formData.error) toast.success('Suppression bien efféctuée.', {icon: '😶'})
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

      <EditExam onHide={toggleEditModal} show={showEdit} currency={currency} data={exam} />
      <AppDelModal
        show={showDelete}
        onHide={toggleDeleteModal}
        onDelete={onDelete}
        text={
          <p>
            Êtes-vous certain(e) de vouloir supprimer l'examen <br/>
            <i className='bi bi-quote me-1'/>
            <span className="fw-bold text-uppercase">{exam.wording}</span>
            <i className='bi bi-quote mx-1'/>
          </p>
        } />
    </>
  )
}

export const ExamsList = () => {
  const [keywords, setKeywords] = useState({search: ''})
  const [showNew, setShowNew] = useState(false)
  const { fCurrency } = useSelector(state => state.parameters)
  const {data: exams = [], isLoading, isFetching, isSuccess, isError, refetch} = useGetExamsQuery('Exam')

  let content, errors
  if (isError) errors = <AppMainError/>
  else if (isSuccess) content = exams && exams.ids.map(id => <ExamItem key={id} id={id} currency={fCurrency}/>)

  const handleToggleNewExam = () => setShowNew(!showNew)

  const onRefresh = async () => await refetch()

  function handleSubmit(e) {
    e.preventDefault()
  } // submit search keywords

  return (
    <>
      <AppDataTableStripped
        loader={isLoading}
        title='Liste des examens disponibles'
        overview={
          <>
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
                <InputGroup>
                  <Form.Control
                    placeholder='Votre recherche ici...'
                    aria-label='Votre recherche ici...'
                    autoComplete='off'
                    disabled={exams.length < 1}
                    name='search'
                    value={keywords.search}
                    onChange={(e) => handleChange(e, keywords, setKeywords)} />
                  <Button type='submit' variant='light' disabled={exams.length < 1}>
                    <i className='bi bi-search'/>
                  </Button>
                </InputGroup>
              </form>
            </Col> {/* search form for patients */}
          </>
        }
        thead={<AppTHead isImg loader={isLoading} isFetching={isFetching} onRefresh={onRefresh} items={[
          {label: '#'},
          {label: 'Libéllé'},
          {label: 'Catégorie'},
          {label: 'Prix'},
        ]}/>}
        tbody={<tbody>{content}</tbody> } />

      {errors && errors}

      <AddExams onHide={handleToggleNewExam} show={showNew} currency={fCurrency} />
    </>
  )
}
