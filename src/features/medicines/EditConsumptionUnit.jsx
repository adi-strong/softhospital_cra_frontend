import {useState} from "react";
import {useUpdateConsumptionUnitMutation} from "./consumptionUnitApiSlice";
import toast from "react-hot-toast";
import {AppEditModal} from "../../components";
import AppInputField from "../../components/forms/AppInputField";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {requiredField} from "../covenants/addCovenant";

export const EditConsumptionUnit = ({show, onHide, data}) => {
  const [cUnit, setCUnit] = useState(data)
  const [updateConsumptionUnit, {isLoading, isError, error}] = useUpdateConsumptionUnitMutation()
  let apiErrors = {wording: null}

  async function onSubmit() {
    apiErrors = {wording: null}
    try {
      const formData = await updateConsumptionUnit(cUnit)
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
          onChange={(e) => handleChange(e, cUnit, setCUnit)}
          value={cUnit?.wording}
          name='wording'
          label={<><i className='bi bi-tags'/> Unité {requiredField}</>} />
      </AppEditModal>
    </>
  )
}
