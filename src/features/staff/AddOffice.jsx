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
    if (offices.length > 0) {
      let values = [...offices]
      for (const key in offices) {
        try {
          const formData = await addNewOffice(offices[key])
          if (!formData.error) {
            values = values.filter(item => item !== offices[key])
            setOffices(values)
            toast.success('Fonction bien enregistrée.')
            if (values.length < 1) {
              onHide()
              setOffices([{title: ''}])
            }
          }
        }
        catch (e) { }
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
              autoFocus
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
