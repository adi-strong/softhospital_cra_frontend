import {useState} from "react";
import {Button, Col, Form, InputGroup, Modal, Row, Spinner} from "react-bootstrap";
import {AppSelectOptions, AppSInputField} from "../../components";
import {
  onAddArrayClick,
  onArrayChange,
  onRemoveArrayClick,
  onSelectAsyncOption
} from "../../services/handleFormsFieldsServices";
import PropTypes from "prop-types";
import {useAddNewExamMutation} from "./examApiSlice";
import toast from "react-hot-toast";
import {useGetExamCategoriesQuery} from "./examCategoryApiSlice";

export const AddExams = ({onHide, show = false, currency}) => {
  const [exams, setExams] = useState([{wording: '', price: 0,}])
  const [category, setCategory] = useState(null)
  const [addNewExam, {isLoading}] = useAddNewExamMutation()
  const {
    data: categories = [],
    isLoading: isCategoriesLoad,
    isSuccess,
    isError} = useGetExamCategoriesQuery('ExamCategories')

  let options
  if (isError) alert('Erreur lors du chargement des catégories !!')
  else if (isSuccess) options = categories && categories.ids.map(id => {
    return {
      label: categories.entities[id].name,
      value: categories.entities[id]['@id'],
    }
  })

  async function onSubmit() {
    if (exams.length > 0) {
      let values = [...exams]
      for (const key in exams) {
        const formData = await addNewExam({...exams[key], category: category ? category.value : null})
        if (!formData.error) {
          values = values.filter(item => item !== exams[key])
          setExams(values)
          if (values.length < 1) {
            setExams([{price: 0, wording: ''}])
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
    setExams([{wording: '', price: 0}])
    setCategory(null)
  }

  return (
    <>
      <Modal show={show} onHide={onHide} backdrop='static' keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Enregistrement des examens</Modal.Title>
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
          {exams && exams?.map((exam, idx) =>
            <Row key={idx} data-aos='fade-in'>
              <Col md={6}>
                <InputGroup>
                  <AppSInputField
                    required
                    autofocus
                    disabled={isLoading}
                    name='wording'
                    placeholder='Libéllé'
                    value={exam.wording}
                    onChange={(e) => onArrayChange(e, idx, exams, setExams)} />
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
                    value={exam.price}
                    onChange={(e) => onArrayChange(e, idx, exams, setExams)} />
                  {exams.length < 5 &&
                    <Button
                      disabled={isLoading}
                      type='button'
                      variant='secondary'
                      onClick={() => onAddArrayClick({wording: '', price: 0}, exams, setExams)}>
                      <i className='bi bi-plus'/>
                    </Button>}
                  {exams.length > 1 &&
                    <Button
                      disabled={isLoading}
                      type='button'
                      variant='dark'
                      onClick={() => onRemoveArrayClick(idx, exams, setExams)}>
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

AddExams.propTypes = {show: PropTypes.bool, onHide: PropTypes.func.isRequired}
