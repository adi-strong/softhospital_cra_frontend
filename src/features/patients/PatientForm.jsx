import {Button, Card, Col, Form, InputGroup} from "react-bootstrap";
import {RowContent, style} from "./PatientOverviewTab";
import img from "../../assets/app/img/default_profile.jpg";
import {AppAsyncSelectOptions, AppSInputField, AppSSelectField} from "../../components";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {maritalStatusOptions, sexOptions} from "./EditPatientTab";
import AppSelectField from "../../components/forms/AppSelectField";
import {requiredField} from "../covenants/addCovenant";
import {useEffect, useMemo, useState} from "react";
import {useGetCovenantsQuery, useLazyLoadCovenantsQuery} from "../covenants/covenantApiSlice";
import toast from "react-hot-toast";
import {AddImageModal} from "../images/AddImageModal";
import {entrypoint} from "../../app/store";

export const PatientForm = (
  {
    isLoading = false,
    onSubmit,
    patient,
    setPatient,
    age,
    labelBtn,
    labelResetBtn,
    handleReset,
    apiErrors,
    covenant,
    setCovenant,
    isPatientDataExists,
  }) => {
  const [show, setShow] = useState(false)
  const [check, setCheck] = useState({isCovenant: false})
  const [loadCovenants] = useLazyLoadCovenantsQuery()
  const {
    data: covenants = [],
    isLoading: isCovenantsLoad,
    isFetching,
    isSuccess,
    isError} = useGetCovenantsQuery('Covenant')
  let  options = []
  if (isError) alert("ERREUR: Les coventions n'ont pas pû se charger correctement 🤕")

  options = useMemo(() => isSuccess && covenants ? covenants.ids.map(id => {
    return {
      id: covenants.entities[id].id,
      label: covenants.entities[id].denomination,
      value: covenants.entities[id]['@id'],
    }
  }) : [], [isSuccess, covenants])

  useEffect(() => {
    if (!check.isCovenant) setCovenant(null)
  }, [check, setCovenant])

  const toggleModal = () => setShow(!show)
  const onRemoveProfile = () => setPatient({...patient, profile: null})

  const handleSelectCovenant = (event) => setCovenant(event)

  async function onLoadCovenants(keyword) {
    try { return await loadCovenants(keyword).unwrap() }
    catch (e) { toast.error(e.message) }
  }

  return (
    <>
      <Col md={4}>
        <Card className='border-0'>
          <Card.Body className='profile-card pt-4 d-flex flex-column align-items-center'>
            <Col>
              <img
                src={patient?.profile ? entrypoint+patient.profile.contentUrl : img}
                width={120}
                height={120}
                className='rounded-circle' alt=''/>
              <h5 style={style}>Profil Image</h5>
              <div className="pt-2 px-4">
                <Button
                  disabled={isLoading}
                  onClick={toggleModal}
                  type='button'
                  variant='primary'
                  className='btn-sm me-1'
                  title='Nouveau profil'>
                  <i className="bi bi-upload"/>
                </Button>
                <Button
                  disabled={isLoading}
                  onClick={onRemoveProfile}
                  type='button'
                  variant='danger'
                  className="btn-sm"
                  title='Supprimer le profil'>
                  <i className='bi bi-trash'/>
                </Button>
              </div>
            </Col>
          </Card.Body>
        </Card>
      </Col>

      <Col md={8}>
        <Card className='border-0'>
          <Card.Body>
            <form onSubmit={onSubmit} className='pt-3'>
              <RowContent
                className=''
                label={
                  <>
                    <Form.Check
                      id='isCovenant'
                      name='isCovenant'
                      value={check.isCovenant}
                      onChange={(e) => handleChange(e, check, setCheck)}
                      label={<>Conventioné(e)</>}
                      disabled={isLoading}
                      checked={check.isCovenant} />
                  </>}
                body={check.isCovenant &&
                  <>
                    <AppAsyncSelectOptions
                      loadOptions={onLoadCovenants}
                      value={covenant}
                      onChange={handleSelectCovenant}
                      disabled={isLoading || isCovenantsLoad || isFetching}
                      defaultOptions={options} />
                  </>} />
              <RowContent
                className=''
                label={<label htmlFor='name'>Nom <i className='text-danger'>*</i></label>}
                body={<AppSInputField
                  required
                  autofocus
                  error={apiErrors.name}
                  disabled={isLoading}
                  placeholder='Nom du patient'
                  name='name'
                  value={patient.name}
                  onChange={(e) => handleChange(e, patient, setPatient)} />} />
              <RowContent
                className=''
                label={<label htmlFor='lastName'>Postnom</label>}
                body={<AppSInputField
                  error={apiErrors.lastName}
                  disabled={isLoading}
                  placeholder='Postnom'
                  name='lastName'
                  value={patient.lastName}
                  onChange={(e) => handleChange(e, patient, setPatient)} />} />
              <RowContent
                className=''
                label={<label htmlFor='firstName'>Prénom</label>}
                body={<AppSInputField
                  error={apiErrors.firstName}
                  disabled={isLoading}
                  placeholder='Prénom'
                  name='firstName'
                  value={patient.firstName}
                  onChange={(e) => handleChange(e, patient, setPatient)} />} />
              <RowContent
                className=''
                label={<label htmlFor='sex'>Sexe</label>}
                body={<AppSelectField
                  error={apiErrors.sex}
                  disabled={isLoading}
                  name='sex'
                  options={sexOptions}
                  value={patient.sex}
                  onChange={({target}) => setPatient({...patient, sex: target.value})} />} />
              <RowContent
                className=''
                error={
                  <>
                    {apiErrors?.birthPlace && <div>{apiErrors.birthPlace}</div>}
                    {apiErrors?.birthDate && <div>{apiErrors.birthDate}</div>}
                  </>}
                label={<>Lieu &amp; date de naissance</>}
                body={
                  <>
                    <InputGroup>
                      <Form.Control
                        disabled={isLoading}
                        placeholder='Lieu de naissance'
                        name='birthPlace'
                        value={patient.birthPlace}
                        onChange={(e) => handleChange(e, patient, setPatient)} />
                      <Form.Control
                        required
                        type='date'
                        disabled={isLoading}
                        placeholder='Date de naissance'
                        name='birthDate'
                        value={patient.birthDate}
                        onChange={(e) => handleChange(e, patient, setPatient)} />
                    </InputGroup>
                  </>} />
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
                label={<label htmlFor='maritalStatus'>État-civil</label>}
                body={<AppSSelectField
                  error={apiErrors.maritalStatus}
                  disabled={isLoading}
                  name='maritalStatus'
                  options={maritalStatusOptions}
                  value={patient.maritalStatus}
                  onChange={({target}) => setPatient({...patient, maritalStatus: target.value})} />} />
              <RowContent
                className=''
                label={<label htmlFor='address'>Adresse</label>}
                body={<AppSInputField
                  error={apiErrors.address}
                  disabled={isLoading}
                  placeholder='Adresse...'
                  name='address'
                  value={patient.address}
                  onChange={(e) => handleChange(e, patient, setPatient)} />} />
              <RowContent
                className=''
                label={<label htmlFor='nationality'>Nationalité</label>}
                body={<AppSInputField
                  error={apiErrors.nationality}
                  disabled={isLoading}
                  name='nationality'
                  value={patient.nationality}
                  onChange={(e) => handleChange(e, patient, setPatient)} />} />
              <RowContent
                className=''
                label={<label htmlFor='father'>Père</label>}
                body={<AppSInputField
                  error={apiErrors.father}
                  disabled={isLoading}
                  placeholder='Nom du père'
                  name='father'
                  value={patient.father}
                  onChange={(e) => handleChange(e, patient, setPatient)} />} />
              <RowContent
                className=''
                label={<label htmlFor='mother'>Mère</label>}
                body={<AppSInputField
                  error={apiErrors.mother}
                  disabled={isLoading}
                  placeholder='Nom de la mère'
                  name='mother'
                  value={patient.mother}
                  onChange={(e) => handleChange(e, patient, setPatient)} />} />
              <RowContent
                className=''
                label={<label htmlFor='email'>Email</label>}
                body={<AppSInputField
                  error={apiErrors.email}
                  disabled={isLoading}
                  placeholder='Adresse email du patient'
                  type='email'
                  name='email'
                  value={patient.email}
                  onChange={(e) => handleChange(e, patient, setPatient)} />} />
              <RowContent
                className=''
                label={<label htmlFor='tel'>n° Tél {requiredField}</label>}
                body={<AppSInputField
                  error={apiErrors.tel}
                  disabled={isLoading}
                  placeholder='n° de téléphone du patient'
                  name='tel'
                  value={patient.tel}
                  onChange={(e) => handleChange(e, patient, setPatient)} />} />

              <div className="text-center">
                <Button type='submit' className='me-1' disabled={isLoading}>{labelBtn}</Button>
                {!isPatientDataExists && labelResetBtn &&
                  <Button type="reset" variant='secondary' disabled={isLoading} onClick={handleReset}>
                    {labelResetBtn}
                  </Button>}
              </div>
            </form>
          </Card.Body>
        </Card>
      </Col>

      <AddImageModal
        show={show}
        onHide={toggleModal}
        setItemState={setPatient}
        itemState={patient}
        item='profile' />
    </>
  )
}
