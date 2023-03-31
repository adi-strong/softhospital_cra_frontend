import {useEffect, useState} from "react";
import {
  AppBreadcrumb,
  AppDataTableStripped,
  AppDelModal,
  AppHeadTitle,
  AppMainError,
  AppPaginationComponent,
  AppTHead
} from "../../components";
import {Badge, Button, ButtonGroup, Card, Col, Form} from "react-bootstrap";
import {
  agentsPages, researchAgentsPages,
  totalAgents, totalResearchAgents,
  useDeleteAgentMutation,
  useGetAgentsQuery,
  useLazyGetAgentsByPaginationQuery, useLazyGetResearchAgentsByPaginationQuery, useLazyGetResearchAgentsQuery
} from "./agentApiSlice";
import {Link} from "react-router-dom";
import toast from "react-hot-toast";
import {AddUser} from "../users/AddUser";
import img from '../../assets/app/img/default_profile.jpg';
import {entrypoint} from "../../app/store";
import {limitStrTo} from "../../services";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";

function AgentItem({ agent }) {
  const [show, setShow] = useState(false)
  const [showNewUser, setShowNewUser] = useState(false)
  const [deleteAgent, {isLoading}] = useDeleteAgentMutation()

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
              to={`/member/staff/agents/edit/${agent?.id}/${agent.slug}`}
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
  const [search, setSearch] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [contents, setContents] = useState([])
  const [tempSearch, setTempSearch] = useState('')
  const [page, setPage] = useState(1)
  const [checkItems, setCheckItems] = useState({isSearching: false, isPaginated: false,})

  const toggleModal = () => setShowNew(!showNew)

  const [paginatedItems, setPaginatedItems] = useState([])
  const [researchPaginatedItems, setResearchPaginatedItems] = useState([])

  const [getAgentsByPagination, {isFetching: isFetching2, isError: isError2,}] = useLazyGetAgentsByPaginationQuery()
  const [getResearchAgents, {isFetching: isFetching3, isError: isError3,}] = useLazyGetResearchAgentsQuery()
  const [getResearchAgentsByPagination, {
    isFetching: isFetching4,
    isError: isError4,
  }] = useLazyGetResearchAgentsByPaginationQuery()

  async function handlePagination(pagination) {
    const param = pagination + 1
    setPage(param)
    setCheckItems({isSearching: false, isPaginated: true})
    const { data: searchData, isSuccess } = await getAgentsByPagination(param)
    if (isSuccess && searchData) {
      setPaginatedItems(searchData)
    }
  } // handle main pagination

  async function handlePagination2(pagination) {
    const param = pagination + 1
    const keywords = {page: param, keyword: tempSearch}
    setPage(param)
    setCheckItems({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchAgentsByPagination(keywords)
    if (isSuccess && searchData) {
      setResearchPaginatedItems(searchData)
    }
  } // 2nd handle main pagination

  async function handleSubmit(e) {
    e.preventDefault()
    setPage(1)
    setTempSearch(search)
    setSearch('')
    setCheckItems({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchAgents(search)
    if (isSuccess && searchData) {
      setResearchPaginatedItems(searchData)
    }
  } // submit search keywords

  const onRefresh = async () => {
    setCheckItems({isSearching: false, isPaginated: false})
    setSearch('')
    setTempSearch('')
    setPage(1)
    await refetch()
  }

  useEffect(() => {
    if (!checkItems.isSearching && !checkItems.isPaginated && isSuccess && agents) {
      const items = agents.ids?.map(id => agents?.entities[id])
      setContents(items?.filter(a => (
        (a.name.toLowerCase().includes(search.toLowerCase())) ||
        a?.lastName.toLowerCase().includes(search.toLowerCase()) ||
        a?.firstName.toLowerCase().includes(search.toLowerCase())
      )))
    }
    else if (!checkItems.isSearching && checkItems.isPaginated && isSuccess && agents)
      setContents(paginatedItems?.filter(a => (
        (a.name.toLowerCase().includes(search.toLowerCase())) ||
        a?.lastName.toLowerCase().includes(search.toLowerCase()) ||
        a?.firstName.toLowerCase().includes(search.toLowerCase())
      )))
    else if (checkItems.isSearching && !checkItems.isPaginated && isSuccess && agents)
      setContents(researchPaginatedItems?.filter(a => (
        (a.name.toLowerCase().includes(search.toLowerCase())) ||
        a?.lastName.toLowerCase().includes(search.toLowerCase()) ||
        a?.firstName.toLowerCase().includes(search.toLowerCase())
      )))
  }, [isSuccess, agents, search, checkItems, paginatedItems, researchPaginatedItems])

  return (
    <>
      <AppHeadTitle title='Agents' />
      <AppBreadcrumb title='Agents' />
      <Card className='border-0'>
        <Card.Body>
          <AppDataTableStripped
            overview={
              <>
                <div className='mb-3'>
                  {checkItems.isSearching ?
                    totalResearchAgents > 0 ?
                      <p>
                        Au total
                        <code className="mx-1 me-1">{totalResearchAgents.toLocaleString()}</code>
                        agent(s) trouvé(s) suite à votre recherche ⏩ <b>{tempSearch}</b> :
                      </p> : 'Aucune occurence trouvée 🎈'
                    :
                    <p>
                      {totalAgents < 1
                        ? 'Aucun organisme(s) enregistré(s).'
                        : <>Il y a au total <code>{totalAgents.toLocaleString()}</code> agent(s) enregistré(s) :</>}
                    </p>}
                </div>

                <Col md={8} className='mb-2'>
                  <form onSubmit={handleSubmit}>
                    <Form.Control
                      placeholder='Votre recherche ici...'
                      aria-label='Votre recherche ici...'
                      autoComplete='off'
                      disabled={isFetching3}
                      name='search'
                      value={search}
                      onChange={({ target}) => setSearch(target.value)} />
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
            loader={isLoading || isFetching2 || isFetching4}
            thead={
              <AppTHead
                isImg
                loader={isLoading}
                isFetching={isFetching || isFetching2 || isFetching4 || isFetching3}
                onRefresh={onRefresh}
                items={[
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
            tbody={
              <tbody>
                {!isError && isSuccess && contents.length > 0 &&
                  contents.map(a => <AgentItem key={a?.id} agent={a}/>)}
              </tbody>}
            title='Liste des agents' />

          {isLoading || isFetching || isFetching2 || isFetching3 || isFetching4
            ? <BarLoaderSpinner loading={isLoading || isFetching || isFetching2 || isFetching3 || isFetching4}/>
            : (
              <>
                {agentsPages > 1 && isSuccess && agents
                  && !checkItems.isSearching &&
                  <AppPaginationComponent
                    onPaginate={handlePagination}
                    currentPage={page - 1}
                    pageCount={agentsPages} />}

                {researchAgentsPages > 1 && isSuccess && agents && checkItems.isSearching &&
                  <AppPaginationComponent
                    onPaginate={handlePagination2}
                    currentPage={page - 1}
                    pageCount={researchAgentsPages} />}
              </>
            )}

          {isError && <div className='mb-3'><AppMainError/></div>}
          {isError2 && <div className='mb-3'><AppMainError/></div>}
          {isError3 && <div className='mb-3'><AppMainError/></div>}
          {isError4 && <div className='mb-3'><AppMainError/></div>}
        </Card.Body>
      </Card>
    </>
  )
}

export default Staff
