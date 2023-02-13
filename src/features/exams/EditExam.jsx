import {useEffect, useState} from "react";
import {AppEditModal, AppSelectOptions} from "../../components";
import {useUpdateExamMutation} from "./examApiSlice";
import {handleChange, onSelectAsyncOption} from "../../services/handleFormsFieldsServices";
import {Col, Form, InputGroup, Row} from "react-bootstrap";
import AppInputField from "../../components/forms/AppInputField";
import toast from "react-hot-toast";
import {useGetExamCategoriesQuery} from "./examCategoryApiSlice";

export const EditExam = ({show, onHide, data, currency}) => {
  const [exam, setExam] = useState(data)
  const [category, setCategory] = useState(null)
  const [updateExam, {isLoading, isError, error}] = useUpdateExamMutation()
  const {
    data: categories = [],
    isLoading: isCategoriesLoad,
    isSuccess,
    isExamError} = useGetExamCategoriesQuery('ExamCategories')
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
      const formData = await updateExam({
        id: exam.id,
        wording: exam.wording,
        price: exam?.price ? exam.price.toString() : '0',
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
      <AppEditModal
        show={show}
        onHide={onHide}
        onEdit={onSubmit}
        loader={isLoading}>
        <AppSelectOptions
          className='mb-3'
          value={category}
          disabled={isLoading || isCategoriesLoad}
          name='category'
          options={options}
          onChange={(e) => onSelectAsyncOption(e, setCategory)} />
        <Row>
          <AppInputField
            required
            autofocus
            className='col-md-6'
            disabled={isLoading}
            name='wording'
            value={exam.wording}
            onChange={(e) => handleChange(e, exam, setExam)}
            error={apiErrors.wording}
            label={<>Examen <i className='text-danger'>*</i></>} />
          <Col md={6} className='mb-3'>
            <Form.Label htmlFor='price'>Prix</Form.Label>
            <InputGroup>
              {currency && <InputGroup.Text>{currency.currency}</InputGroup.Text>}
              <Form.Control
                id='price'
                type='number'
                disabled={isLoading}
                name='price'
                value={exam.price}
                onChange={(e) => handleChange(e, exam, setExam)}
                error={apiErrors.price}
                label='Prix' />
              {currency && <InputGroup.Text className='bg-secondary'>{currency.value}</InputGroup.Text>}
            </InputGroup>
          </Col>
        </Row>
      </AppEditModal>
    </>
  )
}
