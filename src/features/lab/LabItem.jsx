import {Link} from "react-router-dom";
import {ButtonGroup} from "react-bootstrap";
import img from '../../assets/app/img/default_profile.jpg';
import {entrypoint} from "../../app/store";

export function LabItem({ lab }) {
  const file = lab?.consultation
    ? <Link to={`/member/treatments/consultations/${lab.consultation?.id}/show`} className='text-decoration-none'>
        <i className='bi bi-journal-medical me-1'/>
        {lab.consultation?.file?.wording}
      </Link>
    : '❓'
  const patient = lab?.patient ? lab.patient : null
  const createdAt = lab?.createdAt ? lab.createdAt : '〰'
  const profile = patient && patient?.profile && entrypoint+patient.profile?.contentUrl

  return (
    <>
      <tr>
        <td><i className='bi bi-virus2'/></td>
        <th>#{lab?.labNumber}</th>
        <td className='text-uppercase'>{file}</td>
        <td className='text-uppercase text-primary fw-bold'>
          {patient
            ? (
              <Link to={`/member/patients/${patient?.id}/${patient?.slug}`} className='text-decoration-none'>
                <img src={profile ? profile : img} className='rounded-circle me-1' width={30} height={30} alt=''/>
                {patient?.firstName && <span className='text-capitalize me-1'>{patient.firstName}</span>}
                <span className='text-uppercase'>{patient?.name}</span>
              </Link>
            )
            : '❓'}
        </td>
        <td>{createdAt}</td>
        <td className='text-end'>
          <ButtonGroup size='sm'>
            {lab?.isPublished &&
              <Link to={`/member/treatments/lab/${lab?.id}/show`} className='btn btn-light'>
                <i className='bi bi-eye'/>
              </Link>}
            {!lab?.isPublished &&
              <Link to={`/member/treatments/lab/${lab?.id}/edit`} className='btn btn-primary'>
                <i className='bi bi-pencil'/> Publier les résultats
              </Link>}
          </ButtonGroup>
        </td>
      </tr>
    </>
  )
}
