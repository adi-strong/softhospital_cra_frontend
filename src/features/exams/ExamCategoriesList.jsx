import {useEffect, useState} from "react";
import {AppDataTableStripped, AppDelModal, AppMainError, AppTHead} from "../../components";
import {Button, ButtonGroup, Col, Form} from "react-bootstrap";
import {AddExamCategories} from "./AddExamCategories";
import {totalExamCategories, useDeleteExamCategoryMutation, useGetExamCategoriesQuery} from "./examCategoryApiSlice";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {limitStrTo} from "../../services";
import toast from "react-hot-toast";
import {EditExamCategory} from "./EditExamCategory";

const ExamCategoryItem = ({ category }) => {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteExamCategory, {isLoading}] = useDeleteExamCategoryMutation()

  const toggleEditModal = () => setShowEdit(!showEdit)
  const toggleDeleteModal = () => setShowDelete(!showDelete)

  async function onDelete() {
    try {
      toggleDeleteModal()
      const formData = await deleteExamCategory(category)
      if (!formData.error) toast.success('Suppression bien efféctuée.', {icon: '😶'})
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
        <td>{category?.createdAt ? category.createdAt : '-'}</td>
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

      <EditExamCategory show={showEdit} onHide={toggleEditModal} data={category} />
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

export const ExamCategoriesList = () => {
  const [search, setSearch] = useState('')
  const [showNew, setShowNew] = useState(false)
  const {
    data: categories = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    refetch} = useGetExamCategoriesQuery('ExamCategories')

  const [contents, setContents] = useState([])

  const handleToggleNewExamCategory = () => setShowNew(!showNew)

  const onRefresh = async () => {
    setSearch('')
    await refetch()
  }

  useEffect(() => {
    if (isSuccess && categories) {
      const items = categories.ids?.map(id => { return categories?.entities[id] })
      setContents(items?.filter(c => c?.name.toLowerCase().includes(search.toLowerCase())))
    }
  }, [isSuccess, categories, search])

  return (
    <>
      <AppDataTableStripped
        title='Liste de catégories des examens'
        overview={
          <>
            <p>
              {totalExamCategories < 1
                ? 'Aucune catégorie pour le moment 🎈'
                : <>Il y a au total <code>{totalExamCategories.toLocaleString()}</code> catégorie(s) :</>}
            </p>
            <Col md={4} className='mb-2'>
              <Button
                type='button'
                title='Enregistrement des catégories'
                className='mb-1 me-1'
                onClick={handleToggleNewExamCategory}>
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
        thead={<AppTHead isImg loader={isLoading} isFetching={isFetching} onRefresh={onRefresh} items={[
          {label: 'Libéllé'},
          {label: "Date"},
        ]}/>}
        tbody={
          <tbody>
            {!isLoading && contents.length > 0 && contents.map(item =>
              <ExamCategoryItem key={item?.id} category={item}/>)}
          </tbody>} />

      {isLoading && <BarLoaderSpinner loading={isLoading}/>}

      {isError && <div className='mb-3'><AppMainError/></div>}

      <AddExamCategories onHide={handleToggleNewExamCategory} show={showNew} />
    </>
  )
}
