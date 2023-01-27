import {useState} from "react";
import {AppBreadcrumb, AppDataTableStripped, AppDelModal, AppHeadTitle, AppTHead} from "../../components";
import {Alert, Button, ButtonGroup, Card, Col, Form, InputGroup, Row} from "react-bootstrap";
import {ParametersOverView} from "../parameters/ParametersOverView";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../auth/authSlice";
import {totalDepartments, useDeleteDepartmentMutation, useGetDepartmentsQuery} from "./departmentApiSlice";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {AddDepartment} from "./AddDepartment";
import {EditDepartment} from "./EditDepartment";
import toast from "react-hot-toast";

const DepartmentItem = ({id}) => {
  const { department } = useGetDepartmentsQuery('Departments', {
    selectFromResult: ({ data }) => ({ department: data.entities[id] })
  })

  const [deleteDepartment, {isLoading}] = useDeleteDepartmentMutation()
  const [show, setShow] = useState(false)
  const [show2, setShow2] = useState(false)

  const toggleEditModal = () => setShow(!show)
  const toggleDelModal = () => setShow2(!show2)

  async function handleDelete() {
    toggleDelModal();
    try {
      const data = await deleteDepartment(department)
      if (!data.error) toast.custom('Suppression bien effectée.', {
        icon: '😶',
        style: {
          background: '#c7ab06',
          color: '#000',
        }
      })
    }
    catch (e) {
      toast.error(e.message, {
        style: {
          background: 'red',
          color: '#fff',
        }
      })
    }
  }

  return (
    <>
      <tr>
        <th><i className='bi bi-house-gear'/></th>
        <th>#{department.id}</th>
        <td className='text-uppercase'>{department.name}</td>
        <td>{department?.createdAt ? department.createdAt : '❓'}</td>
        <td className='text-md-end' colSpan={2}>
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
        onDelete={handleDelete}
        text={
          <p>
            Êtes-vous certain(e) de vouloir supprimer le département <br/>
            <i className='me-1 bi bi-quote'/>
            <b className='text-uppercase'>{department.name}</b>
            <i className='mx-1 bi bi-quote'/>
          </p>}
      />
      <EditDepartment data={department} show={show} onHide={toggleEditModal} />
    </>
  )
}

function Departments() {
  const user = useSelector(selectCurrentUser)
  const {
    data: departments = [],
    isLoading,
    isSuccess,
    isError,
    isFetching,
    refetch} = useGetDepartmentsQuery('Departments')
  const [keywords, setKeywords] = useState({search: ''})
  const [showNew, setShowNew] = useState(false)

  let content, error
  if (isSuccess) content = departments && departments?.ids.map(id => <DepartmentItem key={id} id={id} />)

  if (isError) error =
    <Alert variant='danger'>
      <p>Une erreur s'est produite.</p>
      <p>Veuillez soit recharger la page soit vous reconnecter <i className='bi bi-exclamation-triangle-fill'/></p>
    </Alert>
  else error = null

  const onRefresh = async () => await refetch()

  const onToggleNewDepartmentModal = () => setShowNew(!showNew)

  function handleSubmit(e) {
    e.preventDefault()
  } // submit search keywords

  return (
    <>
      <AppHeadTitle title='Départements' />
      <AppBreadcrumb title='Départements' />
      <section className='section profile'>
        <Row>
          <Col xl={4}>
            <Card className='border-0'>
              <Card.Body className='profile-card pt-4 d-flex flex-column align-items-center'>
                <ParametersOverView user={user} />
              </Card.Body>
            </Card>
          </Col>
          <Col md={8}>
            <Card className='border-0'>
              <Card.Body>
                <AppDataTableStripped
                  loader={isLoading}
                  title='Liste de départements'
                  overview={
                    <>
                      <p>{totalDepartments < 1
                        ? 'Aucun département enregistré pour le moment 🎈'
                        : <>Il y a au total <code>{totalDepartments.toLocaleString()}</code> département(s) :</>}
                      </p>
                      <Col md={8} className='mb-2'>
                        <form onSubmit={handleSubmit}>
                          <InputGroup>
                            <Button type='submit' variant='light' disabled={departments.length < 1}>
                              <i className='bi bi-search'/>
                            </Button>
                            <Form.Control
                              placeholder='Votre recherche ici...'
                              aria-label='Votre recherche ici...'
                              autoComplete='off'
                              disabled={departments.length < 1 || isFetching}
                              name='search'
                              value={keywords.search}
                              onChange={(e) => handleChange(e, keywords, setKeywords)} />
                          </InputGroup>
                        </form>
                      </Col>
                      <Col md={4} className='text-md-end mb-2'>
                        <Button
                          type='button'
                          title='Ajouter un département'
                          className='mb-1 me-1'
                          onClick={onToggleNewDepartmentModal}>
                          <i className='bi bi-plus'/> Ajouter un département
                        </Button>
                      </Col>
                    </>
                  }
                  tbody={
                    <tbody>
                    {content}
                    </tbody>
                  }
                  thead={<AppTHead isImg onRefresh={onRefresh} loader={isLoading} isFetching={isFetching} items={[
                    {label: '#'},
                    {label: 'Département'},
                    {label: 'Date d\'enregistrement'},
                  ]} />}
                />
                {error && error}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>

      <AddDepartment onHide={onToggleNewDepartmentModal} show={showNew} />
    </>
  )
}

export default Departments
