import {Button, Col, Form, InputGroup, Row} from "react-bootstrap";
import {useMemo, useState} from "react";
import {
  useGetMedicinesQuery,
  useLazyHandleLoadMedicinesCodesOptionsQuery,
  useLazyHandleLoadMedicinesOptionsQuery
} from "./medicineApiSlice";
import {AppAsyncSelectOptions} from "../../components";
import {requiredField} from "../covenants/addCovenant";
import {handleChange, onStrictNumChange} from "../../services/handleFormsFieldsServices";
import moment from "moment";

export const DrugstoreForm2 = ({ invoice, items, total, setTotal, setItems, loader = false }) => {
  const [item, setItem] = useState({
    product: null,
    productCode: null,
    select: 'piece',
    quantityLabel: 'Pièce',
    isVTASelected: false,
    otherQty: 0,
    cost: 1,
    vTA: 10,
    quantity: 1,
    finalQty: 0,
    expiryDate: ''})

  const [check, setCheck] = useState(false)

  const {
    data: medicines = [],
    isSuccess: isMedOk,
    isFetching: isMedPending,
    isError: isMedError} = useGetMedicinesQuery('Drugstore')

  let medOptions, medCodeOptions

  const [handleLoadMedicinesOptions] = useLazyHandleLoadMedicinesOptionsQuery()
  const [handleLoadMedicinesCodesOptions] = useLazyHandleLoadMedicinesCodesOptionsQuery()

  if (isMedError) alert('ERREUR: Erreur lors du chargement des produits ❗')

  medOptions = useMemo(() => isMedOk && medicines
    ? medicines.map(item => {
      return {
        id: item?.id,
        quantity: item?.quantity,
        cost: parseFloat(item?.cost),
        price: parseFloat(item?.price),
        code: item?.code ? item?.code : '-- --',
        label: item?.wording,
        value: item['@id'],
        data: item,
      }
    })
    : [], [isMedOk, medicines])

  medCodeOptions = useMemo(() => isMedOk && medicines
    ? medicines.map(item => {
      return {
        id: item?.id,
        quantity: item?.quantity,
        cost: parseFloat(item?.cost),
        price: parseFloat(item?.price),
        wording: item?.wording,
        label: item?.code,
        value: item['@id'],
        data: item,
      }
    })
    : [], [isMedOk, medicines])

  const handleChangeProduct = (event) => {
    if (event) {
      setItem({...item,
        product: event,
        productCode: {label: event?.code, value: event?.value}})
    }
    else {
      setItem({...item,
        product: event,
        productCode: event})
    }
  }

  const handleChangeProductsCode = (event) => {
    if (event) {
      setItem({...item,
        productCode: event,
        product: {id: event?.id, label: event?.wording, value: event?.value, data: event?.data}})
    }
    else {
      setItem({...item,
        productCode: event,
        product: null})
    }
  }

  async function onLoadProduct(key) {
    const {data: prodData, isSuccess: isProdOk} = await handleLoadMedicinesOptions(key)
    if (isProdOk) return prodData
  }

  async function onLoadProductsCode(key) {
    const {data: prodData, isSuccess: isProdOk} = await handleLoadMedicinesCodesOptions(key)
    if (isProdOk) return prodData
  }

  function handleChangeOtherQty({ target }) {
    const value = target.value > 0 && !isNaN(target.value) ? parseFloat(target.value) : 0
    const qty = item.quantity * value
    setItem({...item, otherQty: value, finalQty: qty})
  }

  const onChangeKindOfQty = () => setItem({...item,
    quantityLabel: 'Pièce',
    select: 'piece',
    cost: 1,
    quantity: 1,
    finalQty: 0,
    otherQty: 0})

  const onChangeKindOfQty2 = () => setItem({...item,
    quantityLabel: '',
    select: 'other',
    cost: 1,
    quantity: 1,
    finalQty: 0,
    otherQty: 0})

  const onReset = () => {
    setItem({
      product: null,
      productCode: null,
      select: 'piece',
      quantityLabel: 'Pièce',
      isVTASelected: false,
      otherQty: 0,
      cost: 1,
      vTA: 10,
      quantity: 1,
      finalQty: 0,
      expiryDate: ''})
    setCheck(false)
  }

  const canSave = [
    invoice?.released,
    item.expiryDate,
    item.quantity,
    item.otherQty,
    item.cost,
    item.quantityLabel].every(Boolean) || !loader

  function onSubmit(e) {
    e.preventDefault()
    if (canSave) { // Si tout les champs obligatoires sont rempli
      const values = [...items]
      const releasedDate = moment(invoice?.released)
      const endDate = moment(item.expiryDate);
      const dateDiff = parseInt(endDate.diff(releasedDate, 'days'))
      if (!item.product) alert('Le produit doit être renseigné ❗')
      else if (values?.find(element => element?.product.label === item.product?.label))
        alert('Ce produit a déjà été ajouté 😑')
      else if (dateDiff > 0) {
        values.unshift(item)
        setItems(values)
        onReset()
      }
      else alert('La date de péremption ne peut être inférieure ou égal à la date d\'origine ❗')
    }
    // Fin Si tout les champs obligatoires sont rempli
    else alert('Veuillez remplir les champs (⭐) obligatoires ❗❗❗') // Sinon...
  }

  function handleChangeProductPrice({ target }) {
    const value = target.value > 0 && !isNaN(target.value) ? parseFloat(target.value) : 1
    if (item.product) setItem({...item, product: {...item.product, price: value}})
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <div className='mb-3'>
          <AppAsyncSelectOptions
            value={item.product}
            onChange={(e) => handleChangeProduct(e)}
            loadOptions={onLoadProduct}
            defaultOptions={medOptions}
            disabled={isMedPending || loader}
            className='text-capitalize'
            label={<>Produit {requiredField}</>}
            placeholder='-- Produit... --' />
        </div> {/* Produit */}
        <div className='mb-3'>
          <AppAsyncSelectOptions
            disabled
            value={item.productCode}
            onChange={(e) => handleChangeProductsCode(e)}
            loadOptions={onLoadProductsCode}
            defaultOptions={medCodeOptions}
            className='text-capitalize'
            label='Code produit'
            placeholder='-- Code Produit... --' />
        </div> {/* Code Produit */}

        <Row>
          {item.select === 'piece' && (
            <>
              <Col md={6} className='mb-3'>
                <Form.Label htmlFor='quantity'>Quantité</Form.Label>
                <Form.Control
                  required
                  autoComplete='off'
                  id='quantity'
                  type='number'
                  name='quantity'
                  value={item.quantity}
                  onChange={(e) => onStrictNumChange(e, item, setItem)}
                  disabled={loader} />
              </Col> {/* Quantité */}

              <Col md={6} className='mb-3'>
                <Form.Label htmlFor='cost'>Coût d'achat {requiredField}</Form.Label>
                <Form.Control
                  required
                  disabled={loader}
                  type='number'
                  id='cost'
                  name='cost'
                  value={item.cost}
                  onChange={(e) => onStrictNumChange(e, item, setItem)} />
              </Col> {/* Coût d'achat */}
            </>
          )} {/* Quantité & Coût d'achat */}

          <Col className='mb-3'>
            <Form.Label htmlFor='expiryDate'>Date de péremption {requiredField}</Form.Label>
            <Form.Control
              required
              type='date'
              id='expiryDate'
              name='expiryDate'
              value={item.expiryDate}
              onChange={(e) => handleChange(e, item, setItem)}
              disabled={loader} />
          </Col> {/* Date de péremption */}
        </Row>
        {/* Qté & Date de péremption */}

        <div className='mb-3 inline-radio'>
          <Form.Label className='me-3'>Par : </Form.Label>
          <Form.Check
            inline
            disabled={loader}
            type='radio'
            label='Pièce'
            name='select'
            value={'piece'}
            checked={item.select === 'piece'}
            onChange={onChangeKindOfQty}
            id='inline-radio-1'/> {/* Kind 1 */}

          <Form.Check
            inline
            disabled={loader}
            type='radio'
            label='Autre'
            name='select'
            value={'other'}
            checked={item.select === 'other'}
            onChange={onChangeKindOfQty2}
            id='inline-radio-2'/> {/* Kind 2 */}
        </div>
        {item.select === 'other' && (
          <>
            <div className='mb-3'>
              <Form.Control
                required
                autoFocus
                autoComplete='off'
                disabled={item.select === 'piece' || loader}
                id='quantityLabel'
                name='quantityLabel'
                value={item.quantityLabel}
                onChange={(e) => handleChange(e, item, setItem)}
                placeholder='* Ce champs est requis' />
            </div> {/* Label de la quantité */}

            <div className='mb-3'>
              <InputGroup>
                <InputGroup.Text>1 {item.quantityLabel} =</InputGroup.Text>
                <Form.Control
                  required
                  autoComplete='off'
                  disabled={item.select === 'piece'}
                  type='number'
                  name='quantity'
                  value={item.quantity}
                  onChange={(e) => onStrictNumChange(e, item, setItem)}
                  placeholder='Quantité' />
                <InputGroup.Text>pièce(s)</InputGroup.Text>
              </InputGroup>
            </div> {/* Quantité */}

            <div className='mb-3'>
              <InputGroup>
                <InputGroup.Text>Quantité :</InputGroup.Text>
                <Form.Control
                  type='number'
                  name='otherQty'
                  value={item.otherQty}
                  onChange={handleChangeOtherQty}
                  placeholder='Quantité' />
              </InputGroup>
            </div> {/* Autre Quantité */}

            <Row>
              <Col md={7} className='mb-3'>
                <Form.Label htmlFor='cost'>Coût d'achat {requiredField}</Form.Label>
                <Form.Control
                  required
                  disabled={loader}
                  type='number'
                  id='cost'
                  name='cost'
                  value={item.cost}
                  onChange={(e) => onStrictNumChange(e, item, setItem)} />
              </Col> {/* Coût d'achat */}

              <Col className='mb-3'>
                <Form.Label htmlFor='otherQty'>
                  <b>{item.otherQty} {item.quantityLabel}</b>
                </Form.Label>
                <p>: {item.finalQty} pièce(s)</p>
              </Col> {/* Sommation du nombre de pièce */}
            </Row>
            {/* Coût d'achat & Sommation du nombre de pièce */}
          </>
        )}
        {/* Autres Qtés & Date de péremption */}

        {item.product && (
          <div className='mb-3'>
            <Form.Check
              className='mb-3'
              name='check'
              value={check}
              onChange={() => setCheck(!check)}
              checked={check}
              id='check'
              label='Ajuster le prix de vente'
              disabled={loader} />

            {check &&
              <Row>
                <Col md={6} className='mb-2'>
                  <Form.Label htmlFor='price'>Ajuster le prix de vente</Form.Label>
                </Col>
                <Col className='mb-2'>
                  <Form.Control
                    type='number'
                    name='price'
                    value={item?.product.price}
                    onChange={handleChangeProductPrice}
                    disabled={loader} />
                </Col>
              </Row>}
          </div>
        )}

        <div className='mb-3'>
          <Form.Label><i className='bi bi-database'/> Quantité en stock</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              {item.product && item.select === 'piece'
                && (
                  <>
                    {item.product?.quantity
                      ? parseInt(item.product.quantity + item.quantity).toLocaleString()
                      : item.quantity.toLocaleString()}
                  </>
                )}
              {item.product && item.select === 'other'
                && (
                  <>
                    {item.product?.quantity
                      ? parseInt(item.product.quantity + item.finalQty).toLocaleString()
                      : item.finalQty.toLocaleString()}
                  </>
                )}
            </InputGroup.Text>
          </InputGroup>
        </div>
        {/* Qté En stock */}

        <div className='text-end'>
          <Button type='button' variant='transparent' className='me-1' disabled={loader} onClick={onReset}>
            <i className='bi bi-arrow-clockwise'/>
          </Button>
          <Button type='submit' variant='secondary' disabled={loader}>
            <i className='bi bi-plus'/>
            Ajouter
          </Button>
        </div>
      </Form>
    </>
  )
}
