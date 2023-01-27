import {useState} from "react";
import {AppEditModal} from "../../components";
import AppInputField from "../../components/forms/AppInputField";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {useUpdateDepartmentMutation} from "./departmentApiSlice";
import toast from "react-hot-toast";

export function EditDepartment({data, show = false, onHide}) {
  const [department, setDepartment] = useState(data)
  const [updateDepartment, {isLoading, isError, error}] = useUpdateDepartmentMutation()
  let apiErrors = {name: null}

  async function handleEdit() {
    apiErrors = {name: null}
    try {
      const departmentData = await updateDepartment(department)
      if (!departmentData.error) {
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
        onHide={onHide}
        show={show}
        loader={isLoading}
        title='Modification du départment'
        onEdit={handleEdit}>
        {department && (
          <>
            <AppInputField
              required
              autofocus
              name='name'
              value={department.name}
              onChange={(e) => handleChange(e, department, setDepartment)}
              disabled={isLoading}
              error={apiErrors.name}
              placeholder='Département' />
          </>
        )}
      </AppEditModal>
    </>
  )
}
