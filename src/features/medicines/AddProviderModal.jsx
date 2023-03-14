import {AppAddModal, AppFloatingInputField} from "../../components";
import {useAddNewProviderMutation, useUpdateProviderMutation} from "./providerApiSlice";
import {useEffect, useState} from "react";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {requiredField} from "../covenants/addCovenant";
import {Button} from "react-bootstrap";
import toast from "react-hot-toast";

export const AddProviderModal = ({show, onHide, data}) => {
  const [addNewProvider, {isLoading, isError, error}] = useAddNewProviderMutation()
  const [updateProvider, {isLoading: isUpdating, isError: isError2, error: error2}] = useUpdateProviderMutation()
  const [provider, setProvider] = useState({wording: '', focal: '', tel: '', email: '', address: ''})
  let apiErrors = {wording: null, focal: null, tel: null, email: null, address: null}

  useEffect(() => {
    if (data) setProvider({
      id: data?.id,
      focal: data?.focal,
      address: data?.address,
      tel: data?.tel,
      wording: data?.wording,
      email: data?.email ? data.email : ''
    })
  }, [data])

  const canSave = [
    provider.wording,
    provider.tel,
    provider.address,
    provider.focal
  ].every(Boolean) || !isLoading

  function onReset() { setProvider({wording: '', focal: '', tel: '', email: '', address: ''}) }

  async function onSubmit() {
    apiErrors = {wording: null, focal: null, tel: null, email: null, address: null}
    if (canSave) {
      if (data) {
        const formData = await updateProvider(provider)
        if (!formData.error) {
          toast.success('Modification bien efféctuée.')
          onReset()
          onHide()
        }
      }
      else {
        const formData = await addNewProvider(provider)
        if (!formData.error) {
          toast.success('Enregistrement bien efféctué.')
          onReset()
          onHide()
        }
      }
    }
    else alert("Veuillez renseigner les champs obligatoires s'il vous plaît !!!")
  }

  if (isError) {
    const { violations } = error.data
    if (violations) {
      violations.forEach(({ propertyPath, message }) => {
        apiErrors[propertyPath] = message;
      });
    }
  }

  if (isError2) {
    const { violations } = error2.data
    if (violations) {
      violations.forEach(({ propertyPath, message }) => {
        apiErrors[propertyPath] = message;
      });
    }
  }

  return (
    <>
      <AppAddModal
        className={data ? 'bg-primary text-light' : 'bg-light'}
        loader={isLoading || isUpdating}
        onHide={onHide}
        show={show}
        title={data ? <><i className='bi bi-pencil-square'/> Modification</> : 'Ajouter un fournisseur'}
        onAdd={onSubmit}>

        <AppFloatingInputField
          autofocus
          required
          disabled={isLoading || isUpdating}
          name='wording'
          value={provider.wording}
          onChange={(e) => handleChange(e, provider, setProvider)}
          error={apiErrors.wording}
          label={<>Désignation {requiredField}</>} />

        <AppFloatingInputField
          required
          disabled={isLoading || isUpdating}
          name='focal'
          value={provider.focal}
          onChange={(e) => handleChange(e, provider, setProvider)}
          error={apiErrors.focal}
          label={<>Point Focal {requiredField}</>} />

        <AppFloatingInputField
          required
          disabled={isLoading || isUpdating}
          name='tel'
          value={provider.tel}
          onChange={(e) => handleChange(e, provider, setProvider)}
          error={apiErrors.tel}
          label={<>n° Télépone {requiredField}</>} />

        <AppFloatingInputField
          required
          disabled={isLoading || isUpdating}
          type='email'
          name='email'
          value={provider.email}
          onChange={(e) => handleChange(e, provider, setProvider)}
          error={apiErrors.email}
          label='Email' />

        <AppFloatingInputField
          required
          disabled={isLoading || isUpdating}
          name='address'
          value={provider.address}
          onChange={(e) => handleChange(e, provider, setProvider)}
          error={apiErrors.address}
          label={<><i className='bi bi-map'/> Adresse {requiredField}</>} />

        {!data &&
          <Button type='button' variant='light' className='d-block w-100' onClick={onReset} disabled={isLoading || isUpdating}>
            <i className='bi bi-trash3 text-danger'/>
          </Button>}

      </AppAddModal>
    </>
  )
}
