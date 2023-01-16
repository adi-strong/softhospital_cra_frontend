import img from '../../assets/app/img/default_profile.jpg';
import {Link} from "react-router-dom";

const style = {
  width: 120,
  height: 50,
}

export const PatientItem = ({patient}) => {
  let sex, maritalStatus

  if (patient.sex && patient.sex === 'M') sex = 'Masculin'
  else if (patient.sex && patient.sex === 'F') sex = 'Féminin'
  else sex = null

  if (patient.maritalStatus && patient.maritalStatus === 'single') maritalStatus = 'Célibataire'
  else if (patient.maritalStatus && patient.maritalStatus === 'married') maritalStatus = 'Marié(e)'
  else if (!patient.maritalStatus || patient.maritalStatus === 'none') maritalStatus = null

  return (
    <>
      <tr>
        <th scope='row'>
          <a href={patient.profile} target='_blank' rel='noreferrer'>
            {patient?.profile
              ? <img src={patient.profile} alt='' style={style}/>
              : <img src={img} alt='' style={style}/>}
          </a>
        </th>
        <td className='fw-bold'>{patient.id}</td>
        <td className='text-capitalize'>
          <Link to={`/patients/${patient.id}`} className="text-primary fw-bold text-decoration-none">
            {patient.name+' '}
            {patient?.firstName && patient.firstName}
          </Link>
        </td>
        <td>{patient?.age ? patient.age + ' an(s)' : '-'}</td>
        <td>{sex ? sex : '-'}</td>
        <td>{maritalStatus ? maritalStatus : '-'}</td>
        <td>Privé(e)</td>
        <td className='text-md-end'>
          <button type="button" title='Suppression' className='btn border-0 m-0 p-0'>
            <i className='bi bi-trash text-danger'/>
          </button>
        </td>
      </tr>
    </>
  )
}
