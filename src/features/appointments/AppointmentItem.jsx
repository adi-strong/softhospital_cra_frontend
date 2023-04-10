import {useState} from "react";
import {Link} from "react-router-dom";
import {Form} from "react-bootstrap";
import {AppLgModal} from "../../components";
import {ShowAppointment} from "./ShowAppointment";
import {limitStrTo} from "../../services";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../auth/authSlice";
import {allowActionsToPatients} from "../../app/config";

export const AppointmentItem = ({ appointment, onToggleAppointment, search, page, onRefresh }) => {
  const patient = appointment?.patient
  const createdAt = appointment?.createdAt ? appointment.createdAt : '❓'
  const user = useSelector(selectCurrentUser)

  const [show, setShow] = useState(false)

  const toggleModal = () => setShow(!show)
  const onToggleChange = () => onToggleAppointment({
    id: appointment?.id,
    isComplete: !appointment?.isComplete,
    search,
    page,
  })

  return (
    <>
      <tr>
        <td>
          {user && allowActionsToPatients(user?.roles[0]) ?
            <Form.Check
              name='isComplete'
              value={appointment?.isComplete}
              onChange={(e) => onToggleChange(e)}
              checked={appointment?.isComplete} /> : <i className='bi bi bi-square'/>}
        </td>
        <th>#{appointment?.id}</th>
        <td className={`${appointment?.isComplete ? 'text-decoration-line-through text-success' : 'fw-bold text-primary'}`}>
          <Link to={`/member/patients/${patient?.id}/${patient?.slug}`} className='text-decoration-none'>
            {patient?.firstName && <span className='text-capitalize'>{patient.firstName}</span>}
            <span className='text-uppercase mx-1'>{limitStrTo(9, patient?.name)}</span>
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
          onRefresh={onRefresh}
          onHide={toggleModal}
          data={appointment} />
      </AppLgModal>
    </>
  )
}
