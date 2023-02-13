import {useEffect, useState} from "react";
import {useUpdateTreatmentMutation} from "./treatmentApiSlice";
import {useGetTreatmentCategoriesQuery} from "./treatmentCategoryApiSlice";
import toast from "react-hot-toast";
import {Button, Col, Form, InputGroup, Modal, Row, Spinner} from "react-bootstrap";
import {AppSelectOptions} from "../../components";
import {handleChange, onSelectAsyncOption} from "../../services/handleFormsFieldsServices";
import AppInputField from "../../components/forms/AppInputField";

export const EditTreatment = ({show, onHide, data, currency}) => {
  const [treatment, setTreatment] = useState(data)
  const [category, setCategory] = useState(null)
  const [updateTreatment, {isLoading, isError, error}] = useUpdateTreatmentMutation()
  const {
    data: categories = [],
    isLoading: isCategoriesLoad,
    isSuccess,
    isExamError} = useGetTreatmentCategoriesQuery('TreatmentCategories')
  let apiErrors = {wording: null, price: null}

  let options
  if (isError) alert("Les catégories n'ont pas pû être chargé, une érreur est survenue !!")
  else if (isSuccess) options = categories && categories.ids.map(id => {
    return {
      label: categories.entities[id].name,
      value: categories.entities[id]['@id'],
    }
  })

  useEffect(() => {
    if (data && data?.category) {
      setCategory({
        label: data.category.name,
        value: data.category['@id'],
      })
    }
  }, [data])

  async function onSubmit() {
    apiErrors = {wording: null, price: null}
    try {
      const formData = await updateTreatment({
        id: treatment.id,
        wording: treatment.wording,
        price: treatment?.price ? treatment.price.toString() : '0',
        category: category ? category.value : null})
      if (!formData.error) {
        toast.success('Modification bien efféctuée.')
        onHide()
      }
    }
    catch (e) { toast.error(e.message) }
  }

  if (isExamError) {
    const { violations } = error.data
    if (violations) {
      violations.forEach(({ propertyPath, message }) => {
        apiErrors[propertyPath] = message;
      });
    }
  }

  return (
    <>
      <Modal show={show} onHide={onHide} backdrop='static' keyboard={false}>
        <Modal.Header className='bg-primary text-light' closeButton>
          <Modal.Title>
            <i className='bi bi-pencil-square me-1'/>
            Modification
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <AppSelectOptions
              value={category}
              disabled={isLoading || isCategoriesLoad}
              name='category'
              options={options}
              onChange={(e) => onSelectAsyncOption(e, setCategory)} />
          </div>
          <Row>
            <AppInputField
              required
              autofocus
              className='col-md-6'
              disabled={isLoading}
              name='wording'
              value={treatment.wording}
              onChange={(e) => handleChange(e, treatment, setTreatment)}
              error={apiErrors.wording}
              label={<>Traitement <i className='text-danger'>*</i></>} />
            <Col md={6} className='mb-3'>
              <Form.Label htmlFor='price'>Prix</Form.Label>
              <InputGroup>
                {currency && <InputGroup.Text>{currency.currency}</InputGroup.Text>}
                <Form.Control
                  id='price'
                  type='number'
                  disabled={isLoading}
                  name='price'
                  value={treatment.price}
                  onChange={(e) => handleChange(e, treatment, setTreatment)}
                  error={apiErrors.price}
                  label='Prix' />
                {currency && <InputGroup.Text className='bg-secondary'>{currency.value}</InputGroup.Text>}
              </InputGroup>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button type='button' variant='light' disabled={isLoading} onClick={onHide}>
            <i className='bi bi-x'/> Annuler
          </Button>
          <Button type='button' disabled={isLoading} onClick={onSubmit}>
            {isLoading ? <>Veuillez patienter <Spinner animation='border' size='sm'/></> : 'Valider'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
