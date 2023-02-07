import {useState} from "react";
import {Button, Modal, Spinner} from "react-bootstrap";
import {handleChange} from "../../services/handleFormsFieldsServices";
import PropTypes from "prop-types";
import {useAddNewBedroomMutation} from "./bedroomApiSlice";
import toast from "react-hot-toast";
import {useGetBedroomCategoriesQuery} from "./bedroomCategoryApiSlice";
import {BedroomForm} from "./BedroomForm";

export const AddBedroom = ({onHide, show = false}) => {
  const [bedroom, setBedroom] = useState({number: '', description: '', category: 'none'})
  const [addNewBedroom, {isLoading, isError, error}] = useAddNewBedroomMutation()
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

  async function onSubmit() {
    apiErrors = {number: null, description: null}
    try {
      const formData = await addNewBedroom({...bedroom,
        category: bedroom.category && bedroom.category !== 'none'
          ? bedroom.category
          : null})
      if (!formData.error) {
        toast.success('Enregistrement bien efféctué.')
        setBedroom({description: '', number: '', category: 'none'})
        onHide()
      }
    }
    catch (e) { toast.error(e.message) }
  }

  const onReset = () => setBedroom({number: '', description: '', category: 'none'})

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
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une chambre</Modal.Title>
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
            isCategoriesLoad={isCategoriesLoad}
            onReset={onReset} />
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

AddBedroom.propTypes = {show: PropTypes.bool, onHide: PropTypes.func.isRequired}
