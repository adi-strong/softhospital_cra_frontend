import {useState} from "react";
import PropTypes from "prop-types";
import {Button, Col, Form, InputGroup, Modal, Row, Spinner} from "react-bootstrap";
import {AppSelectOptions, AppSInputField} from "../../components";
import {
  onAddArrayClick,
  onArrayChange,
  onRemoveArrayClick,
  onSelectAsyncOption
} from "../../services/handleFormsFieldsServices";
import {useAddNewTreatmentMutation} from "./treatmentApiSlice";
import {useGetTreatmentCategoriesQuery} from "./treatmentCategoryApiSlice";
import toast from "react-hot-toast";

export const AddTreatments = ({onHide, show = false, currency}) => {
  const [treatments, setTreatments] = useState([{wording: '', price: 0}])
  const [category, setCategory] = useState(null)
  const [addNewTreatment, {isLoading}] = useAddNewTreatmentMutation()
  const {
    data: categories = [],
    isLoading: isCategoriesLoad,
    isSuccess,
    isError} = useGetTreatmentCategoriesQuery('TreatmentCategories')

  let options
  if (isError) alert('Erreur lors du chargement des catégories !!')
  else if (isSuccess) options = categories && categories.ids.map(id => {
    return {
      label: categories.entities[id].name,
      value: categories.entities[id]['@id'],
    }
  })

  async function onSubmit() {
    if (treatments.length > 0) {
      let values = [...treatments]
      for (const key in treatments) {
        const formData = await addNewTreatment({...treatments[key], category: category ? category.value : null})
        if (!formData.error) {
          values = values.filter(item => item !== treatments[key])
          setTreatments(values)
          if (values.length < 1) {
            setTreatments([{price: 0, wording: ''}])
            setCategory(null)
            toast.success('Enregistrement bien efféctuée.')
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
    else alert('Aucune information renseignée !!')
  }

  const onReset = () => {
    setTreatments([{wording: '', price: 0}])
    setCategory(null)
  }

  return (
    <>
      <Modal show={show} onHide={onHide} backdrop='static' keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Enregistrement de traitements</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span>Catégorie</span>
          <AppSelectOptions
            className='mb-3'
            options={options}
            name='category'
            value={category}
            disabled={isLoading || isCategoriesLoad}
            onChange={(e) => onSelectAsyncOption(e, setCategory)}
            placeholder='Catégorie...' />
          {treatments && treatments?.map((treatment, idx) =>
            <Row key={idx} data-aos='fade-in'>
              <Col md={6}>
                <InputGroup>
                  <AppSInputField
                    required
                    autofocus
                    disabled={isLoading}
                    name='wording'
                    placeholder='Libéllé'
                    value={treatment.wording}
                    onChange={(e) => onArrayChange(e, idx, treatments, setTreatments)} />
                </InputGroup>
              </Col>
              <Col md={6} className='mb-3'>
                <InputGroup>
                  {currency && <Button type='button' disabled>{currency.currency}</Button>}
                  <Form.Control
                    required
                    disabled={isLoading}
                    type='number'
                    name='price'
                    placeholder='Prix'
                    value={treatment.price}
                    onChange={(e) => onArrayChange(e, idx, treatments, setTreatments)} />
                  {treatments.length < 5 &&
                    <Button
                      disabled={isLoading}
                      type='button'
                      variant='secondary'
                      onClick={() => onAddArrayClick({wording: '', price: 0}, treatments, setTreatments)}>
                      <i className='bi bi-plus'/>
                    </Button>}
                  {treatments.length > 1 &&
                    <Button
                      disabled={isLoading}
                      type='button'
                      variant='dark'
                      onClick={() => onRemoveArrayClick(idx, treatments, setTreatments)}>
                      <i className='bi bi-dash'/>
                    </Button>}
                </InputGroup>
              </Col>
            </Row>)}
          <Button disabled={isLoading} type='reset' variant='light' className='w-100' onClick={onReset}>
            <i className='bi bi-trash3'/>
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={isLoading} type='button' variant='light' onClick={onHide}>
            <i className='bi bi-x'/> Annuler
          </Button>
          <Button disabled={isLoading} type='button' onClick={onSubmit}>
            {isLoading ? <>Veuillez patienter <Spinner animation='border' size='sm'/></> : 'Enregistrer'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

AddTreatments.propTypes = {show: PropTypes.bool, onHide: PropTypes.func.isRequired}
