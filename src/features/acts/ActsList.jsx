import {useEffect, useState} from "react";
import {AppDataTableStripped, AppDelModal, AppMainError, AppPaginationComponent, AppTHead} from "../../components";
import {Badge, Button, ButtonGroup, Col, Form} from "react-bootstrap";
import {AddActs} from "./AddActs";
import {
  actsPages, researchActsPages, totalResearchActs,
  useDeleteActMutation,
  useGetActsQuery,
  useLazyGetActsByPaginationQuery, useLazyGetResearchActsByPaginationQuery,
  useLazyGetResearchActsQuery
} from "./actApiSlice";
import {useSelector} from "react-redux";
import {limitStrTo} from "../../services";
import toast from "react-hot-toast";
import {EditAct} from "./EditAct";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {ShowSingleAct} from "./ShowSingleAct";

const ActItem = ({ act, currency, onRefresh }) => {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [show, setShow] = useState(false)
  const [deleteAct, {isLoading}] = useDeleteActMutation()

  const toggleEditModal = () => setShowEdit(!showEdit)
  const toggleDeleteModal = () => setShowDelete(!showDelete)
  const toggleShowActModal = () => setShow(!show)

  async function onDelete() {
    toggleDeleteModal()
    try {
      const formData = await deleteAct(act)
      if (!formData.error) {
        toast.success('Suppression bien efféctuée.', {icon: '😶'})
        onRefresh()
      }
    }
    catch (e) { toast.error(e.message) }
  }

  return (
    <>
      <tr>
        <td><i className='bi bi-file-earmark-medical'/></td>
        <th>#{act.id}</th>
        <td
          className='text-uppercase text-primary'
          title={act.wording}
          onClick={toggleShowActModal}
          style={{ cursor: 'pointer' }}>
          {limitStrTo(21, act.wording)}
        </td>
        <td className='fw-bold'>
          {act.price
            ? <><span className='text-secondary me-1'>{currency && currency.value}</span>
              {parseFloat(act.price).toFixed(2).toLocaleString()}</>
            : '❓'}
        </td>
        <td className='text-uppercase' title={act?.category ? act.category.name : ''}>
          {act?.category
            ? <Badge>{limitStrTo(18, act.category.name)}</Badge>
            : '❓'}
        </td>
        <td className='text-md-end'>
          <ButtonGroup size='sm'>
            <Button type='button' variant='light' title='Modification' disabled={isLoading} onClick={toggleEditModal}>
              <i className='bi bi-pencil-square text-primary'/>
            </Button>
            <Button size='sm' variant='light' type='button' title='Suppression' disabled={isLoading} onClick={toggleDeleteModal}>
              <i className='bi bi-trash3 text-danger'/>
            </Button>
          </ButtonGroup>
        </td>
      </tr>

      <ShowSingleAct
        currency={currency}
        show={show}
        onHide={toggleShowActModal}
        act={act} />

      <EditAct
        onHide={toggleEditModal}
        show={showEdit}
        data={act}
        currency={currency}
        onRefresh={onRefresh} />
      <AppDelModal
        show={showDelete}
        onHide={toggleDeleteModal}
        onDelete={onDelete}
        text={
          <p>
            Êtes-vous certain(e) de vouloir supprimer l'acte médical <br/>
            <i className='bi bi-quote me-1'/>
            <span className="fw-bold text-uppercase">{act.wording}</span>
            <i className='bi bi-quote mx-1'/>
          </p>
        } />
    </>
  )
}

