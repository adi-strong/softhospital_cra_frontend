import {useEffect, useState} from "react";
import {
  AppBreadcrumb,
  AppDataTableBorderless,
  AppHeadTitle,
  AppMainError, AppPaginationComponent,
  AppTHead
} from "../../components";
import {Badge, Button, Card, Col, Form, Row} from "react-bootstrap";
import {
  outputsPages, researchOutputsPages,
  totalResearchOutputs,
  useGetOutputsQuery,
  useLazyGetOutputsByPaginationQuery,
  useLazyGetResearchOutputsByPaginationQuery,
  useLazyGetResearchOutputsQuery
} from "./outputApiSlice";
import {limitStrTo} from "../../services";
import {usernameFiltered} from "../../components/AppNavbar";
import {useGetBoxQuery} from "./boxApiSlice";
import {useSelector} from "react-redux";
import {AddOutput} from "./AddOutput";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import Box from "./Box";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {selectCurrentUser} from "../auth/authSlice";
import {useNavigate} from "react-router-dom";
import {allowShowFinancesPage} from "../../app/config";
import toast from "react-hot-toast";
import {DashSection3Item3} from "../dashboard/sections/section3/DashSection3Item3";

const menus = [
  {label: 'Ce mois', name: 'this-month', action: '#'},
  {label: 'Mois passé', name: 'last-month', action: '#'},
  {label: 'Cette année', name: 'this-year', action: '#'},
  {label: 'Actualiser', name: 'refresh', action: '#'},
]

const OutputItem = ({ output, currency }) => {

  return (
    <>
      <tr>
        <th scope='row'>#{output?.docRef ? output.docRef : '❓'}</th>
        <td className='text-uppercase' title={output?.recipient ? output.recipient : ''}>
          {output?.recipient ? limitStrTo(18, output.recipient) : '❓'}</td>
        <td className='text-capitalize' title={output?.reason ? output.reason : ''}>
          {output?.reason ? limitStrTo(18, output.reason) : '❓'}</td>
        <td className='fw-bolder'>{output?.amount
          ? <>{currency && <span className='text-secondary me-1'>{currency.value}</span>}
            {parseFloat(output.amount).toFixed(2).toLocaleString()}</>
          : '❓'}</td>
        <td className='text-uppercase'>
          {output?.category ? <Badge>{output.category.name}</Badge> : '❓'}
        </td>
        <td className='text-capitalize'>
          {output?.user
            ? output.user?.name
              ? usernameFiltered(output.user.name)
              : output.user.username
            : '❓'}
        </td>
        <td colSpan={2}>{output?.createdAt ? output.createdAt : '❓'}</td>
      </tr>
    </>
  )
}

