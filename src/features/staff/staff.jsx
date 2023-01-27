import {useState} from "react";
import {AppBreadcrumb, AppDataTableStripped, AppDelModal, AppHeadTitle, AppTHead} from "../../components";
import {Alert, Badge, Button, ButtonGroup, Card, Col, Form, InputGroup} from "react-bootstrap";
import {totalAgents, useDeleteAgentMutation, useGetAgentsQuery} from "./agentApiSlice";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {Link} from "react-router-dom";
import toast from "react-hot-toast";
import {AddUser} from "../users/AddUser";
import img from '../../assets/app/img/default_profile.jpg';
import {entrypoint} from "../../app/store";
import {limitStrTo} from "../../services";

function AgentItem({id}) {
  const [show, setShow] = useState(false)
  const [showNewUser, setShowNewUser] = useState(false)
  const [deleteAgent, {isLoading}] = useDeleteAgentMutation()
  const {agent} = useGetAgentsQuery('Agents', {
    selectFromResult: ({ data }) => ({ agent: data.entities[id]})
  })

  const toggleModal = () => setShow(!show)

  const toggleNewUserModal = () => setShowNewUser(!showNewUser)

  const onDelete = async () => {
    toggleModal()
    try {
      const data = await deleteAgent(agent)
      if (!data.error) {
        toast.success('Suppression bien efféctuée.', {icon: '😶'})
      }
    } catch (e) { toast.error(e.message) }
  }

  return (
    <>
      <tr style={{ fontSize: '0.8rem' }}>
        <th>
          <img
            src={agent?.userAccount
              ? agent.userAccount?.profile
                ? entrypoint+agent.userAccount.profile.contentUrl
                : img
              : img}
            alt=""
            className='rounded-circle'
            width={30}
            height={28}/>
        </th>
        <th>#{agent.id}</th>
        <th className='text-uppercase'>
          {agent.name+' '}
          {agent?.lastName && agent.lastName+' '}
          {agent?.firstName && agent.firstName}
        </th>
        <td>{agent?.sex && agent.sex !== 'none' ? agent.sex : '❓'}</td>
        <td>{agent.phone}</td>
        <td className='text-lowercase fst-italic' title={agent?.email ? agent.email : ''}>
          {agent?.email ? limitStrTo(21, agent.email) : '❓'}
        </td>
        <td className='text-uppercase'>
          <small><Badge className='mb-0'>{agent?.office ? agent.office.title : '❓'}</Badge></small>
        </td>
        <td className='text-uppercase'>
          {agent?.service
            ? agent.service?.department
              && agent.service.department.name
            : '❓'}
        </td>
        <td className='text-uppercase'>{agent?.service ? agent.service.name : '❓'}</td>
        <td><small>{agent?.createdAt ? agent.createdAt : '❓'}</small></td>
        <td className='text-end'>
          <ButtonGroup size='sm'>
            <Link
              to={`/member/staff/agents/edit/${id}/${agent.slug}`}
              className={`btn btn-light ${isLoading ? 'disabled' : ''}`}>
              <i className='bi bi-pencil-square text-primary'/>
            </Link>
            {!agent.userAccount &&
              <Button type='button' variant='light' disabled={isLoading} onClick={toggleNewUserModal}>
                <i className='bi bi-person-plus text-success'/>
              </Button>}
            <Button type='button' variant='light' disabled={isLoading} onClick={toggleModal}>
              <i className='bi bi-trash3 text-danger'/>
            </Button>
          </ButtonGroup>
        </td>
      </tr>

      <AddUser
        onHide={toggleNewUserModal}
        show={showNewUser}
        data={agent} />

      <AppDelModal
        onHide={toggleModal}
        show={show}
        onDelete={onDelete}
        text={
          <>
            <p>
              Êtes-vous certain(e) de vouloir supprimer l'agent <br/>
              <i className='bi bi-quote me-1'/>
              <span className="fw-bold text-uppercase">{agent.name}</span>
              <i className='bi bi-quote mx-1'/> <br/><br/>

              <small>
                <em>
                  Cette action n'affectera pas le compte utilisateur. <br/>
                  Si toute fois un compte utilisateur est associé à cet agent
                  <i className='bi bi-exclamation-triangle-fill mx-1'/>
                </em>
              </small>
            </p>
          </>} />
    </>
  )
}

function Staff() {
  const {data: agents = [], isSuccess, isLoading, isFetching, isError, refetch} = useGetAgentsQuery('Agents')
  const [keywords, setKeywords] = useState({search: ''})
  const [showNew, setShowNew] = useState(false)

  let content, error
  if (isSuccess) content = agents && agents?.ids.map(id => <AgentItem key={id} id={id}/>)
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
      <AppHeadTitle title='Agents' />
      <AppBreadcrumb title='Agents' />
      <Card className='border-0'>
        <Card.Body>
          <AppDataTableStripped
            overview={
              <>
                <p>{totalAgents < 1
                  ? 'Aucun département enregistré pour le moment 🎈'
                  : <>Il y a au total <code>{totalAgents.toLocaleString()}</code> agent(s) :</>}
                </p>
                <Col md={8} className='mb-2'>
                  <form onSubmit={handleSubmit}>
                    <InputGroup>
                      <Button type='submit' variant='light' disabled={agents.length < 1}>
                        <i className='bi bi-search'/>
                      </Button>
                      <Form.Control
                        placeholder='Votre recherche ici...'
                        aria-label='Votre recherche ici...'
                        autoComplete='off'
                        disabled={agents.length < 1 || isFetching}
                        name='search'
                        value={keywords.search}
                        onChange={(e) => handleChange(e, keywords, setKeywords)} />
                    </InputGroup>
                  </form>
                </Col>
                <Col md={4} className='text-md-end mb-2'>
                  <Link
                    to='/member/staff/agents/add'
                    title='Ajouter un agent'
                    className='mb-1 me-1 btn btn-primary'
                    onClick={toggleModal}>
                    <i className='bi bi-plus'/> Ajouter un agent
                  </Link>
                </Col>
              </>
            }
            loader={isLoading}
            thead={<AppTHead isImg loader={isLoading} isFetching={isFetching} onRefresh={onRefresh} items={[
              {label: '#'},
              {label: 'Nom'},
              {label: 'Sexe'},
              {label: 'n° Tél.'},
              {label: 'Email'},
              {label: 'Fonction'},
              {label: 'Département'},
              {label: 'Service'},
              {label: 'Date'},
            ]} />}
            tbody={<tbody>{content}</tbody>}
            title='Liste des agents' />
          {error && error}
        </Card.Body>
      </Card>
    </>
  )
}

export default Staff
