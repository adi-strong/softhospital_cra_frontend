import {Button, Col, Row, Spinner, Table} from "react-bootstrap";
import {AppTHead} from "../../components";
import {limitStrTo} from "../../services";
import {useEffect} from "react";
import {roundANumber} from "../invoices/singleInvoice";

const theadItems = [
  {label: 'Désignation'},
  {label: 'Unité'},
  {label: 'Qté'},
  {label: 'PU HT'},
  {label: 'TVA'},
  {label: 'TOTAL HT'},
]

const Item = ({ item, currency, onRemoveItem, onChangeVTA, onChangeIsVTASelected, loader = false }) => {
  return (
    <>
      <tr>
        <th className='text-capitalize' title={item?.product?.label}>{limitStrTo(25, item?.product?.label)}</th>
        <td className='text-capitalize text-center'>{item?.quantityLabel}</td>
        <td className='text-center'>
          {item?.quantityLabel !== 'Pièce'
            ? parseInt(item?.otherQty).toLocaleString()
            : parseInt(item?.quantity).toLocaleString()}
        </td>
        <td className='text-end'>
          {parseFloat(item?.cost).toFixed(2).toLocaleString()+' '}
          {currency && currency?.value}
        </td>
        <td className='text-end'>
          <input
            disabled={loader}
            type='checkbox'
            className='me-1'
            name='isVTASelected'
            value={item?.isVTASelected}
            onChange={onChangeIsVTASelected}
            checked={item?.isVTASelected} />
          <input
            disabled={!item?.isVTASelected || loader}
            type='number'
            className='text-end me-1'
            name='vTA'
            value={item?.vTA}
            onChange={onChangeVTA}
            style={{ width: 60 }} />
          %
        </td>
        <td className='text-end fw-bold'>
          <span className='me-1'>
            {item?.quantityLabel !== 'Pièce'
              ? parseFloat(item?.otherQty * item?.cost).toFixed(2).toLocaleString()
              : parseFloat(item?.quantity * item?.cost).toFixed(2).toLocaleString()}
          </span>
          {currency && <span className='me-1'>{currency?.value}</span>}
          <span onClick={onRemoveItem} className='text-danger' style={{ cursor: 'pointer' }} title='Supprimer'>
            <i className='bi bi-trash3'/>
          </span>
        </td>
      </tr>
    </>
  )
}

