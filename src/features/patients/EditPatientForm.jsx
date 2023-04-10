import {Button, Form, InputGroup, Spinner} from "react-bootstrap";
import {FormRowContent} from "../profile/ChangeUserProfilePassword";
import img from "../../assets/app/img/default_profile.jpg";
import {requiredField} from "../covenants/addCovenant";
import {AppAsyncSelectOptions, AppSInputField} from "../../components";
import {handleChange, onSelectAsyncOption} from "../../services/handleFormsFieldsServices";
import {maritalStatusOptions, sexOptions} from "./EditPatientTab";
import {useGetCovenantsQuery, useLazyLoadCovenantsQuery} from "../covenants/covenantApiSlice";
import {useEffect, useMemo} from "react";
import toast from "react-hot-toast";

export const EditPatientForm = (
  {
    onSubmit,
    profile,
    toggleModal,
    handleRemoveProfile,
    apiErrors,
    isLoading,
    patient,
    setPatient,
    age,
    covenant,
    setCovenant,
    check,
    setCheck,
    isPatientChecked = false
  }) => {

  const [loadCovenants] = useLazyLoadCovenantsQuery()
  const {data: covenants = [], isFetching, isSuccess, isError} = useGetCovenantsQuery('Covenant')
  let options

  if (isError) alert("ERREUR: Erreur lors du chargemen des Conventions !!!")
  options = useMemo(() => isSuccess && covenants ? covenants.ids.map(id => {
    return {
      id: covenants.entities[id].id,
      label: covenants.entities[id].denomination,
      value: covenants.entities[id]['@id'],
    }
  }) : [], [isSuccess, covenants])

  async function onLoadCovenants(keyword) {
    try { return await loadCovenants(keyword).unwrap() }
    catch (e) { toast.error(e.message) }
  }

  useEffect(() => {
    if (!check.isCovenant) setCovenant(null)
  }, [check, setCovenant])

  return (
    <>
      <Form onSubmit={onSubmit}>
        <FormRowContent error={apiErrors?.profile} label='Profil patient' body={
          <>
            <img
              src={profile ? profile : img}
              width={120}
              height={120}
              alt='' />
            <div className='mt-1 px-4'>
              <Button type='button' size='sm' className='me-1' onClick={toggleModal}>
                <i className='bi bi-upload'/>
              </Button>
              <Button type='button' size='sm' variant='danger' onClick={handleRemoveProfile}>
                <i className='bi bi-trash'/>
              </Button>
            </div>
          </>} />

        <FormRowContent
          label={
            <>
              <Form.Check
                disabled={isLoading}
                id='isCovenant'
                label='Conventionn(é)'
                name='isCovenant'
                value={check.isCovenant}
                onChange={() => setCheck({isCovenant: !check.isCovenant})}
                checked={check.isCovenant} />
            </>}
          body={check.isCovenant &&
            <AppAsyncSelectOptions
              onChange={(e) => onSelectAsyncOption(e, setCovenant)}
              value={covenant}
              disabled={isLoading || isFetching}
              loadOptions={onLoadCovenants}
              defaultOptions={options}
              placeholder="Sélectionnez..." />} />

        <FormRowContent error={apiErrors?.name} label={<>Nom {requiredField}</>} body={
          <AppSInputField
            required
            autofocus
            error={apiErrors.name}
            disabled={isLoading}
            placeholder='Nom du patient'
            name='name'
            value={patient.name}
            onChange={(e) => handleChange(e, patient, setPatient)} />
        } />

        <FormRowContent error={apiErrors?.lastName} label='Postnom' body={
          <AppSInputField
            error={apiErrors.lastName}
            disabled={isLoading}
            name='lastName'
            value={patient.lastName}
            onChange={(e) => handleChange(e, patient, setPatient)} />
        } />

        <FormRowContent error={apiErrors?.firstName} label='Prénom' body={
          <AppSInputField
            error={apiErrors.firstName}
            disabled={isLoading}
            name='firstName'
            value={patient.firstName}
            onChange={(e) => handleChange(e, patient, setPatient)} />
        } />

        <FormRowContent error={apiErrors?.sex} label='Sexe' body={
          <>
            <Form.Select
              aria-label='sex'
              value={patient?.sex}
              onChange={({ target }) => setPatient({ ...patient, sex: target.value })}>
              {sexOptions && sexOptions.map((item, idx) =>
                <option key={idx} value={item.value}>{item.label}</option>)}
            </Form.Select>
          </>
        } />

        <FormRowContent error={apiErrors?.birthDate} label='Lieu & date de naissance' body={
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
          </>
        } />

        <FormRowContent label='Âge' body={
          <AppSInputField
            disabled
            placeholder='Âge'
            type='number'
            name='age'
            value={age}
            onChange={() => {}} />
        } />

        <FormRowContent error={apiErrors?.maritalStatus} label='État-civil' body={
          <>
            <Form.Select
              aria-label='maritalStatus'
              value={patient?.maritalStatus}
              onChange={({ target }) => setPatient({ ...patient, maritalStatus: target.value })}>
              {maritalStatusOptions && maritalStatusOptions.map((item, idx) =>
                <option key={idx} value={item.value}>{item.label}</option>)}
            </Form.Select>
          </>
        } />

        <FormRowContent error={apiErrors?.address} label='Adresse' body={
          <AppSInputField
            error={apiErrors.address}
            disabled={isLoading}
            placeholder='Adresse...'
            name='address'
            value={patient.address}
            onChange={(e) => handleChange(e, patient, setPatient)} />
        } />

        <FormRowContent error={apiErrors?.nationality} label='Nationalité' body={
          <AppSInputField
            error={apiErrors.nationality}
            disabled={isLoading}
            name='nationality'
            value={patient.nationality}
            onChange={(e) => handleChange(e, patient, setPatient)} />
        } />

        <FormRowContent error={apiErrors?.father} label='Père' body={
          <AppSInputField
            error={apiErrors.father}
            disabled={isLoading}
            placeholder='Nom du père'
            name='father'
            value={patient.father}
            onChange={(e) => handleChange(e, patient, setPatient)} />
        } />

        <FormRowContent error={apiErrors?.mother} label='Mère' body={
          <AppSInputField
            error={apiErrors.mother}
            disabled={isLoading}
            placeholder='Nom de la mère'
            name='mother'
            value={patient.mother}
            onChange={(e) => handleChange(e, patient, setPatient)} />
        } />

        <FormRowContent error={apiErrors?.email} label='Email' body={
          <AppSInputField
            error={apiErrors.email}
            disabled={isLoading}
            placeholder='Adresse email du patient'
            type='email'
            name='email'
            value={patient.email}
            onChange={(e) => handleChange(e, patient, setPatient)} />
        } />

        <FormRowContent error={apiErrors?.tel} label={<>n° Téléphone {requiredField}</>} body={
          <AppSInputField
            required
            error={apiErrors.tel}
            disabled={isLoading}
            placeholder='n° de téléphone du patient'
            name='tel'
            value={patient.tel}
            onChange={(e) => handleChange(e, patient, setPatient)} />
        } />

        <div className='text-center'>
          <Button type='submit' disabled={isLoading}>
            {isPatientChecked ? <>Veuillez patienter <Spinner animation='border' size='sm'/></> : 'Modifier'}
          </Button>
        </div>
      </Form>
    </>
  )
}
