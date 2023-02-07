import {useState} from "react";
import {AppDataTableStripped, AppDelModal, AppMainError, AppTHead} from "../../components";
import {Button, ButtonGroup, Col, Form, InputGroup} from "react-bootstrap";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {useDeleteConsultationTypeMutation, useGetConsultationTypesQuery} from "./consultationTypeApiSlice";
import {EditFileType} from "./EditFileType";
import toast from "react-hot-toast";
import {useSelector} from "react-redux";

const FileItem = ({id, currency, onDelete}) => {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteConsultationType, {isLoading}] = useDeleteConsultationTypeMutation()
  const { file } = useGetConsultationTypesQuery('ConsultationType', {
    selectFromResult: ({ data }) => ({ file: data.entities[id] })
  })

  const toggleEditModal = () => setShowEdit(!showEdit)
  const toggleDeleteModal = () => setShowDelete(!showDelete)

  return (
    <>
      <tr>
        <td><i className='bi bi-file-medical'/></td>
        <th scope='row'>#{file.id}</th>
        <td className='text-uppercase'>{file.wording}</td>
        <td className='text-capitalize fw-bolder'>
          <span className='text-secondary me-1'>{currency && currency.value}</span>
          {parseFloat(file.price).toFixed(2).toLocaleString()}
        </td>
        <td className='text-end'>
          <ButtonGroup size='sm'>
            <Button type='button' variant='light' title='Modifier' disabled={isLoading} onClick={toggleEditModal}>
              <i className='bi bi-pencil-square text-primary'/>
            </Button>
            <Button type='button' variant='light' title='Supprimer' disabled={isLoading} onClick={toggleDeleteModal}>
              <i className='bi bi-trash3 text-danger'/>
            </Button>
          </ButtonGroup>
        </td>
      </tr>

      <EditFileType onHide={toggleEditModal} show={showEdit} data={file} currency={currency} />
      <AppDelModal
        onHide={toggleDeleteModal}
        show={showDelete}
        onDelete={() => onDelete(file, deleteConsultationType, toggleDeleteModal)}
        text={
          <p>
            Êtes-vous certain(e) de vouloir supprimer ce type de fiche <br/>
            <i className='bi bi-quote me-1'/>
            <span className="fw-bold text-uppercase">{file.wording}</span>
            <i className='bi bi-quote mx-1'/>
          </p>
        } />
    </>
  )
}

export const FilesList = () => {
  const [keywords, setKeywords] = useState({search: ''})
  const { fCurrency } = useSelector(state => state.parameters)
  const {data: fileTypes = [], isLoading, isFetching, isSuccess, isError, refetch} = useGetConsultationTypesQuery('ConsultationType')

  const onDelete = async (file, func, onHide) => {
    onHide()
    try {
      await func(file)
    }
    catch (e) { toast.error(e.message) }
  }

  let content, errors
  if (isError) errors = <AppMainError/>
  else if (isSuccess) content = fileTypes && fileTypes.ids.map(id =>
    <FileItem key={id} id={id} onDelete={onDelete} currency={fCurrency}/>)

  const onRefresh = async () => await refetch()

  function handleSubmit(e) {
    e.preventDefault()
  } // submit search keywords

  return (
    <>
      <AppDataTableStripped
        loader={isLoading}
        title='Liste de types des fiches'
        overview={
          <>
            <Col className='text-md-end'>
              <form onSubmit={handleSubmit}>
                <InputGroup>
                  <Form.Control
                    placeholder='Votre recherche ici...'
                    aria-label='Votre recherche ici...'
                    autoComplete='off'
                    disabled={fileTypes.length < 1}
                    name='search'
                    value={keywords.search}
                    onChange={(e) => handleChange(e, keywords, setKeywords)} />
                  <Button type='submit' variant='light' disabled={fileTypes.length < 1}>
                    <i className='bi bi-search'/>
                  </Button>
                </InputGroup>
              </form>
            </Col> {/* search form for patients */}
          </>
        }
        thead={<AppTHead isImg loader={isLoading} isFetching={isFetching} onRefresh={onRefresh} items={[
          {label: '#'}, {label: 'Libellé'}, {label: 'Prix'}
        ]}/>}
        tbody={<tbody>{content}</tbody>} />
      {errors && errors}
    </>
  )
}