export const ActsList = () => {
  const [search, setSearch] = useState('')
  const [showNew, setShowNew] = useState(false)
  const {data: acts = [], isLoading, isFetching, isSuccess, isError, refetch} = useGetActsQuery('Act')
  const { fCurrency } = useSelector(state => state.parameters)

  const [contents, setContents] = useState([])
  const [tempSearch, setTempSearch] = useState('')
  const [page, setPage] = useState(1)
  const [checkActs, setCheckActs] = useState({isSearching: false, isPaginated: false,})

  const handleToggleNewAct = () => setShowNew(!showNew)

  const [paginatedActs, setPaginatedActs] = useState([])
  const [researchPaginatedActs, setResearchPaginatedActs] = useState([])

  const [getActsByPagination, {isFetching: isFetching2, isError: isError2,}] = useLazyGetActsByPaginationQuery()
  const [getResearchActs, {isFetching: isFetching3, isError: isError3,}] = useLazyGetResearchActsQuery()
  const [getResearchActsByPagination, {
    isFetching: isFetching4,
    isError: isError4,
  }] = useLazyGetResearchActsByPaginationQuery()

  async function handlePagination(pagination) {
    const param = pagination + 1
    setPage(param)
    setCheckActs({isSearching: false, isPaginated: true})
    const { data: searchData, isSuccess } = await getActsByPagination(param)
    if (isSuccess && searchData) {
      setPaginatedActs(searchData)
    }
  } // handle main pagination

  async function handlePagination2(pagination) {
    const param = pagination + 1
    const keywords = {page: param, keyword: tempSearch}
    setPage(param)
    setCheckActs({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchActsByPagination(keywords)
    if (isSuccess && searchData) {
      setResearchPaginatedActs(searchData)
    }
  } // 2nd handle main pagination

  async function handleSubmit(e) {
    e.preventDefault()
    setPage(1)
    setTempSearch(search)
    setSearch('')
    setCheckActs({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchActs(search)
    if (isSuccess && searchData) {
      setResearchPaginatedActs(searchData)
    }
  } // submit search keywords

  const onRefresh = async () => {
    setCheckActs({isSearching: false, isPaginated: false})
    setSearch('')
    setTempSearch('')
    setPage(1)
    await refetch()
  }

  useEffect(() => {
    if (!checkActs.isSearching && !checkActs.isPaginated && isSuccess && acts)
      setContents(acts.filter(f => f?.wording.toLowerCase().includes(search.toLowerCase())))
    else if (!checkActs.isSearching && checkActs.isPaginated && isSuccess && acts)
      setContents(paginatedActs?.filter(f => f?.wording.toLowerCase().includes(search.toLowerCase())))
    else if (checkActs.isSearching && !checkActs.isPaginated && isSuccess && acts)
      setContents(researchPaginatedActs?.filter(f => f?.wording.toLowerCase().includes(search.toLowerCase())))
  }, [
    checkActs,
    isSuccess,
    acts,
    search,
    researchPaginatedActs,
    paginatedActs,
  ])

  return (
    <>
      <AppDataTableStripped
        loader={isLoading || isFetching2 || isFetching4}
        title='Liste des actes médicaux'
        overview={
          <>
            {checkActs.isSearching &&
              <p>
                Au total
                <code className="mx-1 me-1">{totalResearchActs.toLocaleString()}</code>
                acte(s) médicaux trouvé(s) suite à votre recherche ⏩ <b>{tempSearch}</b> :
              </p>}

            <Col md={3}>
              <Button
                type='button'
                title='Enregistrer un acte médical'
                className='mb-1 me-1'
                onClick={handleToggleNewAct}>
                <i className='bi bi-plus'/> Enregistrer
              </Button>
            </Col> {/* add new patient and printing's launch button */}
            <Col className='text-md-end'>
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
            </Col> {/* search form for patients */}
          </>
        }
        thead={
        <AppTHead
          onRefresh={onRefresh}
          loader={isLoading || isFetching2 || isFetching4 || isFetching3}
          isFetching={isFetching || isFetching2 || isFetching4 || isFetching3}
          isImg
          items={[
            {label: '#'},
            {label: 'Libéllé'},
            {label: 'Prix'},
            {label: 'Catégorie'},
          ]}/>}
        tbody={

          <tbody>
            {!isLoading && contents.length > 0 && contents.map(act =>
              <ActItem
                key={act?.id}
                currency={fCurrency}
                act={act}
                onRefresh={onRefresh}/>)}
          </tbody>
      } />

      {isLoading || isFetching || isFetching2 || isFetching3 || isFetching4
        ? <BarLoaderSpinner loading={isLoading || isFetching || isFetching2 || isFetching3 || isFetching4}/>
        : (
          <>
            {actsPages > 1 && isSuccess && acts
              && !checkActs.isSearching &&
              <AppPaginationComponent
                nextLabel=''
                previousLabel=''
                onPaginate={handlePagination}
                currentPage={page - 1}
                pageCount={actsPages} />}

            {researchActsPages > 1 && isSuccess && acts && checkActs.isSearching &&
              <AppPaginationComponent
                nextLabel=''
                previousLabel=''
                onPaginate={handlePagination2}
                currentPage={page - 1}
                pageCount={researchActsPages} />}
          </>
        )}

      {isError && <div className='mb-3'><AppMainError/></div>}
      {isError2 && <div className='mb-3'><AppMainError/></div>}
      {isError3 && <div className='mb-3'><AppMainError/></div>}
      {isError4 && <div className='mb-3'><AppMainError/></div>}

      <AddActs show={showNew} onHide={handleToggleNewAct} currency={fCurrency} />
    </>
  )
}
