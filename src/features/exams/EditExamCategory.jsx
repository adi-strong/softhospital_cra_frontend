import {useState} from "react";
import toast from "react-hot-toast";
import {useUpdateExamCategoryMutation} from "./examCategoryApiSlice";
import {AppEditModal} from "../../components";
import AppInputField from "../../components/forms/AppInputField";
import {handleChange} from "../../services/handleFormsFieldsServices";

export const EditExamCategory = ({show, onHide, data}) => {
  const [category, setCategory] = useState(data)
  const [updateExamCategory, {isLoading, isError, error}] = useUpdateExamCategoryMutation()
  let apiErrors = {name: null}

  async function onSubmit() {
    apiErrors = {name: null}
    try {
      const formData = await updateExamCategory(category)
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
          label={<>Catégorie <i className='text-danger'>*</i></>}
          error={apiErrors.name} />
      </AppEditModal>
    </>
  )
}
