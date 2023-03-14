import {useGetProvidersQuery, useLazyHandleLoadProvidersOptionsQuery} from "./providerApiSlice";
import {useEffect, useMemo, useState} from "react";
import toast from "react-hot-toast";
import {Button, Col, Form, FormGroup, Row, Spinner} from "react-bootstrap";
import {AppAsyncSelectOptions, AppFloatingInputField} from "../../components";
import {requiredField} from "../covenants/addCovenant";
import AppInputField from "../../components/forms/AppInputField";
import {handleChange, onStrictNumChange} from "../../services/handleFormsFieldsServices";
import {
  useLazyHandleLoadMedicinesCodesOptionsQuery,
  useLazyHandleLoadMedicinesOptionsQuery
} from "./medicineApiSlice";
import {useGetDrugstoreListQuery} from "./drugStoreApiSlice";

export const DrugstoreForm2 = ({ currency, drugstore, setDrugstore, values, setValues, isLoading, isSuccess }) => {
  const [qty, setQty] = useState(0)
  const [check, setCheck] = useState(false)
  const {
    data: providers = [],
    isLoading: isProvidersLoading,
    isFetching: isProvidersFetching,
    isError: isProvidersError
  } = useGetProvidersQuery('Providers')
  const {
    data: medicines = [],
    isLoading: isMedicinesLoading,
    isFetching: isMedicinesFetching,
    isError: isMedicinesError
  } = useGetDrugstoreListQuery('DrugstoreList')

  const [handleLoadProvidersOptions] = useLazyHandleLoadProvidersOptionsQuery()
  const [handleLoadMedicinesOptions] = useLazyHandleLoadMedicinesOptionsQuery()
  const [handleLoadMedicinesCodesOptions] = useLazyHandleLoadMedicinesCodesOptionsQuery()
  const [supplyData, setSupplyData] = useState({
    document: '',
    provider: null,
    medicine: null,
    released: new Date().toISOString().substring(0, 10),
    expiryDate: '',
    code: null,
    quantity: 1,
    cost: null,
    price: null,
    id: null,
  })

  let apiErrors = {document: null, released: null, expiryDate: null}

  let providersOptions, medicinesOptions, medicinesCodesOptions

  if (isProvidersError) alert('ERREUR: Erreur lors du chargement des fournisseurs !!!')
  if (isMedicinesError) alert('ERREUR: Erreur lors du chargement des produits !!!')

  providersOptions = useMemo(() => {
    if (!isProvidersLoading && providers) return providers.map(provider => {
      return {
        id: provider.id,
        label: provider.wording,
        value: provider['@id'],
      }
    })
  }, [isProvidersLoading, providers])

  medicinesOptions = useMemo(() => {
    if (!isMedicinesLoading && medicines) return medicines.map(medicine => {
      return {
        id: medicine.id,
        quantity: medicine.quantity,
        cost: parseFloat(medicine.cost),
        price: parseFloat(medicine.price),
        code: medicine?.code ? medicine.code : '-- --',
        label: medicine.wording,
        value: medicine['@id'],
      }
    })
  }, [isMedicinesLoading, medicines])

  medicinesCodesOptions = useMemo(() => {
    if (!isMedicinesLoading && medicines) return medicines.map(code => {
      return {
        id: code.id,
        quantity: code.quantity,
        cost: parseFloat(code.cost),
        price: parseFloat(code.price),
        wording: code.wording,
        label: code.code,
        value: code['@id'],
      }
    })
  }, [isMedicinesLoading, medicines])

  async function onLoadProviders(keyword) {
    try {
      const providersData = await handleLoadProvidersOptions(keyword).unwrap()
      if (providersData)
        return providersData
    }
    catch (e) { toast.error(e.message) }
  }

  async function onLoadMedicines(keyword) {
    try {
      const medicinesData = await handleLoadMedicinesOptions(keyword).unwrap()
      if (medicinesData)
        return medicinesData
    }
    catch (e) { toast.error(e.message) }
  }

  async function onLoadMedicinesCodes(keyword) {
    try {
      const medicinesData = await handleLoadMedicinesCodesOptions(keyword).unwrap()
      if (medicinesData)
        return medicinesData
    }
    catch (e) { toast.error(e.message) }
  }

  useEffect(() => {
    if (supplyData.medicine) {
      setQty(supplyData.quantity + supplyData.medicine.quantity)
    }
    else setQty(0)
  }, [supplyData])

  function onChangeMedicine(event) {
    let code
    if (event) {
      code = {
        id: event.id,
        quantity: event.quantity,
        cost: parseFloat(event.cost),
        price: parseFloat(event.price),
        wording: event.wording,
        label: event.code,
        value: event.value,
      }
    }
    else code = null
    setSupplyData({
      ...supplyData,
      code,
      id: event ? event.id : null,
      medicine: event,
      cost: event ? event.cost : null,
      price: event ? event.price : null})
  }

  function onChangeMedicineCode(event) {
    let medicine
    if (event) {
      medicine = {
        id: event.id,
        quantity: event.quantity,
        cost: parseFloat(event.cost),
        price: parseFloat(event.price),
        code: event?.code ? event.code : '-- --',
        label: event.wording,
        value: event.value,
      }
    }
    else medicine = null
    setSupplyData({
      ...supplyData,
      medicine,
      id: event ? event.id : null,
      code: event,
      cost: event ? event.cost : null,
      price: event ? event.price : null})
  }

  function handleChangeCheck({target}) {
    const checked = target.checked
    setCheck(checked)
    if (!checked && supplyData.medicine) setSupplyData({...supplyData,
      cost: supplyData.medicine.cost,
      price: supplyData.medicine.price,
    })
  }

  function onReset() {
    setCheck(false)
    setSupplyData({
      document: '',
      provider: null,
      medicine: null,
      released: new Date().toISOString().substring(0, 10),
      expiryDate: '',
      code: null,
      quantity: 1,
      cost: null,
      price: null,
      id: null,
    })
  }

  function onReset2() {
    setCheck(false)
    setSupplyData({
      ...supplyData,
      medicine: null,
      code: null,
      quantity: 1,
      expiryDate: '',
      cost: null,
      price: null,
    })
  }

  const canSave = [
    supplyData.document,
    supplyData.provider,
    supplyData.expiryDate,
    supplyData.medicine,
    supplyData.quantity,
  ].every(Boolean)

  function onSubmit(e) {
    e.preventDefault()
    if (canSave) {
      const obj = [...drugstore]
      if (supplyData.released && supplyData.released <= supplyData.expiryDate) {
        const isItemExists = drugstore.find(item => item.id === supplyData.id)
        // Si le produit existe déjà dans la liste des
        // produits à approvisionner ?
        if (drugstore.length > 0 && isItemExists) {
          alert('🤕 ce produit a déjà été ajouté ❗')
          onReset2()
        }
        else {
          obj.unshift(supplyData)
          setDrugstore(obj)
          setValues([...values, {
            id: supplyData.id,
            quantity: supplyData.quantity,
            cost: supplyData.cost.toString(),
            price: supplyData.price.toString(),
            expiryDate: supplyData.expiryDate,
          }])
          onReset2()
        }

      } // Si la date d'approvisionnement est
      // inférieure ou égale à la date de péremption
      else alert("🤕 La date d'approvisionnement ne peut être supérieure à la date de péremption 👎")
      // Sinon
      // il ne se passe rien et on affiche un message une alerte !
    }
    else alert('Veuillez renseigner les champs obligatoires !!!')
  }

  useEffect(() => {
    if (isSuccess) onReset()
  }, [isSuccess])

  return (
    <Form onSubmit={onSubmit}>
      <p>
        Veuillez renseigner les champs obligatoires marqués par <i className='text-danger'>*</i>.
      </p>

      <Row>
        <Col md={6}>
          <AppInputField
            required
            autofocus
            disabled={isLoading}
            label={<>n° document {requiredField}</>}
            name='document'
            value={supplyData.document}
            onChange={(e) => handleChange(e, supplyData, setSupplyData)}
            error={apiErrors.document}
            placeholder='n° document' />
        </Col>

        <Col md={6} className='mb-3'>
          <AppAsyncSelectOptions
            placeholder='-- Fournisseur --'
            className='text-uppercase'
            disabled={isProvidersFetching || isLoading}
            label={<>Fournisseur {requiredField}</>}
            onChange={(e) => setSupplyData({...supplyData, provider: e})}
            value={supplyData.provider}
            loadOptions={onLoadProviders}
            defaultOptions={providersOptions} />
        </Col>

        <Col xl={6}>
          <AppInputField
            type='date'
            disabled={isLoading}
            label='Date'
            name='released'
            value={supplyData.released}
            onChange={(e) => handleChange(e, supplyData, setSupplyData)}
            error={apiErrors.released} />
        </Col>

        <Col xl={6}>
          <AppInputField
            type='date'
            disabled={isLoading}
            label={<>Date de péremption {requiredField}</>}
            name='expiryDate'
            value={supplyData.expiryDate}
            onChange={(e) => handleChange(e, supplyData, setSupplyData)}
            error={apiErrors.expiryDate} />
        </Col>

        <Col md={6} className='mb-3'>
          <AppAsyncSelectOptions
            placeholder='-- Code produit --'
            className='text-uppercase'
            disabled={isMedicinesLoading || isMedicinesFetching || isLoading}
            label={<><i className='bi bi-qr-code'/> Code produit</>}
            onChange={(e) => onChangeMedicineCode(e)}
            value={supplyData.code}
            loadOptions={onLoadMedicinesCodes}
            defaultOptions={medicinesCodesOptions} />
        </Col>

        <Col md={6} className='mb-3'>
          <AppAsyncSelectOptions
            placeholder='-- Article --'
            className='text-uppercase'
            disabled={isMedicinesLoading || isMedicinesFetching || isLoading}
            label={<>Article {requiredField}</>}
            onChange={(e) => onChangeMedicine(e)}
            value={supplyData.medicine}
            loadOptions={onLoadMedicines}
            defaultOptions={medicinesOptions} />
        </Col>

        <Col md={6}>
          <AppInputField
            required
            disabled={isLoading}
            label={<>Quantité {requiredField}</>}
            type='number'
            name='quantity'
            value={supplyData.quantity}
            onChange={(e) => onStrictNumChange(e, supplyData, setSupplyData)} />
        </Col>

        <Col md={6}>
          <AppInputField
            type='number'
            disabled
            label={<><i className='bi bi-database'/> Quantité en stock</>}
            name='quantity'
            value={qty}
            onChange={() => { }} />
        </Col>

        <FormGroup className='mb-3'>
          <Form.Check
            disabled={isLoading}
            id='check'
            label='Ajuster le prix'
            name='check'
            value={check}
            onChange={handleChangeCheck}
            checked={check} />

          {check &&
            <Row>
              <Col md={6}>
                <AppFloatingInputField
                  disabled={isLoading}
                  name='cost'
                  value={supplyData.cost ? supplyData.cost : 0}
                  onChange={(e) => handleChange(e, supplyData, setSupplyData)}
                  label={<span style={{ fontWeight: 900 }}>Coût ( {currency && currency.value} )</span>}
                  type='number'
                  placeholder='Ajustement du coût' />
              </Col>

              <Col md={6}>
                <AppFloatingInputField
                  disabled={isLoading}
                  name='price'
                  value={supplyData.price ? supplyData.price : 0}
                  onChange={(e) => handleChange(e, supplyData, setSupplyData)}
                  label={<span style={{ fontWeight: 900 }}>Prix ( {currency && currency.value} )</span>}
                  type='number'
                  placeholder='Ajustement du prix' />
              </Col>
            </Row>}
        </FormGroup>

        <div className='text-md-center'>
          <Button type='button' variant='light' onClick={onReset} disabled={isLoading}>
            <i className='bi bi-arrow-clockwise'/>
          </Button>
          <Button type='submit' variant='secondary' className='mx-1' disabled={isLoading}>
            {!isLoading
              ? <><i className='bi bi-plus'/> Ajouter</>
              : <>Veuillez patienter <Spinner animation='border' size='sm'/></>}
          </Button>
        </div>
      </Row>
    </Form>
  )
}
