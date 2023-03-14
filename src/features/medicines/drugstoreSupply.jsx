import {AppBreadcrumb, AppDataTableStripped, AppHeadTitle, AppTHead} from "../../components";
import {Button, Card, Col, Row, Spinner} from "react-bootstrap";
import {DrugStoreDataForSupplying} from "./DrugStoreDataForSupplying";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {DrugstoreForm1} from "./DrugstoreForm1";
import {useOnSupplyingDrugInStoreMutation} from "./drugStoreApiSlice";
import toast from "react-hot-toast";

const thead = [
  {label: 'n° doc'},
  {label: 'Produit'},
  {label: 'Coût'},
  {label: 'Qté'},
  {label: 'P.T.'},
]

function DrugstoreSupply() {
  const { fCurrency } = useSelector(state => state.parameters)
  const [drugstoreItems, setDrugstoreItems] = useState([])
  const [values, setValues] = useState([])
  const [amount, setAmount] = useState(0)
  const [onSupplyingDrugInStore, {isLoading, isSuccess}] = useOnSupplyingDrugInStoreMutation()

  useEffect(() => {
    if (values) {
      let total = 0
      for (const key in values) {
        const cost = parseFloat(values[key].quantity) * parseFloat(values[key].cost)
        total += cost
      }

      setAmount(total)
    }
    else setAmount(0)
  }, [values]) // total's calculus

  function handleRemoveItem(id) {
    const values = drugstoreItems.filter(item => item.id !== id)
    const obj = values.filter(item => item.id !== id)
    setDrugstoreItems(values)
    setValues(obj)
  }

  const onReset = () => {
    setDrugstoreItems([])
    setValues([])
  }

  async function onSubmit() {
    if (drugstoreItems.length > 0 && values.length > 0) {
      try {
        const data = await onSupplyingDrugInStore({...drugstoreItems, values, amount})
        if (!data.error) {
          toast.success('Opération bien efféctuée.')
          onReset()
        }
      } catch (e) { toast.error(e.message) }
    } else alert("🤕 Aucun produit renseigné ❗")
  }

  return (
    <>
      <AppHeadTitle title='Pharmacie | Approvisionnement' />
      <AppBreadcrumb title='Approvisionnement de produits pharmaceutiques' links={[
        {label: 'Liste des produits', path: '/member/drugstore/medicines'}
      ]} />

      <Row>
        <Col>
          <Card className='border-0'>
            <Card.Body>
              <AppDataTableStripped
                title='Produits à approvisionner'
                thead={<AppTHead items={thead} loader={isLoading} onRefresh={onReset} />}
                tbody={
                  <tbody>
                    {drugstoreItems && drugstoreItems.map(item =>
                      <DrugstoreForm1
                        key={item.id}
                        currency={fCurrency}
                        item={item}
                        isLoading={isLoading}
                        onRemove={() => handleRemoveItem(item.id)}/>)}
                  </tbody>} />

              <div
                className='bg-warning p-2 d-flex justify-content-around mb-3'
                style={{ borderRadius: 4, fontWeight: 800 }}>
                <span>Total</span>
                <span>=</span>
                <span>
                  <i className='me-1'>{fCurrency && fCurrency.value}</i>
                  {parseFloat(amount).toFixed(2).toLocaleString()}
                </span>
              </div>

              {drugstoreItems.length > 0 &&
                <div className='text-md-center'>
                  <Button type='button' variant='secondary' onClick={onReset} className='me-1' disabled={isLoading}>
                    <i className='bi bi-trash'/> Effacer
                  </Button>
                  <Button type='button' onClick={onSubmit} disabled={isLoading}>
                    {!isLoading
                      ? <><i className='bi bi-plus-circle-dotted'/> Valider</>
                      : <>Veuillez patienter <Spinner animation='border' size='sm'/></>}
                  </Button>
                </div>}
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          <Card className='border-0'>
            <Card.Body>
              <DrugStoreDataForSupplying
                isSuccess={isSuccess}
                isLoading={isLoading}
                values={values}
                setValues={setValues}
                drugstore={drugstoreItems}
                setDrugstore={setDrugstoreItems}
                currency={fCurrency}/>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default DrugstoreSupply
