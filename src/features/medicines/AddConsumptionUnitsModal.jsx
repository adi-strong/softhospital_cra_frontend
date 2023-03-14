import {useState} from "react";
import toast from "react-hot-toast";
import {useAddNewConsumptionUnitMutation} from "./consumptionUnitApiSlice";
import {AppAddModal} from "../../components";
import {Button, Form, InputGroup} from "react-bootstrap";
import {onAddArrayClick, onArrayChange, onRemoveArrayClick} from "../../services/handleFormsFieldsServices";

export const AddConsumptionUnitsModal = ({show, onHide}) => {
  const [addNewConsumptionUnit, {isLoading}] = useAddNewConsumptionUnitMutation()
  const [cUnits, setCUnits] = useState([{wording: ''}])

  const onReset = () => setCUnits([{wording: ''}])

  const onSubmit = async (e) => {
    e.preventDefault()
    if (cUnits.length > 0) {
      let values = [...cUnits]
      for (const key in cUnits) {
        const formData = await addNewConsumptionUnit(cUnits[key])
        if (!formData.error) {
          values = values.filter(item => item !== cUnits[key])
          setCUnits(values)
          toast.success('Unité bien ajoutée.')
          if (values.length < 1) {
            toast.success('Enregistrement bien efféctuée.', {
              icon: '👌',
              style: {
                background: '#3f6c1e',
                color: '#fff'
              }
            })
            onReset()
            onHide()
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
    }
    else alert('Aucune catégorie renseignée !!!')
  }

  return (
    <>
      <AppAddModal
        loader={isLoading}
        onHide={onHide}
        show={show}
        title={<><i className='bi bi-plus'/> Enregistrement des unités</>}
        onAdd={onSubmit}>
        <Form onSubmit={onSubmit}>
          {cUnits && cUnits.map((cUnit, key) =>
            <InputGroup key={key} className='mb-3' data-aos='fade-in'>
              <Form.Control
                required
                disabled={isLoading}
                name='wording'
                value={cUnit.wording}
                onChange={(e) => onArrayChange(e, key, cUnits, setCUnits)}
                placeholder='Libellé' />
              {cUnits.length < 5 &&
                <Button
                  disabled={isLoading}
                  type='button'
                  variant='secondary'
                  onClick={() => onAddArrayClick({wording: ''}, cUnits, setCUnits)}>
                  <i className='bi bi-plus'/>
                </Button>}
              {cUnits.length > 1 &&
                <Button
                  disabled={isLoading}
                  type='button'
                  variant='dark'
                  onClick={() => onRemoveArrayClick(key, cUnits, setCUnits)}>
                  <i className='bi bi-dash'/>
                </Button>}
            </InputGroup>)}
        </Form>

        <Button type='button' variant='light' className='d-block w-100' disabled={isLoading} onClick={onReset}>
          <i className='bi bi-trash3 text-danger'/>
        </Button>
      </AppAddModal>
    </>
  )
}
