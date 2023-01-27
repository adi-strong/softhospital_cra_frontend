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
    e.preventDefault()
    if (departments.length >= 1) {
      let data
      for (const key in departments) {
        const department = await addNewDepartment(departments[key])
        if (!department.error) {
          data = departments.filter(item => item !== departments[key])
          if (data.length < 1) {
            onReset()
            onHide()
          }
          else setDepartments(data)
          toast.success('Ajout bien efféctué.')
        }
        else {
          const violations = department.error.data.violations
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
    else alert('Aucun département renseigné !')
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
