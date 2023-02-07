import {useState} from "react";
import PropTypes from "prop-types";
import {Button, Form, InputGroup, Modal, Spinner} from "react-bootstrap";
import {onAddArrayClick, onArrayChange, onRemoveArrayClick} from "../../services/handleFormsFieldsServices";
import {useAddNewTreatmentCategoryMutation} from "./treatmentCategoryApiSlice";
import toast from "react-hot-toast";

export const AddTreatmentCategories = ({onHide, show = false}) => {
  const [categories, setCategories] = useState([{name: ''}])
  const [addNewTreatmentCategory, {isLoading}] = useAddNewTreatmentCategoryMutation()

  async function onSubmit(e) {
    if (categories.length > 0) {
      let values = [...categories]
      for (const key in categories) {
        const formData = await addNewTreatmentCategory(categories[key])
        if (!formData.error) {
          values = values.filter(item => item !== categories[key])
          setCategories(values)
          if (values.length < 1) {
            toast.success('Enregistrement bien efféctuée.')
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
    else alert('Aucune information renseignée !!')
  }

  const onReset = () => setCategories([{name: ''}])

  return (
    <>
      <Modal show={show} onHide={onHide} backdrop='static' keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Enregistrement des catégories</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {categories && categories?.map((category, idx) =>
            <InputGroup key={idx} data-aos='fade-in' className='mb-3'>
              <Form.Control
                required
                autoFocus
                disabled={isLoading}
                name='name'
                placeholder='Libellé'
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

AddTreatmentCategories.propTypes = {show: PropTypes.bool, onHide: PropTypes.func.isRequired}
