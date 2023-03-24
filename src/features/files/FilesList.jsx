import {useEffect, useState} from "react";
import {AppDataTableStripped, AppDelModal, AppMainError, AppPaginationComponent, AppTHead} from "../../components";
import {Button, ButtonGroup, Col, Form} from "react-bootstrap";
import {
  consultationTypesPages, researchConsultationTypesPages, totalResearchConsultationTypes,
  useDeleteConsultationTypeMutation,
  useGetConsultationTypesQuery,
  useLazyGetConsultationTypesByPaginationQuery,
  useLazyGetResearchConsultationTypesByPaginationQuery,
  useLazyGetResearchConsultationTypesQuery
} from "./consultationTypeApiSlice";
import {EditFileType} from "./EditFileType";
import toast from "react-hot-toast";
import {useSelector} from "react-redux";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";

const FileItem = ({ file, currency, onDelete, onRefresh }) => {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteConsultationType, {isLoading}] = useDeleteConsultationTypeMutation()

  const toggleEditModal = () => setShowEdit(!showEdit)
  const toggleDeleteModal = () => setShowDelete(!showDelete)

  return (
    <>
      <tr>
        <td><i className='bi bi-file-medical'/></td>
        <th scope='row'>#{file.id}</th>
        <td className='text-uppercase'>{file.wording}</td>
        <td className='text-capitalize fw-bolder'>
          <span className='text-secondary me-1'>{currency && currency.value}</span>
          {parseFloat(file.price).toFixed(2).toLocaleString()}
        </td>
        <td className='text-end'>
          <ButtonGroup size='sm'>
            <Button type='button' variant='light' title='Modifier' disabled={isLoading} onClick={toggleEditModal}>
              <i className='bi bi-pencil-square text-primary'/>
            </Button>
            <Button type='button' variant='light' title='Supprimer' disabled={isLoading} onClick={toggleDeleteModal}>
              <i className='bi bi-trash3 text-danger'/>
            </Button>
          </ButtonGroup>
        </td>
      </tr>

      <EditFileType
        onRefresh={onRefresh}
        onHide={toggleEditModal}
        show={showEdit}
        data={file}
        currency={currency} />
      <AppDelModal
        onHide={toggleDeleteModal}
        show={showDelete}
        onDelete={() => onDelete(file, deleteConsultationType, toggleDeleteModal)}
        text={
          <p>
            Êtes-vous certain(e) de vouloir supprimer ce type de fiche <br/>
            <i className='bi bi-quote me-1'/>
            <span className="fw-bold text-uppercase">{file.wording}</span>
            <i className='bi bi-quote mx-1'/>
          </p>
        } />
    </>
  )
}

