import {usernameFiltered} from "../../components/AppNavbar";
import {ButtonGroup} from "react-bootstrap";
import {Link} from "react-router-dom";
import {entrypoint} from "../../app/store";
import img from '../../assets/app/img/default_profile.jpg';

export const PrescriptionItem = ({ prescription }) => {
  const consultation = prescription?.consultation
  const file = consultation && consultation?.file
    ? <Link
        to={`/member/treatments/consultations/${consultation?.id}/${prescription?.patient.slug}`}
        className='text-decoration-none'>
        <i className='bi bi-journal-medical'/> {consultation.file?.wording }
      </Link>
    : '❓'
  const patient = prescription?.patient
  const user = prescription?.user
  const updatedAt = prescription?.updatedAt
  const profile = patient && patient?.profile && entrypoint+patient.profile?.contentUrl

  return (
    <>
      <tr>
        <td><i className='bi bi-file-medical'/></td>
        <th scope='row'>#{prescription?.prescriptionNumber}</th>
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
        </td>
        <td>{updatedAt && updatedAt}</td>
        <td className='text-end'>
          <ButtonGroup size='sm'>
            <Link to={`/member/treatments/prescriptions/${prescription.id}/edit`} className='btn btn-primary'>
              <i className='bi bi-plus'/> Prescrire
            </Link>
          </ButtonGroup>
        </td>
      </tr>
    </>
  )
}
