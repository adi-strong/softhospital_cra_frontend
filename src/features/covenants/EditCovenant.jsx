import {useState} from "react";
import {AppEditModal, AppFloatingInputField} from "../../components";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {requiredField} from "./addCovenant";
import {useUpdateCovenantMutation} from "./covenantApiSlice";
import toast from "react-hot-toast";
import {Button} from "react-bootstrap";
import {entrypoint} from "../../app/store";
import {AddImageModal} from "../images/AddImageModal";

export const EditCovenant = ({show, onHide, data}) => {
  const [showImage, setShowImage] = useState(false)
  const [covenant, setCovenant] = useState(data)
  const [updateCovenant, {isLoading, isError, error}] = useUpdateCovenantMutation()
  let apiErrors = {denomination: '', unitName: '', focal: '', tel: '', email: '', address: '', logo: null, file: null,}

  const toggleImageModal = () => setShowImage(!showImage)

  async function onSubmit() {
    apiErrors = {denomination: '', unitName: '', focal: '', tel: '', email: '', address: '', logo: null, file: null,}
    try {
      const formData = await updateCovenant(covenant)
      if (!formData.error) {
        toast.success('Modification bien efféctuée.')
        onHide()
      }
    }
    catch (e) { toast.error(e.message) }
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
      <AppEditModal
        loader={isLoading}
        onHide={onHide}
        show={show}
        onEdit={onSubmit}>
        <AppFloatingInputField
          required
          autofocus
          disabled={isLoading}
          error={apiErrors.denomination}
          label={<>Dénomination {requiredField}</>}
          placeholder='Dénomination'
          name='denomination'
          value={covenant.denomination}
          onChange={(e) => handleChange(e, covenant, setCovenant)} />
        <AppFloatingInputField
          disabled={isLoading}
          error={apiErrors.unitName}
          maxLength={20}
          text='Ce champs ne peut dépasser 20 caractères.'
          label='Abbréviation'
          placeholder='Abbréviation'
          name='unitName'
          value={covenant.unitName}
          onChange={(e) => handleChange(e, covenant, setCovenant)} />
        <AppFloatingInputField
          required
          disabled={isLoading}
          error={apiErrors.focal}
          label={<>Point focal {requiredField}</>}
          placeholder='Point focal'
          name='focal'
          value={covenant.focal}
          onChange={(e) => handleChange(e, covenant, setCovenant)} />
        <AppFloatingInputField
          required
          disabled={isLoading}
          error={apiErrors.tel}
          label={<>n° Tél {requiredField}</>}
          placeholder='n° Tél'
          name='tel'
          value={covenant.tel}
          onChange={(e) => handleChange(e, covenant, setCovenant)} />
        <AppFloatingInputField
          required
          disabled={isLoading}
          error={apiErrors.email}
          type='email'
          label={<>Email {requiredField}</>}
          placeholder='Email'
          name='email'
          value={covenant.email}
          onChange={(e) => handleChange(e, covenant, setCovenant)} />
        <AppFloatingInputField
          maxLength={255}
          disabled={isLoading}
          error={apiErrors.address}
          label='Adresse'
          placeholder='Adresse'
          name='address'
          value={covenant.address}
          onChange={(e) => handleChange(e, covenant, setCovenant)} />

        <h6>Logo <small><i>(faculatif)</i></small></h6>
        {!covenant.logo && <p>Veuillez insérer l'image du logo en pièce jointe :</p>}
        {apiErrors.logo && <p className='text-danger'>{apiErrors.logo}</p>}

        <figure>
          {covenant.logo &&
            <img
              src={entrypoint+covenant.logo.contentUrl}
              alt="Logo"
              style={{ width: '100%', height: 150 }}/>}
        </figure>

        <Button
          type='button'
          variant='warning'
          className='w-100 d-block'
          onClick={toggleImageModal}
          disabled={isLoading}>
          <i className='bi bi-upload me-1'/>
        </Button>
      </AppEditModal>

      <AddImageModal
        show={showImage}
        onHide={toggleImageModal}
        item='logo'
        itemState={covenant}
        setItemState={setCovenant} />
    </>
  )
}