export const FilesList = () => {
  const [search, setSearch] = useState('')
  const [contents, setContents] = useState([])
  const { fCurrency } = useSelector(state => state.parameters)
  const {data: fileTypes = [], isLoading, isFetching, isSuccess, isError, refetch} = useGetConsultationTypesQuery('ConsultationType')

  const [tempSearch, setTempSearch] = useState('')
  const [page, setPage] = useState(1)
  const [checkFiles, setCheckFiles] = useState({isSearching: false, isPaginated: false,})

  const [paginatedFiles, setPaginatedFiles] = useState([])
  const [researchFiles, setResearchFiles] = useState([])

  const [getConsultationTypesByPagination, {
    isFetching: isFetching2,
    isError: isError2,
  }] = useLazyGetConsultationTypesByPaginationQuery()

  const [getResearchConsultationTypes, {
    isFetching: isFetching3,
    isError: isError3,
  }] = useLazyGetResearchConsultationTypesQuery()

  const [getResearchConsultationTypesByPagination, {
    isFetching: isFetching4,
    isError: isError4,
  }] = useLazyGetResearchConsultationTypesByPaginationQuery()

  async function handlePagination(pagination) {
    const param = pagination + 1
    setPage(param)
    setCheckFiles({isSearching: false, isPaginated: true})
    const { data: searchData, isSuccess } = await getConsultationTypesByPagination(param)
    if (isSuccess && searchData) {
      setPaginatedFiles(searchData)
    }
  } // handle main pagination

  async function handlePagination2(pagination) {
    const param = pagination + 1
    const keywords = {page: param, keyword: tempSearch}
    setPage(param)
    setCheckFiles({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchConsultationTypesByPagination(keywords)
    if (isSuccess && searchData) {
      setResearchFiles(searchData)
    }
  } // 2nd handle main pagination

  async function handleSubmit(e) {
    e.preventDefault()
    setPage(1)
    setTempSearch(search)
    setSearch('')
    setCheckFiles({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchConsultationTypes(search)
    if (isSuccess && searchData) {
      setResearchFiles(searchData)
    }
  } // submit search keywords

  const onRefresh = async () => {
    setCheckFiles({isSearching: false, isPaginated: false})
    setSearch('')
    setTempSearch('')
    setPage(1)
    await refetch()
  }

  const onDelete = async (file, func, onHide) => {
    onHide()
    try {
      await func(file)
      await onRefresh()
    }
    catch (e) { toast.error(e.message) }
  }

  useEffect(() => {
    if (!checkFiles.isSearching && !checkFiles.isPaginated && isSuccess && fileTypes)
      setContents(fileTypes.filter(f => f?.wording.toLowerCase().includes(search.toLowerCase())))
    else if (!checkFiles.isSearching && checkFiles.isPaginated && isSuccess && fileTypes)
      setContents(paginatedFiles?.filter(f => f?.wording.toLowerCase().includes(search.toLowerCase())))
    else if (checkFiles.isSearching && !checkFiles.isPaginated && isSuccess && fileTypes)
      setContents(researchFiles?.filter(f => f?.wording.toLowerCase().includes(search.toLowerCase())))
  }, [
    checkFiles,
    isSuccess,
    fileTypes,
    search,
    researchFiles,
    paginatedFiles,
  ])

  return (
    <>
      <AppDataTableStripped
        loader={isLoading || isFetching2 || isFetching4}
        title='Liste de types des fiches'
        overview={
          <>
            {checkFiles.isSearching &&
              <p>
                Au total
                <code className="mx-1 me-1">
                  {totalResearchConsultationTypes.toLocaleString()}
                </code>
                types de fiches trouvées suite à votre recherche ⏩ <b>{tempSearch}</b> :
              </p>}

            <Col className='text-md-end'>
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
            </Col> {/* search form for patients */}
          </>
        }
        thead={
          <AppTHead
            isImg
            loader={isLoading || isFetching2 || isFetching4}
            isFetching={isFetching || isFetching2 || isFetching4 || isFetching3}
            onRefresh={onRefresh}
            items={[{label: '#'}, {label: 'Libellé'}, {label: 'Prix'}]}/>}
        tbody={
          <tbody>
            {!isLoading && contents.length > 0 && contents.map(file =>
              <FileItem key={file?.id} file={file} currency={fCurrency} onDelete={onDelete} onRefresh={onRefresh}/>)}
          </tbody>} />

      {isLoading || isFetching || isFetching2 || isFetching3 || isFetching4
        ? <BarLoaderSpinner loading={isLoading || isFetching || isFetching2 || isFetching3 || isFetching4}/>
        : (
          <>
            {consultationTypesPages > 1 && isSuccess && fileTypes
              && !checkFiles.isSearching &&
              <AppPaginationComponent
                nextLabel=''
                previousLabel=''
                onPaginate={handlePagination}
                currentPage={page - 1}
                pageCount={consultationTypesPages} />}

            {researchConsultationTypesPages > 1 && isSuccess && fileTypes && checkFiles.isSearching &&
              <AppPaginationComponent
                nextLabel=''
                previousLabel=''
                onPaginate={handlePagination2}
                currentPage={page - 1}
                pageCount={researchConsultationTypesPages} />}
          </>
        )}

      {isError && <div className='mb-3'><AppMainError/></div>}
      {isError2 && <div className='mb-3'><AppMainError/></div>}
      {isError3 && <div className='mb-3'><AppMainError/></div>}
      {isError4 && <div className='mb-3'><AppMainError/></div>}
    </>
  )
}
