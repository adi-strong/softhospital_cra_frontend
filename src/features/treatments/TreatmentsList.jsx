import {useState} from "react";
import {AppDataTableStripped, AppDelModal, AppMainError, AppTHead} from "../../components";
import {Badge, Button, ButtonGroup, Col, Form, InputGroup} from "react-bootstrap";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {AddTreatments} from "./AddTreatments";
import {limitStrTo} from "../../services";
import {useDeleteTreatmentMutation, useGetTreatmentsQuery} from "./treatmentApiSlice";
import toast from "react-hot-toast";
import {EditTreatment} from "./EditTreatment";

const TreatmentItem = ({id, currency}) => {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteTreatment, {isLoading}] = useDeleteTreatmentMutation()
  const { treatment } = useGetTreatmentsQuery('Treatment', {
    selectFromResult: ({ data }) => ({ treatment: data.entities[id] })
  })

  const toggleEditModal = () => setShowEdit(!showEdit)
  const toggleDeleteModal = () => setShowDelete(!showDelete)

  async function onDelete() {
    toggleDeleteModal()
    try {
      const formData = await deleteTreatment(treatment)
      if (!formData.error) toast.success('Suppression bien efféctuée.', {icon: '😶'})
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

      <EditTreatment currency={currency} data={treatment} show={showEdit} onHide={toggleEditModal} />
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

export const TreatmentsList = ({currency}) => {
  const [keywords, setKeywords] = useState({search: ''})
  const [showNew, setShowNew] = useState(false)
  const {data: treatments = [], isLoading, isFetching, isSuccess, isError, refetch} = useGetTreatmentsQuery('Treatment')

  let content, errors
  if (isError) errors = <AppMainError/>
  else if (isSuccess) content = treatments && treatments.ids.map(id =>
    <TreatmentItem key={id} id={id} currency={currency}/>)

  const handleToggleNewTreatments = () => setShowNew(!showNew)

  const onRefresh = async () => await refetch()

  function handleSubmit(e) {
    e.preventDefault()
  } // submit search keywords

  return (
    <>
      <AppDataTableStripped
        loader={isLoading}
        title='Liste de traitements'
        overview={
          <>
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
                <InputGroup>
                  <Form.Control
                    placeholder='Votre recherche ici...'
                    aria-label='Votre recherche ici...'
                    autoComplete='off'
                    disabled={treatments.length < 1}
                    name='search'
                    value={keywords.search}
                    onChange={(e) => handleChange(e, keywords, setKeywords)} />
                  <Button type='submit' variant='light' disabled={treatments.length < 1}>
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
        tbody={<tbody>{content}</tbody>} />

      {errors && errors}

      <AddTreatments onHide={handleToggleNewTreatments} show={showNew} />
    </>
  )
}
