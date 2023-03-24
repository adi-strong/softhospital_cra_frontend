import {useEffect, useState} from "react";
import {AppDataTableStripped, AppDelModal, AppMainError, AppTHead} from "../../components";
import {Button, ButtonGroup, Col, Form} from "react-bootstrap";
import {AddActCategories} from "./AddActCategories";
import {
  useDeleteActCategoryMutation,
  useGetActCategoriesQuery,
} from "./actCategoriesApiSlice";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {limitStrTo} from "../../services";
import toast from "react-hot-toast";
import {EditActCategory} from "./EditActCategory";

const CategoryActItem = ({ category }) => {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteActCategory, {isLoading}] = useDeleteActCategoryMutation()

  const toggleEditModal = () => setShowEdit(!showEdit)
  const toggleDeleteModal = () => setShowDelete(!showDelete)

  const onDelete = async () => {
    toggleDeleteModal()
    try {
      await deleteActCategory(category)
    }
    catch (e) { toast.error(e.message) }
  }

  return (
    <>
      <tr>
        <td><i className='bi bi-tags'/></td>
        <td className='text-uppercase' title={category.name}>
          {limitStrTo(14, category.name)}
        </td>
        <td>{category?.createdAt ? category.createdAt : '❓'}</td>
        <td className='text-md-end'>
          <ButtonGroup size='sm'>
            <Button type='button' variant='light' title='Modification' disabled={isLoading} onClick={toggleEditModal}>
              <i className='bi bi-pencil-square text-primary'/>
            </Button>
            <Button type='button' variant='light' title='Suppression' disabled={isLoading} onClick={toggleDeleteModal}>
              <i className='bi bi-trash3 text-danger'/>
            </Button>
          </ButtonGroup>
        </td>
      </tr>

      <EditActCategory show={showEdit} onHide={toggleEditModal} data={category} />
      <AppDelModal
        onDelete={onDelete}
        show={showDelete}
        onHide={toggleDeleteModal}
        text={
          <p>
            Êtes-vous certain(e) de vouloir supprimer la catégorie <br/>
            <i className='bi bi-quote me-1'/>
            <span className="fw-bold text-uppercase">{category.name}</span>
            <i className='bi bi-quote mx-1'/>
          </p>
        } />
    </>
  )
}

export const ActCategoriesList = () => {
  const [showNew, setShowNew] = useState(false)
  const {data: categories = [], isLoading, isFetching, isSuccess, isError, refetch} = useGetActCategoriesQuery('ActCategories')

  const [contents, setContents] = useState([])
  const [search, setSearch] = useState('')

  const handleToggleNewCategory = () => setShowNew(!showNew)

  const onRefresh = async () => {
    setSearch('')
    await refetch()
  }

  useEffect(() => {
    if (isSuccess && categories)
      setContents(categories.filter(f => f?.name.toLowerCase().includes(search.toLowerCase())))
  }, [isSuccess, categories, search])

  return (
    <>
      <AppDataTableStripped
        title='Liste des catégories'
        overview={
          <>
            <Col md={4} className='mb-2'>
              <Button
                type='button'
                title='Enregistrer un acte médical'
                className='mb-2 me-1'
                onClick={handleToggleNewCategory}>
                <i className='bi bi-plus'/> Enregistrer
              </Button>
            </Col> {/* add new patient and printing's launch button */}
            <Col className='mb-2'>
              <form onSubmit={(e) => { e.preventDefault() }}>
                <Form.Control
                  placeholder='Votre recherche ici...'
                  aria-label='Votre recherche ici...'
                  autoComplete='off'
                  disabled={isLoading || isFetching}
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
          loader={isLoading}
          isFetching={isFetching}
          onRefresh={onRefresh}
          items={[
            {label: 'Libéllé'},
            {label: 'Date'},
          ]} />}
        tbody={
        <tbody>
          {!isLoading && contents.length > 0 && contents.map(item =>
            <CategoryActItem key={item?.id} category={item} onRefresh={onRefresh}/>)}
        </tbody>} />

      {isLoading && <BarLoaderSpinner loading={isLoading} />}

      {isError && <div className='mb-3'><AppMainError/></div>}

      <AddActCategories onHide={handleToggleNewCategory} show={showNew} />
    </>
  )
}
