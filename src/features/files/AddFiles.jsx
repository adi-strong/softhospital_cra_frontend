import {useState} from "react";
import {Button, Col, Form, InputGroup, Row, Spinner} from "react-bootstrap";
import {onAddArrayClick, onArrayChange, onRemoveArrayClick} from "../../services/handleFormsFieldsServices";
import {useAddNewConsultationTypeMutation} from "./consultationTypeApiSlice";
import toast from "react-hot-toast";
import AppInputField from "../../components/forms/AppInputField";
import {useSelector} from "react-redux";

export const AddFiles = () => {
  const [files, setFiles] = useState([])
  const [addNewConsultationType, {isLoading}] = useAddNewConsultationTypeMutation()
  const { fCurrency } = useSelector(state => state.parameters)

  const onReset = () => setFiles([{wording: '', price: 0}])

  async function onSubmit(e) {
    e.preventDefault()
    if (files.length > 0) {
      let values = [...files]
      for (const key in files) {
        const formData = await addNewConsultationType(files[key])
        if (!formData.error) {
          values = values.filter(item => item !== files[key])
          setFiles(values)
          toast.success('Type de fiches bien rengistré.')
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
    else alert('Aucune information renseignée !')
  }

  return (
    <Form onSubmit={onSubmit}>
      <Button
        disabled={isLoading}
        type='button'
        variant='secondary'
        className='d-block w-100 mb-3'
        onClick={(e) => onAddArrayClick({wording: '', price: 0}, files, setFiles)}>
        <i className='bi bi-plus'/>
      </Button>
      {files && files.map((file, idx) =>
        <Row key={idx}>
          <AppInputField
            required
            autofocus
            className='col-md-6'
            disabled={isLoading}
            name='wording'
            value={file.wording}
            onChange={(e) => onArrayChange(e, idx, files, setFiles)}
            placeholder='Libellé' />
          <Col md={6}>
            <InputGroup data-aos='fade-in'>
              {fCurrency && <Button type='button' disabled>{fCurrency.currency}</Button>}
              <Form.Control
                required
                type='number'
                disabled={isLoading}
                name='price'
                value={file.price}
                onChange={(e) => onArrayChange(e, idx, files, setFiles)}
                placeholder='Prix' />
              {files.length < 5 &&
                <Button
                  disabled={isLoading}
                  type='button'
                  variant='secondary'
                  onClick={() => onAddArrayClick({wording: '', price: 0}, files, setFiles)}>
                  <i className='bi bi-plus'/>
                </Button>}
              {files.length > 1 &&
                <Button
                  disabled={isLoading}
                  type='button'
                  variant='dark'
                  onClick={() => onRemoveArrayClick(idx, files, setFiles)}>
                  <i className='bi bi-dash'/>
                </Button>}
            </InputGroup>
          </Col>
        </Row>)}

      <div className="text-md-center">
        {files.length > 0 && (
          <>
            <Button disabled={isLoading} type='button' variant='secondary' onClick={onReset} className='me-1 mb-1'>
              Effacer
            </Button>
            <Button disabled={isLoading} type='submit' onClick={onSubmit} className='mb-1'>
              {isLoading ? <>Veuillez patienter <Spinner animation='border' size='sm'/></> : 'Enregistrer'}
            </Button>
          </>
        )}
      </div>
    </Form>
  )
}
