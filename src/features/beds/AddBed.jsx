import {useState} from "react";
import {Button, Col, Modal, Row} from "react-bootstrap";
import PropTypes from "prop-types";
import {AppFloatingInputField} from "../../components";
import {handleChange} from "../../services/handleFormsFieldsServices";

export const AddBed = ({onHide, show = false}) => {
  const [bed, setBed] = useState({wording: '', cost: 0, price: 0, description: ''})

  function onSubmit(e) {
    e.preventDefault()
    alert('submitted')
  }

  const onReset = () => setBed({wording: '', cost: 0, price: 0, description: ''})

  return (
    <>
      <Modal show={show} onHide={onHide} backdrop='static' keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un lit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AppFloatingInputField
            required
            autofocus
            name='wording'
            value={bed.wording}
            onChange={(e) => handleChange(e, bed, setBed)}
            placeholder='Lit...'
            label='Lit...' />
          <Row>
            <Col md={6}>
              <AppFloatingInputField
                required
                type='number'
                name='cost'
                value={bed.cost}
                onChange={(e) => handleChange(e, bed, setBed)}
                placeholder='Coût'
                label='Coût' />
            </Col>
            <Col md={6}>
              <AppFloatingInputField
                required
                type='number'
                name='price'
                value={bed.price}
                onChange={(e) => handleChange(e, bed, setBed)}
                placeholder='Prix'
                label='Prix' />
            </Col>
          </Row>
          <AppFloatingInputField
            required
            text="Ce champs ne peut contenir que 53 caractère(s) maximum."
            maxLength={53}
            name='description'
            value={bed.description}
            onChange={(e) => handleChange(e, bed, setBed)}
            placeholder='Petite description du lit...'
            label='Petite description du lit...' />
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

AddBed.propTypes = {show: PropTypes.bool, onHide: PropTypes.func.isRequired}
