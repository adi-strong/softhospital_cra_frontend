import {useState} from "react";
import PropTypes from "prop-types";
import {Button, InputGroup, Modal} from "react-bootstrap";
import {AppSInputField} from "../../components";
import {onAddArrayClick, onArrayChange, onRemoveArrayClick} from "../../services/handleFormsFieldsServices";

export const AddExamCategories = ({onHide, show = false}) => {
  const [categories, setCategories] = useState([{name: ''}])

  function onSubmit(e) {
    e.preventDefault()
    alert('submitted')
  }

  const onReset = () => setCategories([{name: ''}])

  return (
    <>
      <Modal show={show} onHide={onHide} backdrop='static' keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Enregistrement de catégories d'examens</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {categories.map((category, idx) =>
            <InputGroup key={idx} className='mb-3' data-aos='fade-in'>
              <AppSInputField
                required
                name='name'
                placeholder='Libéllé'
                value={category.name}
                onChange={(e) => onArrayChange(e, idx, categories, setCategories)} />
              {categories.length < 5 &&
                <Button
                  type='button'
                  variant='secondary'
                  onClick={() => onAddArrayClick({name: ''}, categories, setCategories)}>
                  <i className='bi bi-plus'/>
                </Button>}
              {categories.length > 1 &&
                <Button type='button' variant='dark' onClick={() => onRemoveArrayClick(idx, categories, setCategories)}>
                  <i className='bi bi-dash'/>
                </Button>}
            </InputGroup>)}
          <Button type='reset' variant='light' className='w-100' onClick={onReset}>
            <i className='bi bi-trash3'/>
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button type='button' variant='light' onClick={onHide}>
            <i className='bi bi-x'/> Annuler
          </Button>
          <Button type='button' onClick={onSubmit}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

AddExamCategories.propTypes = {show: PropTypes.bool, onHide: PropTypes.func.isRequired}
