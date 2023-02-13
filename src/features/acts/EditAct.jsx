import {useEffect, useState} from "react";
import {useUpdateActMutation} from "./actApiSlice";
import {AppEditModal, AppSelectOptions} from "../../components";
import AppInputField from "../../components/forms/AppInputField";
import {handleChange, onSelectAsyncOption} from "../../services/handleFormsFieldsServices";
import toast from "react-hot-toast";
import {useGetActCategoriesQuery} from "./actCategoriesApiSlice";
import {Col, Form, InputGroup, Row} from "react-bootstrap";

export const EditAct = ({show, onHide, data, currency}) => {
  const [act, setAct] = useState(data)
  const [category, setCategory] = useState(null)
  const {data: categories = [], isLoading: isCategoriesLoad, isSuccess, isError} = useGetActCategoriesQuery('ActCategories')
  const [updateAct, {isLoading, isError: isActError, error}] = useUpdateActMutation()
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
    if (data && data.category) {
      setCategory({
        label: data.category.name,
        value: data.category['@id']
      })
    }
  }, [data])

  async function onSubmit() {
    apiErrors = {wording: null, price: null}
    try {
      const formData = await updateAct({
        id: act.id,
        wording: act.wording,
        price: act?.price ? act.price.toString() : '0',
        category: category ? category.value : null})
      if (!formData.error) {
        toast.success('Modification bien efféctuée.')
        onHide()
      }
    }
    catch (e) { toast.error(e.message) }
  }

  if (isActError) {
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
        <div className='mb-3'>
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
            value={act.wording}
            onChange={(e) => handleChange(e, act, setAct)}
            error={apiErrors.wording}
            label={<>Acte <i className='text-danger'>*</i></>} />
          <Col md={6}>
            <Form.Label htmlFor='price'>Prix</Form.Label>
            <InputGroup>
              {currency && <InputGroup.Text>{currency.currency}</InputGroup.Text>}
              <Form.Control
                id='price'
                type='number'
                disabled={isLoading}
                name='price'
                value={act.price}
                onChange={(e) => handleChange(e, act, setAct)}
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
