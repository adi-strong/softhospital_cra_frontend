import {entrypoint} from "../../app/store";
import img from "../../assets/app/img/default_profile.jpg";
import {limitStrTo} from "../../services";
import {Link} from "react-router-dom";

export const ConsultationItem2 = ({ consult }) => {
  const file = consult?.file ? consult.file?.wording : '❓'
  const patient = consult?.patient
  const date = consult?.createdAt ? consult.createdAt : '❓'
  const profile = consult?.patient?.profile
    ? entrypoint+consult.patient.profile?.contentUrl
    : img

  return (
    <>
      <tr>
        <th scope='row'>#{consult.id}</th>
        <td className='text-uppercase' title={file ? file.toUpperCase() : ''}>
          <Link to={`/member/treatments/consultations/${consult?.id}/${patient?.slug}`} className='text-decoration-none'>
            <i className='bi bi-journal-medical me-1'/>
            {limitStrTo(8, file)}
          </Link>
        </td>
        <td className='text-primary fw-bold'>
          <Link to={`/member/treatments/consultations/${consult?.id}/${patient?.slug}`} className='text-decoration-none'>
            <img src={profile} width={30} height={30} className='rounded-circle me-2' alt='' />
            {patient?.firstName && <span className='text-capitalize me-1'>{patient.firstName}</span>}
            <span className='text-uppercase'>{limitStrTo(9, patient?.name)}</span>
          </Link>
        </td>
        <td>{date}</td>
        <td className='text-end'>
          <Link
            to={`/member/treatments/consultations/${consult?.id}/${patient?.slug}`}
            className='w-100 btn btn-light btn-sm text-decoration-none'>
            <i className='bi bi-eye'/>
          </Link>
        </td>
      </tr>
    </>
  )
}
