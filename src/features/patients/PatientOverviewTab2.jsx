import {cardTitleStyle} from "../../layouts/AuthLayout";
import {Col, Row} from "react-bootstrap";
import {AppMainError} from "../../components";
import {RowContent} from "./PatientOverviewTab";
import {useMemo} from "react";
import moment from "moment";
import {Link} from "react-router-dom";

export function PatientOverviewTab2({patient, refetch, isLoading, isFetching, isError}) {

  let sex, maritalStatus, birthDate
  sex = useMemo(() => {
    return !isLoading && patient && patient?.sex && patient.sex !== 'none'
      && patient.sex
  }, [isLoading, patient])
  maritalStatus = useMemo(() => {
    if (!isLoading && patient && patient?.maritalStatus) {
      const mStatus = patient.maritalStatus
      return mStatus === 'single'
        ? 'Célibataire'
        : mStatus === 'married'
          ? 'Marié(e)'
          : null
    }
    return null
  }, [isLoading, patient])
  birthDate = useMemo(() => {
    return !isLoading && patient && patient?.birthDate
      && moment(patient.birthDate.substring(0, 10)).calendar()
  }, [isLoading, patient])

  return (
    <>
      <Row>
        <Col>
          <h2 className='text-capitalize card-title' style={cardTitleStyle}>Identifiant</h2>
          {!isLoading && patient && `#${patient.id}`}
        </Col>
      </Row>

      <h2 className='card-title'>Identité</h2>
      <RowContent label='Nom complet' className='fw-bold text-uppercase' body={!isLoading && patient &&
        <>
          {patient?.name+' '}
          {patient?.lastName && patient.lastName+' '}
          {patient?.firstName && patient.firstName+' '}
        </>} />

      <RowContent
        className=''
        label='Lieu & date de naissance'
        body={
          <>
            {!isLoading && patient && patient?.birthPlace && patient.birthPlace+' -- '}
            {birthDate ? birthDate : '❓'}
          </>} />

      <RowContent label='Âge' className='' body={!isLoading && patient && patient?.age && patient.age+' an(s)'} />

      <RowContent label='Sexe' className='fw-bold' body={sex ? sex : '❓'} />

      <RowContent label='État-civil' className='fw-bold' body={maritalStatus ? maritalStatus : '❓'} />

      <RowContent label='Nationalité' body={patient?.nationality ? patient.nationality : '❓'} />

      <RowContent label='Adresse' body={!isLoading && patient && patient?.address ? patient.address : '❓'} />

      <RowContent
        label='n° Téléphone'
        className='fw-bold'
        body={!isLoading && patient && patient?.tel ? patient.tel : '❓'} />

      <RowContent
        label='Email'
        className='text-lowercase fw-bold'
        body={!isLoading && patient && patient?.email ? patient.email : '❓'} />

      <RowContent label='Père' body={!isLoading && patient && patient?.father ? patient.father : '❓'} />

      <RowContent label='Mère' body={!isLoading && patient && patient?.mother ? patient.mother : '❓'} />

      <RowContent
        label={<i className='bi bi-question-circle-fill'/>}
        body={
          <>
            {!isLoading && patient && patient?.covenant
              ? <Link
                to={`/member/patients/covenants/${patient.covenant.id}/${patient.covenant.slug}`}
                className='text-decoration-none'>
                {patient.covenant.denomination}</Link>
              : <i className='bi bi-x-square-fill'/>}
          </>} />

      {isError && <AppMainError/>}
    </>
  )
}
