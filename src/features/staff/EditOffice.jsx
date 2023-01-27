import {useState} from "react";
import {useUpdateOfficeMutation} from "./officeApiSlice";
import toast from "react-hot-toast";
import {AppEditModal} from "../../components";
import AppInputField from "../../components/forms/AppInputField";
import {handleChange} from "../../services/handleFormsFieldsServices";

export const EditOffice = ({data, show = false, onHide}) => {
  const [office, setOffice] = useState(data)
  const [updateOffice, {isLoading, isError, error}] = useUpdateOfficeMutation()
  let apiErrors = {title: null}

  async function onSubmit() {
    apiErrors = {title: null}
    try {
      const officeData = await updateOffice(office)
      if (!officeData.error) {
        toast.success('Mise à jour bien efféctuée.')
        onHide()
      }
    } catch (e) { }
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
        show={show}
        onHide={onHide}
        loader={isLoading}
        onEdit={onSubmit}>
        {office && (
          <>
            <AppInputField
              autofocus
              name='title'
              value={office.title}
              onChange={(e) => handleChange(e, office, setOffice)}
              disabled={isLoading}
              error={apiErrors.title}
              placeholder='Fonction' />
          </>
        )}
      </AppEditModal>
    </>
  )
}
