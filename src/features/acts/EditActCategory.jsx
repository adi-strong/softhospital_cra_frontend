import {useState} from "react";
import {useUpdateActCategoryMutation} from "./actCategoriesApiSlice";
import toast from "react-hot-toast";
import {AppEditModal} from "../../components";
import AppInputField from "../../components/forms/AppInputField";
import {handleChange} from "../../services/handleFormsFieldsServices";

export const EditActCategory = ({ show, onHide, data }) => {
  const [category, setCategory] = useState(data)
  const [updateActCategory, {isLoading, isError, error}] = useUpdateActCategoryMutation()
  let apiErrors = {name: null}

  async function onSubmit() {
    apiErrors = {wording: null}
    try {
      const formData = await updateActCategory(category)
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
        onHide={onHide}
        show={show}
        onEdit={onSubmit}
        loader={isLoading}>
        <AppInputField
          required
          autofocus
          name='name'
          value={category.name}
          onChange={(e) => handleChange(e, category, setCategory)}
          disabled={isLoading}
          error={apiErrors.name} />
      </AppEditModal>
    </>
  )
}
