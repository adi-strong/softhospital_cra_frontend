import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {
  researchUsersPages,
  totalResearchUsers,
  totalUsers,
  useDeleteUserMutation,
  useGetUsersQuery, useLazyGetResearchUsersByPaginationQuery, useLazyGetResearchUsersQuery,
  useLazyGetUsersByPaginationQuery, usersPages
} from "./userApiSlice";
import {AppDataTableStripped, AppDelModal, AppMainError, AppPaginationComponent, AppTHead} from "../../components";
import {allowShowPersonalsPage, role, ROLE_OWNER_ADMIN} from "../../app/config";
import {selectCurrentUser} from "../auth/authSlice";
import {Button, ButtonGroup, Card, Col, Form, InputGroup} from "react-bootstrap";
import {EditUser} from "./EditUser";
import toast from "react-hot-toast";
import img from '../../assets/app/img/default_profile.jpg';
import {entrypoint} from "../../app/store";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {limitStrTo} from "../../services";
import {useNavigate} from "react-router-dom";

const UserItem = ({user, currentUser}) => {
  const [deleteUser, {isLoading}] = useDeleteUserMutation()
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const toggleEditModal = () => setShowEdit(!showEdit)
  const toggleDeleteModal = () => setShowDelete(!showDelete)

  const onDelete = async () => {
    toggleDeleteModal()
    try {
      const data = await deleteUser(user)
      if (!data.error) toast.success('Suppression bien efféctuée.', {icon: '😶'})
    } catch (e) { toast.error(e.message) }
  }

  return (user.id !== currentUser.id) && (
    <>
      {user.roles[0] !== ROLE_OWNER_ADMIN &&
        <tr>
          <th>
            <img
              src={user?.profile ? entrypoint+user.profile.contentUrl : img}
              alt="Profil"
              className='rounded-circle'
              width={30}
              height={28}/>
          </th>
          <th scope='row'>#{user.id}</th>
          <th className={!user.isActive ? 'text-danger' : ''}>
            {!user.isActive && <i className='bi bi-x'/>}
            {user.username}
          </th>
          <th className='text-uppercase'>{user?.name ? user.name : '❓'}</th>
          <td>{user.tel}</td>
          <td className='text-lowercase fst-italic'>{user?.email ? user.email : '❓'}</td>
          <td title={role(user.roles[0])}>{limitStrTo(5, role(user.roles[0]))}</td>
          <td>{user?.createdAt ? limitStrTo(10, user.createdAt) : '❓'}</td>
          <td className='text-end'>
            <ButtonGroup size='sm'>
              <Button type='button' variant='light' disabled={isLoading} onClick={toggleEditModal}>
                <i className='bi bi-pencil-square text-primary'/>
              </Button>
              <Button type='button' variant='light' disabled={isLoading} onClick={toggleDeleteModal}>
                <i className='bi bi-trash3 text-danger'/>
              </Button>
            </ButtonGroup>
          </td>
        </tr>}

      <AppDelModal
        onHide={toggleDeleteModal}
        show={showDelete}
        onDelete={onDelete}
        text={
          <>
            <p>
              Êtes-vous certain(e) de vouloir supprimer l'utilisateur <br/>
              <i className='bi bi-quote me-1'/>
              <span className='fw-bold text-uppercase'>{user.username}</span>
              <i className='bi bi-quote mx-1'/>
            </p>
          </>} />

      <EditUser data={user} show={showEdit} onHide={toggleEditModal} />
    </>
  )
}

