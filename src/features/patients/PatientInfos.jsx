import {memo, useMemo} from "react";
import {RowContent} from "./PatientOverviewTab";
import {entrypoint} from "../../app/store";
import img from '../../assets/app/img/default_profile.jpg';
import {Link} from "react-router-dom";

function PatientInfos({ patient }) {
  const profile = useMemo(() => patient?.profile
    ? entrypoint+patient.profile?.contentUrl
    : null, [patient])

  const sex = useMemo(() => patient?.sex && patient.sex !== 'none' ? patient.sex : null, [patient])

  const maritalStatus = useMemo(() => patient?.maritalStatus && patient.maritalStatus !== 'none'
    ? patient.maritalStatus
    : null, [patient])

  return (
    <>
      <RowContent
        className='text-uppercase text-primary fw-bold'
        label={<img src={profile ? profile : img} className='img-thumbnail' alt='Profile'/>}
        body={
          <>
            <Link to={`/member/patients/${patient?.id}/${patient?.slug}`} className='text-decoration-none'>
              <i className='bi bi-person me-3'/>
              {patient?.name+' '}
              {patient?.lastName && patient.lastName+' '}
              {patient?.firstName && patient.firstName}
            </Link>
            <br/>

            {sex && <i className={`bi bi-gender-${sex === 'M' ? 'male' : 'female'} me-3`}/>}
            {sex && sex === 'M' && <span className='text-capitalize text-dark'>Masculin</span>}
            {sex && sex === 'F' && <span className='text-capitalize text-dark'>Féminin</span>} <br/>

            {patient?.age && patient.age >= 18
              && <span className='text-capitalize text-dark'><i className='bi bi-sort-numeric-up-alt me-3 text-primary'/>Adulte</span>}
            {patient?.age && patient.age < 18
              && <span className='text-capitalize text-dark'><i className='bi bi-sort-numeric-down-alt me-3 text-primary'/>Mineur(e)</span>} <br/>

            <i className='bi bi-person-bounding-box me-3'/>
            <span className='text-dark text-capitalize'>
              {maritalStatus === 'single' && 'Célibataire'}
              {maritalStatus === 'married' && 'Marié(e)'}
            </span> <br/>

            <i className='bi bi-telephone-forward me-3'/>
            {patient?.tel && <span className='text-secondary'>{patient.tel}</span>}
          </>
        } />
    </>
  )
}

export default memo(PatientInfos)
