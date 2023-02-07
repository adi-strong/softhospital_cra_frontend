import {useState} from "react";
import {useUpdateConsultationTypeMutation} from "./consultationTypeApiSlice";
import toast from "react-hot-toast";
import {AppEditModal} from "../../components";
import AppInputField from "../../components/forms/AppInputField";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {Button, Col, Form, InputGroup, Row} from "react-bootstrap";

export const EditFileType = ({show, onHide, data, currency}) => {
  const [file, setFile] = useState(data)
  const [updateConsultationType, {isLoading, isError, error}] = useUpdateConsultationTypeMutation()
  let apiErrors = {wording: null, price: null}

  async function onSubmit() {
    apiErrors = {wording: null, price: null}
    try {
      const formData = await updateConsultationType({
        id: file.id,
        wording: file.wording,
        price: file?.price ? file.price.toString() : '0'
      })
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
        show={show}
        onHide={onHide}
        loader={isLoading}
        onEdit={onSubmit}>
        <Row>
          <AppInputField
            required
            autofocus
            error={apiErrors.wording}
            className='col-md-6'
            disabled={isLoading}
            name='wording'
            value={file.wording}
            onChange={(e) => handleChange(e, file, setFile)}
            placeholder='Libellé' />
          <Col md={6}>
            <InputGroup data-aos='fade-in'>
              {currency && <Button type='button' disabled>{currency.currency}</Button>}
              <Form.Control
                required
                type='number'
                disabled={isLoading}
                name='price'
                value={file.price}
                onChange={(e) => handleChange(e, file, setFile)}
                placeholder='Prix' />
              {apiErrors.price && <span className='text-danger'>{apiErrors.price}</span>}
            </InputGroup>
          </Col>
        </Row>
      </AppEditModal>
    </>
  )
}
