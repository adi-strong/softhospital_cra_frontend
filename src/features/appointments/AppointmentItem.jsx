import {useState} from "react";
import {Link} from "react-router-dom";
import {Form} from "react-bootstrap";
import {AppLgModal} from "../../components";
import {ShowAppointment} from "./ShowAppointment";

export const AppointmentItem = ({ appointment, onToggleAppointment }) => {
  const patient = appointment?.patient
  const createdAt = appointment?.createdAt ? appointment.createdAt : '❓'

  const [show, setShow] = useState(false)

  const toggleModal = () => setShow(!show)
  const onToggleChange = () => onToggleAppointment({ id: appointment?.id, isComplete: !appointment?.isComplete })

  return (
    <>
      <tr>
        <td>
          <Form.Check
            name='isComplete'
            value={appointment?.isComplete}
            onChange={(e) => onToggleChange(e)}
            checked={appointment?.isComplete} />
        </td>
        <th>#{appointment?.id}</th>
        <td className={`${appointment?.isComplete ? 'text-decoration-line-through text-success' : 'fw-bold text-primary'}`}>
          <Link to={`/member/patients/${patient?.id}/${patient?.slug}`} className='text-decoration-none'>
            {patient?.firstName && <span className='text-capitalize'>{patient.firstName}</span>}
            <span className='text-uppercase mx-1'>{patient?.name}</span>
          </Link>
        </td>
        <td>{createdAt}</td>
        <td className='text-end'>
          <i
            onClick={toggleModal}
            className={`bi bi-pin-angle-fill text-${appointment?.isComplete ? 'success' : 'danger'}`}
            style={{ cursor: 'pointer' }}/>
        </td>
      </tr>

      <AppLgModal
        title={<><i className='bi bi-calendar-event-fill'/> Rendez-vous</>}
        show={show}
        onHide={toggleModal}
        className='bg-primary text-light'>
        <ShowAppointment
          onHide={toggleModal}
          data={appointment} />
      </AppLgModal>
    </>
  )
}
