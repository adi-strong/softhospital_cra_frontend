import {Link} from "react-router-dom";
import img from '../../assets/app/img/default_profile.jpg';
import {entrypoint} from "../../app/store";
import {ButtonGroup} from "react-bootstrap";

export const NursingItem = ({ nursing }) => {
  const consultation = nursing?.consultation
  const file = consultation && consultation?.file
    ? <Link to={`/member/treatments/consultations/${consultation?.id}/show`} className='text-decoration-none'>
        <i className='bi bi-journal-medical me-1'/>
        {consultation.file?.wording}
      </Link>
    : '❓'

  const patient = nursing?.patient ? nursing.patient : null
  const profile = patient && patient?.profile ? entrypoint+patient.profile.contentUrl : img

  return (
    <>
      <tr>
        <td><i className='bi bi-file-earmark-medical'/></td>
        <th scope='row'>#{nursing?.nursingNumber}</th>
        <td className='text-uppercase'>{file}</td>
        <td className='fw-bold'>
          {patient && (
            <Link to={`/member/patients/${patient?.id}/${patient?.slug}`} className='text-decoration-none'>
              <img src={profile} width={30} height={30} className='rounded-circle me-1' alt=''/>
              {patient?.firstName && <span className='text-capitalize me-1'>{patient.firstName}</span>}
              <span className='text-uppercase'>{patient?.name}</span>
            </Link>
          )}
          {!patient && '❓'}
        </td>
        <td className='text-end'>
          <ButtonGroup size='sm'>
            <Link to={`/member/treatments/nursing/${nursing?.id}/show`} className='btn btn-light'>
              <i className='bi bi-eye text-success'/>
            </Link>
            {!nursing?.isCompleted &&
              <Link to={`/member/treatments/nursing/${nursing?.id}/edit`} className='btn btn-primary'>
                <i className='bi bi-plus'/>
              </Link>}
          </ButtonGroup>
        </td>
      </tr>
    </>
  )
}
