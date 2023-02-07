import {useState} from "react";
import {AppDataTableStripped, AppDelModal, AppMainError, AppTHead} from "../../components";
import {Button, ButtonGroup, Form, InputGroup} from "react-bootstrap";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {AddActCategories} from "./AddActCategories";
import {totalActCategories, useDeleteActCategoryMutation, useGetActCategoriesQuery} from "./actCategoriesApiSlice";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {limitStrTo} from "../../services";
import toast from "react-hot-toast";
import {EditActCategory} from "./EditActCategory";

const CategoryActItem = ({id}) => {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteActCategory, {isLoading}] = useDeleteActCategoryMutation()
  const { category } = useGetActCategoriesQuery('ActCategories', {
    selectFromResult: ({ data }) => ({ category: data.entities[id] })
  })

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
          {limitStrTo(18, category.name)}
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
  const [keywords, setKeywords] = useState({search: ''})
  const [showNew, setShowNew] = useState(false)
  const {data: categories = [], isLoading, isFetching, isSuccess, isError, refetch} = useGetActCategoriesQuery('ActCategories')

  let content, errors
  if (isError) errors = <AppMainError/>
  else if (isSuccess) content = categories && categories.ids.map(id => <CategoryActItem key={id} id={id}/>)

  const handleToggleNewCategory = () => setShowNew(!showNew)

  function handleSubmit(e) {
    e.preventDefault()
  } // submit search keywords

  const onRefresh = async () => await refetch()

  return (
    <>
      <AppDataTableStripped
        title='Liste des catégories'
        overview={
          <>
            <p>
              {categories.length < 1
                ? 'Aucun(e) patient(e) enregistré(e).'
                : <>Au total, <code>{totalActCategories.toLocaleString()}</code> catégorie(s) enregistrée(s) :</>}
            </p>
            <div className='text-md-end'>
              <Button
                type='button'
                title='Enregistrer un acte médical'
                className='mb-2 me-1'
                onClick={handleToggleNewCategory}>
                <i className='bi bi-plus'/> Enregistrer
              </Button>
            </div> {/* add new patient and printing's launch button */}
            <div className='text-md-end'>
              <form onSubmit={handleSubmit}>
                <InputGroup>
                  <Form.Control
                    placeholder='Votre recherche ici...'
                    aria-label='Votre recherche ici...'
                    autoComplete='off'
                    disabled={categories.length < 1}
                    name='search'
                    value={keywords.search}
                    onChange={(e) => handleChange(e, keywords, setKeywords)} />
                  <Button type='submit' variant='light' disabled={categories.length < 1}>
                    <i className='bi bi-search'/>
                  </Button>
                </InputGroup>
              </form>
            </div> {/* search form for patients */}
          </>
        }
        thead={<AppTHead isImg loader={isLoading} isFetching={isFetching} onRefresh={onRefresh} items={[
          {label: 'Libéllé'},
          {label: "Date d'enregistrement"},
        ]} />}
        tbody={<tbody>{content}</tbody>} />

      {isLoading && <BarLoaderSpinner loading={isLoading} />}

      {errors && errors}

      <AddActCategories onHide={handleToggleNewCategory} show={showNew} />
    </>
  )
}
