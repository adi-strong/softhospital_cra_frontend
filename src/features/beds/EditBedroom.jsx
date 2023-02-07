import {useEffect, useState} from "react";
import {Button, Modal, Spinner} from "react-bootstrap";
import {BedroomForm} from "./BedroomForm";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {useUpdateBedroomMutation} from "./bedroomApiSlice";
import {useGetBedroomCategoriesQuery} from "./bedroomCategoryApiSlice";
import toast from "react-hot-toast";

export const EditBedroom = ({onHide, show = false, data}) => {
  const [bedroom, setBedroom] = useState({number: '', description: '', category: 'none'})
  const [updateBedroom, {isLoading, isError, error}] = useUpdateBedroomMutation()
  const {
    data: categories = [],
    isLoading: isCategoriesLoad,
    isSuccess,
    isError: isCategoriesError} = useGetBedroomCategoriesQuery('BedroomCategories')

  let apiErrors = {number: null, description: null}, options
  if (isCategoriesError) alert('Erreur lors du chargement des catégories !!')
  else if (isSuccess) options = categories && categories.ids.map(id => {
    return {
      label: categories.entities[id].name,
      value: categories.entities[id]['@id'],
    }
  })

  const handleChangeBedroomCategory = ({target}) => setBedroom({...bedroom, category: target.value})

  useEffect(() => {
    if (data) setBedroom({
      id: data.id,
      number: data.number,
      description: data?.description ? data.description : '',
      category: data?.category ? data.category['@id'] : null,
    })
  }, [data])

  async function onSubmit() {
    apiErrors = {number: null, description: null}
    try {
      const formData = await updateBedroom({...bedroom,
        category: bedroom.category && bedroom.category !== 'none'
          ? bedroom.category
          : null})
      if (!formData.error) {
        toast.success('Modification bien efféctuée.')
        setBedroom({description: '', number: '', category: 'none'})
        onHide()
      }
    }
    catch (e) { toast.error(e.message) }
  }

  if (isError) {
    const { violations } = error.data
    if (violations) {
      violations.forEach(({ propertyPath, message }) => {
        apiErrors[propertyPath] = message;
      });
    }
  }

  return (
    <>
      <Modal show={show} onHide={onHide} backdrop='static' keyboard={false}>
        <Modal.Header closeButton className='bg-primary text-light'>
          <Modal.Title><i className='bi bi-pencil'/> Modification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BedroomForm
            options={options}
            apiErrors={apiErrors}
            bedroom={bedroom}
            isLoading={isLoading}
            handleChange={handleChange}
            setBedroom={setBedroom}
            handleChangeBedroomCategory={handleChangeBedroomCategory}
            isCategoriesLoad={isCategoriesLoad} />
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={isLoading} type='button' variant='light' onClick={onHide}>
            <i className='bi bi-x'/> Annuler
          </Button>
          <Button disabled={isLoading} type='button' onClick={onSubmit}>
            {isLoading ? <>Veuillez patienter <Spinner animation='border' size='sm'/></> : 'Enregistrer'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
