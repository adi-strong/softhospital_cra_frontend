import {useEffect, useState} from "react";
import {useUpdateActMutation} from "./actApiSlice";
import {AppLgModal, AppSelectOptions} from "../../components";
import AppInputField from "../../components/forms/AppInputField";
import {handleChange, onSelectAsyncOption} from "../../services/handleFormsFieldsServices";
import toast from "react-hot-toast";
import {useGetActCategoriesQuery} from "./actCategoriesApiSlice";
import {Button, ButtonGroup, Col, Form, InputGroup, Row} from "react-bootstrap";
import {cardTitleStyle} from "../../layouts/AuthLayout";

export const EditAct = ({ show, onHide, data, currency, onRefresh }) => {
  const [category, setCategory] = useState(null)
  const {data: categories = [], isLoading: isCategoriesLoad, isSuccess, isError} = useGetActCategoriesQuery('ActCategories')
  const [updateAct, {isLoading, isError: isActError, error}] = useUpdateActMutation()
  let apiErrors = {wording: null, price: null}

  const [act, setAct] = useState({
    wording: '',
    cost: 0.00,
    price: 0.00,
    procedures: [{item: '', children: [{wording: ''}]}]
  })

  let options
  if (isError) alert("Les catégories n'ont pas pû être chargé, une érreur est survenue !!")
  else if (isSuccess) options = categories && categories.map(category => {
    return {
      label: category?.name,
      value: category['@id'],
    }
  })

  useEffect(() => {
    if (data) {
      if (data?.category) setCategory({
        label: data.category.name,
        value: data.category['@id']
      })

      let procedures
      if (data?.procedures && data.procedures.length > 0) {
        procedures = []
        const items = data.procedures
        for (const key in items) {
          const item = items[key]?.item
          const children = items[key].children?.map(c => { return {wording: c?.wording} })
          procedures.push({ item, children })
        }
      }
      else procedures = [{item: '', children: [{wording: ''}]}]
      setAct(prev => {
        return {
          ...prev,
          wording: data?.wording ? data.wording : '',
          cost: data?.cost ? data.cost : 0.00,
          price: data?.price ? data.price : 0.00,
          procedures: procedures
        }
      })
    }
  }, [data])

  async function onSubmit() {
    apiErrors = {wording: null, price: null}
    if (data && data?.id) {
      try {
        const formData = await updateAct({
          ...act,
          id: data.id,
          category})
        if (!formData.error) {
          toast.success('Modification bien efféctuée.')
          onRefresh()
          onHide()
        }
      }
      catch (e) { toast.error(e.message) }
    }
  }

  if (isActError) {
    const { violations } = error.data
    if (violations) {
      violations.forEach(({ propertyPath, message }) => {
        apiErrors[propertyPath] = message;
      });
    }
  }

  function handleChangePItem(event, index) {
    const target = event.target
    const values = [...act.procedures]
    values[index][target.name] = target.value
    setAct({...act, procedures: values})
  }

  function handleChangePChildItem(event, index, index2) {
    const target = event.target
    const parentItems = [...act.procedures]
    const values = parentItems[index]['children']
    values[index2][target.name] = target.value
    parentItems[index]['children'] = values
    setAct({...act, procedures: parentItems})
  }

  const onAddPItem = () => setAct({...act, procedures: [...act.procedures, {item: '', children: [{wording: ''}]}]})

  function onRemovePItem(index) {
    const values = [...act.procedures]
    values.splice(index, 1)
    setAct({...act, procedures: values})
  }

  function onAddPChildItem(index) {
    const values = [...act.procedures]
    values[index]['children'].push({wording: ''})
    setAct({...act, procedures: values})
  }

  function onRemovePChildItem(index, index2) {
    const values = [...act.procedures]
    const children = values[index]['children']
    children.splice(index2, 1)
    values[index]['children'] = children
    setAct({...act, procedures: values})
  }

  return (
    <>
      <AppLgModal
        onClick={onSubmit}
        title={<><i className='bi bi-pencil-square'/> Modification de l'Acte</>}
        loader={isLoading}
        onHide={onHide}
        show={show}
        className='bg-primary text-light'>
        <Row>
          <Col md={6} className='mb-3'>
            <AppSelectOptions
              label='Catégorie'
              value={category}
              disabled={isLoading || isCategoriesLoad}
              name='category'
              options={options}
              onChange={(e) => onSelectAsyncOption(e, setCategory)} />
          </Col>
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

          <Col md={4}>
            <Form.Label htmlFor='cost'>Coût</Form.Label>
            <InputGroup>
              {currency && <InputGroup.Text>{currency.currency}</InputGroup.Text>}
              <Form.Control
                id='cost'
                type='number'
                className='text-end'
                disabled={isLoading}
                name='cost'
                value={act.cost}
                onChange={(e) => handleChange(e, act, setAct)}
                label='Coût' />
              {currency && <InputGroup.Text className='bg-secondary'>{currency.value}</InputGroup.Text>}
            </InputGroup>

            <Form.Label htmlFor='price'>Prix</Form.Label>
            <InputGroup>
              {currency && <InputGroup.Text>{currency.currency}</InputGroup.Text>}
              <Form.Control
                id='price'
                type='number'
                className='text-end'
                disabled={isLoading}
                name='price'
                value={act.price}
                onChange={(e) => handleChange(e, act, setAct)}
                error={apiErrors.price}
                label='Prix' />
              {currency && <InputGroup.Text className='bg-secondary'>{currency.value}</InputGroup.Text>}
            </InputGroup>
          </Col>

          {/* ----------------------------------------------------------------------------- */}
          <Col md={8} className='bg-light pt-3' style={{ borderRadius: 6 }}>
            <h5 className='text-center card-title' style={cardTitleStyle}>
              <i className='bi bi-caret-down-fill'/> Procédures
            </h5> <hr className='mt-0 text-primary'/>
            {act.procedures && act.procedures.length > 0 &&
              act.procedures.map((p, idx) =>
                <Row key={idx} className='mb-3'>
                  <Col md={4}>
                    <Form.Control
                      autoComplete='off'
                      required
                      placeholder='Procédure :'
                      className='mb-2'
                      name='item'
                      value={p.item}
                      onChange={(e) => handleChangePItem(e, idx)}
                      disabled={isLoading} />
                    <ButtonGroup size='sm' className='mb-2 w-100'>
                      {act.procedures.length > 1 &&
                        <Button type='button' variant='dark' disabled={isLoading} onClick={() => onRemovePItem(idx)}>
                          <i className='bi bi-dash'/>
                        </Button>}
                      <Button type='button' variant='secondary' disabled={isLoading} onClick={onAddPItem}>
                        <i className='bi bi-plus'/>
                      </Button>
                    </ButtonGroup>
                  </Col>
                  <Col md={8}>
                    {p.children && p.children.length > 0 && p.children.map((c, i) =>
                      <Row key={i}>
                        <Col md={8} className='mb-2'>
                          <Form.Control
                            required
                            autoComplete='off'
                            placeholder='Libellé'
                            name='wording'
                            value={c.wording}
                            onChange={(e) => handleChangePChildItem(e, idx, i)}
                            disabled={isLoading} />
                        </Col>
                        <Col md={4}>
                          <ButtonGroup className='w-100'>
                            <Button type='button' variant='primary' disabled={isLoading} onClick={() => onAddPChildItem(idx)}>
                              <i className='bi bi-plus'/>
                            </Button>
                            {p.children.length > 1 &&
                              <Button
                                type='button'
                                variant='danger'
                                disabled={isLoading}
                                onClick={() => onRemovePChildItem(idx, i)}>
                                <i className='bi bi-x'/>
                              </Button>}
                          </ButtonGroup>
                        </Col>
                      </Row>)}
                  </Col>
                  <hr/>
                </Row>)}
          </Col>
        </Row>
      </AppLgModal>
    </>
  )
}
