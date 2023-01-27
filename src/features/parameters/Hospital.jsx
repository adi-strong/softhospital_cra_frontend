import {useEffect, useState} from "react";
import {Alert, Button, Form, Spinner} from "react-bootstrap";
import {RowContent} from "../patients/PatientOverviewTab";
import AppInputField from "../../components/forms/AppInputField";
import {handleChange} from "../../services/handleFormsFieldsServices";
import img from '../../assets/app/img/default_hospital_img.jpg';
import {useSelector} from "react-redux";
import {useUpdateHospitalMutation} from "./parametersApiSlice";
import toast from "react-hot-toast";
import {AddImageModal} from "../images/AddImageModal";
import {entrypoint} from "../../app/store";

export function Hospital({user}) {
  const {hospital} = useSelector(state => state.parameters)
  const [validated, setValidated] = useState(false)
  const [show, setShow] = useState(false)
  const [isToggled, setIsToggled] = useState(false)
  const [updateHospital, {isLoading, error, isError}] = useUpdateHospitalMutation()
  const [item, setItem] = useState({
    denomination: '',
    unitName: '',
    tel: '',
    email: '',
    address: '',
    logo: null})

  const handleToggleModal = () => setIsToggled(!isToggled)

  const handleRemoveLogo = () => setItem({...item, logo: null})

  useEffect(() => {
    if (hospital && user && user.roles[0] !== 'ROLE_SUPER_ADMIN') {
      setItem({
        id: hospital.id,
        denomination: hospital.denomination,
        unitName: hospital?.unitName ? hospital.unitName : '',
        tel: hospital?.tel ? hospital.tel : '',
        email: hospital?.email ? hospital.email : '',
        address: hospital?.address ? hospital.address : '',
        logo: hospital?.logo ? {id: `/api/image_objects/${hospital.logo.id}`, contentUrl: hospital.logo.contentUrl} : null,
      })
    }
  }, [hospital, user]) // handle get hospital data

  let apiErrors = {denomination: null, tel: null, email: null, unitName: null}
  const canSave = [item.denomination].every(Boolean) || !isLoading

  async function onSubmit(e) {
    e.preventDefault()
    e.stopPropagation()
    setShow(false)
    apiErrors = {denomination: null, tel: null, email: null, unitName: null}
    const form = e.currentTarget
    if (canSave || form.checkValidity() === false) {
      const data = await updateHospital(item)
      if (!data.error) toast.success('Parametrage bien efféctué.')
    } else alert('Formulaire non valide !')
    setValidated(true)
  }

  if (isError) {
    const { violations } = error.data
    if (violations) {
      violations.forEach(({ propertyPath, message }) => {
        apiErrors[propertyPath] = message;
      });
    }
  }

  return (
    <>
      <Form noValidate onSubmit={onSubmit} validated={validated} className='pt-2'>
        {show &&
          <Alert variant='info' className='text-center'>
            <p>
              Une erreur est survenue lors du chargement de données. <br/>
              Veuillez recharger la page ou vous reconnectz <i className='bi bi-exclamation-circle-fill'/>
            </p>
          </Alert>}
        <RowContent
          label='Logo'
          body={
            <>
              <img
                src={item.logo ? `${entrypoint}${item.logo.contentUrl}` : img}
                alt="Profile"
                width={120}
                height={120} />
              <div className="pt-2">
                <Button
                  type='button'
                  size='sm'
                  className="me-1 mb-1"
                  title="Upload new profile image"
                  onClick={handleToggleModal}>
                  <i className="bi bi-upload"/>
                </Button>
                <Button
                  onClick={handleRemoveLogo}
                  type='button'
                  variant='danger'
                  size='sm'
                  className="mb-1"
                  title="Remove my profile image">
                  <i className="bi bi-trash"/>
                </Button>
              </div>
            </>
          } /> {/* Logo */}
        <RowContent
          label={<>Dénomination <i className='text-danger'>*</i></>}
          className=''
          body={
            <AppInputField
              autofocus
              required
              error={apiErrors.denomination}
              disabled={isLoading}
              name='denomination'
              value={item.denomination}
              onChange={(e) => handleChange(e, item, setItem)} />
          } />
        <RowContent
          label='Abbréviation'
          className=''
          body={
            <AppInputField
              error={apiErrors.unitName}
              disabled={isLoading}
              name='unitName'
              value={item.unitName}
              onChange={(e) => handleChange(e, item, setItem)} />
          } />
        <RowContent
          label={<>n° Téléphone <i className='text-danger'>*</i></>}
          className=''
          body={
            <AppInputField
              name='tel'
              error={apiErrors.tel}
              disabled={isLoading}
              value={item.tel}
              onChange={(e) => handleChange(e, item, setItem)} />
          } />
        <RowContent
          label='Email'
          className=''
          body={
            <AppInputField
              type='email'
              name='email'
              value={item.email}
              error={apiErrors.email}
              disabled={isLoading}
              onChange={(e) => handleChange(e, item, setItem)} />
          } />
        <RowContent
          label='Adresse'
          className=''
          body={
            <AppInputField
              disabled={isLoading}
              name='address'
              value={item.address}
              onChange={(e) => handleChange(e, item, setItem)} />
          } />
        <div className="text-center">
          <Button type='submit' disabled={isLoading}>
            {isLoading ? <>Veuillez patienter <Spinner animation='border' size='sm'/></> : 'Valider'}
          </Button>
        </div>
      </Form>

      <AddImageModal
        item='logo'
        itemState={item}
        setItemState={setItem}
        show={isToggled}
        onHide={handleToggleModal} />
    </>
  )
}