function Users() {
  const currentUser = useSelector(selectCurrentUser)
  const {data: users = [], isLoading, isFetching, isError, isSuccess, refetch} = useGetUsersQuery('Users')
  const [search, setSearch] = useState('')
  const [contents, setContents] = useState([])
  const [tempSearch, setTempSearch] = useState('')
  const [page, setPage] = useState(1)
  const [checkItems, setCheckItems] = useState({isSearching: false, isPaginated: false,})

  const [paginatedItems, setPaginatedItems] = useState([])
  const [researchPaginatedItems, setResearchPaginatedItems] = useState([])

  const [getUsersByPagination, {isFetching: isFetching2, isError: isError2,}] = useLazyGetUsersByPaginationQuery()
  const [getResearchUsers, {isFetching: isFetching3, isError: isError3,}] = useLazyGetResearchUsersQuery()
  const [getResearchUsersByPagination, {
    isFetching: isFetching4,
    isError: isError4,
  }] = useLazyGetResearchUsersByPaginationQuery()

  async function handlePagination(pagination) {
    const param = pagination + 1
    setPage(param)
    setCheckItems({isSearching: false, isPaginated: true})
    const { data: searchData, isSuccess } = await getUsersByPagination(param)
    if (isSuccess && searchData) {
      setPaginatedItems(searchData)
    }
  } // handle main pagination

  async function handlePagination2(pagination) {
    const param = pagination + 1
    const keywords = {page: param, keyword: tempSearch}
    setPage(param)
    setCheckItems({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchUsersByPagination(keywords)
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
    const { data: searchData, isSuccess } = await getResearchUsers(search)
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
    if (!checkItems.isSearching && !checkItems.isPaginated && isSuccess && users) {
      const items = users.ids?.map(id => users?.entities[id])
      setContents(items?.filter(u => u?.username.toLowerCase().includes(search.toLowerCase())))
    }
    else if (!checkItems.isSearching && checkItems.isPaginated && isSuccess && users)
      setContents(paginatedItems?.filter(f => f?.username.toLowerCase().includes(search.toLowerCase())))
    else if (checkItems.isSearching && !checkItems.isPaginated && isSuccess && users)
      setContents(researchPaginatedItems?.filter(f => f?.username.toLowerCase().includes(search.toLowerCase())))
  }, [isSuccess, users, search, checkItems, paginatedItems, researchPaginatedItems])

  const user = useSelector(selectCurrentUser), navigate = useNavigate()
  useEffect(() => {
    if (user && !allowShowPersonalsPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

  return (
    <>
      <Card className='border-0'>
        <Card.Body>
          <AppDataTableStripped
            overview={
              <>
                <div className='mb-3'>
                  {checkItems.isSearching ?
                    totalResearchUsers > 0 ?
                      <p>
                        Au total
                        <code className="mx-1 me-1">{totalResearchUsers.toLocaleString()}</code>
                        utilisateur(s) trouvé(s) suite à votre recherche ⏩ <b>{tempSearch}</b> :
                      </p> : 'Aucune occurence trouvée 🎈'
                    :
                    <p>
                      {totalUsers < 1
                        ? 'Aucun organisme(s) enregistré(s).'
                        : <>Il y a au total <code>{totalUsers.toLocaleString()}</code> utilisateur(s) enregistré(s) :</>}
                    </p>}
                </div>

                <Col className='mb-2'>
                  <form onSubmit={handleSubmit}>
                    <InputGroup>
                      <Button type='submit' variant='light' disabled={users.length < 1}>
                        <i className='bi bi-search'/>
                      </Button>
                      <Form.Control
                        placeholder='Votre recherche ici...'
                        aria-label='Votre recherche ici...'
                        autoComplete='off'
                        name='search'
                        value={search}
                        onChange={({ target }) => setSearch(target.value)} />
                    </InputGroup>
                  </form>
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
                  {label: 'Username'},
                  {label: 'Nom complet'},
                  {label: 'n° Téléphone'},
                  {label: 'Email'},
                  {label: 'Droits'},
                  {label: 'Date'},
                ]}/>}
            tbody={
              <tbody>
                {!isError && isSuccess && contents.length > 0 &&
                  contents.map(u => <UserItem key={u?.id} user={u} currentUser={currentUser}/>)}
              </tbody>}
            title='Liste des utilisateurs' />

          {isLoading || isFetching || isFetching2 || isFetching3 || isFetching4
            ? <BarLoaderSpinner loading={isLoading || isFetching || isFetching2 || isFetching3 || isFetching4}/>
            : (
              <>
                {usersPages > 1 && isSuccess && users
                  && !checkItems.isSearching &&
                  <AppPaginationComponent
                    onPaginate={handlePagination}
                    currentPage={page - 1}
                    pageCount={usersPages} />}

                {researchUsersPages > 1 && isSuccess && users && checkItems.isSearching &&
                  <AppPaginationComponent
                    onPaginate={handlePagination2}
                    currentPage={page - 1}
                    pageCount={researchUsersPages} />}
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

export default Users
