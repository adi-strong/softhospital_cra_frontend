import {useEffect, useState} from "react";
import {AppDataTableStripped, AppDelModal, AppMainError, AppTHead} from "../../components";
import {Button, ButtonGroup, Form} from "react-bootstrap";
import {AddBedroomCategories} from "./AddBedroomCategories";
import {
  totalBedroomCategories,
  useDeleteBedroomCategoryMutation,
  useGetBedroomCategoriesQuery
} from "./bedroomCategoryApiSlice";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {limitStrTo} from "../../services";
import toast from "react-hot-toast";
import {EditBedroomCategory} from "./EditBedroomCategory";

const BedroomCategoryItem = ({ category }) => {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteBedroomCategory, {isLoading}] = useDeleteBedroomCategoryMutation()

  const toggleEditModal = () => setShowEdit(!showEdit)
  const toggleDeleteModal = () => setShowDelete(!showDelete)

  async function onDelete() {
    try {
      toggleDeleteModal()
      const formData = await deleteBedroomCategory(category)
      if (!formData.error) toast.success('Suppression bien efféctuée.', {icon: '😶'})
    }
    catch (e) { toast.error(e.message) }
  }

  return (
    <>
      <tr>
        <td><i className='bi bi-tag'/></td>
        <td className='text-capitalize' title={category.name}>{limitStrTo(30, category.name)}</td>
        <td>{category?.createdAt ? category.createdAt : '❓'}</td>
        <td className='text-md-end'>
          <ButtonGroup>
            <Button
              type='button'
              variant='light'
              className='p-0 px-1 pe-1'
              title='Modifier'
              disabled={isLoading}
              onClick={toggleEditModal}>
              <i className='bi bi-pencil text-primary'/>
            </Button>
            <Button
              type='button'
              variant='light'
              className='p-0 px-1 pe-1'
              title='Supprimer'
              disabled={isLoading}
              onClick={toggleDeleteModal}>
              <i className='bi bi-trash text-danger'/>
            </Button>
          </ButtonGroup>
        </td>
      </tr>

      <EditBedroomCategory data={category} onHide={toggleEditModal} show={showEdit} />
      <AppDelModal
        show={showDelete}
        onHide={toggleDeleteModal}
        onDelete={onDelete}
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

export const BedroomCategoriesList = () => {
  const [search, setSearch] = useState('')
  const [contents, setContents] = useState([])
  const [showNew, setShowNew] = useState(false)
  const {
    data: categories = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    refetch} = useGetBedroomCategoriesQuery('BedroomCategories')

  useEffect(() => {
    if (isSuccess && categories) {
      const items = categories.ids?.map(id => { return categories?.entities[id] })
      setContents(items?.filter(c => c?.name.toLowerCase().includes(search.toLowerCase())))
    }
  }, [isSuccess, categories, search])

  const handleToggleNewBedroomCategory = () => setShowNew(!showNew)

  const onRefresh = async () => {
    setSearch('')
    await refetch()
  }

  return (
    <>
      <AppDataTableStripped
        title={<><i className='bi bi-tags'/> Catégories des chambres</>}
        overview={
          <>
            <p>
              {totalBedroomCategories < 1
                ? 'Aucun(e) catégorie enregistrée.'
                : <>Il y a au total <code>{totalBedroomCategories.toLocaleString()}</code> catégorie(s) enregistré(s) :</>}
            </p>
            <div className='text-md-end mb-2'>
              <Button
                type='button'
                variant='secondary'
                title='Enregistrer les catégories'
                className='mb-1 me-1'
                onClick={handleToggleNewBedroomCategory}>
                <i className='bi bi-plus'/> Enregistrer
              </Button>
            </div> {/* add new patient and printing's launch button */}
            <div className='text-md-end'>
              <form onSubmit={(e) => { e.preventDefault() }}>
                <Form.Control
                  placeholder='Votre recherche ici...'
                  aria-label='Votre recherche ici...'
                  autoComplete='off'
                  disabled={categories.length < 1 || isLoading || isFetching}
                  name='search'
                  value={search}
                  onChange={({ target }) => setSearch(target.value)} />
              </form>
            </div> {/* search form for patients */}
          </>
        }
        thead={<AppTHead isImg loader={isLoading} isFetching={isFetching} onRefresh={onRefresh} items={[
          {label: 'Libellé'},
          {label: "Date d'ajout"},
        ]}/>}
        tbody={
          <tbody>
            {!isLoading && contents.length > 0 && contents.map(item =>
              <BedroomCategoryItem key={item?.id} category={item}/>)}
          </tbody>} />

      {isLoading && <BarLoaderSpinner loading={isLoading}/>}

      {isError && <AppMainError/>}

      <AddBedroomCategories onHide={handleToggleNewBedroomCategory} show={showNew} />
    </>
  )
}
