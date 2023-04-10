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
import {
  researchServicesPages,
  servicesPages,
  totalResearchServices,
  totalServices,
  useDeleteServiceMutation,
  useGetServicesQuery, useLazyGetResearchServicesByPaginationQuery, useLazyGetResearchServicesQuery,
  useLazyGetServicesByPaginationQuery
} from "./serviceApiSlice";
import {AddService} from "./AddService";
import {EditService} from "./EditService";
import toast from "react-hot-toast";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {useNavigate} from "react-router-dom";
import {allowShowPersonalsPage} from "../../app/config";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../auth/authSlice";

const ServiceItem = ({ service }) => {
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
  const [search, setSearch] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [contents, setContents] = useState([])
  const [tempSearch, setTempSearch] = useState('')
  const [page, setPage] = useState(1)
  const [checkItems, setCheckItems] = useState({isSearching: false, isPaginated: false,})

  const toggleNewServiceModal = () => setShowNew(!showNew)

  const [paginatedItems, setPaginatedItems] = useState([])
  const [researchPaginatedItems, setResearchPaginatedItems] = useState([])

  const [getServicesByPagination, {isFetching: isFetching2, isError: isError2,}] = useLazyGetServicesByPaginationQuery()
  const [getResearchServices, {isFetching: isFetching3, isError: isError3,}] = useLazyGetResearchServicesQuery()
  const [getResearchServicesByPagination, {
    isFetching: isFetching4,
    isError: isError4,
  }] = useLazyGetResearchServicesByPaginationQuery()

  async function handlePagination(pagination) {
    const param = pagination + 1
    setPage(param)
    setCheckItems({isSearching: false, isPaginated: true})
    const { data: searchData, isSuccess } = await getServicesByPagination(param)
    if (isSuccess && searchData) {
      setPaginatedItems(searchData)
    }
  } // handle main pagination

  async function handlePagination2(pagination) {
    const param = pagination + 1
    const keywords = {page: param, keyword: tempSearch}
    setPage(param)
    setCheckItems({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchServicesByPagination(keywords)
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
    const { data: searchData, isSuccess } = await getResearchServices(search)
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
    if (!checkItems.isSearching && !checkItems.isPaginated && isSuccess && services) {
      const items = services.ids?.map(id => services?.entities[id])
      setContents(items?.filter(f => f?.name.toLowerCase().includes(search.toLowerCase())))
    }
    else if (!checkItems.isSearching && checkItems.isPaginated && isSuccess && services)
      setContents(paginatedItems?.filter(f => f?.name.toLowerCase().includes(search.toLowerCase())))
    else if (checkItems.isSearching && !checkItems.isPaginated && isSuccess && services)
      setContents(researchPaginatedItems?.filter(f => f?.name.toLowerCase().includes(search.toLowerCase())))
  }, [
    checkItems,
    isSuccess,
    services,
    search,
    researchPaginatedItems,
    paginatedItems,
  ])

  const user = useSelector(selectCurrentUser), navigate = useNavigate()
  useEffect(() => {
    if (user && !allowShowPersonalsPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

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
                      <div className="mb-3">
                        {checkItems.isSearching ?
                          totalResearchServices > 0 ?
                            <p>
                              Au total
                              <code className="mx-1 me-1">{totalResearchServices.toLocaleString()}</code>
                              service(s) trouvé(s) suite à votre recherche ⏩ <b>{tempSearch}</b> :
                            </p> : 'Aucune occurence trouvée 🎈'
                          :
                          <p>
                            {totalServices < 1
                              ? 'Aucun organisme(s) enregistré(s).'
                              : <>Il y a au total <code>{totalServices.toLocaleString()}</code> service(s) enregistré(s) :</>}
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
                          title='Ajouter un service'
                          className='mb-1 me-1'
                          onClick={toggleNewServiceModal}>
                          <i className='bi bi-plus'/> Ajouter un service
                        </Button>
                      </Col>
                    </>
                  }
                  thead={
                    <AppTHead
                      isImg loader={isLoading || isFetching}
                      isFetching={isFetching || isFetching2 || isFetching4 || isFetching3}
                      onRefresh={onRefresh} items={[
                        {label: '#'},
                        {label: 'Service'},
                        {label: 'Département'},
                        {label: 'Date'},
                      ]}
                    />}
                  tbody={
                    <tbody>
                      {!isError && isSuccess && contents.length > 0 &&
                        contents.map(s => <ServiceItem key={s?.id} service={s}/>)}
                    </tbody>
                  }
                  loader={isLoading || isFetching2 || isFetching4}
                  title='Liste de services' />

                {isLoading || isFetching || isFetching2 || isFetching3 || isFetching4
                  ? <BarLoaderSpinner loading={isLoading || isFetching || isFetching2 || isFetching3 || isFetching4}/>
                  : (
                    <>
                      {servicesPages > 1 && isSuccess && services
                        && !checkItems.isSearching &&
                        <AppPaginationComponent
                          nextLabel=''
                          previousLabel=''
                          onPaginate={handlePagination}
                          currentPage={page - 1}
                          pageCount={servicesPages} />}

                      {researchServicesPages > 1 && isSuccess && services && checkItems.isSearching &&
                        <AppPaginationComponent
                          nextLabel=''
                          previousLabel=''
                          onPaginate={handlePagination2}
                          currentPage={page - 1}
                          pageCount={researchServicesPages} />}
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

      <AddService show={showNew} onHide={toggleNewServiceModal} />
    </>
  )
}

export default Services
