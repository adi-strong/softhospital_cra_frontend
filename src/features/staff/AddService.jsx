import {AppAddModal} from "../../components";
import {useState} from "react";
import {useAddNewServiceMutation} from "./serviceApiSlice";
import toast from "react-hot-toast";
import {Button, Form, InputGroup} from "react-bootstrap";
import {
  onAddArrayClick,
  onArrayChange,
  onRemoveArrayClick, onSelectAsyncOption,
} from "../../services/handleFormsFieldsServices";
import {
  useGetDepartmentsQuery,
  useLazyLoadDepartmentsOptionsQuery
} from "./departmentApiSlice";
import AsyncSelect from "react-select/async";

export const AddService = ({show = false, onHide}) => {
  const {data, isLoading: loader, isSuccess, isFetching} = useGetDepartmentsQuery('Departments')
  const [services, setServices] = useState([{name: ''}])
  const [department, setDepartment] = useState(null)
  const [loadDepartmentsOptions] = useLazyLoadDepartmentsOptionsQuery()
  const [addNewService, {isLoading}] = useAddNewServiceMutation()

  let departments = []
  if (isSuccess) departments = data
    ? data?.ids.map(id => {
      return {
        label: data?.entities[id].name,
        value: `/api/departments/${data?.entities[id].id}`,
      }
    })
    : []

  const onReset = () => {
    setServices([{wording: ''}])
    setDepartment(null)
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

  // {...services[key], department: department ? department.value : null}
  async function onSubmit() {
    if (services.length > 0) {
      let values = [...services]
      for (const key in services) {
        try {
          const formData = await addNewService({...services[key], department: department ? department.value : null})
          if (!formData.error) {
            values = values.filter(item => item !== services[key])
            setServices(values)
            toast.success('Service bien enregistré.')
            if (values.length < 1) {
              onHide()
              setServices([{wording: ''}])
              setDepartment(null)
            }
          }
          else {
            const violations = formData.error.data.violations
            if (violations) {
              violations.forEach(({propertyPath, message}) => {
                toast.error(`${propertyPath}: ${message}`, {
                  style: {
                    background: 'red',
                    color: '#fff',
                  }
                })
              })
            }
          }
        }
        catch (e) { }
      }
    }
    else alert('Aucun service renseigné !')
  }

  return (
    <>
      <AppAddModal
        show={show}
        onHide={onHide}
        onAdd={onSubmit}
        loader={isLoading}
        title='Ajouter un service'>
        <div className="mb-3">
          <AsyncSelect
            isClearable
            placeholder='-- Département --'
            className='text-uppercase'
            isDisabled={loader || isFetching || isLoading}
            defaultOptions={departments}
            onChange={(e) => onSelectAsyncOption(e, setDepartment)}
            loadOptions={onLoadDepartmentsOptions}
            value={department} />
        </div>
        {services && services.map((item, key) =>
          <InputGroup key={key} className='mb-3' data-aos='fade-in'>
            <Form.Control
              required
              name='name'
              value={item.name}
              onChange={(e) => onArrayChange(e, key, services, setServices)}
              disabled={isLoading}
              placeholder='Service...' />
            {services.length < 5 &&
              <Button
                type='button'
                variant='secondary'
                disabled={isLoading}
                onClick={() => onAddArrayClick({name: ''}, services, setServices)}>
                <i className='bi bi-plus'/>
              </Button>}
            {services.length > 1 &&
              <Button
                type='button'
                variant='dark'
                disabled={isLoading}
                onClick={() => onRemoveArrayClick(key, services, setServices)}>
                <i className='bi bi-dash'/>
              </Button>}
          </InputGroup>)}
        <Button type='button' variant='light' onClick={onReset} className='d-block w-100' disabled={isLoading}>
          <i className='bi bi-trash3'/>
        </Button>
      </AppAddModal>
    </>
  )
}
