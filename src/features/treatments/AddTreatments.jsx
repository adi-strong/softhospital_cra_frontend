import {useState} from "react";
import PropTypes from "prop-types";
import {Button, Col, InputGroup, Modal, Row} from "react-bootstrap";
import {AppSInputField} from "../../components";
import {onAddArrayClick, onArrayChange, onRemoveArrayClick} from "../../services/handleFormsFieldsServices";

export const AddTreatments = ({onHide, show = false}) => {
  const [treatments, setTreatments] = useState([{name: ''}])

  function onSubmit(e) {
    e.preventDefault()
    alert('submitted')
  }

  const onReset = () => setTreatments([{name: ''}])

  return (
    <>
      <Modal show={show} onHide={onHide} backdrop='static' keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Enregistrement de traitements</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {treatments && treatments?.map((treatment, idx) =>
            <Row key={idx} className='mb-3' data-aos='fade-in'>
              <Col xl={12}>
                <InputGroup>
                  <AppSInputField
                    required
                    name='name'
                    placeholder='Libéllé'
                    value={treatment.name}
                    onChange={(e) => onArrayChange(e, idx, treatments, setTreatments)} />
                  {treatments.length < 5 &&
                    <Button
                      type='button'
                      variant='secondary'
                      onClick={() => onAddArrayClick({name: ''}, treatments, setTreatments)}>
                      <i className='bi bi-plus'/>
                    </Button>}
                  {treatments.length > 1 &&
                    <Button type='button' variant='dark' onClick={() => onRemoveArrayClick(idx, treatments, setTreatments)}>
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

AddTreatments.propTypes = {show: PropTypes.bool, onHide: PropTypes.func.isRequired}
