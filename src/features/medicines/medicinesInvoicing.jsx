import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Button, Card, Col, Row, Spinner} from "react-bootstrap";
import {MedicinesList2} from "./MedicinesList2";
import {MedSalesForm} from "./MedSalesForm";
import {useState, useEffect} from "react";
import {useSelector} from "react-redux";
import {useOnPostMedicineSalesMutation} from "./medicineApiSlice";
import toast from "react-hot-toast";

const MedicinesInvoicing = () => {
  const { fCurrency } = useSelector(state => state.parameters)
  const [items, setItems] = useState([])
  const [values, setValues] = useState([])
  const [amount, setAmount] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)
  const [check, setCheck] = useState(false)
  const [onPostMedicineSales, {isLoading}] = useOnPostMedicineSalesMutation()

  useEffect(() => {
    if (items) {
      let total = 0
      for (const key in items) {
        const sum = parseFloat(items[key]?.sum)
        total += sum
      }

      setAmount(total)

      if (discount > 0) {
        const totalAmountWithDiscount = (total * discount) / 100
        setTotalAmount(totalAmountWithDiscount)
      }
      else setTotalAmount(total)
    }
    else setAmount(0)
  }, [items, discount]) // get total amount

  useEffect(() => {
    if (items) {
      const obj = items.map(item => {
        return {
          id: item?.id,
          quantity: item?.qty,
          price: item?.price,
        }
      })
      setValues(obj)
    }
    else setValues([])
  }, [items])

  const onReset = () => {
    setItems([])
    setCheck(false)
    setAmount(0)
    setTotalAmount(0)
    setDiscount(0)
  }

  function onRemove(id) {
    const values = items.filter(item => item.id !== id)
    const obj = values.filter(item => item.id !== id)

    setValues(obj)
    setItems(values)
  }

  function onPushNewItem(medicine) {
    let obj = []
    if (items.length > 0) {
      const isItemExists = items.find(item => item.id === medicine.id)
      if (isItemExists) alert('🤕 ce produit a déjà été ajouté ❗')
      else if (medicine?.daysRemainder < 1) alert('😱 ce produit est périmé ou sur le point d\'être périmé ❗')
      else if (medicine?.quantity < 1) alert(`🤕 veuillez d'abord (ré)approvisionner ce produit ❗`)
      else {
        obj = [...items]
        obj.unshift({...medicine, qty: 1, sum: medicine.price})
        setItems(obj)
      }
    }
    else {
      if (medicine?.daysRemainder < 1) alert('😱 ce produit est périmé ou sur le point d\'être périmé ❗')
      else if (medicine?.quantity < 1) alert(`🤕 veuillez d'abord (ré)approvisionner ce produit ❗`)
      else {
        obj = [...items]
        obj.unshift({...medicine, qty: 1, sum: medicine.price})
        setItems(obj)
      }
    }
  }

  function onGetMedicineSum(index) {
    const obj = [...items]
    const quantity = obj[index]['qty']
    obj[index]['sum'] = parseFloat(quantity) * parseFloat(obj[index]['price'])

    setItems(values)
  }

  function onSetQuantity(event, index) {
    const target = event.target
    const value = target.value > 0 && !isNaN(target.value) ? parseInt(target.value) : 1
    const obj = [...items]
    const obj2 = [...values]

    obj[index]['qty'] = value
    obj2[index]['quantity'] = value

    onGetMedicineSum(index)

    setValues(obj2)
    setItems(obj)
  }

  function onGrowUpQty(index) {
    const obj = [...items]
    let quantity = obj[index]['qty']
    quantity = !isNaN(quantity) ? parseInt(quantity) + 1 : 1
    obj[index]['qty'] = quantity
    onGetMedicineSum(index)
    setItems(obj)
  }

  function onPutDownQty(index) {
    const obj = [...items]
    let quantity = obj[index]['qty']
    quantity = quantity > 1 && !isNaN(quantity) ? parseInt(quantity) - 1 : 1
    obj[index]['qty'] = quantity
    onGetMedicineSum(index)
    setItems(obj)
  }

  function handleCheck({ target }) {
    const checked = target.checked
    setCheck(checked)
    if (!checked) setDiscount(0)
  }

  async function onSubmit() {
    if (items.length > 0) {
      try {
        const formData = await onPostMedicineSales({amount, values, discount, currency: fCurrency})
        if (!formData.error) {
          toast.success('Opération bien efféctuée.')
          onReset()
        }
      }
      catch (e) { toast.error(e.message) }
    }
    else alert('🤕 Aucune information renseignée ❗')
  }

  return (
    <>
      <AppHeadTitle title='Pharmacie | Facturation' />
      <AppBreadcrumb
        title='Facturation produit(s)'
        links={[{path: '/member/drugstore/medicines', label: 'Liste des produits'}]} />

      <Row>
        <Col md={7}>
          <Card className='border-0'>
            <Card.Body>
              <MedSalesForm
                handleChangeCheck={handleCheck}
                check={check}
                setCheck={setCheck}
                amount={amount}
                totalAmount={totalAmount}
                discount={discount}
                setDiscount={setDiscount}
                isLoading={isLoading}
                onGrowUpQty={onGrowUpQty}
                onPutDownQty={onPutDownQty}
                onReset={onReset}
                items={items}
                onRemove={onRemove}
                currency={fCurrency}
                onSetQuantity={onSetQuantity}/>

              {items.length > 0 &&
                <div className='text-md-center mt-3 text-sm-end'>
                  <Button type='button' variant='secondary' onClick={onReset} className='me-1' disabled={isLoading}>
                    <i className='bi bi-trash'/> Effacer
                  </Button>
                  <Button type='button' onClick={onSubmit} disabled={isLoading}>
                    {isLoading
                      ? <>Veuillez patienter <Spinner animation='border' size='sm'/></>
                      : <><i className='bi bi-plus-circle-dotted'/> Valider</>}
                  </Button>
                </div>}
            </Card.Body>
          </Card>
        </Col> {/* sale's form */}

        <Col md={5}>
          <MedicinesList2 onPushNewItem={onPushNewItem} isLoading={isLoading}/>
        </Col> {/* drugstore */}
      </Row>
    </>
  )
}

export default MedicinesInvoicing
