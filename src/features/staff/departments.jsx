import {useEffect, useState} from "react";
import {
  AppBreadcrumb,
  AppDataTableStripped,
  AppDelModal,
  AppHeadTitle, AppMainError,
  AppPaginationComponent,
  AppTHead
} from "../../components";
import {Button, ButtonGroup, Card, Col, Form, Row} from "react-bootstrap";
import {ParametersOverView} from "../parameters/ParametersOverView";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../auth/authSlice";
import {
  departmentsPages, researchDepartmentsPages,
  totalDepartments, totalResearchDepartments,
  useDeleteDepartmentMutation,
  useGetDepartmentsQuery,
  useLazyGetDepartmentsByPaginationQuery,
  useLazyGetResearchDepartmentsByPaginationQuery,
  useLazyGetResearchDepartmentsQuery
} from "./departmentApiSlice";
import {AddDepartment} from "./AddDepartment";
import {EditDepartment} from "./EditDepartment";
import toast from "react-hot-toast";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {useNavigate} from "react-router-dom";
import {allowShowPersonalsPage} from "../../app/config";

const DepartmentItem = ({ department }) => {

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
  const [search, setSearch] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [contents, setContents] = useState([])
  const [tempSearch, setTempSearch] = useState('')
  const [page, setPage] = useState(1)
  const [checkItems, setCheckItems] = useState({isSearching: false, isPaginated: false,})

  const onToggleNewDepartmentModal = () => setShowNew(!showNew)

  const [paginatedItems, setPaginatedItems] = useState([])
  const [researchPaginatedItems, setResearchPaginatedItems] = useState([])

  const [getDepartmentsByPagination, {isFetching: isFetching2, isError: isError2,}] = useLazyGetDepartmentsByPaginationQuery()
  const [getResearchDepartments, {isFetching: isFetching3, isError: isError3,}] = useLazyGetResearchDepartmentsQuery()
  const [getResearchDepartmentsByPagination, {
    isFetching: isFetching4,
    isError: isError4,
  }] = useLazyGetResearchDepartmentsByPaginationQuery()

  async function handlePagination(pagination) {
    const param = pagination + 1
    setPage(param)
    setCheckItems({isSearching: false, isPaginated: true})
    const { data: searchData, isSuccess } = await getDepartmentsByPagination(param)
    if (isSuccess && searchData) {
      setPaginatedItems(searchData)
    }
  } // handle main pagination

  async function handlePagination2(pagination) {
    const param = pagination + 1
    const keywords = {page: param, keyword: tempSearch}
    setPage(param)
    setCheckItems({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchDepartmentsByPagination(keywords)
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
    const { data: searchData, isSuccess } = await getResearchDepartments(search)
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
    if (!checkItems.isSearching && !checkItems.isPaginated && isSuccess && departments) {
      const items = departments.ids?.map(id => departments?.entities[id])
      setContents(items?.filter(f => f?.name.toLowerCase().includes(search.toLowerCase())))
    }
    else if (!checkItems.isSearching && checkItems.isPaginated && isSuccess && departments)
      setContents(paginatedItems?.filter(f => f?.name.toLowerCase().includes(search.toLowerCase())))
    else if (checkItems.isSearching && !checkItems.isPaginated && isSuccess && departments)
      setContents(researchPaginatedItems?.filter(f => f?.name.toLowerCase().includes(search.toLowerCase())))
  }, [
    checkItems,
    isSuccess,
    departments,
    search,
    researchPaginatedItems,
    paginatedItems,
  ])

  const navigate = useNavigate()
  useEffect(() => {
    if (user && !allowShowPersonalsPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

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
                  loader={isLoading || isFetching2 || isFetching4}
                  title='Liste de départements'
                  overview={
                    <>
                      <div className='mb-3'>
                        {checkItems.isSearching ?
                          totalDepartments > 0 ?
                            <p>
                              Au total
                              <code className="mx-1 me-1">{totalResearchDepartments.toLocaleString()}</code>
                              départment(s) trouvé(s) suite à votre recherche ⏩ <b>{tempSearch}</b> :
                            </p> : 'Aucune occurence trouvée 🎈'
                          :
                          <p>
                            {totalDepartments < 1
                              ? 'Aucun organisme(s) enregistré(s).'
                              : <>Il y a au total <code className='me-1'>{totalDepartments.toLocaleString()}</code>
                                département(s) enregistré(s) :</>}
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
                            onChange={({ target }) => setSearch(target.value)} />
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
                    {!isError && isSuccess && contents.length > 0 &&
                      contents.map(d => <DepartmentItem key={d?.id} department={d}/>)}
                    </tbody>
                  }
                  thead={
                    <AppTHead
                      isImg onRefresh={onRefresh}
                      loader={isLoading}
                      isFetching={isFetching || isFetching2 || isFetching4 || isFetching3}
                      items={[
                        {label: '#'},
                        {label: 'Département'},
                        {label: 'Date d\'enregistrement'},
                      ]}
                    />}
                />

                {isLoading || isFetching || isFetching2 || isFetching3 || isFetching4
                  ? <BarLoaderSpinner loading={isLoading || isFetching || isFetching2 || isFetching3 || isFetching4}/>
                  : (
                    <>
                      {departmentsPages > 1 && isSuccess && departments
                        && !checkItems.isSearching &&
                        <AppPaginationComponent
                          nextLabel=''
                          previousLabel=''
                          onPaginate={handlePagination}
                          currentPage={page - 1}
                          pageCount={departmentsPages} />}

                      {researchDepartmentsPages > 1 && isSuccess && departments && checkItems.isSearching &&
                        <AppPaginationComponent
                          nextLabel=''
                          previousLabel=''
                          onPaginate={handlePagination2}
                          currentPage={page - 1}
                          pageCount={researchDepartmentsPages} />}
                    </>
                  )}

                {isError && <div className='mb-3'><AppMainError/></div>}
                {isError2 && <div className='mb-3'><AppMainError/></div>}
                {isError3 && <div className='mb-3'><AppMainError/></div>}
                {isError4 && <div className='mb-3'><AppMainError/></div>}
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
