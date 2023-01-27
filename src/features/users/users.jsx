import {useState} from "react";
import {useSelector} from "react-redux";
import {totalUsers, useDeleteUserMutation, useGetUsersQuery} from "./userApiSlice";
import {AppDataTableStripped, AppDelModal, AppMainError, AppTHead} from "../../components";
import {role, ROLE_OWNER_ADMIN} from "../../app/config";
import {selectCurrentUser} from "../auth/authSlice";
import {Button, ButtonGroup, Card, Col, Form, InputGroup} from "react-bootstrap";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {EditUser} from "./EditUser";
import toast from "react-hot-toast";
import img from '../../assets/app/img/default_profile.jpg';
import {entrypoint} from "../../app/store";

const UserItem = ({id, currentUser}) => {
  const [deleteUser, {isLoading}] = useDeleteUserMutation()
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const {user} = useGetUsersQuery('Users', {
    selectFromResult: ({ data }) => ({ user: data.entities[id] })
  })

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
          <td>{role(user.roles[0])}</td>
          <td>{user?.createdAt ? user.createdAt : '❓'}</td>
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
  const [keywords, setKeywords] = useState({search: ''})

  let content, error
  if (isSuccess) content = users && users.ids.map(id => <UserItem key={id} id={id} currentUser={currentUser}/>)
  if (isError) error = <AppMainError/>

  const onRefresh = async () => await refetch()

  function handleSubmit(e) {
    e.preventDefault()
  } // submit search keywords

  return (
    <>
      <Card className='border-0'>
        <Card.Body>
          <AppDataTableStripped
            overview={
              <>
                <p>{totalUsers < 1
                  ? 'Aucun utilisateurs enregistré pour le moment 🎈'
                  : <>Il y a au total <code>{totalUsers.toLocaleString()}</code> utilisateur(s) :</>}
                </p>
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
                        disabled={users.length < 1 || isFetching}
                        name='search'
                        value={keywords.search}
                        onChange={(e) => handleChange(e, keywords, setKeywords)} />
                    </InputGroup>
                  </form>
                </Col>
              </>
            }
            loader={isLoading}
            thead={<AppTHead isImg loader={isLoading} isFetching={isFetching} onRefresh={onRefresh} items={[
              {label: '#'},
              {label: 'Username'},
              {label: 'Nom complet'},
              {label: 'n° Téléphone'},
              {label: 'Email'},
              {label: 'Rôle / Droits'},
              {label: 'Date'},
            ]}/>}
            tbody={<tbody>{content}</tbody>}
            title='Liste des utilisateurs' />
          {error && error}
        </Card.Body>
      </Card>
    </>
  )
}

export default Users
