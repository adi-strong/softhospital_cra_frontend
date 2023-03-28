import {usernameFiltered} from "../../components/AppNavbar";
import {entrypoint} from "../../app/store";
import img from "../../assets/app/img/default_profile.jpg";
import {limitStrTo} from "../../services";
import {Link} from "react-router-dom";
import {ButtonGroup} from "react-bootstrap";

export const AgentConsultationItem = ({ consult }) => {
  const file = consult?.file ? consult.file?.wording : '❓'
  const patient = consult?.patient
  const user = consult?.user
    ? consult.user?.name
      ? usernameFiltered(consult.user.name)
      : consult.user.username
    : '❓'

  const date = consult?.createdAt ? consult.createdAt : '❓'
  const profile = consult?.patient?.profile
    ? entrypoint+consult.patient.profile?.contentUrl
    : img

  return (
    <>
      <tr>
        <td><i className='bi bi-file-earmark-text'/></td>
        <th scope='row'>#{consult.id}</th>
        <td className='text-uppercase' title={file ? file.toUpperCase() : ''}>{limitStrTo(30, file)}</td>
        <td className='text-primary fw-bold'>
          <Link to={`/member/treatments/consultations/${consult?.id}/${patient?.slug}`} className='text-decoration-none'>
            <img src={profile} width={30} height={30} className='rounded-circle me-2' alt='' />
            {patient?.firstName && <span className='text-capitalize me-1'>{patient.firstName}</span>}
            <span className='text-uppercase'>{patient?.name}</span>
          </Link>
        </td>
        <td>{user}</td>
        <td>{date}</td>
        <td className='text-end'>
          <ButtonGroup size='sm' className='w-100'>
            <Link
              to={`/member/treatments/consultations/${consult?.id}/${patient?.slug}`}
              className='btn btn-light text-decoration-none'>
              <i className='bi bi-eye-fill'/>
            </Link>
            <Link
              to={`/member/treatments/consultations/edit/${consult?.id}/${patient?.slug}`}
              className='btn btn-light text-decoration-none'>
              <i className='bi bi-pencil-square text-primary'/>
            </Link>
          </ButtonGroup>
        </td>
      </tr>
    </>
  )
}
