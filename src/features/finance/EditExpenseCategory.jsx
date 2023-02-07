import {AppEditModal} from "../../components";
import {useUpdateExpenseCategoryMutation} from "./expenseCategoryApiSlice";
import {useState} from "react";
import toast from "react-hot-toast";
import AppInputField from "../../components/forms/AppInputField";
import {handleChange} from "../../services/handleFormsFieldsServices";

export const EditExpenseCategory = ({show, onHide, data}) => {
  const [updateExpenseCategory, {isLoading, isError, error}] = useUpdateExpenseCategoryMutation()
  const [category, setCategory] = useState(data)
  let apiErrors = {name: null}

  async function onSubmit() {
    apiErrors = {wording: null}
    try {
      const formData = await updateExpenseCategory(category)
      if (!formData.error) {
        toast.success('Modification bien efféctuée.')
        onHide()
      }
    }
    catch (e) { }
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
        <AppInputField
          required
          autofocus
          disabled={isLoading}
          label={<>Catégorie <i className='text-danger'>*</i></>}
          name='name'
          value={category.name}
          onChange={(e) => handleChange(e, category, setCategory)}
          placeholder='Libellé'
          error={apiErrors.name} />
      </AppEditModal>
    </>
  )
}
