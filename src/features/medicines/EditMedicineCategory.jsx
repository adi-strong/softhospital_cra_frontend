import {useState} from "react";
import {AppEditModal} from "../../components";
import {useUpdateMedicineCategoryMutation} from "./medicineCategoriesApiSlice";
import toast from "react-hot-toast";
import AppInputField from "../../components/forms/AppInputField";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {requiredField} from "../covenants/addCovenant";

export const EditMedicineCategory = ({show, onHide, data}) => {
  const [category, setCategory] = useState(data)
  const [updateMedicineCategory, {isLoading, isError, error}] = useUpdateMedicineCategoryMutation()
  let apiErrors = {wording: null}

  async function onSubmit() {
    apiErrors = {wording: null}
    try {
      const formData = await updateMedicineCategory(category)
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
        show={show}
        onHide={onHide}
        onEdit={onSubmit}>
        <AppInputField
          required
          autofocus
          error={apiErrors.wording}
          disabled={isLoading}
          placeholder='Libellé'
          onChange={(e) => handleChange(e, category, setCategory)}
          value={category?.wording}
          name='wording'
          label={<><i className='bi bi-tags'/> Catégorie {requiredField}</>} />
      </AppEditModal>
    </>
  )
}
