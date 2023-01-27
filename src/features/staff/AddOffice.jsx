import {AppAddModal} from "../../components";
import {useState} from "react";
import {useAddNewOfficeMutation} from "./officeApiSlice";
import {Button, Form, InputGroup} from "react-bootstrap";
import {onAddArrayClick, onArrayChange, onRemoveArrayClick} from "../../services/handleFormsFieldsServices";
import toast from "react-hot-toast";

export const AddOffice = ({show = false, onHide}) => {
  const [offices, setOffices] = useState([{title: ''}])
  const [addNewOffice, {isLoading}] = useAddNewOfficeMutation()

  const onReset = () => setOffices([{title: ''}])

  async function onSubmit(e) {
    e.preventDefault()
    if (offices.length >= 1) {
      let data
      for (const key in offices) {
        const office = await addNewOffice(offices[key])
        if (!office.error) {
          data = offices.filter(item => item !== offices[key])
          if (data.length < 1) {
            onReset()
            onHide()
          }
          else setOffices(data)
          toast.success('Ajout bien efféctué.')
        }
        else {
          const violations = office.error.data.violations
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
    else alert('Aucune fonction renseignée !')
  }

  return (
    <>
      <AppAddModal
        loader={isLoading}
        title='Ajouter une fonction'
        onHide={onHide}
        show={show}
        onAdd={onSubmit}>
        {offices && offices.map((item, key) =>
          <InputGroup key={key} className='mb-3' data-aos='fade-in'>
            <Form.Control
              required
              name='title'
              value={item.title}
              onChange={(e) => onArrayChange(e, key, offices, setOffices)}
              disabled={isLoading}
              placeholder='Fonction...' />
            {offices.length < 5 &&
              <Button
                type='button'
                variant='secondary'
                disabled={isLoading}
                onClick={() => onAddArrayClick({title: ''}, offices, setOffices)}>
                <i className='bi bi-plus'/>
              </Button>}
            {offices.length > 1 &&
              <Button
                type='button'
                variant='dark'
                disabled={isLoading}
                onClick={() => onRemoveArrayClick(key, offices, setOffices)}>
                <i className='bi bi-dash'/>
              </Button>}
          </InputGroup>)}
        <Button type='button' variant='light' className='d-block w-100' onClick={onReset}>
          <i className='bi bi-trash3'/>
        </Button>
      </AppAddModal>
    </>
  )
}
