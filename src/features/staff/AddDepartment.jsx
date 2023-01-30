import PropTypes from "prop-types";
import {Button, Form, InputGroup, Modal, Spinner} from "react-bootstrap";
import {useState} from "react";
import {onAddArrayClick, onArrayChange, onRemoveArrayClick} from "../../services/handleFormsFieldsServices";
import {useAddNewDepartmentMutation} from "./departmentApiSlice";
import toast from "react-hot-toast";

export const AddDepartment = ({onHide, show = false}) => {
  const [departments, setDepartments] = useState([{name: ''}])
  const [addNewDepartment, {isLoading}] = useAddNewDepartmentMutation()

  const onReset = () => setDepartments([{name: ''}])

  async function onSubmit(e) {
    if (departments.length > 0) {
      let values = [...departments]
      for (const key in departments) {
        try {
          const formData = await addNewDepartment(departments[key])
          if (!formData.error) {
            values = values.filter(item => item !== departments[key])
            setDepartments(values)
            toast.success('Département bien enregistré.')
            if (values.length < 1) {
              onHide()
              setDepartments([{name: ''}])
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
    else alert('Aucune information renseignée !')
  }

  return (
    <>
      <Modal show={show} onHide={onHide} backdrop='static' keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un département</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {departments && departments.map((item, key) =>
            <InputGroup key={key} className='mb-3' data-aos='fade-in'>
              <Form.Control
                required
                name='name'
                value={item.name}
                onChange={(e) => onArrayChange(e, key, departments, setDepartments)}
                disabled={isLoading}
                placeholder='Nom du département...' />
              {departments.length < 5 &&
                <Button
                  type='button'
                  variant='secondary'
                  disabled={isLoading}
                  onClick={() => onAddArrayClick({name: ''}, departments, setDepartments)}>
                  <i className='bi bi-plus'/>
                </Button>}
              {departments.length > 1 &&
                <Button
                  type='button'
                  variant='dark'
                  disabled={isLoading}
                  onClick={() => onRemoveArrayClick(key, departments, setDepartments)}>
                  <i className='bi bi-dash'/>
                </Button>}
            </InputGroup>)}
          <Button type='button' variant='light' onClick={onReset} className='d-block w-100' disabled={isLoading}>
            <i className='bi bi-trash3'/>
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button type='button' variant='light' disabled={isLoading} onClick={onHide}>
            <i className='bi bi-x'/> Fermer
          </Button>
          <Button type='button' disabled={isLoading} onClick={onSubmit}>
            {isLoading ? <>Veuillez patienter <Spinner animation='border' size='sm'/></> : 'Ajouter'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

AddDepartment.propTypes = {show: PropTypes.bool, onHide: PropTypes.func.isRequired}
