import {AppBreadcrumb, AppFloatingAreaField, AppFloatingInputField, AppHeadTitle} from "../../components";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {Button, Card, Col, InputGroup, Row} from "react-bootstrap";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import AppInputField from "../../components/forms/AppInputField";
import {handleChange} from "../../services/handleFormsFieldsServices";

const AddConsultation = () => {
  const dispatch = useDispatch()

  const [consultation, setConsultation] = useState({
    comment: '',
    weight: 0.0,
    temperature: 0.0,
    arterialTension: '',
    cardiacFrequency: '',
    respiratoryFrequency: '',
    oxygenSaturation: '',
    diagnostic: '',
  }) // state: consultation's fields

  useEffect(() => {
    dispatch(onInitSidebarMenu('/treatments/consultations'))
  }, [dispatch]) // toggle dropdown treatments menu

  function onReset() {
    setConsultation({
      comment: '',
      oxygenSaturation: '',
      respiratoryFrequency: '',
      cardiacFrequency: '',
      arterialTension: '',
      temperature: 0.0,
      weight: 0.0,
    })
  } // reset local state

  function onSubmit(e) {
    e.preventDefault()
    alert('submitted !')
  } // handle submit data

  return (
    <>
      <AppHeadTitle title='Nouvelle Consultation' />
      <AppBreadcrumb title='Nouvelle consultation (Fiche)' />
      <Row>
        <Col md={7}>
          <Card className='border-0'>
            <Card.Body>
              <h5 className='card-title' style={cardTitleStyle}>Anamnèse &amp; signes vitaux</h5>
              <form onSubmit={onSubmit} className='row mt-3'>
                <Col md={6} className='mb-3'>
                  <InputGroup>
                    <span className='input-group-text'>Poids</span>
                    <AppInputField
                      autofocus
                      type='number'
                      value={consultation.weight}
                      name='weight'
                      onChange={(e) => handleChange(e, consultation, setConsultation)}
                      placeholder='Poids' />
                    <span className='input-group-text'>Kg</span>
                  </InputGroup>
                </Col> {/* Weight */}
                <Col md={6}>
                  <InputGroup>
                    <span className='input-group-text'>T°</span>
                    <AppInputField
                      type='number'
                      value={consultation.temperature}
                      name='temperature'
                      onChange={(e) => handleChange(e, consultation, setConsultation)}
                      placeholder='Température' />
                    <span className='input-group-text'>Température</span>
                  </InputGroup>
                </Col> {/* Temperature */}
                <Col md={6}>
                  <AppFloatingInputField
                    value={consultation.arterialTension}
                    onChange={(e) => handleChange(e, consultation, setConsultation)}
                    name='arterialTension'
                    placeholder='Tension Artérielle (cmHg | mmHg) :'
                    label='Tension Artérielle (cmHg | mmHg) :' />
                </Col> {/* Arterial Tension */}
                <Col md={6}>
                  <AppFloatingInputField
                    value={consultation.cardiacFrequency}
                    onChange={(e) => handleChange(e, consultation, setConsultation)}
                    name='cardiacFrequency'
                    placeholder='Fréquence Cardiaque (fcm) :'
                    label='Fréquence Cardiaque (fcm) :' />
                </Col> {/* Arterial Tension */}
                <Col md={6}>
                  <AppFloatingInputField
                    value={consultation.respiratoryFrequency}
                    onChange={(e) => handleChange(e, consultation, setConsultation)}
                    name='respiratoryFrequency'
                    placeholder='Fréquence Respiratoire (cpm) :'
                    label='Fréquence Respiratoire (cpm) :' />
                </Col> {/* Respiratory Frequency */}
                <Col md={6}>
                  <AppFloatingInputField
                    value={consultation.oxygenSaturation}
                    onChange={(e) => handleChange(e, consultation, setConsultation)}
                    name='oxygenSaturation'
                    placeholder='Saturation en oxygène (o2) :'
                    label='Saturation en oxygène (o2) :' />
                </Col> {/* Oxygen Saturation */}
                <AppFloatingAreaField
                  rows={150}
                  name='comment'
                  value={consultation.comment}
                  onChange={(e) => handleChange(e, consultation, setConsultation)}
                  placeholder='Commentaire(s)'
                  label='Commentaire(s) :' /> {/* Comments */}

                <div className='text-md-center'>
                  <Button type='submit' className='me-1 mb-1'>
                    Valider
                  </Button>
                  <Button type='button' variant='secondary' className='mb-1' onClick={onReset}>
                    Effacer
                  </Button>
                </div>
              </form>
            </Card.Body>
          </Card>
        </Col> {/* ********** *  signes vitaux  *********** */}
        <Col md={5}>
          <Card className='border-0'>
            <Card.Body>
              <h5 className='card-title' style={cardTitleStyle}><i className='bi bi-person-gear'/> Patient(e)</h5>
            </Card.Body>
          </Card> {/* Patient */}
          <Card className='border-0'>
            <Card.Body>
              <h5 className='card-title' style={cardTitleStyle}>
                <i className='bi bi-prescription2'/> Premier(s) soin(s)
              </h5>
            </Card.Body>
          </Card> {/* treatments */}
          <Card className='border-0'>
            <Card.Body>
              <h5 className='card-title' style={cardTitleStyle}>
                <i className='bi bi-heart-pulse'/> Hospitalisation
              </h5>
            </Card.Body>
          </Card> {/* hospitalization */}
        </Col> {/* ********** *  other infos  *********** */}
      </Row>
    </>
  )
}

export default AddConsultation
