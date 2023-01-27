import {useState} from "react";
import {AppBreadcrumb, AppDataTableStripped, AppDelModal, AppHeadTitle, AppTHead} from "../../components";
import {Alert, Button, ButtonGroup, Card, Col, Form, InputGroup, Row} from "react-bootstrap";
import {ParametersOverView} from "../parameters/ParametersOverView";
import {totalServices, useDeleteServiceMutation, useGetServicesQuery} from "./serviceApiSlice";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {AddService} from "./AddService";
import {EditService} from "./EditService";
import toast from "react-hot-toast";

const ServiceItem = ({id}) => {
  const { service } = useGetServicesQuery('Services', {
    selectFromResult: ({ data }) => ({ service: data.entities[id] })
  })
  const [show, setShow] = useState(false)
  const [show2, setShow2] = useState(false)
  const [deleteService, {isLoading}] = useDeleteServiceMutation()

  const toggleEditModal = () => setShow(!show)
  const toggleDelModal = () => setShow2(!show2)

  const onDelete = async () => {
    toggleDelModal()
    try {
      await deleteService(service)
    } catch (e) { toast.error(e.message) }
  }

  return (
    <>
      <tr>
        <th><i className='bi bi-hdd-network'/></th>
        <th scope='row'>#{service.id}</th>
        <td className='text-uppercase'>{service.name}</td>
        <td className='text-uppercase'>{service?.department ? service.department.name : '❓'}</td>
        <td>{service?.createdAt ? service.createdAt : '❓'}</td>
        <td className='text-end'>
          <ButtonGroup size='sm'>
            <Button type='button' variant='light' disabled={isLoading} onClick={toggleEditModal}>
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
            Êtes-vous certain(e) de vouloir supprimer le service <br/>
            <i className='bi bi-quote me-1'/>
            <span className='text-uppercase fw-bold'>{service.name}</span>
            <i className='bi bi-quote mx-1'/>
          </p>
        }
        onDelete={onDelete} />
      <EditService show={show} onHide={toggleEditModal} data={service} />
    </>
  )
}

const Services = () => {
  const {data: services = [], isLoading, isFetching, isSuccess, isError, refetch} = useGetServicesQuery('Services')
  const [keywords, setKeywords] = useState({search: ''})
  const [showNew, setShowNew] = useState(false)

  let content, error
  if (isSuccess) content = services && services?.ids.map(id => <ServiceItem key={id} id={id}/>)

  if (isError) error =
    <Alert variant='danger'>
      <p>Une erreur s'est produite.</p>
      <p>Veuillez soit recharger la page soit vous reconnecter <i className='bi bi-exclamation-triangle-fill'/></p>
    </Alert>

  const onRefresh = async () => await refetch()

  const toggleNewServiceModal = () => setShowNew(!showNew)

  function handleSubmit(e) {
    e.preventDefault()
  } // submit search keywords

  return (
    <>
      <AppHeadTitle title='Services' />
      <AppBreadcrumb title='Services' />
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
                      <p>{totalServices < 1
                        ? 'Aucun service enregistré pour le moment 🎈'
                        : <>Il y a au total <code>{totalServices.toLocaleString()}</code> services(s) :</>}
                      </p>
                      <Col md={8} className='mb-2'>
                        <form onSubmit={handleSubmit}>
                          <InputGroup>
                            <Button type='submit' variant='light' disabled={services.length < 1}>
                              <i className='bi bi-search'/>
                            </Button>
                            <Form.Control
                              placeholder='Votre recherche ici...'
                              aria-label='Votre recherche ici...'
                              autoComplete='off'
                              disabled={services.length < 1 || isFetching}
                              name='search'
                              value={keywords.search}
                              onChange={(e) => handleChange(e, keywords, setKeywords)} />
                          </InputGroup>
                        </form>
                      </Col>
                      <Col md={4} className='text-md-end mb-2'>
                        <Button
                          type='button'
                          title='Ajouter un service'
                          className='mb-1 me-1'
                          onClick={toggleNewServiceModal}>
                          <i className='bi bi-plus'/> Ajouter un service
                        </Button>
                      </Col>
                    </>
                  }
                  thead={<AppTHead
                    isImg loader={isLoading || isFetching}
                    isFetching={isFetching}
                    onRefresh={onRefresh} items={[
                    {label: '#'},
                    {label: 'Service'},
                    {label: 'Département'},
                    {label: 'Date'},
                  ]} />}
                  tbody={
                    <tbody>{content}</tbody>
                  }
                  loader={isLoading}
                  title='Liste de services' />
                {error && error}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>

      <AddService show={showNew} onHide={toggleNewServiceModal} />
    </>
  )
}

export default Services
