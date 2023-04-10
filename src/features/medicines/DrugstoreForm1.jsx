import {Col, Form, Row} from "react-bootstrap";
import {useGetProvidersQuery, useLazyHandleLoadProvidersOptionsQuery} from "./providerApiSlice";
import {useMemo, useState} from "react";
import {AppAsyncSelectOptions, AppChooseField, AppDatePicker} from "../../components";
import {requiredField} from "../covenants/addCovenant";
import {handleChange, onSelectChange} from "../../services/handleFormsFieldsServices";
import {DrugstoreForm3} from "./DrugstoreForm3";
import {currencies} from "../../app/config";
import {useOnSupplyingDrugInStoreMutation} from "./drugStoreApiSlice";
import toast from "react-hot-toast";

export const DrugstoreForm1 = ({ invoice, setInvoice, items, setItems, total, setTotal }) => {
  const [htItems, setHTItems] = useState([])
  const [taxSum, setTaxSum] = useState(0)
  const [subTotal, setSubTotal] = useState(0)

  const {
    data: providers = [],
    isSuccess: isProvOk,
    isFetching: isProvPending,
    isError: isProError} = useGetProvidersQuery('Providers')

  // Options
  let provOptions

  provOptions = useMemo(() => isProvOk && providers
    ? providers.map(item => {
      return {
        id: item?.id,
        label: item?.wording,
        value: item['@id'],
        data: item,
      }
    })
    : [], [isProvOk, providers])
  // End Options

  // Load Errors
  if (isProError) alert('ERREUR: Erreur lors du chargement des fournisseurs ❗')
  // End Load Errors

  // Load functions
  const [handleLoadProvidersOptions] = useLazyHandleLoadProvidersOptionsQuery()
  async function onLoadProviders(key) {
    const {data: provData, isSuccess: isLoadProvOk} = await handleLoadProvidersOptions(key)
    if (isLoadProvOk) return provData
  } // Load providers
  // End Load functions

  function onReset() {
    setItems([])
    setTotal(0)
    setHTItems([])
    setTaxSum(0)
    setSubTotal(0)
    setInvoice({
      released: new Date(),
      document: '',
      amount: 0.00,
      provider: null,
      currency: {value: '$', label: "'(US) United States of America ' $ '"},
    })
  }

  const [onSupplyingDrugInStore, {isLoading}] = useOnSupplyingDrugInStoreMutation()
  const canSave = [
    invoice.document,
    invoice.released,
  ].every(Boolean) || !isLoading
  async function onSubmit(e) {
    e.preventDefault()
    if (!invoice?.provider) alert('Le fournisseur doit être renseigné ❗')
    else if (!invoice?.currency) alert('La devise doit être renseigné ❗')
    else if (canSave) {
      if (items && items?.length > 0) {
        const submit = await onSupplyingDrugInStore({
          document: invoice?.document,
          subTotal: subTotal.toString(),
          total: total.toString(),
          currency: invoice.currency.value,
          provider: invoice.provider?.value,
          values: items?.map(item => {
            return {
              id: item?.product.id,
              price: item.product?.price.toString(),
              vTA: parseFloat(item?.vTA),
              quantityLabel: item?.quantityLabel,
              quantity: item?.otherQty > 0 ? item.finalQty : item?.quantity,
              cost: item?.cost.toString(),
              expiryDate: item?.expiryDate,
              otherQty: item.otherQty,
            }
          })})
        if (!submit?.error) {
          toast.success('Approvisionnement bien efféctué.')
          onReset()
        }
      }
      else alert('Aucun article renseigné ❗')
    }
    else alert('Veuillez renseigner les champs obligatoires ❗')
  } // on submit data

  return (
    <>
      <Form onSubmit={onSubmit}>
        <Row className='mb-2'>
          <Col md={4} className='mb-3'>
            <Form.Label htmlFor='document'>N° Document {requiredField}</Form.Label>
            <Form.Control
              autoFocus
              required
              autoComplete='off'
              id='document'
              name='document'
              value={invoice?.document}
              onChange={(e) => handleChange(e, invoice, setInvoice)}
              placeholder='N° Document' />
          </Col>
          <Col md={4} className='mb-3'>
            <AppAsyncSelectOptions
              value={invoice?.provider}
              disabled={isProvPending}
              className='text-capitalize'
              onChange={(e) => setInvoice({...invoice, provider: e})}
              defaultOptions={provOptions}
              loadOptions={onLoadProviders}
              label={<>Fournisseur {requiredField}</>}
              placeholder='-- Fournisseur --' />
          </Col>
          <Col md={4} className='mb-3'>
            <AppDatePicker
              onChange={(d) => setInvoice({...invoice, released: d})}
              value={invoice?.released}
              label={<>Date {requiredField}</>} />
          </Col>

          <Col md={6} />

          <Col className='mb-2 fw-bold text-end'>
            <Form.Label>Devise {requiredField}</Form.Label>
            <AppChooseField
              required
              isDisabled={isLoading}
              value={invoice?.currency}
              onChange={(e) => onSelectChange(e, 'currency', invoice, setInvoice)}
              options={currencies}
              name='currency'
              placeholder='Devise' />
          </Col>
        </Row>


        <DrugstoreForm3
          onReset={onReset}
          subTotal={subTotal}
          setSubTotal={setSubTotal}
          taxSum={taxSum}
          setTaxSum={setTaxSum}
          htItems={htItems}
          setHTItems={setHTItems}
          total={total}
          setTotal={setTotal}
          currency={invoice?.currency}
          loader={isLoading}
          items={items}
          setItems={setItems} />
      </Form>
    </>
  )
}
