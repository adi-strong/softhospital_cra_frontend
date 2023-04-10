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
  officesPages, researchOfficesPages,
  useDeleteOfficeMutation,
  useGetOfficesQuery,
  useLazyGetOfficesByPaginationQuery, useLazyGetResearchOfficesByPaginationQuery,
  useLazyGetResearchOfficesQuery
} from "./officeApiSlice";
import {AddOffice} from "./AddOffice";
import {EditOffice} from "./EditOffice";
import toast from "react-hot-toast";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../auth/authSlice";
import {useNavigate} from "react-router-dom";
import {allowShowPersonalsPage} from "../../app/config";

function OfficeItem({ office }) {
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
  const [search, setSearch] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [contents, setContents] = useState([])
  const [tempSearch, setTempSearch] = useState('')
  const [page, setPage] = useState(1)
  const [checkItems, setCheckItems] = useState({isSearching: false, isPaginated: false,})

  const toggleModal = () => setShowNew(!showNew)

  const [paginatedItems, setPaginatedItems] = useState([])
  const [researchPaginatedItems, setResearchPaginatedItems] = useState([])

  const [getOfficesByPagination, {isFetching: isFetching2, isError: isError2,}] = useLazyGetOfficesByPaginationQuery()
  const [getResearchOffices, {isFetching: isFetching3, isError: isError3,}] = useLazyGetResearchOfficesQuery()
  const [getResearchOfficesByPagination, {
    isFetching: isFetching4,
    isError: isError4,
  }] = useLazyGetResearchOfficesByPaginationQuery()

  async function handlePagination(pagination) {
    const param = pagination + 1
    setPage(param)
    setCheckItems({isSearching: false, isPaginated: true})
    const { data: searchData, isSuccess } = await getOfficesByPagination(param)
    if (isSuccess && searchData) {
      setPaginatedItems(searchData)
    }
  } // handle main pagination

  async function handlePagination2(pagination) {
    const param = pagination + 1
    const keywords = {page: param, keyword: tempSearch}
    setPage(param)
    setCheckItems({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchOfficesByPagination(keywords)
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
    const { data: searchData, isSuccess } = await getResearchOffices(search)
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
    if (!checkItems.isSearching && !checkItems.isPaginated && isSuccess && offices) {
      const items = offices.ids?.map(id => offices?.entities[id])
      setContents(items?.filter(f => f?.title.toLowerCase().includes(search.toLowerCase())))
    }
    else if (!checkItems.isSearching && checkItems.isPaginated && isSuccess && offices)
      setContents(paginatedItems?.filter(f => f?.title.toLowerCase().includes(search.toLowerCase())))
    else if (checkItems.isSearching && !checkItems.isPaginated && isSuccess && offices)
      setContents(researchPaginatedItems?.filter(f => f?.title.toLowerCase().includes(search.toLowerCase())))
  }, [
    checkItems,
    isSuccess,
    offices,
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
                          title='Ajouter une fonction'
                          className='mb-1 me-1'
                          onClick={toggleModal}>
                          <i className='bi bi-plus'/> Ajouter une fonction
                        </Button>
                      </Col>
                    </>
                  }
                  loader={isLoading || isFetching2 || isFetching4}
                  title='Liste de fonctions (Titres)'
                  thead={
                  <AppTHead
                    isImg
                    loader={isLoading}
                    isFetching={isFetching || isFetching2 || isFetching4 || isFetching2}
                    onRefresh={onRefresh}
                    items={[
                      {label: '#'},
                      {label: 'Fonction (Titre)'},
                      {label: 'Date d\'enregistrement'},
                    ]}
                  />}
                  tbody={
                    <tbody>
                      {!isError && isSuccess && contents.length > 0 &&
                        contents.map(o => <OfficeItem key={o?.id} office={o}/>)}
                    </tbody>} />

                {isLoading || isFetching || isFetching2 || isFetching3 || isFetching4
                  ? <BarLoaderSpinner loading={isLoading || isFetching || isFetching2 || isFetching3 || isFetching4}/>
                  : (
                    <>
                      {officesPages > 1 && isSuccess && offices
                        && !checkItems.isSearching &&
                        <AppPaginationComponent
                          nextLabel=''
                          previousLabel=''
                          onPaginate={handlePagination}
                          currentPage={page - 1}
                          pageCount={officesPages} />}

                      {researchOfficesPages > 1 && isSuccess && offices && checkItems.isSearching &&
                        <AppPaginationComponent
                          nextLabel=''
                          previousLabel=''
                          onPaginate={handlePagination2}
                          currentPage={page - 1}
                          pageCount={researchOfficesPages} />}
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

      <AddOffice show={showNew} onHide={toggleModal} />
    </>
  )
}

export default Offices
