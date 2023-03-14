import {cardTitleStyle} from "../../layouts/AuthLayout";
import {useEffect, useMemo, useState} from "react";
import {AddImageModal} from "../images/AddImageModal";
import {entrypoint} from "../../app/store";
import {EditPatientForm} from "./EditPatientForm";
import {AppMainError} from "../../components";
import toast from "react-hot-toast";
import {useUpdatePatientMutation} from "./patientApiSlice";

export const sexOptions = [
  {label: '-- Aucune valeur sélectionnée --', value: 'none'},
  {label: 'Masculin', value: 'M'},
  {label: 'Féminin', value: 'F'},
]

export const sexOptions_2 = [
  {label: '-- Aucune valeur sélectionnée --', value: 'none'},
  {label: 'Homme', value: 'H'},
  {label: 'Femme', value: 'F'},
]

export const maritalStatusOptions = [
  {label: '-- Aucune valeur sélectionnée --', value: 'none'},
  {label: 'Célibataire', value: 'single'},
  {label: 'Marié(e)', value: 'married'},
]

export const EditPatientTab = ({data, isLoading, isError, refetch}) => {
  let currentYear, birthYear, age
  const [show, setShow] = useState(false)
  const [covenant, setCovenant] = useState(null)
  const [check, setCheck] = useState({isCovenant: false})
  const [updatePatient, {isLoading: isPatientChecked}] = useUpdatePatientMutation()
  const [patient, setPatient]  = useState({
    name: '',
    nationality: '',
    lastName: '',
    firstName: '',
    sex: 'none',
    birthDate: '',
    birthPlace: '',
    maritalStatus: 'none',
    tel: '',
    email: '',
    father: '',
    mother: '',
    address: '',
    profile: null,
  })

  let profile, apiErrors = {
    name: null,
    nationality: null,
    lastName: null,
    firstName: null,
    sex: null,
    birthDate: null,
    birthPlace: null,
    maritalStatus: null,
    tel: null,
    email: null,
    father: null,
    mother: null,
    address: null,
    profile: null,
  }

  profile = useMemo(() => {
    return !isLoading && patient?.profile
      ? entrypoint+patient.profile.contentUrl
      : null
  }, [isLoading, patient])

  useEffect(() => {
    if (!isLoading && data) {
      const sex = data?.sex ? data.sex : 'none';

      setPatient(prevState => {
        return {
          ...prevState,
          sex: sex,
          id: data.id,
          name: data?.name,
          lastName: data?.lastName ? data.lastName : '',
          firstName: data?.firstName ? data.firstName : '',
          mother: data?.mother ? data.mother : '',
          father: data?.father ? data.father : '',
          profile: data?.profile ? data.profile : null,
          email: data?.email ? data.email : '',
          maritalStatus: data?.maritalStatus ? data.maritalStatus : 'none',
          birthDate: data?.birthDate ? data.birthDate.substring(0, 10) : '',
          address: data?.address ? data.address : '',
          tel: data?.tel ? data.tel : '',
          birthPlace: data?.birthPlace ? data.birthPlace : '',
          nationality: data?.nationality ? data.nationality : '',
        }
      })
    }
  }, [isLoading, data]) // get patient's data

  useEffect(() => {
    if (!isLoading && data && data?.covenant) {
      setCheck({isCovenant: true})
      setCovenant({
        label: data.covenant.denomination,
        value: data.covenant['@id'],
      })
    }
  }, [isLoading, data]) // get covenant's data

  currentYear = new Date().getFullYear()
  birthYear = patient.birthDate ? parseInt(patient.birthDate.split('-')[0]) : currentYear
  age = currentYear - birthYear

  const handleRemoveProfile = () => setPatient({...patient, profile: null})

  const toggleModal = () => setShow(!show)

  async function onSubmit(e) {
    e.preventDefault()
    apiErrors = {
      name: null,
      nationality: null,
      lastName: null,
      firstName: null,
      sex: null,
      birthDate: null,
      birthPlace: null,
      maritalStatus: null,
      tel: null,
      email: null,
      father: null,
      mother: null,
      address: null,
      profile: null,
    }
    try {
      const formData = await updatePatient({...patient, covenant: covenant ? covenant.value : null})
      if (!formData.error) {
        toast.success('Modification bien efféctuée.')
        await refetch()
      }
    }
    catch (e) { toast.error(e.message) }
  }

  return (
    <>
      <h2 className='card-title' style={cardTitleStyle}>Édition</h2>

      <EditPatientForm
        age={age}
        onSubmit={onSubmit}
        profile={profile}
        isLoading={isLoading || isPatientChecked}
        isPatientChecked={isPatientChecked}
        toggleModal={toggleModal}
        apiErrors={apiErrors}
        setPatient={setPatient}
        patient={patient}
        covenant={covenant}
        setCovenant={setCovenant}
        check={check}
        setCheck={setCheck}
        handleRemoveProfile={handleRemoveProfile} />

      {isError && <AppMainError/>}

      <AddImageModal
        show={show}
        onHide={toggleModal}
        itemState={patient}
        setItemState={setPatient}
        item='profile' />
    </>
  )
}
