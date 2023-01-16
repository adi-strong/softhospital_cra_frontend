import {useState} from "react";
import {Button, Col, InputGroup, Modal, Row} from "react-bootstrap";
import {AppSInputField} from "../../components";
import {onAddArrayClick, onArrayChange, onRemoveArrayClick} from "../../services/handleFormsFieldsServices";
import PropTypes from "prop-types";

export const AddExams = ({onHide, show = false}) => {
  const [exams, setExams] = useState([{name: '', cost: 0, price: 0,}])

  function onSubmit(e) {
    e.preventDefault()
    alert('submitted')
  }

  const onReset = () => setExams([{name: '', cost: 0, price: 0}])

  return (
    <>
      <Modal show={show} onHide={onHide} backdrop='static' keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Enregistrement des examens</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {exams && exams?.map((exam, idx) =>
            <Row key={idx} className='mb-3' data-aos='fade-in'>
              <Col xl={12} className='mb-3'>
                <InputGroup>
                  <AppSInputField
                    required
                    name='name'
                    placeholder='Libéllé'
                    value={exam.name}
                    onChange={(e) => onArrayChange(e, idx, exams, setExams)} />
                </InputGroup>
              </Col>
              <Col md={6} className='mb-3'>
                <InputGroup>
                  <AppSInputField
                    required
                    type='number'
                    name='cost'
                    placeholder='Coût'
                    value={exam.cost}
                    onChange={(e) => onArrayChange(e, idx, exams, setExams)} />
                </InputGroup>
              </Col>
              <Col md={6} className='mb-3'>
                <InputGroup>
                  <AppSInputField
                    required
                    type='number'
                    name='price'
                    placeholder='Prix'
                    value={exam.price}
                    onChange={(e) => onArrayChange(e, idx, exams, setExams)} />
                  {exams.length < 5 &&
                    <Button
                      type='button'
                      variant='secondary'
                      onClick={() => onAddArrayClick({name: '', cost: 0, price: 0}, exams, setExams)}>
                      <i className='bi bi-plus'/>
                    </Button>}
                  {exams.length > 1 &&
                    <Button type='button' variant='dark' onClick={() => onRemoveArrayClick(idx, exams, setExams)}>
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

AddExams.propTypes = {show: PropTypes.bool, onHide: PropTypes.func.isRequired}
