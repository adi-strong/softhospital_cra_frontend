import {entrypoint} from "../../app/store";
import {Link} from "react-router-dom";
import img from "../../assets/app/img/default_profile.jpg";
import {usernameFiltered} from "../../components/AppNavbar";
import {ButtonGroup} from "react-bootstrap";

export const OrderItem = ({ order }) => {
  const consultation = order?.consultation
  const file = consultation && consultation?.file
    ? <Link to={`/member/treatments/consultations/${consultation?.id}/show`} className='text-decoration-none'>
        <i className='bi bi-journal-medical'/> {consultation.file?.wording }
      </Link>
    : '❓'
  const patient = order?.patient
  const user = order?.user
  const updatedAt = order?.updatedAt
  const profile = patient && patient?.profile && entrypoint+patient.profile?.contentUrl

  return (
    <>
      <tr>
        <td><i className='bi bi-file-medical'/></td>
        <th scope='row'>#{order?.orderNumber}</th>
        <td className='text-uppercase'>{file}</td>
        <td className='text-primary fw-bold'>
          {patient &&
            <Link to={`/member/patients/${patient?.id}/${patient?.slug}`} className='text-decoration-none'>
              <img src={profile ? profile : img} width={30} height={30} className='rounded-circle me-1' alt=''/>
              {patient?.firstName && <span className='text-capitalize me-1'>{patient.firstName}</span>}
              <span className='text-uppercase'>{patient?.name}</span>
            </Link>}
          {!patient && '❓'}
        </td>
        <td className='text-capitalize'>
          {user && user?.name ? usernameFiltered(user.name) : user?.username}
          {!user && '❓'}
        </td>
        <td>
          {updatedAt ? updatedAt : '❓'}
        </td>
        <td className='text-end'>
          <ButtonGroup size='sm'>
            <Link to={`/member/treatments/orders/${order.id}/show`} className='btn btn-success'>
              <i className='bi bi-eye'/>
            </Link>
          </ButtonGroup>
        </td>
      </tr>
    </>
  )
}
