import {useEffect, useState} from "react";
import {Alert, Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {FormRowContent} from "../profile/ChangeUserProfilePassword";
import AppInputField from "../../components/forms/AppInputField";
import {handleChange, onSelectChange} from "../../services/handleFormsFieldsServices";
import {currencies} from "../../app/config";
import {AppChooseField} from "../../components";
import {useAddNewParametersMutation, useGetParametersQuery} from "./parametersApiSlice";
import toast from "react-hot-toast";
import {useSelector} from "react-redux";

const operations = [
  {label: 'Multiplication: *', value: '*'},
  {label: 'Division: /', value: '/'},
]

export const ParametersForm = () => {
  const [validated, setValidated] = useState(false)
  const [item, setItem] = useState({
    currency: null,
    secondCurrency: null,
    fOperation: '',
    lOperation: '',
    rate: 0})
  const [addNewParameters, {isLoading, isError, error}] = useAddNewParametersMutation()
  const {fCurrency, sCurrency} = useSelector(state => state.parameters)
  const {
    data: parameters,
    isLoading: loader,
    isFetching,
    isError: isErrorExists,
    isSuccess
  } = useGetParametersQuery('Parameters')

  useEffect(() => {
    if (isSuccess && parameters) {
      const target = parameters.ids[0]
      if (target) {

        let currency = fCurrency, secondCurrency = sCurrency, rate
        rate = parameters.entities[target].rate ? parseFloat(parameters.entities[target].rate) : 0

        let ope1, ope2

        if (parameters.entities[target]?.fOperation && parameters.entities[target].fOperation === '*') ope1 = '*'
        else if (parameters.entities[target]?.fOperation && parameters.entities[target].fOperation === '/') ope1 = '/'
        else ope1 = null

        if (parameters.entities[target]?.lOperation && parameters.entities[target].lOperation === '*') ope2 = '*'
        else if (parameters.entities[target]?.lOperation && parameters.entities[target].lOperation === '/') ope2 = '/'
        else ope2 = null

        const fOperation = {
          label: ope1 === '*' ? 'Multiplication: *' : ope1 === '/' ? 'Division: /' : '',
          value: ope1 === '*' ? '*' : ope1 === '/' ? '/' : ''
        }

        const lOperation = {
          label: ope2 === '*' ? 'Multiplication: *' : ope2 === '/' ? 'Division: /' : '',
          value: ope2 === '*' ? '*' : ope2 === '/' ? '/' : ''
        }

        setItem(prev => {
          return {
            ...prev,
            rate,
            currency,
            fOperation,
            lOperation,
            secondCurrency: parameters.entities[target].secondCurrency ? secondCurrency : ''}
        })
      }
    }
  }, [isSuccess, parameters, fCurrency, sCurrency]) // handle exists parameters

  const canSave = [item.currency].every(Boolean) || !isLoading
  let apiErrors = {currency: null, secondCurrency: null, rate: null}

  let content
  if (isErrorExists) content =
    <Alert variant='danger'>
      <p>
        Une erreur est survenue lors du chargement de données. <br/>
        Veuillez actualiser la page ou vous reconecter <i className='bi bi-exclamation-circle-fill'/>
      </p>
    </Alert>
  else content = null

  const onReset = () => setItem({currency: null, secondCurrency: null, rate: 0})

  async function onSubmit(e) {
    e.preventDefault()
    e.stopPropagation()
    apiErrors = {currency: null, secondCurrency: null, rate: null}
    const form = e.currentTarget
    if (canSave || form.checkValidity() === false) {
      if (parameters) {
        const data = await addNewParameters({
          ...item,
          isUpdated: true,
          fOperation: item.fOperation && item.fOperation?.value ? item.fOperation?.value : null,
          lOperation: item.fOperation && item.lOperation?.value ? item.lOperation?.value : null})
        if (!data.error) toast.success('Paramètres bien ajouté.')
      }
      else {
        const data = await addNewParameters({
          ...item,
          fOperation: item.fOperation && item.fOperation?.value ? item.fOperation?.value : null,
          lOperation: item.fOperation && item.lOperation?.value ? item.lOperation?.value : null})
        if (!data.error) toast.success('Paramètres bien ajouté.')
      }
    }
    setValidated(true)
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
      <Form noValidate onSubmit={onSubmit} validated={validated} className='pt-2'>
        {content && content}
        <FormRowContent
          label={<>1ère devise</>}
          body={
            <AppChooseField
              required
              isDisabled={isLoading || loader || isFetching}
              value={item.currency}
              onChange={(e) => onSelectChange(e, 'currency', item, setItem)}
              options={currencies}
              name='currency'
              placeholder='-- 1ère devise --' />
          } />
        <FormRowContent
          label={<>Opération</>}
          body={
            <AppChooseField
              required
              isDisabled={isLoading || loader || isFetching}
              value={item.fOperation}
              onChange={(e) => onSelectChange(e, 'fOperation', item, setItem)}
              options={operations}
              name='fOperation'
              placeholder='-- Opération --' />
          } />
        <FormRowContent
          label={<>2ème devise</>}
          body={
            <AppChooseField
              isDisabled={isLoading || loader || isFetching}
              value={item.secondCurrency}
              onChange={(e) => onSelectChange(e, 'secondCurrency', item, setItem)}
              options={currencies}
              error={apiErrors.secondCurrency}
              name='secondCurrency'
              placeholder='-- 2ème devise --' />
          } />
        <FormRowContent
          label={<>Opération</>}
          body={
            <AppChooseField
              required
              isDisabled={isLoading || loader || isFetching}
              value={item.lOperation}
              onChange={(e) => onSelectChange(e, 'lOperation', item, setItem)}
              options={operations}
              name='lOperation'
              placeholder='-- Opération --' />
          } />
        <FormRowContent
          label='Taux'
          body={
            <AppInputField
              type='number'
              name='rate'
              error={apiErrors.rate}
              value={item.rate}
              disabled={isLoading || loader || isFetching}
              onChange={(e) => handleChange(e, item, setItem)} />
          } />
        <Row className='pe-3 px-4'>
          <h5 className="card-title text-center">
            Taux
            <i className='bi bi-quote mx-1 me-1'/>
            {item.secondCurrency && item.secondCurrency.code && !(loader || isFetching) && item.secondCurrency.currency}
            <i className='bi bi-quote mx-1'/>
          </h5>
          <Col md={4} lg={3} />
          <Col
            md={8}
            lg={9}
            className="mb-3 d-flex justify-content-around p-2"
            style={{ fontWeight: 600, borderRadius: '.325rem', border: '1px solid lightgray' }}>
            {item.currency && item.secondCurrency &&
              <>
                <span>1 {item.currency && item.currency.value}</span>
                <span>=</span>
                <span>
                  {parseFloat(item.rate).toFixed(2).toLocaleString()+' '}
                </span>
              </>}
          </Col>
        </Row>
        <div className="text-center">
          <Button
            type='submit'
            className='mb-1 me-1'
            disabled={isLoading || loader || isFetching}>
            {isLoading ? <>Veuillez patienter <Spinner animation='border' size='sm'/></> : 'Valider'}
          </Button>
          <Button
            type='button'
            variant='secondary'
            className='mb-1'
            onClick={onReset}
            disabled={isLoading || loader || isFetching}>
            Effacer
          </Button>
        </div>
      </Form>
    </>
  )
}
