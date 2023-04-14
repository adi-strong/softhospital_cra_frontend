import {useState} from "react";
import PropTypes from "prop-types";
import {Button, Form, InputGroup, Modal, Spinner} from "react-bootstrap";
import {onAddArrayClick, onArrayChange, onRemoveArrayClick} from "../../services/handleFormsFieldsServices";
import {useAddNewActCategoryMutation} from "./actCategoriesApiSlice";
import toast from "react-hot-toast";

export const AddActCategories = ({onHide, show = false}) => {
  const [categories, setCategories] = useState([{name: ''}])
  const [addNewActCategory, {isLoading}] = useAddNewActCategoryMutation()

  const onReset = () => setCategories([{name: '', price: 0}])

  async function onSubmit(e) {
    e.preventDefault()
    if (categories.length > 0) {
      let values = [...categories]
      for (const key in categories) {
        const formData = await addNewActCategory(categories[key])
        if (!formData.error) {
          values = values.filter(item => item !== categories[key])
          setCategories(values)
          if (values.length < 1) {
            toast.success('Enregistrement bien efféctué.')
            setCategories([{name: ''}])
            onHide()
          }
        }
        else {
          const violations = formData.error.data.violations
          if (violations) {
            violations.forEach(({propertyPath, message}) => {
              toast.error(`${propertyPath}: ${message}`, {
                style: {
                  background: 'red',
                  color: '#fff',
                }
              })
            })
          }
        }
      }
    }
    else alert('Aucune information renseignée !')
  }

  return (
    <>
      <Modal show={show} onHide={onHide} backdrop='static' keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Enregistrement des catégories</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {categories && categories?.map((category, idx) =>
            <InputGroup key={idx} className='mb-3' data-aos='fade-in'>
              <Form.Control
                required
                autoFocus
                name='name'
                disabled={isLoading}
                placeholder='Libéllé'
                value={category.name}
                onChange={(e) => onArrayChange(e, idx, categories, setCategories)} />
              {categories.length < 5 &&
                <Button
                  disabled={isLoading}
                  type='button'
                  variant='secondary'
                  onClick={() => onAddArrayClick({name: ''}, categories, setCategories)}>
                  <i className='bi bi-plus'/>
                </Button>}
              {categories.length > 1 &&
                <Button
                  disabled={isLoading}
                  type='button'
                  variant='dark'
                  onClick={() => onRemoveArrayClick(idx, categories, setCategories)}>
                  <i className='bi bi-dash'/>
                </Button>}
            </InputGroup>)}
          <Button disabled={isLoading}  type='reset' variant='light' className='w-100' onClick={onReset}>
            <i className='bi bi-trash3'/>
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={isLoading}  type='button' variant='light' onClick={onHide}>
            <i className='bi bi-x'/> Annuler
          </Button>
          <Button disabled={isLoading}  type='button' onClick={onSubmit}>
            {isLoading ? <>Veuillez patienter <Spinner animation='border' size='sm'/></> : 'Enregistrer'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

AddActCategories.propTypes = {show: PropTypes.bool, onHide: PropTypes.func.isRequired}
