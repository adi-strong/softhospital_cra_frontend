import moment from "moment";
import {Col, Row} from "react-bootstrap";

export const style = {
  fontWeight: 600,
  color: 'rgba(1, 41, 112, 0.6)',
}

export const RowContent = ({label, body, className = 'text-uppercase'}) => {
  return (
    <Row className='mb-3'>
      <Col md={4} lg={3} className='label' style={style}>{label}</Col>
      <Col md={8} lg={9} className={className}>{body}</Col>
    </Row>
  )
}

export const PatientOverviewTab = ({patient}) => {
  return (
    <>
      <Row>
        <Col md={6}>
          <h5 className="card-title">
            ID du patient :
            <i className='mx-1 bi bi-arrow-right'/> 1
          </h5>
        </Col>
        <Col md={6} className='text-md-end pt-3'>
          <i className='bi bi-calendar-check'/> Date d'enregistrement : {moment('2022-03-05 12:30').calendar()}
        </Col>
      </Row>
      <h5 className="card-title"><i className='bi bi-person-vcard'/> Identité du patient</h5>
      <RowContent label='Nom complet' body="Adivin Lifwa Wan'etumba" />
      <RowContent label='Sexe' body='Masculin' />
      <RowContent label='Âge' body='28 an(s) - Majeur(e)' />
      <RowContent label='Etat-civil' body='Célibataire' />
      <RowContent label='n° Tél' body='0904651464' />
      <RowContent label='Adresse email' body='adi.life91@gmail.com' className='text-lowercase' />
      <RowContent label='Nom du père' body='JR Lifwa' />
      <RowContent label='Nom de la mère' body='Jeanine Nkolo' />
      <RowContent label={<i className='bi bi-question-circle'/>} body='Privé(e)' className='text-capitalize text-primary' />
    </>
  )
}
