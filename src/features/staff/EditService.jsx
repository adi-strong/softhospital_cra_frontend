import {useState} from "react";
import {useGetDepartmentsQuery, useLazyLoadDepartmentsOptionsQuery} from "./departmentApiSlice";
import {useUpdateServiceMutation} from "./serviceApiSlice";
import toast from "react-hot-toast";
import {AppEditModal} from "../../components";
import AppInputField from "../../components/forms/AppInputField";
import {handleChange, onSelectAsyncOption} from "../../services/handleFormsFieldsServices";
import AsyncSelect from "react-select/async";

export function EditService({data, show = false, onHide}) {
  const {data: departmentsData, isLoading: loader, isSuccess, isFetching} = useGetDepartmentsQuery('Departments')
  const [updateService, {isLoading, isError, error}] = useUpdateServiceMutation()
  const [loadDepartmentsOptions] = useLazyLoadDepartmentsOptionsQuery()
  const [service, setService] = useState(data)
  const [department, setDepartment] = useState(data?.department ? {
    label: data.department.name,
    value: `/api/departments/${data.department.id}`
  } : null)

  let departments = []
  if (isSuccess) departments = departmentsData
    ? departmentsData?.ids.map(id => {
      return {
        label: departmentsData?.entities[id].name,
        value: `/api/departments/${departmentsData?.entities[id].id}`,
      }
    })
    : []

  let apiErrors = {name: null}

  async function onSubmit() {
    apiErrors = {name: null}
    try {const data = await updateService({
      id: service.id,
      name: service.name,
      department: department ? department.value : null})
      if (!data.error) {
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

  const onLoadDepartmentsOptions = async keyword => {
    try {
      const data = await loadDepartmentsOptions(keyword).unwrap()
      if (data && data['hydra:member']) {
        const departments = data['hydra:member']
        return departments.map(department => {
          return {
            label: department.name,
            value: `/api/departments/${department.id}`,
          }
        })
      }
    }
    catch (e) { toast.error(e.message) }
  }

  return (
    <>
      <AppEditModal
        onHide={onHide}
        show={show}
        loader={isLoading}
        title='Modification du départment'
        onEdit={onSubmit}>
        {service && (
          <>
            <div className="mb-3">
              <AsyncSelect
                isClearable
                placeholder='-- Département --'
                className='text-uppercase'
                isDisabled={loader || isFetching}
                defaultOptions={departments}
                onChange={(e) => onSelectAsyncOption(e, setDepartment)}
                loadOptions={onLoadDepartmentsOptions}
                value={department} />
            </div>
            <AppInputField
              required
              autofocus
              name='name'
              value={service.name}
              onChange={(e) => handleChange(e, service, setService)}
              disabled={isLoading}
              error={apiErrors.name}
              placeholder='Service' />
          </>
        )}
      </AppEditModal>
    </>
  )
}
