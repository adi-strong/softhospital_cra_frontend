import {Button, Col, Row} from "react-bootstrap";
import {RowContent, style} from "./PatientOverviewTab";
import img from "../../assets/app/img/profile-img.jpg";
import {AppSInputField, AppSSelectField} from "../../components";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {maritalStatusOptions, sexOptions} from "./EditPatientTab";

export const PatientForm = (
  {
    onSubmit,
    patient,
    setPatient,
    age,
    handleChangeAge,
    labelBtn,
    labelResetBtn,
    handleReset,
    isProfileExists = false,
  }) => {
  return (
    <form onSubmit={onSubmit} className='pt-3'>
      {isProfileExists &&
        <Row className='mb-3'>
          <label style={style} className='col-lg-4 col-md-3'>Profil Image</label>
          <Col md={7} lg={8}>
            <img src={img} width={120} height={120} alt=''/>
            <div className="pt-2">
              <Button type='button' variant='primary' className='btn-sm me-1' title='Nouveau profil'>
                <i className="bi bi-upload"/>
              </Button>
              <Button type='button' variant='danger' className="btn-sm" title='Supprimer le profil'>
                <i className='bi bi-trash'/>
              </Button>
            </div>
          </Col>
        </Row>}
      <RowContent
        className=''
        label={<label htmlFor='name'>Nom <i className='text-danger'>*</i></label>}
        body={<AppSInputField
          required
          autofocus
          placeholder='Nom du patient'
          name='name'
          value={patient.name}
          onChange={(e) => handleChange(e, patient, setPatient)} />} />
      <RowContent
        className=''
        label={<label htmlFor='lastName'>Postnom</label>}
        body={<AppSInputField
          placeholder='Postnom'
          name='lastName'
          value={patient.lastName}
          onChange={(e) => handleChange(e, patient, setPatient)} />} />
      <RowContent
        className=''
        label={<label htmlFor='firstName'>Prénom</label>}
        body={<AppSInputField
          placeholder='Prénom'
          name='firstName'
          value={patient.firstName}
          onChange={(e) => handleChange(e, patient, setPatient)} />} />
      <RowContent
        className=''
        label={<label htmlFor='sex'>Sexe</label>}
        body={<AppSSelectField
          name='sex'
          options={sexOptions}
          value={patient.sex}
          onChange={(e) => handleChange(e, patient, setPatient)} />} />
      <RowContent
        className=''
        label={<label htmlFor='age'>Âge</label>}
        body={<AppSInputField
          disabled
          placeholder='Âge'
          type='number'
          name='age'
          value={age}
          onChange={() => {}} />} />
      <RowContent
        className=''
        label={<label htmlFor='birthDate'>Date de naissance <i className='text-danger'>*</i></label>}
        body={<AppSInputField
          required
          placeholder='Date de naissance'
          type='date'
          name='birthDate'
          value={patient.birthDate}
          onChange={(e) => handleChangeAge(e)} />} />
      <RowContent
        className=''
        label={<label htmlFor='birthPlace'>Lieu de naissance</label>}
        body={<AppSInputField
          placeholder='Lieu de naissance'
          name='birthPlace'
          value={patient.birthPlace}
          onChange={(e) => handleChange(e, patient, setPatient)} />} />
      <RowContent
        className=''
        label={<label htmlFor='maritalStatus'>État-civil</label>}
        body={<AppSSelectField
          name='maritalStatus'
          options={maritalStatusOptions}
          value={patient.maritalStatus}
          onChange={(e) => handleChange(e, patient, setPatient)} />} />
      <RowContent
        className=''
        label={<label htmlFor='father'>Père</label>}
        body={<AppSInputField
          placeholder='Nom du père'
          name='father'
          value={patient.father}
          onChange={(e) => handleChange(e, patient, setPatient)} />} />
      <RowContent
        className=''
        label={<label htmlFor='mother'>Mère</label>}
        body={<AppSInputField
          placeholder='Nom de la mère'
          name='mother'
          value={patient.mother}
          onChange={(e) => handleChange(e, patient, setPatient)} />} />
      <RowContent
        className=''
        label={<label htmlFor='email'>Email</label>}
        body={<AppSInputField
          placeholder='Adresse email du patient'
          type='email'
          name='email'
          value={patient.email}
          onChange={(e) => handleChange(e, patient, setPatient)} />} />
      <RowContent
        className=''
        label={<label htmlFor='tel'>n° Tél</label>}
        body={<AppSInputField
          placeholder='n° de téléphone du patient'
          name='tel'
          value={patient.tel}
          onChange={(e) => handleChange(e, patient, setPatient)} />} />

      <div className="text-center">
        <Button type='submit' className='me-1'>{labelBtn}</Button>
        {labelResetBtn &&
          <Button type="reset" variant='secondary' onClick={handleReset}>
            {labelResetBtn}
          </Button>}
      </div>
    </form>
  )
}
