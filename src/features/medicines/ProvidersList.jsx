import {useEffect, useState} from "react";
import {AppDataTableStripped, AppMainError, AppPaginationComponent, AppTHead} from "../../components";
import {
  providersPages, researchProvidersPages, totalResearchProviders,
  useGetProvidersQuery,
  useLazyGetProvidersByPaginationQuery, useLazyGetResearchProvidersByPaginationQuery,
  useLazyGetResearchProvidersQuery
} from "./providerApiSlice";
import {ProviderItem} from "./ProviderItem";
import {Button, Col, Form} from "react-bootstrap";
import {AddProviderModal} from "./AddProviderModal";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";

const thead = [
  {label: '#'},
  {label: 'Désignation'},
  {label: 'P. Focal'},
  {label: 'n° Tél.'},
  {label: 'Email'},
  {label: <><i className='bi bi-person'/></>},
  {label: <><i className='bi bi-calendar-event'/> Date</>},
]

export const ProvidersList = () => {
  const {
    data: providers = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    refetch} = useGetProvidersQuery('Providers')
  const [search, setSearch] = useState('')
  const [show, setShow] = useState(false)
  const [contents, setContents] = useState([])
  const [tempSearch, setTempSearch] = useState('')
  const [page, setPage] = useState(1)
  const [checkItems, setCheckItems] = useState({isSearching: false, isPaginated: false,})

  const toggleModal = () => setShow(!show)

  const [paginatedItems, setPaginatedItems] = useState([])
  const [researchPaginatedItems, setResearchPaginatedItems] = useState([])

  const [getProvidersByPagination, {isFetching: isFetching2, isError: isError2,}] = useLazyGetProvidersByPaginationQuery()
  const [getResearchProviders, {isFetching: isFetching3, isError: isError3,}] = useLazyGetResearchProvidersQuery()
  const [getResearchProvidersByPagination, {
    isFetching: isFetching4,
    isError: isError4,
  }] = useLazyGetResearchProvidersByPaginationQuery()

  async function handlePagination(pagination) {
    const param = pagination + 1
    setPage(param)
    setCheckItems({isSearching: false, isPaginated: true})
    const { data: searchData, isSuccess } = await getProvidersByPagination(param)
    if (isSuccess && searchData) {
      setPaginatedItems(searchData)
    }
  } // handle main pagination

  async function handlePagination2(pagination) {
    const param = pagination + 1
    const keywords = {page: param, keyword: tempSearch}
    setPage(param)
    setCheckItems({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchProvidersByPagination(keywords)
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
    const { data: searchData, isSuccess } = await getResearchProviders(search)
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
    if (!checkItems.isSearching && !checkItems.isPaginated && isSuccess && providers)
      setContents(providers.filter(f => f?.wording.toLowerCase().includes(search.toLowerCase())))
    else if (!checkItems.isSearching && checkItems.isPaginated && isSuccess && providers)
      setContents(paginatedItems?.filter(f => f?.wording.toLowerCase().includes(search.toLowerCase())))
    else if (checkItems.isSearching && !checkItems.isPaginated && isSuccess && providers)
      setContents(researchPaginatedItems?.filter(f => f?.wording.toLowerCase().includes(search.toLowerCase())))
  }, [
    checkItems,
    isSuccess,
    providers,
    search,
    researchPaginatedItems,
    paginatedItems,
  ])

  return (
    <>
      <AppDataTableStripped
        loader={isLoading || isFetching2 || isFetching4}
        title='Liste des fournisseurs de produits'
        thead={
          <AppTHead
            loader={isLoading}
            isFetching={isFetching || isFetching2 || isFetching4 || isFetching3}
            onRefresh={onRefresh}
            items={thead}/>}
        tbody={
          <tbody>
            {!isError && isSuccess && contents.length > 0 &&
              contents.map(p => <ProviderItem key={p?.id} provider={p}/>)}
          </tbody>
        }
        overview={
          <>
            <div className="mb-3">
              {checkItems.isSearching ?
                totalResearchProviders > 0 ?
                  <p>
                    Au total
                    <code className="mx-1 me-1">{totalResearchProviders.toLocaleString()}</code>
                    fournisseur(s) trouvé(s) suite à votre recherche ⏩ <b>{tempSearch}</b> :
                  </p> : 'Aucune occurence trouvée 🎈' : ''}
            </div>

            <Col className='mb-2'>
              <Form onSubmit={handleSubmit}>
                <Form.Control
                  placeholder='Rechercher'
                  name='search'
                  value={search}
                  disabled={isFetching3}
                  onChange={({ target }) => setSearch(target.value)} />
              </Form>
            </Col>
            <Col md={3} className='mb-2'>
              <Button type='button' className='w-100' onClick={toggleModal}>
                <i className='bi bi-plus'/> Ajouter un fournisseur
              </Button>
            </Col>
          </>
        } />

      {isLoading || isFetching || isFetching2 || isFetching3 || isFetching4
        ? <BarLoaderSpinner loading={isLoading || isFetching || isFetching2 || isFetching3 || isFetching4}/>
        : (
          <>
            {providersPages > 1 && isSuccess && providers
              && !checkItems.isSearching &&
              <AppPaginationComponent
                onPaginate={handlePagination}
                currentPage={page - 1}
                pageCount={providersPages} />}

            {researchProvidersPages > 1 && isSuccess && providers && checkItems.isSearching &&
              <AppPaginationComponent
                onPaginate={handlePagination2}
                currentPage={page - 1}
                pageCount={researchProvidersPages} />}
          </>
        )}

      {isError && <div className='mb-3'><AppMainError/></div>}
      {isError2 && <div className='mb-3'><AppMainError/></div>}
      {isError3 && <div className='mb-3'><AppMainError/></div>}
      {isError4 && <div className='mb-3'><AppMainError/></div>}

      <AddProviderModal show={show} onHide={toggleModal} />
    </>
  )
}
