import {useState} from "react";
import {AppDataTableStripped, AppDelModal, AppMainError, AppTHead} from "../../components";
import {Badge, Button, ButtonGroup, Col, Form, InputGroup} from "react-bootstrap";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {AddActs} from "./AddActs";
import {useDeleteActMutation, useGetActsQuery} from "./actApiSlice";
import {useSelector} from "react-redux";
import {limitStrTo} from "../../services";
import toast from "react-hot-toast";
import {EditAct} from "./EditAct";

const ActItem = ({id, currency}) => {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteAct, {isLoading}] = useDeleteActMutation()
  const { act } = useGetActsQuery('Act', {
    selectFromResult: ({ data }) => ({ act: data.entities[id] })
  })

  const toggleEditModal = () => setShowEdit(!showEdit)
  const toggleDeleteModal = () => setShowDelete(!showDelete)

  async function onDelete() {
    toggleDeleteModal()
    try {
      const formData = await deleteAct(act)
      if (!formData.error) toast.success('Suppression bien efféctuée.', {icon: '😶'})
    }
    catch (e) { toast.error(e.message) }
  }

  return (
    <>
      <tr>
        <td><i className='bi bi-file-earmark-medical'/></td>
        <th>#{act.id}</th>
        <td className='text-uppercase' title={act.wording}>{limitStrTo(30, act.wording)}</td>
        <td className='fw-bold'>
          {act.price
            ? <><span className='text-secondary me-1'>{currency && currency.value}</span>
              {parseFloat(act.price).toFixed(2).toLocaleString()}</>
            : '❓'}
        </td>
        <td className='text-uppercase' title={act?.category ? act.category.name : ''}>
          {act?.category
            ? <Badge>{limitStrTo(18, act.category.name)}</Badge>
            : '❓'}
        </td>
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

      <EditAct onHide={toggleEditModal} show={showEdit} data={act} currency={currency} />
      <AppDelModal
        show={showDelete}
        onHide={toggleDeleteModal}
        onDelete={onDelete}
        text={
          <p>
            Êtes-vous certain(e) de vouloir supprimer l'acte médical <br/>
            <i className='bi bi-quote me-1'/>
            <span className="fw-bold text-uppercase">{act.wording}</span>
            <i className='bi bi-quote mx-1'/>
          </p>
        } />
    </>
  )
}

export const ActsList = () => {
  const [keywords, setKeywords] = useState({search: ''})
  const [showNew, setShowNew] = useState(false)
  const { fCurrency } = useSelector(state => state.parameters)
  const {data: acts = [], isLoading, isFetching, isSuccess, isError, refetch} = useGetActsQuery('Act')

  let content, errors
  if (isError) errors = <AppMainError/>
  else if (isSuccess) content = acts && acts.ids.map(id => <ActItem key={id} id={id} currency={fCurrency}/>)

  const handleToggleNewAct = () => setShowNew(!showNew)

  const onRefresh = async () => await refetch()

  function handleSubmit(e) {
    e.preventDefault()
  } // submit search keywords

  return (
    <>
      <AppDataTableStripped
        loader={isLoading}
        title='Liste des actes médicaux'
        overview={
          <>
            <Col md={3}>
              <Button
                type='button'
                title='Enregistrer un acte médical'
                className='mb-1 me-1'
                onClick={handleToggleNewAct}>
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
                    disabled={acts.length < 1}
                    name='search'
                    value={keywords.search}
                    onChange={(e) => handleChange(e, keywords, setKeywords)} />
                  <Button type='submit' variant='light' disabled={acts.length < 1}>
                    <i className='bi bi-search'/>
                  </Button>
                </InputGroup>
              </form>
            </Col> {/* search form for patients */}
          </>
        }
        thead={<AppTHead onRefresh={onRefresh} loader={isLoading} isFetching={isFetching} isImg items={[
          {label: '#'},
          {label: "Libéllé"},
          {label: 'Prix'},
          {label: 'Catégorie'},
        ]}/>}
        tbody={<tbody>{content}</tbody>} />

      {errors && errors}

      <AddActs show={showNew} onHide={handleToggleNewAct} currency={fCurrency} />
    </>
  )
}