function Outputs() {
  const [show, setShow] = useState(false)
  const {data: outputs = [], isLoading, isSuccess, isFetching, isError, refetch} = useGetOutputsQuery('Output')
  const {data: boxes = [], isSuccess: isDone} = useGetBoxQuery('Box')
  const { fCurrency } = useSelector(state => state.parameters)

  let boxId
  if (isDone) boxId = boxes && boxes.entities[boxes.ids[0]]['@id']

  const [search, setSearch] = useState('')
  const [contents, setContents] = useState([])
  const [tempSearch, setTempSearch] = useState('')
  const [page, setPage] = useState(1)
  const [checkItems, setCheckItems] = useState({isSearching: false, isPaginated: false,})

  const toggleModal = () => setShow(!show)

  const [paginatedItems, setPaginatedItems] = useState([])
  const [researchPaginatedItems, setResearchPaginatedItems] = useState([])

  const [getOutputsByPagination, {isFetching: isFetching2, isError: isError2,}] = useLazyGetOutputsByPaginationQuery()
  const [getResearchOutputs, {isFetching: isFetching3, isError: isError3,}] = useLazyGetResearchOutputsQuery()
  const [getResearchOutputsByPagination, {
    isFetching: isFetching4,
    isError: isError4,
  }] = useLazyGetResearchOutputsByPaginationQuery()

  async function handlePagination(pagination) {
    const param = pagination + 1
    setPage(param)
    setCheckItems({isSearching: false, isPaginated: true})
    const { data: searchData, isSuccess } = await getOutputsByPagination(param)
    if (isSuccess && searchData) {
      setPaginatedItems(searchData)
    }
  } // handle main pagination

  async function handlePagination2(pagination) {
    const param = pagination + 1
    const keywords = {page: param, keyword: tempSearch}
    setPage(param)
    setCheckItems({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchOutputsByPagination(keywords)
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
    const { data: searchData, isSuccess } = await getResearchOutputs(search)
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
    if (!checkItems.isSearching && !checkItems.isPaginated && isSuccess && outputs) {
      const items = outputs.ids?.map(id => outputs?.entities[id])
      setContents(items?.filter(f => f?.reason.toLowerCase().includes(search.toLowerCase())))
    }
    else if (!checkItems.isSearching && checkItems.isPaginated && isSuccess && outputs)
      setContents(paginatedItems?.filter(f => f?.reason.toLowerCase().includes(search.toLowerCase())))
    else if (checkItems.isSearching && !checkItems.isPaginated && isSuccess && outputs)
      setContents(researchPaginatedItems?.filter(f => f?.reason.toLowerCase().includes(search.toLowerCase())))
  }, [
    checkItems,
    isSuccess,
    outputs,
    search,
    researchPaginatedItems,
    paginatedItems,
  ])

  const user = useSelector(selectCurrentUser), navigate = useNavigate()
  useEffect(() => {
    if (user && !allowShowFinancesPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

  return (
    <div className='section dashboard'>
      <AppHeadTitle title='Finances : Sorties' />
      <AppBreadcrumb title='Sorties' />

      <Row>
        <Col md={8}>
          <Card className='border-0'>
            <Card.Body>
              <h5 className='card-title mb-3' style={cardTitleStyle}>Liste de sorties</h5>
              <Box/>
              <AppDataTableBorderless
                overview={
                  <>
                    <div className='mb-3'>
                      {checkItems.isSearching ?
                        totalResearchOutputs > 0 ?
                          <p>
                            Au total
                            <code className="mx-1 me-1">{totalResearchOutputs.toLocaleString()}</code>
                            sortie(s) trouvé(s) suite à votre recherche ⏩ <b>{tempSearch}</b> :
                          </p> : 'Aucune occurence trouvée 🎈' : ''}
                    </div>

                    <Col md={4}>
                      <Button type='button' onClick={toggleModal}>
                        <i className='bi bi-node-plus'/> Nouvelle sortie
                      </Button>
                    </Col>

                    <Col md={7} className='mb-3'>
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
                  </>
                }
                loader={isLoading || isFetching2 || isFetching4}
                thead={
                  <AppTHead
                    onRefresh={onRefresh}
                    loader={isLoading}
                    isFetching={isFetching || isFetching3 || isFetching2 || isFetching4}
                    items={[
                      {label: '#'},
                      {label: 'Bénéficiaire'},
                      {label: 'Motif'},
                      {label: 'Montant'},
                      {label: 'Catégorie'},
                      {label: <><i className='bi bi-person'/></>},
                      {label: 'Date'},
                    ]}
                  />}
                tbody={
                  <tbody>
                  {!isError && isSuccess && contents.length > 0 &&
                    contents.map(o => <OutputItem key={o?.id} output={o} currency={fCurrency}/>)}
                  </tbody>} />

              {isLoading || isFetching || isFetching2 || isFetching3 || isFetching4
                ? <BarLoaderSpinner loading={isLoading || isFetching || isFetching2 || isFetching3 || isFetching4}/>
                : (
                  <>
                    {outputsPages > 1 && isSuccess && outputs
                      && !checkItems.isSearching &&
                      <AppPaginationComponent
                        nextLabel=''
                        previousLabel=''
                        onPaginate={handlePagination}
                        currentPage={page - 1}
                        pageCount={outputsPages} />}

                    {researchOutputsPages > 1 && isSuccess && outputs && checkItems.isSearching &&
                      <AppPaginationComponent
                        nextLabel=''
                        previousLabel=''
                        onPaginate={handlePagination2}
                        currentPage={page - 1}
                        pageCount={researchOutputsPages} />}
                  </>
                )}

              {isError && <div className='mb-3'><AppMainError/></div>}
              {isError2 && <div className='mb-3'><AppMainError/></div>}
              {isError3 && <div className='mb-3'><AppMainError/></div>}
              {isError4 && <div className='mb-3'><AppMainError/></div>}
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <DashSection3Item3 menus={menus} showBox={false} />
        </Col>
      </Row>

      <AddOutput show={show} onHide={toggleModal} boxId={boxId} />
    </div>
  )
}

export default Outputs
