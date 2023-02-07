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
import {useAddNewActMutation} from "./actApiSlice";
import toast from "react-hot-toast";
import {useGetActCategoriesQuery} from "./actCategoriesApiSlice";

export const AddActs = ({onHide, show = false, currency}) => {
  const [category, setCategory] = useState(null)
  const [acts, setActs] = useState([{wording: '', price: 0,}])
  const [addNewAct, {isLoading}] = useAddNewActMutation()
  const {data: categories = [], isLoading: isCategoriesLoad, isSuccess, isError} = useGetActCategoriesQuery('ActCategories')

  let options
  if (isError) alert("Les catégories n'ont pas pû être chargé, une érreur est survenue !!")
  else if (isSuccess) options = categories && categories.ids.map(id => {
    return {
      label: categories.entities[id].name,
      value: categories.entities[id]['@id'],
    }
  })

  async function onSubmit(e) {
    e.preventDefault()
    if (acts.length > 0) {
      let values = [...acts]
      for (const key in acts) {
        let formData = await addNewAct({...acts[key], category: category ? category.value : null})
        if (!formData.error) {
          values = values.filter(item => item !== acts[key])
          setActs(values)
          if (values.length < 1) {
            toast.success('Enregistrement bien efféctué.')
            setActs([{wording: '', price: 0}])
            setCategory(null)
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
    else alert('Aucune information renseignée !')
  }

  const onReset = () => {
    setActs([{wording: '', price: 0}])
    setCategory(null)
  }

  return (
    <>
      <Modal show={show} onHide={onHide} backdrop='static' keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Enregistrement des actes médicaux</Modal.Title>
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
          {acts && acts?.map((act, idx) =>
            <Row key={idx} data-aos='fade-in'>
              <Col md={6}>
                <InputGroup>
                  <AppSInputField
                    required
                    autofocus
                    disabled={isLoading}
                    name='wording'
                    placeholder='Libellé'
                    value={act.wording}
                    onChange={(e) => onArrayChange(e, idx, acts, setActs)} />
                </InputGroup>
              </Col>
              <Col md={6}>
                <InputGroup>
                  {currency && <Button type='button' disabled>{currency.currency}</Button>}
                  <Form.Control
                    required
                    disabled={isLoading}
                    type='number'
                    name='price'
                    placeholder='Prix'
                    value={act.price}
                    onChange={(e) => onArrayChange(e, idx, acts, setActs)} />
                  {acts.length < 5 &&
                    <Button
                      type='button'
                      disabled={isLoading}
                      variant='secondary'
                      onClick={() => onAddArrayClick({wording: '', price: 0}, acts, setActs)}>
                      <i className='bi bi-plus'/>
                    </Button>}
                  {acts.length > 1 &&
                    <Button
                      disabled={isLoading}
                      type='button'
                      variant='dark'
                      onClick={() => onRemoveArrayClick(idx, acts, setActs)}>
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

AddActs.propTypes = {show: PropTypes.bool, onHide: PropTypes.func.isRequired}
