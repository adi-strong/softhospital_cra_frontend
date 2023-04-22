import {useEffect, useState} from "react";
import {
  AppBreadcrumb,
  AppDataTableBorderless,
  AppHeadTitle,
  AppMainError, AppPaginationComponent,
  AppTHead
} from "../../components";
import {Button, Card, Col, Form, Row} from "react-bootstrap";
import {
  inputsPages, researchInputsPages,
  totalResearchInputs,
  useGetInputsQuery, useLazyGetInputsByPaginationQuery,
  useLazyGetResearchInputsByPaginationQuery,
  useLazyGetResearchInputsQuery
} from "./inputApiSlice";
import {usernameFiltered} from "../../components/AppNavbar";
import {useSelector} from "react-redux";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {useGetBoxQuery} from "./boxApiSlice";
import Box from "./Box";
import {AddInput} from "./AddInput";
import {limitStrTo} from "../../services";
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

// docRef: '', porter: '', reason: '', amount: 1
const InputItem = ({ input, currency }) => {

  return (
    <>
      <tr>
        <th scope='row'>#{input?.docRef ? input.docRef : '❓'}</th>
        <td className='text-uppercase' title={input?.porter ? input.porter : ''}>
          {input?.porter ? limitStrTo(18, input.porter) : '❓'}</td>
        <td className='text-capitalize' title={input?.reason ? input.reason : ''}>
          {input?.reason ? limitStrTo(18, input.reason) : '❓'}</td>
        <td className='fw-bolder'>{input?.amount
          ? <>{currency && <span className='text-secondary me-1'>{currency.value}</span>}
            {parseFloat(input.amount).toFixed(2).toLocaleString()}</>
          : '❓'}</td>
        <td className='text-capitalize'>
          {input?.user
            ? input.user?.name
              ? usernameFiltered(input.user.name)
              : input.user.username
            : '❓'}
        </td>
        <td colSpan={2}>{input?.createdAt ? input.createdAt : '❓'}</td>
      </tr>
    </>
  )
}

function Entries() {
  const [show, setShow] = useState(false)
  const {data: inputs = [], isLoading, isSuccess, isFetching, isError, refetch} = useGetInputsQuery('Input')
  const {data: boxes = [], isSuccess: isDone} = useGetBoxQuery('Box')
  const { fCurrency } = useSelector(state => state.parameters)

  const [search, setSearch] = useState('')
  const [contents, setContents] = useState([])
  const [tempSearch, setTempSearch] = useState('')
  const [page, setPage] = useState(1)
  const [checkItems, setCheckItems] = useState({isSearching: false, isPaginated: false,})

  let boxId
  if (isDone) boxId = boxes && boxes.entities[boxes.ids[0]]['@id']

  const toggleModal = () => setShow(!show)

  const [paginatedItems, setPaginatedItems] = useState([])
  const [researchPaginatedItems, setResearchPaginatedItems] = useState([])

  const [getInputsByPagination, {isFetching: isFetching2, isError: isError2,}] = useLazyGetInputsByPaginationQuery()
  const [getResearchInputs, {isFetching: isFetching3, isError: isError3,}] = useLazyGetResearchInputsQuery()
  const [getResearchInputsByPagination, {
    isFetching: isFetching4,
    isError: isError4,
  }] = useLazyGetResearchInputsByPaginationQuery()

  async function handlePagination(pagination) {
    const param = pagination + 1
    setPage(param)
    setCheckItems({isSearching: false, isPaginated: true})
    const { data: searchData, isSuccess } = await getInputsByPagination(param)
    if (isSuccess && searchData) {
      setPaginatedItems(searchData)
    }
  } // handle main pagination

  async function handlePagination2(pagination) {
    const param = pagination + 1
    const keywords = {page: param, keyword: tempSearch}
    setPage(param)
    setCheckItems({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchInputsByPagination(keywords)
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
    const { data: searchData, isSuccess } = await getResearchInputs(search)
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
    if (!checkItems.isSearching && !checkItems.isPaginated && isSuccess && inputs) {
      const items = inputs.ids?.map(id => inputs?.entities[id])
      setContents(items?.filter(f => f?.reason.toLowerCase().includes(search.toLowerCase())))
    }
    else if (!checkItems.isSearching && checkItems.isPaginated && isSuccess && inputs)
      setContents(paginatedItems?.filter(f => f?.reason.toLowerCase().includes(search.toLowerCase())))
    else if (checkItems.isSearching && !checkItems.isPaginated && isSuccess && inputs)
      setContents(researchPaginatedItems?.filter(f => f?.reason.toLowerCase().includes(search.toLowerCase())))
  }, [
    checkItems,
    isSuccess,
    inputs,
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
      <AppHeadTitle title='Finances : Entrées' />
      <AppBreadcrumb title='Entrées' />

      <Row>
        <Col md={8}>
          <Card className='border-0'>
            <Card.Body>
              <h5 className='card-title mb-3' style={cardTitleStyle}>Liste des entrées</h5>
              <Box/>
              <AppDataTableBorderless
                overview={
                  <>
                    <div className='mb-3'>
                      {checkItems.isSearching ?
                        totalResearchInputs > 0 ?
                          <p>
                            Au total
                            <code className="mx-1 me-1">{totalResearchInputs.toLocaleString()}</code>
                            entrée(s) trouvé(s) suite à votre recherche ⏩ <b>{tempSearch}</b> :
                          </p> : 'Aucune occurence trouvée 🎈' : ''}
                    </div>

                    <Col md={3} className='mb-3'>
                      <Button type='button' onClick={toggleModal}>
                        <i className='bi bi-node-plus'/> Nouvelle entrée
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
                    loader={isLoading}
                    isFetching={isFetching || isFetching2 || isFetching4 || isFetching3}
                    onRefresh={onRefresh}
                    items={[
                      {label: '#'},
                      {label: 'Porteur'},
                      {label: 'Motif'},
                      {label: 'Montant'},
                      {label: <><i className='bi bi-person'/></>},
                      {label: 'Date'},
                    ]} />}
                tbody={
                  <tbody>
                  {!isError && isSuccess && contents.length > 0 &&
                    contents.map(i => <InputItem key={i?.id} input={i} currency={fCurrency}/>)}
                  </tbody>} />

              {isLoading || isFetching || isFetching2 || isFetching3 || isFetching4
                ? <BarLoaderSpinner loading={isLoading || isFetching || isFetching2 || isFetching3 || isFetching4}/>
                : (
                  <>
                    {inputsPages > 1 && isSuccess && inputs
                      && !checkItems.isSearching &&
                      <AppPaginationComponent
                        nextLabel=''
                        previousLabel=''
                        onPaginate={handlePagination}
                        currentPage={page - 1}
                        pageCount={inputsPages} />}

                    {researchInputsPages > 1 && isSuccess && inputs && checkItems.isSearching &&
                      <AppPaginationComponent
                        nextLabel=''
                        previousLabel=''
                        onPaginate={handlePagination2}
                        currentPage={page - 1}
                        pageCount={researchInputsPages} />}
                  </>
                )}

              {isError && <div className='mb-3'><AppMainError/></div>}
              {isError2 && <div className='mb-3'><AppMainError/></div>}
              {isError3 && <div className='mb-3'><AppMainError/></div>}
              {isError4 && <div className='mb-3'><AppMainError/></div>}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <DashSection3Item3 menus={menus} showBox={false} />
        </Col>
      </Row>

      <AddInput show={show} boxId={boxId} onHide={toggleModal} />
    </div>
  )
}

export default Entries
