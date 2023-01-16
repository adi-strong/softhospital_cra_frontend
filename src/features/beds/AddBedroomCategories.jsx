import {useState} from "react";
import PropTypes from "prop-types";
import {Button, Col, InputGroup, Modal, Row} from "react-bootstrap";
import {AppSInputField} from "../../components";
import {onAddArrayClick, onArrayChange, onRemoveArrayClick} from "../../services/handleFormsFieldsServices";

export const AddBedroomCategories = ({onHide, show = false}) => {
  const [categories, setCategories] = useState([{name: ''}])

  const onReset = () => setCategories([{name: ''}])

  function onSubmit(e) {
    e.preventDefault()
    alert('submitted')
  }

  return (
    <>
      <Modal show={show} onHide={onHide} backdrop='static' keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Ajout des catégories</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {categories && categories?.map((category, idx) =>
            <Row key={idx} className='mb-3' data-aos='fade-in'>
              <Col xl={12}>
                <InputGroup>
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
                </InputGroup>
              </Col>
            </Row>)}
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

AddBedroomCategories.propTypes = {show: PropTypes.bool, onHide: PropTypes.func.isRequired}
