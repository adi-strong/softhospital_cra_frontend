import {Button, Col, Row} from "react-bootstrap";
import PatientInfos from "../patients/PatientInfos";
import moment from "moment";
import {usernameFiltered} from "../../components/AppNavbar";
import {cardTitleStyle} from "../../layouts/AuthLayout";

export const AppointmentDetails = ({ appointment }) => {
  return (
    <>
      <Row className='mt-3'>
        <Col md={7}>
          {appointment?.patient && <PatientInfos patient={appointment.patient}/>}
          <small>
            <i className='bi bi-calendar-event'/> {appointment?.createdAt} <i className='bi bi-clock'/> <br/>
            <i className='bi bi-person me-1'/>
            {appointment?.user && appointment.user?.name
              ? <span className='fw-bold'>{usernameFiltered(appointment.user.name)}</span>
              : <span className='fw-bold'>{appointment.user.username}</span>}
          </small>
        </Col>

        <Col md={5}>
          <div className='mb-3'>
            <Button type='button' variant='danger'>
              <i className='bi bi-trash'/> Supprimer
            </Button>
          </div>

          <span className='fw-bold'><i className='bi bi-calendar-event'/> Heure & date :</span> <br/>
          <span className='mx-1'>
            {appointment?.appointmentDate && moment(appointment.appointmentDate).calendar()}
          </span>
          <i className='bi bi-clock mx-1'/>
          <br/>

          <span className='fw-bold'><i className='bi bi-person-circle'/> Médecin / Docteur :</span> <br/>
          {appointment?.doctor &&
            <>
              <span className='mx-1 me-1 text-capitalize'>{appointment.doctor?.firstName && appointment.doctor.firstName}</span>
              <span className='text-uppercase'>{appointment.doctor?.name}</span>
            </>} <br/>

          <span className='fw-bold'>Motif :</span> <br/>
          <span className='mx-1'>{appointment?.reason ? appointment.reason : '-'}</span> <br/> <br/>
        </Col>

        <Col md={2} className='mt-4'><h5 className='card-title' style={cardTitleStyle}>Détails :</h5></Col>
        <Col className='mt-4'>{appointment?.description ? appointment.description : '-'}</Col>
      </Row>
    </>
  )
}