export const DrugstoreForm3 = (
  {
    loader = false,
    currency,
    items,
    setItems,
    onReset,
    total,
    setTotal,
    htItems,
    setHTItems,
    taxSum,
    setTaxSum,
    subTotal,
    setSubTotal,
  }) => {

  function handleRemoveItem( event, index ) {
    const values = [...items]
    values.splice(index, 1)
    setItems(values)
  }

  function handleChangeIsVTASelected( index ) {
    const values = [...items]
    values[index]['isVTASelected'] = !values[index]['isVTASelected']
    setItems(values)
  }

  function handleChangeVTA( event, index ) {
    const value = event.target.value > 0 && !isNaN(event.target.value) ? parseFloat(event.target.value) : 1
    const values = [...items]
    values[index]['vTA'] = value
    setItems(values)
  }

  useEffect(() => {
    let sTot = 0
    if (items && items?.length > 0) {
      for (const key in items) {
        const item = items[key]
        const calculus = item?.otherQty > 0
          ? parseFloat(item.otherQty * item?.cost)
          : parseFloat(item?.quantity * item.cost)
        sTot += calculus
        // Obtention du sous total
      }
    }
    setSubTotal(roundANumber(sTot, 2))
  }, [items, setSubTotal]) // Handle get subtotal

  useEffect(() => {
    if (items && items?.length > 0) {
      const sums = {}
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item?.isVTASelected) {
          const vTA = item?.vTA
          const sum = item?.otherQty > 0
            ? item?.cost * item.otherQty
            : item.cost * item?.quantity
          if (!sums[vTA]) {
            sums[vTA] = sum
          } else {
            sums[vTA] += sum
          }
        }
      }

      const obj = []
      if (sums) {
        for (const i in sums) {
          obj.push({vTA: i, sum: sums[i], amount: (sums[i] * i) / 100})
        }
      }
      setHTItems(obj)
    } else setHTItems([])
  }, [items, setHTItems]) // handle get vta values

  useEffect(() => {
    if (htItems && htItems?.length > 0) {
      let sum = 0
      for (const i in htItems) {
        const element = htItems[i]
        sum += element?.amount
      }
      setTaxSum(sum)
    } else setTaxSum(0)
  }, [htItems, setTaxSum]) // handle get tax values

  useEffect(() => {
    if (taxSum > 0) setTotal(taxSum + subTotal)
    else setTotal(subTotal)
  }, [taxSum, setTotal, subTotal]) // handle get total

  return (
    <>
      <Table hover responsive bordered style={{ fontSize: '0.7rem' }}>
        <AppTHead items={theadItems} className='text-center bg-primary text-light' />
        <tbody>
          {items && items?.length > 0 && items?.map((item, idx) =>
            <Item
              key={idx}
              currency={currency}
              loader={loader}
              item={item}
              onChangeIsVTASelected={() => handleChangeIsVTASelected(idx)}
              onChangeVTA={(e) => handleChangeVTA(e, idx)}
              onRemoveItem={(e) => handleRemoveItem(e, idx)} />)}
        </tbody>
      </Table> {/* Liste des médicaments */}

      <Row>
        <Col md={6} className='mb-3'>
          <Table responsive bordered style={{ fontSize: '0.7rem' }}>
            <thead>
              <tr className='text-primary text-center'>
                <th>Base HT</th>
                <th>% TVA</th>
                <th>Montant TVA</th>
              </tr>
            </thead>

            <tbody>
              {htItems && htItems?.length > 0 && htItems?.map((item, idx) =>
                <tr key={idx}>
                  <th>{item?.sum.toFixed(2).toLocaleString()}</th>
                  <td className='text-primary text-center fw-bold'>{item?.vTA}%</td>
                  <th className='text-end'>
                    {item?.amount.toFixed(2).toLocaleString()+' '}
                    {currency && currency?.value}
                  </th>
                </tr>)}
            </tbody>
          </Table>
        </Col>

        <Col className='mb-3'>
          <Table responsive bordered style={{ fontSize: '0.7rem' }}>
            <tbody>
              <tr className='bg-primary fw-bold text-end text-white'>
                <td>SOUS TOTAL HT</td>
                <td>{parseFloat(subTotal).toFixed(2).toLocaleString()} {currency && currency?.value}</td>
              </tr>{/* Sous total HT */}

              <tr className='fw-bold text-end text-primary'>
                <td>TVA</td>
                <td className='text-end'>
                  {taxSum.toFixed(2).toLocaleString()+' '}
                  {currency && currency?.value}
                </td>
              </tr>{/* TVA */}

              <tr className='fw-bold text-end fs-6'>
                <td style={{ fontWeight: 800 }}>TOTAL TTC</td>
                <td style={{ fontWeight: 800 }}>
                  {total.toFixed(2).toLocaleString()} {currency && currency?.value}
                </td>
              </tr>{/* TOTAL TTC */}
            </tbody>
          </Table>
        </Col>
      </Row> {/* Calcul des totaux */}

      <hr/>

      <div className='text-end'>
        <Button type='button' variant='transparent' className='me-1' disabled={loader} onClick={onReset}>
          <i className='bi bi-arrow-clockwise text-danger'/>
        </Button>
        <Button type='submit' variant='success' disabled={loader}>
          {loader
            ? <>Veuillez patienter <Spinner animation='border' size='sm'/></>
            : <>Valider <i className='bi bi-check'/></>}
        </Button>
      </div>
    </>
  )
}
