import {AppDataTableStripped, AppTHead} from "../../components";
import {useMemo} from "react";
import {limitStrTo} from "../../services";
import {Button, Col, Form, FormGroup, InputGroup} from "react-bootstrap";

const thead1 = [
  {label: 'Désignation'},
  {label: 'Prix U.'},
  {label: 'Qté'},
  {label: 'P. Total'},
]

const style = {fontWeight: 700}

function DraftForm({ medicine, onSetQuantity, isLoading, onRemove, currency, onPutDownQty, onGrowUpQty }) {
  return (
    <>
      <tr>
        <td className='text-uppercase' title={medicine?.wording.toUpperCase()}>
          {limitStrTo(20, medicine?.wording)}
        </td>
        <td style={style}>
          <span className='me-1'>{currency && currency.value}</span>
          {parseFloat(medicine?.price).toFixed(2).toLocaleString()}
        </td>
        <td>
          <InputGroup>
            <Button type='button' variant='dark' disabled={isLoading} onClick={onPutDownQty}>
              <i className='bi bi-dash'/>
            </Button>
            <Form.Control
              style={{ width: 50 }}
              type='number'
              name='qty'
              value={medicine?.qty}
              onChange={onSetQuantity}
              disabled={isLoading} />
            <Button type='button' variant='secondary' disabled={isLoading} onClick={onGrowUpQty}>
              <i className='bi bi-plus'/>
            </Button>
          </InputGroup>
        </td>
        <td style={{ fontWeight: 800 }} className='text-success'>
          <span className='me-1'>{currency && currency.value}</span>
          {parseFloat(medicine?.sum).toFixed(2).toLocaleString()}
        </td>
        <td className='text-end'>
          <Button type='button' variant='outline-danger' size='sm' onClick={onRemove} disabled={isLoading}>
            <i className='bi bi-x'/>
          </Button>
        </td>
      </tr>
    </>
  )
}

export const MedSalesForm = (
  {
    onReset,
    onRemove,
    onSetQuantity,
    currency,
    isLoading = false,
    items = [],
    onGrowUpQty,
    onPutDownQty,
    amount,
    discount,
    totalAmount,
    setDiscount,
    check,
    setCheck,
    handleChangeCheck,
  }) => {
  let medicines
  medicines = useMemo(() => {
    if (items.length > 0)
      return items.map((medicine, index) =>
        <DraftForm
          key={index}
          medicine={medicine}
          isLoading={isLoading}
          currency={currency}
          onGrowUpQty={() => onGrowUpQty(index)}
          onPutDownQty={() => onPutDownQty(index)}
          onSetQuantity={(e) => onSetQuantity(e, index)}
          onRemove={() => onRemove(medicine.id)}/>)
  }, [items, isLoading, onRemove, currency, onSetQuantity, onGrowUpQty, onPutDownQty])

  function handleChangeDiscount({ target }) {
    const value = target.value > 0 && !isNaN(target.value) ? parseInt(target.value) : 0
    setDiscount(value)
  }

  function onGrowUpDiscount() {
    setDiscount(prevState => prevState + 1)

  }

  function onPutDownDiscount() {
    setDiscount(prevState => prevState > 0 ? prevState - 1 : 0)
  }

  return (
    <>
      <AppDataTableStripped
        thead={<AppTHead onRefresh={onReset} loader={isLoading} items={thead1}/>}
        tbody={<tbody>{medicines && medicines}</tbody>} />

      <FormGroup className='mb-3 mt-3 row'>
        <Col xl={2}>
          <Form.Check
            disabled={isLoading}
            id='check'
            label='Remise :'
            name='check'
            value={check}
            onChange={handleChangeCheck}
            checked={check} />
        </Col>

        <Col xl={4}>
          <InputGroup>
            <Button type='button' variant='dark' disabled={isLoading || !check} onClick={onPutDownDiscount}>
              <i className='bi bi-dash'/>
            </Button>
            <Form.Control
              type='number'
              disabled={isLoading || !check}
              name='discount'
              value={discount}
              onChange={handleChangeDiscount} />
            <Button type='button' variant='secondary' disabled={isLoading || !check} onClick={onGrowUpDiscount}>
              <i className='bi bi-plus'/>
            </Button>
            <InputGroup.Text>%</InputGroup.Text>
          </InputGroup>
        </Col>
      </FormGroup>

      <div className='bg-warning p-2 d-flex justify-content-around' style={{ fontWeight: 900, borderRadius: 4 }}>
        <span>Total</span>
        <span>=</span>
        <span>
          <i className='me-1'>{currency && currency.value}</i>
          {parseFloat(totalAmount).toFixed(2).toLocaleString()}
        </span>
      </div>
    </>
  )
}
