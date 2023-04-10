import {Col, Row} from "react-bootstrap";
import {ProfileShowLoader} from "../../loaders";
import {useMemo} from "react";
import {entrypoint} from "../../app/store";
import img from '../../assets/app/img/default_profile.jpg';
import {AppMainError} from "../../components";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";

export const style = {
  fontWeight: 600,
  color: 'rgba(1, 41, 112, 0.6)',
}

const h2Style = {
  fontSize: 24,
  fontWeight: 700,
  color: '#2c384e',
  margin: '10px 0 0'
}

export const RowContent = ({label, body, error = null, className = 'text-uppercase'}) => {
  return (
    <Row className='mb-3'>
      <Col md={4} lg={3} className='label' style={style}>{label}</Col>
      <Col md={8} lg={9} className={className}>
        {body ? body : ''}
        {error && <div className='text-danger text-capitalize'>{error}</div>}
      </Col>
    </Row>
  )
}

export const PatientOverviewTab = ({patient, isError, loader, isFetching, isLoading}) => {
  let profile, isCovenant
  profile = useMemo(() => {
    return !isLoading && patient
      ? patient?.profile && entrypoint+patient?.profile.contentUrl
      : null
  }, [isLoading, patient])
  isCovenant = useMemo(() => {
    return !!(!isLoading && patient && patient?.covenant)
  }, [isLoading, patient])

  return (
    <>
      {isLoading && <ProfileShowLoader/>}
      {!isLoading && patient &&
        <>
          <img
            src={profile ? profile : img} alt="Profile"
            className="rounded-circle"
            width={120}
            height={120}/>
          <h2 className='text-capitalize' style={h2Style}>
            {patient?.firstName && patient.firstName+' '}
            {patient?.name}
          </h2>
          <h3 style={{ fontSize: 18 }}>
            {isCovenant ? 'Conventionné(e)' : 'Privé(e)'}
          </h3>
          {loader && <BarLoaderSpinner loading={loader}/>}
        </>}
      {isError && <AppMainError/>}
    </>
  )
}
