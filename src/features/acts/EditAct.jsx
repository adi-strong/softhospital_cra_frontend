import {useEffect, useState} from "react";
import {useUpdateActMutation} from "./actApiSlice";
import {AppLgModal, AppSelectOptions} from "../../components";
import AppInputField from "../../components/forms/AppInputField";
import {handleChange, onSelectAsyncOption} from "../../services/handleFormsFieldsServices";
import {useGetActCategoriesQuery} from "./actCategoriesApiSlice";
import {Button, Col, Form, InputGroup, Row} from "react-bootstrap";
import {requiredField} from "../covenants/addCovenant";
import toast from "react-hot-toast";

export const EditAct = ({ show, onHide, data, currency, onRefresh }) => {
  const [category, setCategory] = useState(null)
  const {data: categories = [], isLoading: isCategoriesLoad, isSuccess, isError} = useGetActCategoriesQuery('ActCategories')
  const [updateAct, {isLoading, isError: isActError, error}] = useUpdateActMutation()
  let apiErrors = {wording: null, price: null}

  const [act, setAct] = useState({
    wording: '',
    cost: 0.00,
    price: 0.00,
    profitMarge: 0,
    procedures: [{item: '', quantity: ''}]
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
      if (data?.category) {
        setCategory({
          label: data.category?.name,
          value: data.category['@id']
        })
      } // get category

      const wording = data?.wording ? data.wording : ''
      const cost = data?.cost ? data.cost : 0.00
      const price = data?.price ? data.price : 0.00
      const profitMarge = data?.profitMarge ? data.profitMarge : 0
      const procedures = data?.procedures && data.procedures.length > 0
        ? data.procedures?.map(p => {return {item: p?.item ? p.item : '', quantity: p?.quantity ? p.quantity : ''}})
        : [{item: '', quantity: ''}]

      setAct(s => {return {...s, id: data?.id, price, cost, wording, profitMarge, procedures}})
    }
  }, [data]) // handle get data

  const onAddActItem = () => setAct({...act, procedures: [...act.procedures, {item: '', quantity: ''}]})

  const onRemoveActItem = index => {
    const values = [...act.procedures]
    values.splice(index, 1)
    setAct({...act, procedures: values})
  }

  const handleChangeActItem = (event, index) => {
    const target = event.target
    const values = [...act.procedures]
    values[index][target.name] = target.value
    setAct({...act, procedures: values})
  }

  async function onSubmit(e) {
    e.preventDefault()
    apiErrors = {wording: null, price: null}
    try {
      const submit = await updateAct({...act, category})
      if (!submit.error) {
        toast.success('Opération bien efféctuéee.')
        onHide()
        onRefresh()
      }
    } catch (e) { }
  }

  function onChangeActCost({target}) {
    const cost = target.value > 0 && !isNaN(target.value) ? parseFloat(target.value) : 0
    let price
    if (act.profitMarge > 0.00) {
      const sum = parseFloat((cost * act.profitMarge) / 100)
      price = parseFloat(cost + sum)
    }
    else price = cost

    setAct({...act, price, cost})
  }

  function onChangeProfitMarge({target}) {
    const profitMarge = target.value > 0 && !isNaN(target.value) ? parseFloat(target.value) : 0
    let price, sum = 0
    const cost = act.cost
    if (profitMarge > 0.00) {
      sum = parseFloat((cost * profitMarge) / 100)
      price = parseFloat(cost) + parseFloat(sum)
    }
    else price = parseFloat(cost)

    setAct({...act, profitMarge, price})
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
      <AppLgModal
        onClick={onSubmit}
        title={<><i className='bi bi-pencil-square'/> Modification de l'Acte</>}
        loader={isLoading}
        onHide={onHide}
        show={show}
        className='bg-primary text-light'>
        <Form onSubmit={onSubmit}>
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
          </Row>

          <Row className='px-3'>
            <Col md={4} className='bg-light p-1' style={{ borderRadius: 6, border: '1px solid lightgray' }}>
              <Row>
                <Col md={4} className='mb-3'><Form.Label htmlFor='cost'>{requiredField} Coût</Form.Label></Col>
                <Col md={8} className='mb-3'>
                  <InputGroup>
                    {currency && <InputGroup.Text style={{ height: 38 }}>{currency.value}</InputGroup.Text>}
                    <Form.Control
                      required
                      disabled={isLoading}
                      id='cost'
                      className='text-end'
                      type='number'
                      name='cost'
                      value={act.cost}
                      onChange={onChangeActCost} />
                  </InputGroup>
                </Col>

                <Col md={4} className='mb-3'><Form.Label htmlFor='cost'>% Marge d'intérêt</Form.Label></Col>
                <Col md={8} className='mb-3'>
                  <InputGroup>
                    {currency && <InputGroup.Text style={{ height: 38 }}>{currency.value}</InputGroup.Text>}
                    <Form.Control
                      disabled={isLoading}
                      id='profit'
                      className='text-end'
                      type='number'
                      name='profitMarge'
                      value={act.profitMarge}
                      onChange={onChangeProfitMarge} />
                    <InputGroup.Text style={{ height: 38 }}>%</InputGroup.Text>
                  </InputGroup>
                </Col>

                <Col md={4} className='mb-3'><Form.Label htmlFor='price'>{requiredField} Prix</Form.Label></Col>
                <Col md={8} className='mb-3'>
                  <InputGroup>
                    {currency && <InputGroup.Text style={{ height: 38 }}>{currency.value}</InputGroup.Text>}
                    <Form.Control
                      required
                      disabled={isLoading}
                      id='price'
                      className='text-end'
                      type='number'
                      name='price'
                      value={act.price}
                      onChange={(e) => handleChange(e, act, setAct)} />
                  </InputGroup>
                </Col>
              </Row>
            </Col>

            <Col md={1} className='mb-3' />

            <Col md={7} className='bg-light p-1' style={{ borderRadius: 6, border: '1px solid lightgray' }}>
              <h6 className="fw-bold text-center"><i className='bi bi-caret-down-fill'/> Procédure(s)</h6>
              <div>
                {act.procedures && act.procedures.length > 0 && act.procedures.map((p, idx) =>
                  <InputGroup key={idx} className='me-2 mb-2'>
                    <InputGroup.Text>Libellé</InputGroup.Text>
                    <Form.Control
                      required
                      autoFocus
                      autoComplete='off'
                      name='item'
                      value={p.item}
                      onChange={(e) => handleChangeActItem(e, idx)}
                      disabled={isLoading} />
                    <InputGroup.Text>Qté</InputGroup.Text>
                    <Form.Control
                      required
                      autoComplete='off'
                      name='quantity'
                      value={p.quantity}
                      onChange={(e) => handleChangeActItem(e, idx)}
                      disabled={isLoading} />
                    {act.procedures.length > 1 &&
                      <Button
                        type='button'
                        disabled={isLoading}
                        variant='outline-dark'
                        onClick={() => onRemoveActItem(idx)}>
                        <i className='bi bi-x'/>
                      </Button>}
                  </InputGroup>)}

                <div>
                  <Button type='button' variant='info' className='w-100' disabled={isLoading} onClick={onAddActItem}>
                    <i className='bi bi-plus'/>
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </Form>
      </AppLgModal>
    </>
  )
}
