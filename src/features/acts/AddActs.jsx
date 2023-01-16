import {useState} from "react";
import PropTypes from "prop-types";
import {Button, Col, InputGroup, Modal, Row} from "react-bootstrap";
import {AppSInputField} from "../../components";
import {onAddArrayClick, onArrayChange, onRemoveArrayClick} from "../../services/handleFormsFieldsServices";

export const AddActs = ({onHide, show = false}) => {
  const [acts, setActs] = useState([{name: '', price: 0,}])

  function onSubmit(e) {
    e.preventDefault()
    alert('submitted')
  }

  const onReset = () => setActs([{name: '', price: 0}])

  return (
    <>
      <Modal show={show} onHide={onHide} backdrop='static' keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Enregistrement des actes médicaux</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {acts && acts?.map((act, idx) =>
            <Row key={idx} className='mb-3' data-aos='fade-in'>
              <Col md={6}>
                <InputGroup>
                  <AppSInputField
                    required
                    name='name'
                    placeholder='Libéllé'
                    value={act.name}
                    onChange={(e) => onArrayChange(e, idx, acts, setActs)} />
                </InputGroup>
              </Col>
              <Col md={6}>
                <InputGroup>
                  <AppSInputField
                    required
                    type='number'
                    name='price'
                    placeholder='Prix'
                    value={act.price}
                    onChange={(e) => onArrayChange(e, idx, acts, setActs)} />
                  {acts.length < 5 &&
                    <Button
                      type='button'
                      variant='secondary'
                      onClick={() => onAddArrayClick({name: '', price: 0}, acts, setActs)}>
                      <i className='bi bi-plus'/>
                    </Button>}
                  {acts.length > 1 &&
                    <Button type='button' variant='dark' onClick={() => onRemoveArrayClick(idx, acts, setActs)}>
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

AddActs.propTypes = {show: PropTypes.bool, onHide: PropTypes.func.isRequired}
