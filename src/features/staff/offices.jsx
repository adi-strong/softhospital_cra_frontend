import {useState} from "react";
import {AppBreadcrumb, AppDataTableStripped, AppDelModal, AppHeadTitle, AppTHead} from "../../components";
import {Alert, Button, ButtonGroup, Card, Col, Form, InputGroup, Row} from "react-bootstrap";
import {ParametersOverView} from "../parameters/ParametersOverView";
import {useDeleteOfficeMutation, useGetOfficesQuery} from "./officeApiSlice";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {AddOffice} from "./AddOffice";
import {EditOffice} from "./EditOffice";
import toast from "react-hot-toast";

function OfficeItem({id}) {
  const {office} = useGetOfficesQuery('Offices', {
    selectFromResult: ({ data }) => ({ office: data.entities[id] })
  })
  const [show, setShow] = useState(false)
  const [show2, setShow2] = useState(false)
  const [deleteOffice, {isLoading}] = useDeleteOfficeMutation()

  const toggleEditModal = () => setShow(!show)
  const toggleDelModal = () => setShow2(!show2)

  const onDelete = async () => {
    toggleDelModal()
    try {
      const data = await deleteOffice(office)
      if (!data.error) toast.custom('Suppression bien efféctuée.', { icon: '😶' })
    } catch (e) { toast.error(e.message) }
  }

  return (
    <>
      <tr>
        <th/>
        <th scope='row'>#{office.id}</th>
        <td className='text-uppercase'>{office.title}</td>
        <td>{office?.createdAt ? office.createdAt : '❓'}</td>
        <td className='text-end'>
          <ButtonGroup size='sm'>
            <Button type='button' variant='light' onClick={toggleEditModal} disabled={isLoading}>
              <i className='bi bi-pencil-square text-primary'/>
            </Button>
            <Button type='button' variant='light' disabled={isLoading} onClick={toggleDelModal}>
              <i className='bi bi-trash3 text-danger'/>
            </Button>
          </ButtonGroup>
        </td>
      </tr>

      <AppDelModal
        show={show2}
        onHide={toggleDelModal}
        text={
          <p>
            Êtes-vous certain de vouloir supprimer la fonction <br/>
            <i className='bi bi-quote me-1'/>
            <span className='text-uppercase fw-bold'>{office.title}</span>
            <i className='bi bi-quote mx-1'/>
          </p>
        }
        onDelete={onDelete} />
      <EditOffice data={office} show={show} onHide={toggleEditModal} />
    </>
  )
}

function Offices() {
  const {data: offices = [], isLoading, isSuccess, isFetching, isError, refetch} = useGetOfficesQuery('Offices')
  const [keywords, setKeywords] = useState({search: ''})
  const [showNew, setShowNew] = useState(false)

  let content, error
  if (isSuccess) content = offices ? offices.ids.map(id => <OfficeItem key={id} id={id}/>) : []
  else if (isError) error =
    <Alert variant='danger'>
      <p>
        Une erreur est survenue. <br/>
        Veuillez soit recharger la page soit vous reconnecter <i className='bi bi-exclamation-triangle-fill'/>
      </p>
    </Alert>

  const onRefresh = async () => await refetch()

  const toggleModal = () => setShowNew(!showNew)

  function handleSubmit(e) {
    e.preventDefault()
  } // submit search keywords

  return (
    <>
      <AppHeadTitle title='Fonctions' />
      <AppBreadcrumb title='Fonctions' />
      <section className='section profile'>
        <Row>
          <Col xl={4}>
            <Card className='border-0'>
              <Card.Body className='profile-card pt-4 d-flex flex-column align-items-center'>
                <ParametersOverView />
              </Card.Body>
            </Card>
          </Col>
          <Col md={8}>
            <Card className='border-0'>
              <Card.Body>
                <AppDataTableStripped
                  overview={
                    <>
                      <Col md={8} className='mb-2'>
                        <form onSubmit={handleSubmit}>
                          <InputGroup>
                            <Button type='submit' variant='light' disabled={offices.length < 1}>
                              <i className='bi bi-search'/>
                            </Button>
                            <Form.Control
                              placeholder='Votre recherche ici...'
                              aria-label='Votre recherche ici...'
                              autoComplete='off'
                              disabled={offices.length < 1 || isFetching}
                              name='search'
                              value={keywords.search}
                              onChange={(e) => handleChange(e, keywords, setKeywords)} />
                          </InputGroup>
                        </form>
                      </Col>
                      <Col md={4} className='text-md-end mb-2'>
                        <Button
                          type='button'
                          title='Ajouter une fonction'
                          className='mb-1 me-1'
                          onClick={toggleModal}>
                          <i className='bi bi-plus'/> Ajouter une fonction
                        </Button>
                      </Col>
                    </>
                  }
                  loader={isLoading}
                  title='Liste de fonctions (Titres)'
                  thead={<AppTHead isImg loader={isLoading} isFetching={isFetching} onRefresh={onRefresh} items={[
                    {label: '#'},
                    {label: 'Fonction (Titre)'},
                    {label: 'Date d\'enregistrement'},
                  ]} />}
                  tbody={<tbody>{content}</tbody>} />
                {error && error}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>

      <AddOffice show={showNew} onHide={toggleModal} />
    </>
  )
}

export default Offices